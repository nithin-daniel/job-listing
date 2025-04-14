import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import EditProfile from "./EditProfile";

const JobSeeker = () => {
  const [activeTab, setActiveTab] = useState("search");
  const [isEditing, setIsEditing] = useState(false);
  const userInitials = "JS";

  // Mock user profile data
  const [userProfile, setUserProfile] = useState({
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 234 567 8900",
    location: "San Francisco, CA",
    experience: "5 years",
    skills: ["Plumbing", "Electrical", "Carpentry"],
    certifications: ["Certified Plumber", "Electrical Safety"],
    rating: 4.8,
    completedJobs: 45,
    bio: "Experienced handyman with expertise in plumbing and electrical work. Committed to providing quality service and customer satisfaction.",
  });

  const [availableJobs, setAvailableJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [applications, setApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [applicationsError, setApplicationsError] = useState(null);

  const handleSaveProfile = (updatedProfile) => {
    setUserProfile(updatedProfile);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const fetchAvailableJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8000/api/jobs/available/"
      );
      setAvailableJobs(response.data.data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("Failed to fetch available jobs");
    } finally {
      setLoading(false);
    }
  };

  // const fetchMyApplications = async () => {
  //   try {
  //     const userId = localStorage.getItem("userId");
  //     const response = await axios.get(
  //       `http://localhost:8000/api/jobs/my-applications/?userId=${userId}`
  //     );
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error fetching applications:", error);
  //     throw error;
  //   }
  // };

  const handleJobApplication = async (jobId) => {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        alert("Please log in to apply for jobs");
        return;
      }

      const response = await axios.post(
        "http://localhost:8000/api/jobs/apply/",
        {
          job_id: jobId,
          userId: userId, // Changed from user_id to userId to match backend
        }
      );

      if (response.status === 201) {
        alert("Application submitted successfully!");
        setActiveTab("applications");
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to submit application";
      alert(message);
    }
  };

  useEffect(() => {
    fetchAvailableJobs();
  }, []);

  useEffect(() => {
    const loadApplications = async () => {
      if (activeTab === "applications") {
        try {
          setApplicationsLoading(true);
          const userId = localStorage.getItem("userId");
          const response = await axios.get(
            `http://localhost:8000/api/jobs/my-applications/?userId=${userId}`
          );
          setApplications(response.data.data);
          setApplicationsError(null);
        } catch (error) {
          console.error("Error fetching applications:", error);
          setApplicationsError(
            error.response?.data?.message || "Failed to fetch applications"
          );
        } finally {
          setApplicationsLoading(false);
        }
      }
    };

    loadApplications();
  }, [activeTab]);

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "accepted":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        );
      case "rejected":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        );
      case "in-progress":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const ProfileSection = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {isEditing ? (
        <EditProfile
          profile={userProfile}
          onSave={handleSaveProfile}
          onCancel={handleCancelEdit}
        />
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                {userInitials}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {userProfile.name}
                </h2>
                <p className="text-gray-600">{userProfile.location}</p>
                <div className="flex items-center mt-1">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1 text-gray-600">
                    {userProfile.rating} ({userProfile.completedJobs} jobs)
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                {userProfile.completedJobs} Jobs Completed
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Contact Information
              </h3>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">Email:</span>{" "}
                  {userProfile.email}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Phone:</span>{" "}
                  {userProfile.phone}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Professional Details
              </h3>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">Experience:</span>{" "}
                  {userProfile.experience}
                </p>
                <div className="flex flex-wrap gap-2">
                  {userProfile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Certifications
              </h3>
              <div className="flex flex-wrap gap-2">
                {userProfile.certifications.map((cert, index) => (
                  <span
                    key={index}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                About Me
              </h3>
              <p className="text-gray-600">{userProfile.bio}</p>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4">
          {/* Profile Section */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-lg">
                {userInitials}
              </div>
              <div>
                <p className="font-medium text-gray-900">{userProfile.name}</p>
                <p className="text-sm text-gray-500">Job Seeker</p>
              </div>
            </div>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab("search")}
              className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                activeTab === "search"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Search Jobs
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                activeTab === "profile"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              My Profile
            </button>
            <button
              onClick={() => setActiveTab("applications")}
              className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                activeTab === "applications"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              My Applications
            </button>
          </nav>

          <div className="mt-8">
            <button
              onClick={() => {
                /* Handle logout */
              }}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {activeTab === "profile" ? (
          <ProfileSection />
        ) : activeTab === "search" ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">
                Available Jobs
              </h1>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-600 py-8">{error}</div>
            ) : availableJobs.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No jobs available
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {availableJobs.map((job) => (
                  <Card
                    key={job.id}
                    className="hover:shadow-lg transition-shadow duration-200"
                  >
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {job.title}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {job.location}
                            </p>
                          </div>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                            {job.service_category_name}
                          </span>
                        </div>

                        <p className="text-gray-600">{job.description}</p>

                        {job.image && (
                          <div className="w-full">
                            <img
                              src={`http://localhost:8000${job.image}`}
                              alt="Job image"
                              className="w-full h-32 object-cover rounded-md"
                            />
                          </div>
                        )}

                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>Budget: ${job.budget}</span>
                          <span>
                            Posted{" "}
                            {new Date(job.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex justify-end">
                          <Button
                            className="bg-green-500 hover:bg-green-600 text-white"
                            onClick={() => handleJobApplication(job.id)}
                          >
                            Apply Now
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">
              My Applications
            </h1>

            {applicationsLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : applicationsError ? (
              <div className="text-center text-red-600 py-8">
                {applicationsError}
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No applications found
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Job Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Client
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Budget
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Applied Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {applications.map((application) => (
                        <tr key={application.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {application.job_title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {application.location}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {application.client_name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              ${application.budget}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(
                                application.applied_date
                              ).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                  application.status
                                )}`}
                              >
                                {getStatusIcon(application.status)}
                                <span className="ml-1 capitalize">
                                  {application.status.replace("-", " ")}
                                </span>
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSeeker;
