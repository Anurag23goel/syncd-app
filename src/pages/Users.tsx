import React, { useEffect, useState } from "react";
import axios from "axios";
import { Users as UsersIcon, Loader2 } from "lucide-react";
import ROUTES from "../Api";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { User } from "../types/users";

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const authToken = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(ROUTES.SEARCH_USERS, {
          headers: { authToken },
        }); // Replace with your actual API route
        if (res.data.data.users.length > 0) {
          setUsers(res.data.data.users);
        } else {
          setUsers([]);
        }
        setLoading(false);
      } catch (err: any) {
        setError("Failed to fetch users");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <UsersIcon className="w-6 h-6 text-blue-500" />
          All Users
        </h1>
        <p className="text-gray-500 mt-1">
          Manage all users registered in your platform.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">User List</h2>

        {loading ? (
          <div className="flex justify-center items-center h-48 text-gray-500">
            <Loader2 className="animate-spin w-6 h-6 mr-2" />
            Loading users...
          </div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : users.length === 0 ? (
          <div className="text-gray-500">No users found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div
                key={user.UserID}
                className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition"
              >
                <img
                  src={
                    user.UserProfilePicture ||
                    `https://ui-avatars.com/api/?name=${user.UserFullName}`
                  }
                  alt={user.UserFullName}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-medium text-gray-800">
                    {user.UserFullName || "Unnamed User"}
                  </h3>
                  <p className="text-sm text-gray-500">{user.UserEmail}</p>
                  <p className="text-sm text-gray-400">ID: {user.UserID}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
