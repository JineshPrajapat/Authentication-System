import { createSlice } from "@reduxjs/toolkit";
import { AuthStates } from "../../utils/enums";
import { deleteAccount, getAllUsers, login, logOut, updateProfile, UserInfo } from "../../services/auth";

const initialState = {
    name:"",
    email:"",
    profession:"",
    address:"",
    authState : AuthStates.INITIALIZING,
    loading:false,
    error:null,
    users:[]
}

const userSlice = createSlice({
    name:"user",
    initialState,
    reducers:{
        logOut(state){
            state.name = "",
            state.email="",
            state.authState = AuthStates.IDLE,
            state.error=null
        },
        setUser(state, action){
            state.authState = action.payload.authState ?? state.authState;
            // state.name = action.payload
            // state.error = action.payload.error ?? state.error
        }
    },
    extraReducers: (builder)=>{
        builder
            // login
            .addCase(login.pending, (state)=>{
                state.authState = AuthStates.INITIALIZING;
                state.error= null;
                state.loading=true;
            })
            .addCase(login.fulfilled, (state, action) => {
                console.log("login successfully", action)
                state.authState = AuthStates.AUTHENTICATED;
                // state.email = action.payload.email;
                // state.name = action.payload.name;
                state.loading = false;
            })
            .addCase(login.rejected, (state, action) => {
                state.authState = AuthStates.ERROR;
                state.error = action.payload;
                state.loading = false;
            })

            // logOut
            .addCase(logOut.pending,(state)=>{
                state.error= null;
                state.loading= true;
            })
            .addCase(logOut.fulfilled, (state, action)=>{
                state.authState = AuthStates.IDLE
                state.email = "";
                state.name = "";
                state.profession = "";
                state.address = "";
                users=[];
                state.loading=false;
            })

            .addCase(logOut.rejected, (state, action)=>{
                state.loading=false;
                state.error = action.payload;
            })

            // userInfo
            .addCase(UserInfo.pending, (state)=>{
                state.error= null;
                state.loading=true;
            })
            .addCase(UserInfo.fulfilled, (state, action)=>{
                console.log("login successfully", action)
                state.authState = AuthStates.AUTHENTICATED
                state.email = action.payload.user.email;
                state.name = action.payload.user.name;
                state.profession = action.payload.user.profession;
                state.address = action.payload.user.address;
                state.loading=false;
            })
            .addCase(UserInfo.rejected, (state, action)=>{
                state.error= action.payload;
                state.loading=false;
            })

            // alluser 
            .addCase(getAllUsers.pending, (state)=>{
                state.error = null;
                state.loading = true
            })
            .addCase(getAllUsers.fulfilled, (state, action)=>{
                state.users = action.payload.users
                state.loading = false
            })
            .addCase(getAllUsers.rejected, (state, action)=>{
                state.error = action.payload;
                state.loading= false;
            })

            // edit profile
            .addCase(updateProfile.pending, (state)=>{
                state.error= null;
                state.loading=true;
            })
            .addCase(updateProfile.fulfilled, (state, action)=>{
                state.email = action.payload.user.email;
                state.name = action.payload.user.name;
                state.profession = action.payload.user.profession;
                state.address = action.payload.user.address;
                state.loading=false;
            })
            .addCase(updateProfile.rejected, (state, action)=>{
                state.error= action.payload;
                state.loading=false;
            })

            // delete account
            .addCase(deleteAccount.pending, (state)=>{
                state.error= null;
                state.loading=true;
            })
            .addCase(deleteAccount.fulfilled, (state, action)=>{
                console.log("login successfully", action)
                state.authState = AuthStates.IDLE
                state.email = "";
                state.name = "";
                state.profession = "";
                state.address = "";
                users=[];
                state.loading=false;
            })
            .addCase(deleteAccount.rejected, (state, action)=>{
                state.error= action.payload;
                state.loading=false;
            })

    }
});

export const {setUser} = userSlice.actions;
export default userSlice.reducer;

