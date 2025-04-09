import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import { store } from "./store/store";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateProject from "./pages/CreateProject";
import Profile from "./pages/Profile";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";
import { verifyToken } from "./store/slices/authSlice";
import type { AppDispatch } from "./store/store";
import Users from "./pages/Users";
import CreateTeam from "./pages/CreateTeam";
import ExistingProjects from "./pages/ExistingProjects";

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(verifyToken());
  }, [dispatch]);
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="projects/create" element={<CreateProject />} />
            <Route path="profile" element={<Profile />} />
            <Route path="users" element={<Users />} />
            <Route path="create-team" element={<CreateTeam />} />
            <Route path="projects/existing" element={<ExistingProjects />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
