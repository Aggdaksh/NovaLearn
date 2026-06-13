import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import Course from "../models/courseModel.js";
dotenv.config();

const DEBUG_LOG_ENDPOINT = process.env.DEBUG_LOG_ENDPOINT || "";
const GOOGLE_AI_API_KEY = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || "";

const normalizeQuery = (q) => (q || "").toLowerCase().trim();

const SHORT_QUERY_TERMS = new Set(["ai", "ml", "ui", "ux", "ds"]);

const topicAliases = {
  ai: ["ai", "artificial intelligence", "gen ai", "generative ai", "llm", "chatgpt", "prompt engineering"],
  ml: ["ml", "machine learning", "deep learning", "neural network", "neural networks"],
  "data science": ["data science", "data scientist", "ds", "python", "pandas", "numpy"],
  "data analytics": ["data analytics", "analytics", "business analytics", "power bi", "excel"],
  "web development": ["web development", "web dev", "frontend", "backend", "full stack", "fullstack", "mern", "react", "node", "express", "mongodb", "javascript", "html", "css"],
  "app development": ["app development", "mobile development", "android", "ios", "flutter", "react native"],
  "ethical hacking": ["ethical hacking", "cyber security", "cybersecurity", "penetration testing", "pentesting", "network security"],
  "ui ux designing": ["ui", "ux", "ui ux", "ui/ux", "ui ux designing", "design thinking", "figma"],
  "ai tools": ["ai tools", "midjourney", "notion ai", "copilot", "automation"],
  cloud: ["cloud", "aws", "azure", "gcp", "devops", "docker", "kubernetes"],
};

