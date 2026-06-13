import React, { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import useCurrentUser from './customHooks/getCurrentUser'
import { useSelector } from 'react-redux'
import useCourseData from './customHooks/getCouseData'
import ScrollToTop from './components/ScrollToTop'
import useCreatorCourseData from './customHooks/getCreatorCourseData'
import useAllReviews from './customHooks/getAllReviews'
import ProtectedRoute, { FullPageLoader } from './components/ProtectedRoute'

const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const SignUp = lazy(() => import('./pages/SignUp'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const Profile = lazy(() => import('./pages/Profile'))
const EditProfile = lazy(() => import('./pages/EditProfile'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const Courses = lazy(() => import('./pages/admin/Courses'))
const AllCouses = lazy(() => import('./pages/AllCouses'))
const AddCourses = lazy(() => import('./pages/admin/AddCourses'))
const CreateCourse = lazy(() => import('./pages/admin/CreateCourse'))
const CreateLecture = lazy(() => import('./pages/admin/CreateLecture'))
const EditLecture = lazy(() => import('./pages/admin/EditLecture'))
const ViewCourse = lazy(() => import('./pages/ViewCourse'))
const EnrolledCourse = lazy(() => import('./pages/EnrolledCourse'))
const ViewLecture = lazy(() => import('./pages/ViewLecture'))
const SearchWithAi = lazy(() => import('./pages/SearchWithAi'))

function App() {
  const { userData, authLoading } = useSelector((state) => state.user)

  useCurrentUser()
  useCourseData()
  useCreatorCourseData()
  useAllReviews()

  if (authLoading) {
    return <FullPageLoader />
  }

  return (
    <>
      <ToastContainer />
      <ScrollToTop />
      <Suspense fallback={<FullPageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={!userData ? <SignUp /> : <Navigate to="/" />} />
          <Route path="/profile" element={userData ? <Profile /> : <Navigate to="/signup" />} />
          <Route path="/allcourses" element={userData ? <AllCouses /> : <Navigate to="/signup" />} />
          <Route path="/viewcourse/:courseId" element={userData ? <ViewCourse /> : <Navigate to="/signup" />} />
          <Route path="/editprofile" element={userData ? <EditProfile /> : <Navigate to="/signup" />} />
          <Route path="/enrolledcourses" element={userData ? <EnrolledCourse /> : <Navigate to="/signup" />} />
          <Route path="/viewlecture/:courseId" element={userData ? <ViewLecture /> : <Navigate to="/signup" />} />
          <Route path="/searchwithai" element={userData ? <SearchWithAi /> : <Navigate to="/signup" />} />
          <Route path="/dashboard" element={<ProtectedRoute authLoading={authLoading} userData={userData} requiredRole="educator"><Dashboard /></ProtectedRoute>} />
          <Route path="/courses" element={<ProtectedRoute authLoading={authLoading} userData={userData} requiredRole="educator"><Courses /></ProtectedRoute>} />
          <Route path="/addcourses/:courseId" element={<ProtectedRoute authLoading={authLoading} userData={userData} requiredRole="educator"><AddCourses /></ProtectedRoute>} />
          <Route path="/createcourses" element={<ProtectedRoute authLoading={authLoading} userData={userData} requiredRole="educator"><CreateCourse /></ProtectedRoute>} />
          <Route path="/createlecture/:courseId" element={<ProtectedRoute authLoading={authLoading} userData={userData} requiredRole="educator"><CreateLecture /></ProtectedRoute>} />
          <Route path="/editlecture/:courseId/:lectureId" element={<ProtectedRoute authLoading={authLoading} userData={userData} requiredRole="educator"><EditLecture /></ProtectedRoute>} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
        </Routes>
      </Suspense>
    </>
  )
}

export default App
