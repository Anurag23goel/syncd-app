import React, { useState, useEffect } from "react";
import { Search, Plus, CheckCircle } from "lucide-react";
import axios from "axios";
import ROUTES from "../Api";
import { Project } from "../types/project"; // Assuming this is where Project type is defined
import { ProjectDetails } from "../types/project"; // New types we'll define
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const ExistingProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [selectedProjectID, setSelectedProjectID] = useState<string>("");
  const [projectDetails, setProjectDetails] = useState<ProjectDetails | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const currentAdminID = useSelector(
    (state: RootState) => state.auth.userData?.UserID
  );
  const authToken = useSelector((state: RootState) => state.auth.token);

  // Milestone form state
  const [milestoneForm, setMilestoneForm] = useState({
    Title: "",
    Description: "",
  });
  const [milestoneLoading, setMilestoneLoading] = useState(false);
  const [milestoneError, setMilestoneError] = useState("");
  const [milestoneSuccess, setMilestoneSuccess] = useState("");

  // Fetch projects on mount
  useEffect(() => {
    if (!currentAdminID) return;
    const fetchProjects = async () => {
      console.log("FETCHING PROJECTS");

      try {
        setLoading(true);
        const response = await axios.get(ROUTES.GET_ALL_PROJECTS, {
          headers: { authToken },
        });
        console.log(response);

        const adminProjects = response.data.projects.filter(
          (project: Project) => project.ProjectAdminIDs.includes(currentAdminID)
        );
        setProjects(adminProjects);
      } catch (err) {
        setError("Failed to load projects.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [authToken, currentAdminID]);

  // Fetch project details when a project is selected
  useEffect(() => {
    if (!selectedProjectID) {
      setProjectDetails(null);
      return;
    }

    console.log("SELECTED PROJECT ID:", selectedProjectID);

    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          ROUTES.GET_PROJECT_DETAILS.replace(
            "{{ProjectID}}",
            selectedProjectID
          ),
          { headers: { authToken } }
        );
        console.log(response.data);

        setProjectDetails(response.data.data);
      } catch (err) {
        setError("Failed to load project details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjectDetails();
  }, [selectedProjectID, authToken]);

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProjectID(e.target.value);
    setError("");
    setMilestoneError("");
    setMilestoneSuccess("");
  };

  const handleMilestoneInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setMilestoneForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectID) {
      setMilestoneError("Please select a project first.");
      return;
    }

    setMilestoneLoading(true);
    setMilestoneError("");
    setMilestoneSuccess("");

    try {
      const payload = {
        ProjectID: selectedProjectID,
        Title: milestoneForm.Title,
        Description: milestoneForm.Description,
        Status: "PENDING", // Default status as per your payload
      };
      await axios.post(ROUTES.CREATE_MILESTONE, payload, {
        headers: { authToken },
      });
      setMilestoneSuccess("Milestone created successfully!");
      setMilestoneForm({ Title: "", Description: "" });

      // Refresh project details to include new milestone
      const response = await axios.get(
        ROUTES.GET_PROJECT_DETAILS.replace("{{ProjectID}}", selectedProjectID),
        { headers: { authToken } }
      );
      setProjectDetails(response.data.data);
    } catch (err) {
      setMilestoneError(
        err instanceof Error ? err.message : "Failed to create milestone."
      );
    } finally {
      setMilestoneLoading(false);
    }
  };

  const handleCompleteMilestone = async (milestoneID: string) => {
    setMilestoneLoading(true);
    setMilestoneError("");
    setMilestoneSuccess("");

    try {
      const updateMileStoneResponse = await axios.put(
        `${ROUTES.UPDATE_MILESTONE}`,
        {
          ProjectID: selectedProjectID,
          MilestoneID: milestoneID,
          Title: milestoneForm.Title,
        },
        { headers: { authToken } }
      );
      if (updateMileStoneResponse.status === 200) {
        setMilestoneSuccess("Milestone Updated");
      }
      // Refresh project details
      const response = await axios.put(
        `${ROUTES.GET_PROJECT_DETAILS}/${selectedProjectID}`
      );
      setProjectDetails(response.data.data);
    } catch (err) {
      setMilestoneError(
        err instanceof Error ? err.message : "Failed to complete milestone."
      );
    } finally {
      setMilestoneLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-gray-800">Existing Projects</h1>

      {/* Project Dropdown */}
      <div className="flex items-center gap-4 flex-1">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <select
            value={selectedProjectID}
            onChange={handleProjectChange}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 text-sm"
            disabled={loading}
          >
            <option value="">Select a project...</option>
            {projects?.map((project) => (
              <option key={project.ProjectID} value={project.ProjectID}>
                {project.ProjectName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Project Details */}
      {projectDetails && (
        <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {projectDetails.project.ProjectName}
            </h2>
            <p className="text-sm text-gray-500">
              {projectDetails.project.ProjectDescription}
            </p>
            <p className="text-sm text-gray-500">
              Start Date:{" "}
              {new Date(projectDetails.project.StartDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500">
              Status:{" "}
              {projectDetails.project.IsCompleted ? "Completed" : "In Progress"}
            </p>
          </div>

          {/* Milestones Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Milestones
            </h3>

            {/* Create Milestone Form */}
            <form onSubmit={handleCreateMilestone} className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Milestone Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="Title"
                  value={milestoneForm.Title}
                  onChange={handleMilestoneInputChange}
                  className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter milestone title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="Description"
                  value={milestoneForm.Description}
                  onChange={handleMilestoneInputChange}
                  className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter milestone description"
                  rows={3}
                />
              </div>
              <button
                type="submit"
                disabled={milestoneLoading}
                className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 flex items-center gap-2 ${
                  milestoneLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Plus className="h-5 w-5" />
                {milestoneLoading ? "Creating..." : "Create Milestone"}
              </button>
            </form>

            {milestoneError && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm mb-4">
                {milestoneError}
              </div>
            )}
            {milestoneSuccess && (
              <div className="bg-green-100 text-green-700 p-3 rounded-lg text-sm mb-4">
                {milestoneSuccess}
              </div>
            )}

            {/* Milestone List */}
            {projectDetails.milestones.records.length === 0 ? (
              <p className="text-sm text-gray-500">No milestones available.</p>
            ) : (
              <div className="space-y-4">
                {projectDetails.milestones.records.map((milestone) => (
                  <div
                    key={milestone.MilestoneID} // Assuming MilestoneID is added in the type
                    className="flex justify-between items-center border-b pb-4 last:border-0"
                  >
                    <div>
                      <h4 className="font-medium text-gray-800">
                        {milestone.Title}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {milestone.Description}
                      </p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          milestone.Status === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {milestone.Status}
                      </span>
                    </div>
                    {milestone.Status !== "COMPLETED" && (
                      <button
                        onClick={() =>
                          handleCompleteMilestone(milestone.MilestoneID)
                        }
                        disabled={milestoneLoading}
                        className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2 text-sm"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Mark Complete
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExistingProjects;
