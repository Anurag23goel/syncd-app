import { useForm } from "react-hook-form";
import { Project } from "../types/project";
import axios from "axios";
import ROUTES from "../Api";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const CreateProject = () => {
  const authToken = useSelector((state: RootState) => state.auth.token);
  console.log(authToken);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Project>();

  const onSubmit = async (data: Project) => {
    try {
      await axios.post(ROUTES.CREATE_PROJECT, data, { headers: { authToken } });
      reset();
      // Show success message or redirect
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Create a New Project
        </h1>
        <p className="text-gray-500 mt-2">
          Fill in the form below to add a new project to the system.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-10 bg-white p-8 rounded-2xl shadow-lg border border-gray-200"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Project Name
            </label>
            <input
              {...register("ProjectName", {
                required: "Project name is required",
              })}
              className="input-field"
              placeholder="e.g. Smart City Initiative"
            />
            {errors.ProjectName && (
              <p className="text-xs text-red-600 mt-1">
                {errors.ProjectName.message}
              </p>
            )}
          </div>

          {/* Project Code */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Project Code
            </label>
            <input
              {...register("ProjectCode", {
                required: "Project code is required",
              })}
              className="input-field"
              placeholder="e.g. SCI2025"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Description
            </label>
            <textarea
              {...register("ProjectDescription", {
                required: "Description is required",
              })}
              rows={4}
              className="input-field"
              placeholder="Brief description of the project"
            />
          </div>

          {/* Area */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Project Area
            </label>
            <input
              {...register("ProjectArea", {
                required: "Project area is required",
              })}
              className="input-field"
              placeholder="e.g. 100 acres"
            />
          </div>

          {/* Budget + Currency */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Budget
            </label>
            <div className="flex rounded-md shadow-sm overflow-hidden">
              <input
                {...register("Budget", {
                  required: "Budget is required",
                  valueAsNumber: true,
                })}
                type="number"
                className="input-field rounded-r-none"
                placeholder="Enter amount"
              />
              <select
                {...register("Currency")}
                className="bg-gray-50 border border-l-0 border-gray-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="JPY">JPY</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>

          {/* Dates */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Start Date
            </label>
            <input
              {...register("StartDate", { required: "Start date is required" })}
              type="date"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              End Date
            </label>
            <input
              {...register("EndDate", { required: "End date is required" })}
              type="date"
              className="input-field"
            />
          </div>

          {/* Location */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Project Location
            </label>
            <input
              {...register("ProjectLocation", {
                required: "Location is required",
              })}
              className="input-field"
              placeholder="e.g. Gurgaon, India"
            />
          </div>

          {/* Map link */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Google Maps Link
            </label>
            <input
              {...register("ProjectMapLink", {
                required: "Map link is required",
                pattern: {
                  value: /^https:\/\/maps\.google\.com/,
                  message: "Must be a valid Google Maps URL",
                },
              })}
              className="input-field"
              placeholder="https://maps.google.com/..."
            />
            {errors.ProjectMapLink && (
              <p className="text-xs text-red-600 mt-1">
                {errors.ProjectMapLink.message}
              </p>
            )}
          </div>

          {/* Thumbnail */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Thumbnail URL
            </label>
            <input
              {...register("ProjectThumbnail", {
                required: "Thumbnail URL is required",
              })}
              className="input-field"
              placeholder="https://yourcdn.com/thumbnail.jpg"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create Project
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProject;
