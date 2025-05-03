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
        otpVerificationRequest: (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        otpVerificationSuccess:(state,action)=>{
            state.loading = false;
            state.message = action.payload.message;
            state.isAuthenticated = true;
            state.user = action.payload.user;
        },
        otpVerificationFailed:(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        },
        loginRequest: (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        loginSuccess:(state,action)=>{
            state.loading = false;
            state.message = action.payload.message;
            state.isAuthenticated = true;
            state.user = action.payload.user;
        },
        loginFailed:(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        },
        logoutRequest: (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
         logoutSuccess:(state,action)=>{
            state.loading = false;
            state.message = action.payload;
            state.isAuthenticated = false;
            state.user = null;
        },
        logoutFailed:(state,action)=>{
            state.loading = false;
            state.error = action.payload;
            state.message = null;
        },
        getUserRequest: (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        getUserSuccess:(state,action)=>{
            state.loading = false;
            state.message = action.payload.message;
            state.isAuthenticated = true;
            state.user = action.payload.user;
        },
        getUserFailed:(state)=>{
            state.loading = false;
            state.user = null;
            state.isAuthenticated = false;
        },
        forgotPasswordRequest: (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        forgotPasswordSuccess:(state,action)=>{
            state.loading = false;
            state.message = action.payload.message;
        },
        forgotPasswordFailed:(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        },
        resetPasswordRequest: (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        resetPasswordSuccess:(state,action)=>{
            state.loading = false;
            state.message = action.payload.message;
            state.isAuthenticated = true;
            state.user = action.payload.user;
        },
        resetPasswordFailed:(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        },
        updatePasswordRequest: (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        updatePasswordSuccess:(state,action)=>{
            state.loading = false;
            state.message = action.payload;
        },
        updatePasswordFailed:(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        },


        resetAuthSlice: (state) => {
            state.loading = false;
            state.user = state.user ? state.user : null;
            state.message = null;
            state.error = null;
            state.isAuthenticated = state.isAuthenticated ? state.isAuthenticated : false;
        }
    }
});

export const resetAuthSlice = () => (dispatch) => {
    dispatch(authSlice.actions.resetAuthSlice());
}
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
export const otpVerification=(email,otp)=>async(dispatch)=>{
    dispatch(authSlice.actions.otpVerificationRequest());
    await axios.post('/api/v1/auth/register',{email,otp},{
        withCredentials:true,
        headers:{
            'Content-Type':'application/json',
        },
    })
    .then((res)=>{
        dispatch(authSlice.actions.otpVerificationSuccess(res.data));
    })
    .catch((err)=>{
        dispatch(authSlice.actions.otpVerificationFailed(err.response.data.message));
    });
};

export const login=(data)=>async(dispatch)=>{
    dispatch(authSlice.actions.loginRequest());
    await axios.post('/api/v1/auth/login',data,{
        withCredentials:true,
        headers:{
            'Content-Type':'application/json',
        },
    })
    .then((res)=>{
        dispatch(authSlice.actions.loginSuccess(res.data));
    })
    .catch((err)=>{
        dispatch(authSlice.actions.loginFailed(err.response.data.message));
    });
}
export const logout=()=>async(dispatch)=>{
    dispatch(authSlice.actions.logoutRequest());
    await axios.get('http://localhost:3000/api/v1/user/logout',{
        withCredentials:true,
    })
    .then((res)=>{
        dispatch(authSlice.actions.logoutSuccess(res.data.message));
        dispatch(authSlice.actions.resetAuthSlice());
    })
    .catch((err)=>{
        dispatch(authSlice.actions.logoutFailed(err.response.data.message));
    });
}
export const getUser=()=>async(dispatch)=>{
    dispatch(authSlice.actions.getUserRequest());
    await axios.get('/api/v1/auth/me',{
        withCredentials:true,
    })
    .then((res)=>{
        dispatch(authSlice.actions.getUserSuccess(res.data));
    })
    .catch((err)=>{
        dispatch(authSlice.actions.getUserFailed(err.response.data.message));
    });
};
export const forgotPassword=(email)=>async(dispatch)=>{
    dispatch(authSlice.actions.forgotPasswordRequest());
    await axios.post('/api/v1/auth/forgotpassword',{email},{
        withCredentials:true,
        headers:{
            'Content-Type':'application/json',
        },
    })
    .then((res)=>{
        dispatch(authSlice.actions.forgotPasswordSuccess(res.data));
    })
    .catch((err)=>{
        dispatch(authSlice.actions.forgotPasswordFailed(err.response.data.message));
    });
};
export const resetPassword=(data,token)=>async(dispatch)=>{
    dispatch(authSlice.actions.resetPasswordRequest());
    await axios.put('/api/v1/auth/resetpassword',data,{
        withCredentials:true,
        headers:{
            'Content-Type':'application/json',
        },
    })
    .then((res)=>{
        dispatch(authSlice.actions.resetPasswordSuccess(res.data));
    })
    .catch((err)=>{
        dispatch(authSlice.actions.resetPasswordFailed(err.response.data.message));
    });
};
export const updatePassword=(data)=>async(dispatch)=>{
    dispatch(authSlice.actions.updatePasswordRequest());
    await axios.put('/api/v1/auth/updatepassword',data,{
        withCredentials:true,
        headers:{
            'Content-Type':'application/json',
        },
    })
    .then((res)=>{
        dispatch(authSlice.actions.updatePasswordSuccess(res.data.message));
    })
    .catch((err)=>{
        dispatch(authSlice.actions.updatePasswordFailed(err.response.data.message));
    });
};
export default authSlice.reducer;
