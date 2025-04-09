import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Calendar,
  Settings,
  Building2,
  LogOut,
  UserCircle,
  PlusCircle,
  Users2,
} from "lucide-react";
import { logout } from "../store/slices/authSlice";
import type { AppDispatch } from "../store/store";
import logo from "../assets/sync.png";

const Sidebar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="h-screen w-64 bg-gray-900 text-white p-4 fixed left-0 top-0 flex flex-col">
      <div className="flex items-center gap-2 mb-8">
        <img src={logo} alt="" className="h-10 w-10" />
        <h1 className="text-2xl font-bold">SyncD</h1>
      </div>

      <nav className="flex-1 space-y-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-2 p-3 rounded-lg transition-colors ${
              isActive ? "bg-blue-600" : "hover:bg-gray-800"
            }`
          }
        >
          <LayoutDashboard className="h-5 w-5" />
          Dashboard
        </NavLink>

        <NavLink
          to="/projects/existing"
          className={({ isActive }) =>
            `flex items-center gap-2 p-3 rounded-lg transition-colors ${
              isActive ? "bg-blue-600" : "hover:bg-gray-800"
            }`
          }
        >
          <PlusCircle className="h-5 w-5" />
          Existing Projects
        </NavLink>

        <NavLink
          to="/projects/create"
          className={({ isActive }) =>
            `flex items-center gap-2 p-3 rounded-lg transition-colors ${
              isActive ? "bg-blue-600" : "hover:bg-gray-800"
            }`
          }
        >
          <PlusCircle className="h-5 w-5" />
          New Project
        </NavLink>

        {/* <NavLink
          to="/calendar"
          className={({ isActive }) =>
            `flex items-center gap-2 p-3 rounded-lg transition-colors ${
              isActive ? 'bg-blue-600' : 'hover:bg-gray-800'
            }`
          }
        >
          <Calendar className="h-5 w-5" />
          Calendar
        </NavLink> */}

        <NavLink
          to="/users"
          className={({ isActive }) =>
            `flex items-center gap-2 p-3 rounded-lg transition-colors ${
              isActive ? "bg-blue-600" : "hover:bg-gray-800"
            }`
          }
        >
          <Users2 className="h-5 w-5" />
          Users
        </NavLink>

        <NavLink
          to="/create-team"
          className={({ isActive }) =>
            `flex items-center gap-2 p-3 rounded-lg transition-colors ${
              isActive ? "bg-blue-600" : "hover:bg-gray-800"
            }`
          }
        >
          <UserCircle className="h-5 w-5" />
          Create A Team
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-2 p-3 rounded-lg transition-colors ${
              isActive ? "bg-blue-600" : "hover:bg-gray-800"
            }`
          }
        >
          <Settings className="h-5 w-5" />
          Settings
        </NavLink>
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 p-3 rounded-lg text-red-400 hover:bg-gray-800 transition-colors mt-auto"
      >
        <LogOut className="h-5 w-5" />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
