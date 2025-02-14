import { createAsyncThunk } from "@reduxjs/toolkit";
import userApi from "../api/userapi";

export const login = createAsyncThunk(
    "user/login",
    async (
        { email, password }, { rejectWithValue }
    ) => {
        try {
            const response = await userApi.post("/auth/login", {
                email,
                password
            });
            console.log("login response", response);
            window.location.reload;
            return response.data;
        } catch (error) {

            console.log("error",error);
            return rejectWithValue(
                error.response?.data?.message ||
                "Login failed: Invalid credentials or server error."
            );
        }
    }
);

export const register = createAsyncThunk(
    "user/register",
    async (
        { email, password, name }, { rejectWithValue }
    ) => {
        console.log("response", response.status);
        try {
            console.log("response", response.status);
            const response = await userApi.post("/auth/register", {
                email,
                password,
                name
            });

            console.log("response", response.status);
            if (response.data.success === true) {
                return response.data;
            } else if(response.data.status === 409) {
                return rejectWithValue("User already registerd");
            }
        } catch (error) {

            console.log("error.response", error.response);
            // if (error.response) {
            //     const statusCode = error.response.status;

            //     if (statusCode === 409) {
            //         // User already registered
            //         return rejectWithValue("User already registered");
            //     }
            //     else if (statusCode === 400) {
            //         // Invalid input
            //         return rejectWithValue("Invalid input, please check the fields");
            //     }
            //     else if (statusCode === 401) {
            //         // Unauthorized
            //         return rejectWithValue("Unauthorized, please check your permissions");
            //     }
            //     else if (statusCode === 404) {
            //         // Not Found
            //         return rejectWithValue("The requested resource was not found");
            //     }
            //     else if (statusCode >= 500) {
            //         // Server errors
            //         return rejectWithValue("Server error, please try again later");
            //     }
            // }

            return rejectWithValue(
                error.response?.data?.message || "Registration failed: Server error."
            );
        }
    }
)

export const verifyEmail = createAsyncThunk(
    "user/verifyEmail",
    async (
        { verificationToken }, { rejectWithValue }
    ) => {
        console.log("verificationToken", verificationToken)
        try {
            const response = await userApi.post("/auth/verify-email", null,{
                params: { verificationToken },
            });

        

            if (response.data.success === true) {
                return 1;
            }
            else {
                return rejectWithValue("Email verification failed");
            }

        }
        catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Email verification failed: Server error."
            );
        }
    }
)

// forget password
export const sendPasswordResetLink = createAsyncThunk(
    "/user/forgetpassword",
    async (
        { email }, { rejectWithValue }
    ) => {
        try {
            const response = await userApi.post("/auth/reset-password-token", {
                email,
            });

            if (response.data.success === true) {
                return 1;
            }
            else {
                return rejectWithValue("Reset Password link not generated");
            }
        }
        catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "REset password link not created: Server error."
            );
        }
    }
)

export const resetPassword = createAsyncThunk(
    "/user/forgetpassword",
    async (
        { password, confirmPassword, token }, { rejectWithValue }
    ) => {
        try {
            const response = await userApi.post("/auth/reset-password", {
                password,
                confirmPassword,
                token
            });

            if (response.data.success === true) {
                return 1;
            }
            else {
                return rejectWithValue("Failed to reset password, try again later");
            }
        }
        catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "REset password link not created: Server error."
            );
        }
    }
)

export const logOut = createAsyncThunk(
    "user/logOut",
    async (
        _, { rejectWithValue }
    ) => {
        try {
            const response = await userApi.post("/auth/logout");

            if(response.data.success === true)
            {
                window.location.href = "/";
                return response.data;
            }
            else{
                return rejectWithValue("Failed to logout, try again");
            }
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "REset password link not created: Server error."
            );
        }
    }
);

export const getAllUsers = createAsyncThunk(
    "user/allusers",
    async(
        _, {rejectWithValue}
    )=>{
        try {
            const response = await userApi.get("/user/allUsers");

            const {users} = response.data;
            if(response.data.success === true)
            {
                return {users};
            }
            else{
                return rejectWithValue("Failed to fetch Users, try again");
            }
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch Users: Server error."
            );
        }
    }
)

export const UserInfo = createAsyncThunk(
    "user/userInfo",
    async(
        _, {rejectWithValue}
    )=>{
        try {
            const response = await userApi.get("/user");
            const {user} = response.data;
            console.log("user", response.data)
            if(response.data.success === true)
            {
                return {user}
            }
            else{
                return rejectWithValue("Failed to fetch Users, try again");
            }
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch Users: Server error."
            );
        }
    }
)