import { createSlice } from "@reduxjs/toolkit"

const courseSlice=createSlice({
    name:"course",
    initialState:{
        creatorCourseData:[],
        courseData:[],
        selectedCourseData:null,
        courseLoading:false,
        courseError:"",
        hasFetchedCourses:false,
        

    },
    reducers:{
        setCreatorCourseData:(state,action)=>{
        state.creatorCourseData=action.payload
        },
        setCourseData:(state,action)=>{
            state.courseData = action.payload
        },
        setSelectedCourseData:(state,action)=>{
            state.selectedCourseData=action.payload
        },
        setCourseLoading:(state,action)=>{
            state.courseLoading=action.payload
        },
        setCourseError:(state,action)=>{
            state.courseError=action.payload
        },
        setHasFetchedCourses:(state,action)=>{
            state.hasFetchedCourses=action.payload
        }
    }
})

export const {setCreatorCourseData}=courseSlice.actions
export const {setCourseData} = courseSlice.actions
export const {setSelectedCourseData} = courseSlice.actions
export const {setCourseLoading} = courseSlice.actions
export const {setCourseError} = courseSlice.actions
export const {setHasFetchedCourses} = courseSlice.actions
export default courseSlice.reducer
