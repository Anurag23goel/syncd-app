import React, { useState, useEffect } from "react";
import { Users, FolderKanban, Plus } from "lucide-react"; // Removed X since it's unused
import axios from "axios";
import ROUTES from "../Api";
import { User } from "../types/users";
import { Project } from "../types/project";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const CreateTeam: React.FC = () => {
  const [formData, setFormData] = useState({
    ProjectID: "",
    TeamName: "",
    TeamLeaderID: "",
    TeamMembers: [] as string[],
  });
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [users, setUsers] = useState<User[] | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const authToken = useSelector((state: RootState) => state.auth.token);
  const adminID = useSelector(
    (state: RootState) => state.auth.userData?.UserID
  );

  // Fetch projects and users on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsResponse = await axios.get(ROUTES.GET_ALL_PROJECTS, {
          headers: { authToken },
        });
        const usersResponse = await axios.get(ROUTES.SEARCH_USERS, {
          headers: { authToken },
        });

        // Filter only projects where the current user is an admin
        const filteredProjects = projectsResponse.data.projects.filter(
          (project: Project) => project.ProjectAdminIDs.includes(adminID)
        );

        setProjects(filteredProjects.length > 0 ? filteredProjects : []);
        setUsers(
          usersResponse.data.data.users.length > 0
            ? usersResponse.data.data.users
            : []
        );
      } catch (err) {
        setError("Failed to load projects or users.");
      }
    };
    if (adminID && authToken) {
      fetchData();
    }
  }, [adminID, authToken]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTeamMemberChange = (userId: string) => {
    setFormData((prev) => {
      const isSelected = prev.TeamMembers.includes(userId);
      const updatedMembers = isSelected
        ? prev.TeamMembers.filter((id) => id !== userId)
        : [...prev.TeamMembers, userId];
      return { ...prev, TeamMembers: updatedMembers };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Validate form
      if (!formData.ProjectID || !formData.TeamName || !formData.TeamLeaderID) {
        throw new Error("Please fill in all required fields.");
      }

      console.log(formData);

      // Send request to backend
      const response = await axios.post(ROUTES.CREATE_TEAM, formData, {
        headers: { authToken },
      });
      console.log(response.data);
      if (response.data.message === "Team created successfully") {
        setSuccess("Team created successfully!");
      }
      // Reset form
      setFormData({
        ProjectID: "",
        TeamName: "",
        TeamLeaderID: "",
        TeamMembers: [],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create team.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Create New Team</h1>
        <p className="text-gray-500 mt-1">
          Assign a team leader and members to a project.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FolderKanban className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                name="ProjectID"
                value={formData.ProjectID}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select a project</option>
                {projects?.map((project) => (
                  <option key={project.ProjectID} value={project.ProjectID}>
                    {project.ProjectName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Team Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Team Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="TeamName"
              value={formData.TeamName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter team name"
              required
            />
          </div>

          {/* Team Leader Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Team Leader <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                name="TeamLeaderID"
                value={formData.TeamLeaderID}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select a team leader</option>
                {users?.map((user) => (
                  <option key={user.UserID} value={user.UserID}>
                    {user.UserFullName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Team Members Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Team Members
            </label>
            <div className="border rounded-lg p-4">
              {!users || users.length === 0 ? (
                <p className="text-sm text-gray-500">No users available.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {users.map((user) => (
                    <div key={user.UserID} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={user.UserID}
                        checked={formData.TeamMembers.includes(user.UserID)}
                        onChange={() => handleTeamMemberChange(user.UserID)}
                        className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                        disabled={user.UserID === formData.TeamLeaderID}
                      />
                      <label
                        htmlFor={user.UserID}
                        className="text-sm text-gray-700"
                      >
                        {user.UserFullName}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Error and Success Messages */}
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 text-green-700 p-3 rounded-lg text-sm">
              {success}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Plus className="h-5 w-5" />
              {loading ? "Creating..." : "Create Team"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTeam;
