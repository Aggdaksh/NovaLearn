import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FaArrowLeftLong } from "react-icons/fa6";
import {
  FaBookOpen,
  FaCheckCircle,
  FaClock,
  FaLayerGroup,
  FaLock,
  FaPlayCircle,
  FaStar,
  FaUserGraduate,
} from "react-icons/fa";
import { serverUrl } from "../config/api";
import img from "../assets/empty.jpg";
import Card from "../components/Card.jsx";
import { setSelectedCourseData } from "../redux/courseSlice";
import { setUserData } from "../redux/userSlice";

const courseProfiles = {
  "Web Development": {
    badge: "Full-stack track",
    learn: [
      "Ship responsive React interfaces with reusable component patterns.",
      "Design APIs, auth flows, and MongoDB-backed data models end-to-end.",
      "Structure production-style projects instead of only toy exercises.",
    ],
    requirements:
      "Basic JavaScript awareness helps, but each concept is explained from fundamentals before moving into the MERN stack.",
    audience:
      "Students, aspiring full-stack developers, and freelancers who want to build client-ready web products.",
  },
  "AI/ML": {
    badge: "Core AI concepts",
    learn: [
      "Understand machine learning workflows, model evaluation, and deployment basics.",
      "Work with datasets, experiments, and practical Python-first AI pipelines.",
      "Translate theory into portfolio projects that are easy to explain in interviews.",
    ],
    requirements:
      "Comfort with basic programming is enough. The course builds intuition before introducing heavier ML ideas.",
    audience:
      "Beginners exploring AI seriously, students, and developers looking to move into ML-oriented roles.",
  },
  "AI Tools": {
    badge: "Workflow acceleration",
    learn: [
      "Use modern generative AI tools to speed up coding, research, content, and ideation.",
      "Design prompts and workflows that create reliable results instead of random outputs.",
      "Combine AI tools into repeatable systems for study, work, and side projects.",
    ],
    requirements:
      "No advanced technical background is required. Curiosity and willingness to experiment are enough.",
    audience:
      "Founders, creators, students, and working professionals who want AI to improve their day-to-day output.",
  },
  "UI UX Designing": {
    badge: "Design thinking",
    learn: [
      "Create cleaner interfaces with strong layout, typography, and spacing decisions.",
      "Turn user flows into polished wireframes and screen systems with intent.",
      "Present design work in a way that feels thoughtful, practical, and portfolio ready.",
    ],
    requirements:
      "No prior design experience is required. A basic sense of visual curiosity is enough to start.",
    audience:
      "Beginners entering UI/UX, frontend learners who want stronger visual instincts, and designers refreshing fundamentals.",
  },
  Others: {
    badge: "Problem-solving mode",
    learn: [
      "Break large problems into smaller patterns you can solve under pressure.",
      "Build confidence with contests, interview-style questions, and time-bound thinking.",
      "Create a repeatable approach for arrays, graphs, DP, and greedy strategy questions.",
    ],
    requirements:
      "Basic coding syntax is enough to begin. The main focus is on structured thinking and repetition.",
    audience:
      "Competitive programmers, interview prep learners, and developers who want sharper problem-solving speed.",
  },
};

const defaultProfile = {
  badge: "Career-ready learning",
  learn: [
    "Build practical skills through hands-on lessons and guided exercises.",
    "Follow a structured path that turns concepts into portfolio-friendly work.",
    "Learn with enough depth to apply the ideas independently after the course.",
  ],
  requirements:
    "A beginner-friendly mindset is enough to start. The path is designed to become deeper as you progress.",
  audience:
    "Curious learners, students, and professionals looking to build useful skills in a focused way.",
};

const requestCourseById = (courseId) =>
  axios.get(`${serverUrl}/api/course/getcourse/${courseId}`, {
    withCredentials: true,
  });

function ViewCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { courseData, selectedCourseData } = useSelector((state) => state.course);
  const { userData, authLoading } = useSelector((state) => state.user);

  const [creatorData, setCreatorData] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [selectedCreatorCourse, setSelectedCreatorCourse] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const rawLectures = selectedCourseData?.lectures;
  const lectures = Array.isArray(selectedCourseData?.lectures)
    ? selectedCourseData.lectures
    : [];
  const previewLectures = lectures.filter((lecture) => lecture?.isPreviewFree);
  const creatorId =
    typeof selectedCourseData?.creator === "string"
      ? selectedCourseData.creator
      : selectedCourseData?.creator?._id;
  const courseProfile =
    courseProfiles[selectedCourseData?.category] ?? defaultProfile;

  const ratingFromReviews = (reviews) => {
    if (!Array.isArray(reviews) || reviews.length === 0) return 0;
    const total = reviews.reduce(
      (sum, review) => sum + (typeof review?.rating === "number" ? review.rating : 0),
      0
    );
    return Number((total / reviews.length).toFixed(1));
  };

  const avgRating =
    selectedCourseData?.averageRating != null &&
    Number.isFinite(Number(selectedCourseData.averageRating))
      ? Number(selectedCourseData.averageRating)
      : ratingFromReviews(selectedCourseData?.reviews);

  const reviewCount =
    selectedCourseData?.reviewCount != null &&
    Number.isFinite(Number(selectedCourseData.reviewCount))
      ? Number(selectedCourseData.reviewCount)
      : Array.isArray(selectedCourseData?.reviews)
        ? selectedCourseData.reviews.length
        : 0;

  const currentCourseId =
    selectedCourseData?._id?.toString() ?? courseId?.toString() ?? "";
  const priceLabel =
    selectedCourseData?.price != null ? `₹${selectedCourseData.price}` : "Free";
  const ratingLabel = reviewCount > 0 ? avgRating.toFixed(1) : "New";
  const availableLectureCount = isEnrolled ? lectures.length : previewLectures.length;
  const totalLearners = Array.isArray(selectedCourseData?.enrolledStudents)
    ? selectedCourseData.enrolledStudents.length
    : 0;

  const loadCourseById = async () => {
    if (!courseId) return null;
    try {
      const result = await requestCourseById(courseId);
      dispatch(setSelectedCourseData(result.data));
      return result.data;
    } catch (error) {
      if (error?.response?.status === 401) {
        toast.error("Please log in to view this course.");
        return null;
      }
      toast.error(error?.response?.data?.message ?? "Failed to load course.");
      return null;
    }
  };

  const handleReview = async () => {
    if (!rating) {
      toast.error("Please choose a rating first.");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please write a short review.");
      return;
    }

    try {
      await axios.post(
        `${serverUrl}/api/review/givereview`,
        { rating, comment: comment.trim(), courseId },
        { withCredentials: true }
      );
      toast.success("Review added");
      setRating(0);
      setComment("");
      await loadCourseById();
    } catch (error) {
      toast.error(error?.response?.data?.message ?? "Unable to submit review.");
    }
  };

  const handleEnroll = async (activeCourseId, userId) => {
    try {
      const orderData = await axios.post(
        `${serverUrl}/api/payment/create-order`,
        { courseId: activeCourseId, userId },
        { withCredentials: true }
      );
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

      if (!razorpayKey) {
        toast.error("Payments are not configured in the frontend yet.");
        return;
      }

      if (!window.Razorpay) {
        toast.error("Razorpay checkout is unavailable right now.");
        return;
      }

      const options = {
        key: razorpayKey,
        amount: orderData.data.amount,
        currency: "INR",
        name: "NovaLearn",
        description: `Enroll in ${selectedCourseData?.title ?? "this course"}`,
        order_id: orderData.data.id,
        theme: {
          color: "#111827",
        },
        handler: async (response) => {
          try {
            const verifyRes = await axios.post(
              `${serverUrl}/api/payment/verify-payment`,
              {
                ...response,
                courseId: activeCourseId,
                userId,
              },
              { withCredentials: true }
            );

            setIsEnrolled(true);
            toast.success(verifyRes.data.message);

            const userRes = await axios.get(`${serverUrl}/api/user/currentuser`, {
              withCredentials: true,
            });
            dispatch(setUserData(userRes.data));
          } catch (verifyError) {
            toast.error("Payment verification failed.");
            console.error("Verification Error:", verifyError);
          }
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ?? "Something went wrong while enrolling."
      );
      console.error("Enroll Error:", error);
    }
  };

  useEffect(() => {
    const matchedCourse = courseData.find(
      (item) => item._id?.toString() === courseId?.toString()
    );
    if (matchedCourse) {
      dispatch(setSelectedCourseData(matchedCourse));
    }
  }, [courseId, courseData, dispatch]);

  useEffect(() => {
    if (!courseId) return;

    const alreadySelected =
      selectedCourseData?._id?.toString() === courseId?.toString();
    if (alreadySelected) return;

    const existsInList = courseData.some(
      (course) => course._id?.toString() === courseId?.toString()
    );
    if (existsInList) return;

    const fetchCourse = async () => {
      try {
        const result = await requestCourseById(courseId);
        dispatch(setSelectedCourseData(result.data));
      } catch (error) {
        if (error?.response?.status === 401) {
          toast.error("Please log in to view this course.");
          return;
        }
        toast.error(error?.response?.data?.message ?? "Failed to load course.");
      }
    };

    fetchCourse();
  }, [courseId, courseData, dispatch, selectedCourseData?._id]);

  useEffect(() => {
    const enrolled = userData?.enrolledCourses?.some((course) => {
      const enrolledId = typeof course === "string" ? course : course?._id;
      return enrolledId?.toString() === courseId?.toString();
    });
    setIsEnrolled(Boolean(enrolled));
  }, [userData, courseId]);

  useEffect(() => {
    if (!creatorId) return;

    const getCreator = async () => {
      try {
        const result = await axios.post(
          `${serverUrl}/api/course/getcreator`,
          { userId: creatorId },
          { withCredentials: true }
        );
        setCreatorData(result.data);
      } catch (error) {
        console.error("Error fetching creator:", error);
      }
    };

    getCreator();
  }, [creatorId]);

  useEffect(() => {
    if (!creatorId || courseData.length === 0) {
      setSelectedCreatorCourse([]);
      return;
    }

    const creatorCourses = courseData.filter((course) => {
      const courseCreatorId =
        typeof course?.creator === "string" ? course.creator : course?.creator?._id;
      return (
        courseCreatorId?.toString() === creatorId?.toString() &&
        course._id?.toString() !== currentCourseId
      );
    });

    setSelectedCreatorCourse(creatorCourses.slice(0, 3));
  }, [creatorId, courseData, currentCourseId]);

  useEffect(() => {
    const availableLectures = Array.isArray(rawLectures) ? rawLectures : [];

    if (availableLectures.length === 0) {
      setSelectedLecture(null);
      return;
    }

    setSelectedLecture((currentLecture) => {
      if (
        currentLecture &&
        availableLectures.some((lecture) => lecture._id === currentLecture._id)
      ) {
        return currentLecture;
      }

      return (
        availableLectures.find((lecture) => isEnrolled || lecture.isPreviewFree) ??
        availableLectures[0]
      );
    });
  }, [isEnrolled, rawLectures]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.10),_transparent_32%),linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <button
          className="inline-flex items-center gap-3 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:-translate-y-0.5 hover:text-black"
          onClick={() => navigate("/allcourses")}
        >
          <FaArrowLeftLong className="text-base" />
          Back to courses
        </button>

        <section className="overflow-hidden rounded-[34px] border border-slate-200/80 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.10)]">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
            <div className="relative min-h-[360px] overflow-hidden bg-slate-950">
              <img
                src={selectedCourseData?.thumbnail || img}
                alt={selectedCourseData?.title || "Course thumbnail"}
                className="h-full w-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.12)_0%,rgba(2,6,23,0.72)_58%,rgba(2,6,23,0.96)_100%)]" />

              <div className="absolute left-6 top-6 flex flex-wrap gap-3">
                <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur">
                  {selectedCourseData?.category || "Course"}
                </span>
                <span className="rounded-full border border-blue-300/20 bg-blue-400/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-100 backdrop-blur">
                  {courseProfile.badge}
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-10">
                <p className="text-xs font-medium uppercase tracking-[0.38em] text-white/65">
                  NovaLearn spotlight
                </p>
                <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
                  {selectedCourseData?.title || "Course details"}
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/78 sm:text-base">
                  {selectedCourseData?.subTitle ||
                    selectedCourseData?.description ||
                    "Learn through structured lessons, practical outcomes, and a cleaner, more guided learning journey."}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white backdrop-blur">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-white/60">
                      Rating
                    </p>
                    <p className="mt-1 text-lg font-semibold">{ratingLabel}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white backdrop-blur">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-white/60">
                      Lectures
                    </p>
                    <p className="mt-1 text-lg font-semibold">{lectures.length}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white backdrop-blur">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-white/60">
                      Free Preview
                    </p>
                    <p className="mt-1 text-lg font-semibold">{previewLectures.length}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative flex flex-col justify-between overflow-hidden bg-slate-950 p-6 text-white sm:p-8 lg:p-10">
              <div className="absolute right-[-56px] top-[-20px] h-44 w-44 rounded-full bg-blue-400/20 blur-3xl" />
              <div className="absolute bottom-[-72px] left-[-28px] h-44 w-44 rounded-full bg-white/8 blur-3xl" />

              <div className="relative space-y-6">
                <div>
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-4xl font-semibold">{priceLabel}</p>
                      <p className="mt-2 text-sm text-white/60">
                        Lifetime access with guided lessons and curated practice.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right">
                      <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">
                        Reviews
                      </p>
                      <p className="mt-1 text-lg font-semibold">{reviewCount}</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-3 text-white/90">
                      <FaClock className="text-blue-300" />
                      <span className="text-sm">Structured pace</span>
                    </div>
                    <p className="mt-2 text-sm text-white/60">
                      Clear flow from concepts to execution, without random jumps.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-3 text-white/90">
                      <FaLayerGroup className="text-blue-300" />
                      <span className="text-sm">Hands-on content</span>
                    </div>
                    <p className="mt-2 text-sm text-white/60">
                      Learn with examples, walkthroughs, and project-oriented thinking.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-3 text-white/90">
                      <FaUserGraduate className="text-blue-300" />
                      <span className="text-sm">Learner friendly</span>
                    </div>
                    <p className="mt-2 text-sm text-white/60">
                      Strong enough for growth, but explained simply enough to follow.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-3 text-white/90">
                      <FaBookOpen className="text-blue-300" />
                      <span className="text-sm">Preview access</span>
                    </div>
                    <p className="mt-2 text-sm text-white/60">
                      {previewLectures.length > 0
                        ? `${previewLectures.length} lecture${previewLectures.length === 1 ? "" : "s"} available before enrollment.`
                        : "Preview starts after the first lecture is published."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative mt-8 space-y-4">
                {authLoading ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-white/60">
                    Checking enrollment...
                  </div>
                ) : !isEnrolled ? (
                  <button
                    className="w-full rounded-2xl bg-white px-6 py-4 text-base font-semibold text-black transition hover:-translate-y-0.5 hover:bg-slate-100"
                    onClick={() => handleEnroll(courseId, userData?._id)}
                  >
                    Enroll Now
                  </button>
                ) : (
                  <button
                    className="w-full rounded-2xl bg-emerald-400 px-6 py-4 text-base font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-emerald-300"
                    onClick={() => navigate(`/viewlecture/${courseId}`)}
                  >
                    Watch Full Course
                  </button>
                )}

                <p className="text-sm leading-6 text-white/55">
                  {isEnrolled
                    ? "You are enrolled. Open the full lecture player any time from here."
                    : "Enroll once and continue from any device with your saved progress and student account."}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <div className="rounded-[30px] border border-black/6 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.07)] sm:p-8">
              <h2 className="text-2xl font-semibold text-slate-900">What you'll learn</h2>
              <div className="mt-6 space-y-4">
                {courseProfile.learn.map((point) => (
                  <div
                    key={point}
                    className="flex gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4"
                  >
                    <FaCheckCircle className="mt-1 shrink-0 text-emerald-500" />
                    <p className="text-sm leading-7 text-slate-700 sm:text-base">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[30px] border border-black/6 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.07)] sm:p-8">
              <h2 className="text-2xl font-semibold text-slate-900">Requirements</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                {courseProfile.requirements}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-950 p-5 text-white">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/45">
                    Available now
                  </p>
                  <p className="mt-3 text-2xl font-semibold">{availableLectureCount}</p>
                  <p className="mt-2 text-sm text-white/60">
                    {isEnrolled
                      ? "Lecture slots currently unlocked for you."
                      : "Preview lessons visible before payment."}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                    Learners
                  </p>
                  <p className="mt-3 text-2xl font-semibold text-slate-900">
                    {totalLearners}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    Students already connected to this course.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[30px] border border-black/6 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.07)] sm:p-8">
              <h2 className="text-2xl font-semibold text-slate-900">
                Who this course is for
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                {courseProfile.audience}
              </p>
            </div>
          </div>

          <div className="rounded-[30px] border border-black/6 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.07)] sm:p-8">
            <div className="flex flex-col gap-3 border-b border-slate-100 pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                  Course experience
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                  Curriculum and preview
                </h2>
              </div>
              <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
                {lectures.length} lecture{lectures.length === 1 ? "" : "s"}
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
              <div className="space-y-3">
                {authLoading ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-6 text-sm text-slate-500">
                    Loading curriculum...
                  </div>
                ) : lectures.length > 0 ? (
                  lectures.map((lecture, index) => {
                    const canAccessLecture = isEnrolled || lecture.isPreviewFree;
                    const isActive = selectedLecture?._id === lecture._id;

                    return (
                      <button
                        key={lecture._id || `${lecture.lectureTitle}-${index}`}
                        disabled={!canAccessLecture}
                        onClick={() => canAccessLecture && setSelectedLecture(lecture)}
                        className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                          isActive
                            ? "border-slate-900 bg-slate-950 text-white shadow-lg"
                            : canAccessLecture
                              ? "border-slate-200 bg-white text-slate-800 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                              : "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400 opacity-80"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                              isActive
                                ? "bg-white/10 text-white"
                                : canAccessLecture
                                  ? "bg-slate-100 text-slate-700"
                                  : "bg-slate-200 text-slate-400"
                            }`}
                          >
                            {canAccessLecture ? <FaPlayCircle /> : <FaLock />}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs uppercase tracking-[0.18em] opacity-60">
                              Lesson {index + 1}
                            </p>
                            <p className="mt-1 text-sm font-semibold leading-6">
                              {lecture.lectureTitle}
                            </p>
                            <p className="mt-2 text-xs opacity-70">
                              {lecture.isPreviewFree
                                ? "Preview available"
                                : isEnrolled
                                  ? "Unlocked in your enrollment"
                                  : "Enroll to unlock"}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-6 text-sm leading-7 text-slate-500">
                    Lectures will appear here as soon as course content is added. The page is ready for them.
                  </div>
                )}
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4 sm:p-5">
                <div className="aspect-video overflow-hidden rounded-[24px] bg-slate-950">
                  {selectedLecture?.videoUrl ? (
                    <video
                      src={selectedLecture.videoUrl}
                      controls
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center px-6 text-center text-white">
                      <p className="text-lg font-semibold">
                        {lectures.length > 0
                          ? isEnrolled || previewLectures.length > 0
                            ? "Select a lecture to start the preview"
                            : "No free preview is available yet"
                          : "Curriculum preview will appear here"}
                      </p>
                      <p className="mt-3 max-w-md text-sm leading-7 text-white/65">
                        {lectures.length > 0
                          ? "Pick a lesson from the left panel and the preview player will update here."
                          : "Once lectures are attached to this course, students will be able to preview them from this screen."}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-5 rounded-2xl bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      {selectedLecture?.isPreviewFree ? "Preview lesson" : "Lesson details"}
                    </span>
                    {!selectedLecture?.isPreviewFree && !isEnrolled && lectures.length > 0 && (
                      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                        Enrollment required
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold text-slate-900">
                    {selectedLecture?.lectureTitle ||
                      (lectures.length > 0 ? "Choose a lecture" : "Lecture content coming soon")}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {selectedLecture
                      ? `This lesson is part of ${selectedCourseData?.title}. Use it to explore the teaching style before continuing deeper into the course.`
                      : `Preview lessons from ${selectedCourseData?.title || "this course"} will appear here with video playback and quick context.`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[30px] border border-black/6 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.07)] sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                  Community voice
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                  Write a review
                </h2>
              </div>
              <div className="rounded-2xl bg-slate-100 px-4 py-3 text-center">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  Current rating
                </p>
                <p className="mt-1 text-xl font-semibold text-slate-900">
                  {ratingLabel}
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className="rounded-full border border-slate-200 p-3 transition hover:-translate-y-0.5 hover:border-slate-300"
                  onClick={() => setRating(star)}
                >
                  <FaStar
                    className={star <= rating ? "fill-yellow-500" : "fill-slate-300"}
                  />
                </button>
              ))}
            </div>

            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Share what felt useful, what stood out, or what could be improved..."
              className="mt-5 min-h-[140px] w-full rounded-[24px] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 outline-none transition focus:border-slate-400"
            />

            <button
              className="mt-5 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
              onClick={handleReview}
            >
              Submit Review
            </button>
          </div>

          <div className="space-y-6">
            <div className="rounded-[30px] border border-black/6 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.07)] sm:p-8">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                Instructor
              </p>
              <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
                <img
                  src={creatorData?.photoUrl || img}
                  alt={creatorData?.name || "Instructor"}
                  className="h-20 w-20 rounded-full border border-slate-200 object-cover"
                />
                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold text-slate-900">
                    {creatorData?.name || "NovaLearn Educator"}
                  </h3>
                  <p className="text-sm leading-7 text-slate-600">
                    {creatorData?.description ||
                      "Focused on practical learning experiences that help students move from watching to building."}
                  </p>
                  <p className="text-sm font-medium text-slate-500">
                    {creatorData?.email || "Educator details will appear here."}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[30px] border border-black/6 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.07)] sm:p-8">
              <div className="flex flex-col gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                    More to explore
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                    More from this educator
                  </h2>
                </div>
                <p className="text-sm text-slate-500">
                  {selectedCreatorCourse.length} recommendation
                  {selectedCreatorCourse.length === 1 ? "" : "s"}
                </p>
              </div>

              {selectedCreatorCourse.length > 0 ? (
                <div className="mt-6 grid gap-5 xl:grid-cols-2">
                  {selectedCreatorCourse.map((course) => (
                    <Card
                      key={course._id}
                      thumbnail={course.thumbnail}
                      title={course.title}
                      id={course._id}
                      price={course.price}
                      category={course.category}
                      reviews={course.reviews}
                      averageRating={course.averageRating}
                      reviewCount={course.reviewCount}
                    />
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-6 text-sm leading-7 text-slate-500">
                  Other published courses from this educator will appear here automatically.
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ViewCourse;
