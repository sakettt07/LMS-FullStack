import {createSlice} from '@reduxjs/toolkit';
import axios from 'axios';

const authSlice = createSlice({
    name: 'auth',
    initialState:{
        loading: false,
        user: null,
        message:null,
        error: null,
        isAuthenticated: false,
    },
    reducers:{
        registerRequest: (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        registerSuccess:(state,action)=>{
            state.loading = false;
            state.message = action.payload.message;
        },
        registerFailed:(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        },
    }
});

export const register=(data)=>async(dispatch)=>{
    dispatch(authSlice.actions.registerRequest());
    await axios.post('/api/v1/auth/register',data,{
        withCredentials:true,
        headers:{
            'Content-Type':'application/json',
        },
    })
    .then((res)=>{
        dispatch(authSlice.actions.registerSuccess(res.data));
    })
    .catch((err)=>{
        dispatch(authSlice.actions.registerFailed(err.response.data.message));
    });
};