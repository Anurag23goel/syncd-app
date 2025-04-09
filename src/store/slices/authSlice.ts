import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { AuthState, LoginCredentials } from "../../types/auth";
import ROUTES from "../../Api";

const initialState: AuthState = {
  userData: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null,
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials) => {
    console.log(credentials);

    const response = await axios.post(ROUTES.LOGIN, credentials);
    const { data: userData, token } = response.data;
    console.log(token);
    console.log(userData);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    return { token, userData };
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  await axios.post("/api/admin/logout");
  localStorage.removeItem("token");
});

export const verifyToken = createAsyncThunk(
  "auth/verifyToken",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    console.log("verifyToken vale thunk mei", token);

    if (!token) return rejectWithValue("No token found");

    try {
      const response = await axios.post(
        ROUTES.VERIFY_AUTH_TOKEN,
        {},
        {
          headers: { authToken: token },
        }
      );

      if (response.data.message === "Token verified") {
        return { token };
      } else {
        return rejectWithValue("Token invalid");
      }
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Token verification failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.userData = action.payload.userData;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.userData));
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Login failed";
      })
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      })
      .addCase(verifyToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.token = null;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
