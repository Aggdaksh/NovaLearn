import React, { useEffect, useState } from 'react';
import Card from "../components/Card.jsx";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate, useSearchParams } from 'react-router-dom';
import Nav from '../components/Nav';
import ai from '../assets/SearchAi.png'
import { useSelector } from 'react-redux';

function AllCourses() {
  const categoryOptions = [
    'App Development',
    'AI/ML',
    'AI Tools',
    'Data Science',
    'Data Analytics',
    'Ethical Hacking',
    'UI UX Designing',
    'Web Development',
    'Others',
  ];
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  const [category, setCategory] = useState([]);
  const [filterCourses, setFilterCourses] = useState([]);
  const { courseData, courseLoading, courseError, hasFetchedCourses } = useSelector(state => state.course);

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory(prev => prev.filter(item => item !== e.target.value));
    } else {
      setCategory(prev => [...prev, e.target.value]);
    }
  };

  const clearFilters = () => {
    setCategory([]);
    if (categoryFromUrl) {
      navigate("/allcourses");
      return;
    }
    setFilterCourses(courseData);
  };

  // Single source: filter by URL category (when present) or by sidebar checkboxes
  useEffect(() => {
    let list = courseData.slice();
    const urlCategory = categoryFromUrl?.trim();
    if (urlCategory) {
      const q = urlCategory.toLowerCase();
      list = list.filter(item => (item.category || '').toLowerCase() === q);
    } else if (category.length > 0) {
      list = list.filter(item => category.includes(item.category));
    }
    setFilterCourses(list);
  }, [courseData, categoryFromUrl, category]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Nav/>
      {/* Toggle Button */}
      <button
        onClick={() => setIsSidebarVisible(prev => !prev)}
        className="fixed top-20 left-4 z-50 bg-white text-black px-3 py-1 rounded md:hidden border-2 border-black"
      >
        {isSidebarVisible ? 'Hide' : 'Show'} Filters
      </button>

      {/* Sidebar */}
      <aside className={`w-[260px] h-screen overflow-y-auto bg-black fixed  top-0 left-0 p-6 py-[130px] border-r border-gray-200 shadow-md transition-transform duration-300 z-5 
        ${isSidebarVisible ? 'translate-x-0' : '-translate-x-full'} 
        md:block md:translate-x-0`}>
          
        <h2 className="text-xl font-bold flex items-center justify-center gap-2 text-gray-50 mb-6"><FaArrowLeftLong className='text-white' onClick={()=>navigate("/")}/>Filter by Category</h2>

        <form className="space-y-4 text-sm  bg-gray-600 border-white text-[white] border  p-[20px] rounded-2xl" onSubmit={(e)=>e.preventDefault()}>
          <button className='px-[10px] py-[10px]  bg-black text-white  rounded-[10px] text-[15px] font-light flex items-center justify-center gap-2 cursor-pointer' onClick={()=>navigate("/searchwithai")}>Search with AI <img src={ai} className='w-[30px] h-[30px] rounded-full' alt="" /></button>
          {(category.length > 0 || categoryFromUrl) && (
            <button
              className='w-full rounded-[10px] border border-white/40 bg-white/10 px-[10px] py-[8px] text-[14px] font-medium text-white cursor-pointer hover:bg-white/20 transition'
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          )}
          {categoryOptions.map((option) => (
            <label key={option} className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition">
              <input
                type="checkbox"
                className="accent-black w-4 h-4 rounded-md"
                value={option}
                checked={category.includes(option)}
                onChange={toggleCategory}
              />
              {option}
            </label>
          ))}
        </form>
      </aside>

      {/* Main Courses Section */}
      <main className="w-full transition-all duration-300 py-[130px] md:pl-[300px]  flex items-start justify-center md:justify-start flex-wrap gap-6 px-[10px]">
        {courseLoading && !hasFetchedCourses ? (
          <div className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800">Loading courses...</h2>
            <p className="mt-3 text-gray-500">
              The course server may take a few seconds to wake up on production.
            </p>
          </div>
        ) : courseError ? (
          <div className="w-full max-w-xl rounded-2xl border border-dashed border-red-300 bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800">Unable to load courses</h2>
            <p className="mt-3 text-gray-500">{courseError}</p>
          </div>
        ) : filterCourses?.length > 0 ? (
          filterCourses.map((item,index)=>(
            <Card key={index} thumbnail={item.thumbnail} title={item.title} price={item.price} category={item.category} id={item._id} reviews={item.reviews} averageRating={item.averageRating} reviewCount={item.reviewCount} />
          ))
        ) : (
          <div className="w-full max-w-xl rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800">
              {category.length > 0 || categoryFromUrl ? "No courses match these filters" : "No courses available right now"}
            </h2>
            <p className="mt-3 text-gray-500">
              {category.length > 0 || categoryFromUrl
                ? "Try clearing the selected category filters to view all available courses."
                : "Create a course from the educator dashboard, or clear the category filter to see all available courses."}
            </p>
            {(category.length > 0 || categoryFromUrl) && (
              <button
                className="mt-6 rounded-xl bg-black px-5 py-3 text-white transition hover:bg-gray-800"
                onClick={clearFilters}
              >
                Show All Courses
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default AllCourses;
