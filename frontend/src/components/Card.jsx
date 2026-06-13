import React from "react";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import img from "../assets/empty.jpg";

const CourseCard = ({ thumbnail, title, category, price ,id , reviews, averageRating, reviewCount }) => {
  const navigate = useNavigate()
   const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;

  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return (total / reviews.length).toFixed(1); // rounded to 1 decimal
};

const avgRating = averageRating ?? calculateAverageRating(reviews);
const totalReviews = reviewCount ?? reviews?.length ?? 0;
  return (
    <div
      className="group max-w-sm w-full cursor-pointer overflow-hidden rounded-[28px] border border-black/8 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(15,23,42,0.14)]"
      onClick={()=>navigate(`/viewcourse/${id}`)}
    >
      <div className="relative overflow-hidden">
        <img
          src={thumbnail || img}
          alt={title}
          className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-black shadow-sm">
          {category}
        </div>
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h2 className="text-xl font-semibold leading-tight">{title}</h2>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span className="rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-700">
            {totalReviews} review{totalReviews === 1 ? "" : "s"}
          </span>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
            Explore
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <span className="text-2xl font-semibold text-gray-900">₹{price}</span>
          <span className="flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
            <FaStar className="text-yellow-500" />
            {avgRating}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