const tokenizeQuery = (q) =>
  normalizeQuery(q)
    .split(/[^a-z0-9+#/.]+/i)
    .filter(Boolean)
    .filter((term) => term.length > 2 || SHORT_QUERY_TERMS.has(term));

const normalizeTopicKey = (topic) => {
  const normalizedTopic = normalizeQuery(topic);

  if (!normalizedTopic) return "";

  for (const [key, aliases] of Object.entries(topicAliases)) {
    if (key === normalizedTopic || aliases.some((alias) => normalizedTopic.includes(alias))) {
      return key;
    }
  }

  if (normalizedTopic.includes("machine learning")) return "ml";
  if (normalizedTopic.includes("artificial intelligence")) return "ai";
  if (normalizedTopic.includes("web development") || normalizedTopic.includes("web dev")) return "web development";

  return normalizedTopic;
};

const inferTopicsFromInput = (normalizedInput) =>
  Object.entries(topicAliases)
    .filter(([, aliases]) => aliases.some((alias) => normalizedInput.includes(alias)))
    .map(([key]) => key);

const buildSearchTerms = ({ normalizedInput, extractedTopic }) => {
  const terms = new Set();
  const inputTokens = tokenizeQuery(normalizedInput);
  const inferredTopics = inferTopicsFromInput(normalizedInput);
  const topicCandidates = [normalizeTopicKey(extractedTopic), ...inferredTopics].filter(Boolean);

  inputTokens.forEach((term) => terms.add(term));

  if (inputTokens.length > 0 && inputTokens.length <= 4) {
    terms.add(inputTokens.join(" "));
  }

  topicCandidates.forEach((topic) => {
    terms.add(topic);
    const aliases = topicAliases[topic] || [];
    aliases.forEach((alias) => terms.add(alias));
  });

  return Array.from(terms).filter(Boolean);
};

const scoreField = (text, terms, weight) => {
  const haystack = normalizeQuery(text);

  if (!haystack) return 0;

  return terms.reduce((score, term) => (
    haystack.includes(term) ? score + weight : score
  ), 0);
};

const scoreCourse = (course, terms) => {
  let score = 0;

  score += scoreField(course.title, terms, 5);
  score += scoreField(course.category, terms, 4);
  score += scoreField(course.subTitle, terms, 3);
  score += scoreField(course.description, terms, 2);
  score += scoreField(course.level, terms, 2);

  return score;
};


export const searchWithAi = async (req,res) => {

  try {
    const { input } = req.body;

    if (!input) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const normalizedInput = normalizeQuery(input);

    // --- Use Gemini ONLY for intent extraction (topic + level) ---
    let extractedTopic = normalizedInput;
    let extractedLevel = null;
    try {
      if (!GOOGLE_AI_API_KEY) {
        throw new Error("Google AI API key is not configured");
      }

      const ai = new GoogleGenAI({ apiKey: GOOGLE_AI_API_KEY });
      const prompt = `You are an intent extraction helper for an LMS course search API.
User will type a free-form query describing what they want to learn.
You MUST respond with a single JSON object ONLY, no extra text, in this exact shape:
{ "topic": "<short topic keyword>", "level": "<Beginner|Intermediate|Advanced|\"\">"}

Rules:
- "topic" should be a short keyword like "ml", "machine learning", "ai", "data science", "web development", etc.
- "level" must be one of: "Beginner", "Intermediate", "Advanced", or an empty string "" if level is not clear.
- Do NOT include explanations or markdown, ONLY the JSON object.

Query: "${input}"`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const raw = typeof response.text === "function" ? response.text() : response.text;
      let parsed = null;
      try {
        parsed = JSON.parse(raw);
      } catch {
        // If Gemini wrapped JSON in extra text, try to extract the JSON substring
        const match = raw.match(/\{[\s\S]*\}/);
        if (match) {
          parsed = JSON.parse(match[0]);
        }
      }

      if (parsed && typeof parsed === "object") {
        if (parsed.topic) {
          extractedTopic = normalizeTopicKey(parsed.topic);
        }
        if (typeof parsed.level === "string" && parsed.level.trim()) {
          extractedLevel = parsed.level.trim();
        }
      }

      // #region agent log
      if (DEBUG_LOG_ENDPOINT) {
        fetch(DEBUG_LOG_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: "debug-session",
            runId: "ai-search",
            hypothesisId: "gemini-intent",
            location: "aiController.js:searchWithAi:afterGemini",
            message: "Gemini intent extracted",
            data: { input, normalizedInput, extractedTopic, extractedLevel, raw },
            timestamp: Date.now(),
          }),
        }).catch(() => {});
      }
      // #endregion
    } catch (intentError) {
      // If Gemini fails, fall back to normalized input only
      if (DEBUG_LOG_ENDPOINT) {
        fetch(DEBUG_LOG_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: "debug-session",
            runId: "ai-search",
            hypothesisId: "gemini-failure",
            location: "aiController.js:searchWithAi:geminiError",
            message: "Gemini intent extraction failed",
            data: { input, normalizedInput, error: String(intentError) },
            timestamp: Date.now(),
          }),
        }).catch(() => {});
      }
    }

    if (!extractedTopic || extractedTopic === "course") {
      extractedTopic = inferTopicsFromInput(normalizedInput)[0] || normalizedInput;
    }

    const searchTerms = buildSearchTerms({ normalizedInput, extractedTopic });

    // #region agent log
    if (DEBUG_LOG_ENDPOINT) {
      fetch(DEBUG_LOG_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: "debug-session",
          runId: "ai-search",
          hypothesisId: "normalized-search",
          location: "aiController.js:searchWithAi:beforeQuery",
          message: "AI search built patterns",
          data: { input, normalizedInput, extractedTopic, extractedLevel, searchTerms, levelFilterApplied: !!extractedLevel },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
    }
    // #endregion

    const publishedCourses = await Course.find({ isPublished: true }).lean();
    const normalizedLevel = normalizeQuery(extractedLevel);
    const levelMatchedCourses = normalizedLevel
      ? publishedCourses.filter((course) => normalizeQuery(course.level) === normalizedLevel)
      : publishedCourses;
    const candidateCourses = levelMatchedCourses.length > 0 ? levelMatchedCourses : publishedCourses;

    const courses = candidateCourses
      .map((course) => ({
        ...course,
        _score: scoreCourse(course, searchTerms),
      }))
      .filter((course) => course._score > 0)
      .sort((a, b) => b._score - a._score || a.title.localeCompare(b.title))
      .map(({ _score, ...course }) => course);

    return res.status(200).json(courses);
  } catch (error) {
    console.error("AI search error:", error);
    return res.status(500).json({
      message: "AI search failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
