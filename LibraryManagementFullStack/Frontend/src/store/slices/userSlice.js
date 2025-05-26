import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
 import { toast } from "react-toastify";

 const userSlice=createSlice({
    name:"user",
    initialState:{
        users:[],
        loading:false,
    },
    reducers:{
        fetchAllUsersRequest(state){
            state.loading=true;
        },
        fetchAllUsersSuccess(state,action){
            state.loading=false;
            state.users=action.payload;
        },
        fetchAllUsersFailed(state){
            state.loading=false;
        },

    }
 });

 export const fetchAllUsersRequest=()=>async(dispatch)=>{
    dispatch(userSlice.actions.fetchAllUsersRequest());
    await axios.get("http://localhost:4000/api/v1/admin/users",{withCredentials:true}).then(res=>{
        dispatch(userSlice.actions.fetchAllUsersSuccess(req.data.users));
    }).catch(err=>{
        dispatch(userSlice.actions.fetchAllUsersFailed(err.response.data.message));
    })
 };

 export const addNewAdmin=(data)=>async(dispatch)=>{
    dispatch(userSlice.actions.addNewAdminRequest());
    await axios.post("",data,{
        withCredentials:true,
        headers:{
            "Content-Type":"multipart/form-data",
        },
    });
 };