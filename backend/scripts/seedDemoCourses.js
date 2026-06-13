import dotenv from "dotenv";
import mongoose from "mongoose";
import Course from "../models/courseModel.js";
import Lecture from "../models/lectureModel.js";
import User from "../models/userModel.js";

dotenv.config();

const demoVideoUrls = [
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  "https://www.w3schools.com/html/mov_bbb.mp4",
  "https://www.w3schools.com/html/movie.mp4",
];

const demoCourses = [
  {
    title: "MERN Stack Masterclass",
    subTitle: "Build modern full-stack apps with React, Node, Express, and MongoDB.",
    description:
      "A practical MERN course focused on shipping polished products, not just isolated code snippets. You will build the frontend, backend, authentication flow, and deployment-ready structure in a clean sequence.",
    category: "Web Development",
    level: "Beginner",
    price: 1999,
    thumbnail:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80",
    lectures: [
      {
        lectureTitle: "Kickoff: MERN roadmap and project architecture",
        videoUrl: demoVideoUrls[0],
        isPreviewFree: true,
      },
      {
        lectureTitle: "Building React pages with reusable UI sections",
        videoUrl: demoVideoUrls[1],
        isPreviewFree: false,
      },
      {
        lectureTitle: "Node APIs, auth, and MongoDB integration",
        videoUrl: demoVideoUrls[2],
        isPreviewFree: false,
      },
    ],
  },
  {
    title: "AI Foundations Bootcamp",
    subTitle: "Start from the core ideas behind ML and grow into practical AI workflows.",
    description:
      "This course makes AI concepts approachable while still feeling serious. It covers data thinking, model intuition, experimentation, and how AI work actually looks in hands-on projects.",
    category: "AI/ML",
    level: "Beginner",
    price: 2299,
    thumbnail:
      "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1400&q=80",
    lectures: [
      {
        lectureTitle: "AI roadmap: data, models, and outcomes",
        videoUrl: demoVideoUrls[1],
        isPreviewFree: true,
      },
      {
        lectureTitle: "Feature engineering and training loop basics",
        videoUrl: demoVideoUrls[2],
        isPreviewFree: false,
      },
      {
        lectureTitle: "Evaluation, iteration, and model storytelling",
        videoUrl: demoVideoUrls[0],
        isPreviewFree: false,
      },
    ],
  },
  {
    title: "UI UX Design Launchpad",
    subTitle: "Learn to craft interfaces that feel cleaner, smarter, and easier to use.",
    description:
      "A design-first path for learners who want stronger taste, better screen hierarchy, and more confident product thinking. The focus is on practical layouts, flow, and presentation quality.",
    category: "UI UX Designing",
    level: "Beginner",
    price: 1499,
    thumbnail:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=80",
    lectures: [
      {
        lectureTitle: "Design thinking and interface critique basics",
        videoUrl: demoVideoUrls[2],
        isPreviewFree: true,
      },
      {
        lectureTitle: "Wireframes to polished layouts",
        videoUrl: demoVideoUrls[0],
        isPreviewFree: false,
      },
      {
        lectureTitle: "Typography, spacing, and visual systems",
        videoUrl: demoVideoUrls[1],
        isPreviewFree: false,
      },
    ],
  },
  {
    title: "CP Mastery Bootcamp",
    subTitle: "Sharpen logic, speed, and structured thinking for contests and interviews.",
    description:
      "Built for learners who want competitive programming style problem-solving without feeling lost. The path focuses on pattern recognition, fast thinking, and disciplined practice across classic topics.",
    category: "Others",
    level: "Intermediate",
    price: 1799,
    thumbnail:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1400&q=80",
    lectures: [
      {
        lectureTitle: "CP starter toolkit: approach, speed, and debugging",
        videoUrl: demoVideoUrls[0],
        isPreviewFree: true,
      },
      {
        lectureTitle: "Greedy, binary search, and pattern spotting",
        videoUrl: demoVideoUrls[1],
        isPreviewFree: false,
      },
      {
        lectureTitle: "Graphs, DP, and contest mindset",
        videoUrl: demoVideoUrls[2],
        isPreviewFree: false,
      },
    ],
  },
  {
    title: "Generative AI Builder Lab",
    subTitle: "Create useful GenAI workflows for study, work, and real mini products.",
    description:
      "A hands-on course that turns generative AI from hype into a workflow tool. You will learn prompt design, output validation, and how to turn AI into repeatable systems for practical tasks.",
    category: "AI Tools",
    level: "Beginner",
    price: 2499,
    thumbnail:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1400&q=80",
    lectures: [
      {
        lectureTitle: "Prompt design patterns that actually work",
        videoUrl: demoVideoUrls[1],
        isPreviewFree: true,
      },
      {
        lectureTitle: "Building repeatable AI workflows",
        videoUrl: demoVideoUrls[2],
        isPreviewFree: false,
      },
      {
        lectureTitle: "From idea to AI-powered mini tool",
        videoUrl: demoVideoUrls[0],
        isPreviewFree: false,
      },
    ],
  },
];

const findEducator = async () => {
  const preferredEmail = process.env.DEMO_EDUCATOR_EMAIL || "daksh121105@gmail.com";

  let educator = await User.findOne({ email: preferredEmail });
  if (!educator) {
    educator = await User.findOne({ role: "educator" });
  }
  if (!educator) {
    educator = await User.findOne();
  }
  if (!educator) {
    throw new Error(
      "No user found in the database. Create or sign up at least one account before seeding demo courses."
    );
  }

  if (educator.role !== "educator") {
    educator.role = "educator";
    await educator.save();
  }

  return educator;
};

const syncLectures = async (course, lectureConfigs) => {
  const existingLectures =
    course.lectures?.length > 0
      ? await Lecture.find({ _id: { $in: course.lectures } })
      : [];

  const lectureIds = [];

  for (const lectureConfig of lectureConfigs) {
    let lecture = existingLectures.find(
      (item) => item.lectureTitle === lectureConfig.lectureTitle
    );

    if (!lecture) {
      lecture = new Lecture();
    }

    lecture.lectureTitle = lectureConfig.lectureTitle;
    lecture.videoUrl = lectureConfig.videoUrl;
    lecture.isPreviewFree = lectureConfig.isPreviewFree;
    await lecture.save();

    lectureIds.push(lecture._id);
  }

  return lectureIds;
};

const upsertCourse = async (creator, courseConfig) => {
  let course = await Course.findOne({
    title: courseConfig.title,
    creator: creator._id,
  });

  if (!course) {
    course = new Course({
      title: courseConfig.title,
      creator: creator._id,
    });
  }

  course.title = courseConfig.title;
  course.subTitle = courseConfig.subTitle;
  course.description = courseConfig.description;
  course.category = courseConfig.category;
  course.level = courseConfig.level;
  course.price = courseConfig.price;
  course.thumbnail = courseConfig.thumbnail;
  course.creator = creator._id;
  course.isPublished = true;
  course.lectures = await syncLectures(course, courseConfig.lectures);
  await course.save();

  return course;
};

const run = async () => {
  const mongoUri = process.env.MONGODB_URL || process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error(
      "MongoDB connection string is missing. Set MONGODB_URL or MONGODB_URI first."
    );
  }

  await mongoose.connect(mongoUri);

  const educator = await findEducator();
  const seeded = [];

  for (const courseConfig of demoCourses) {
    const course = await upsertCourse(educator, courseConfig);
    seeded.push(course);
  }

  console.log(
    JSON.stringify(
      {
        educator: {
          id: educator._id,
          name: educator.name,
          email: educator.email,
          role: educator.role,
        },
        totalSeededCourses: seeded.length,
        courses: seeded.map((course) => ({
          id: course._id,
          title: course.title,
          category: course.category,
          price: course.price,
          lectures: course.lectures.length,
          isPublished: course.isPublished,
        })),
      },
      null,
      2
    )
  );
};

run()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
