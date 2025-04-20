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
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);

  const [userProfile, setUserProfile] = useState({
    full_name: "",
    email: "",
    mobile_number: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    highest_qualification: "",
    experience: 0,
    service_category: "",
    hourly_rate: "",
    works: 0,
  });

  const [availableJobs, setAvailableJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [applications, setApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [applicationsError, setApplicationsError] = useState(null);

  const [requestedApplications, setRequestedApplications] = useState([]);
  const [requestedApplicationsLoading, setRequestedApplicationsLoading] =
    useState(false);
  const [requestedApplicationsError, setRequestedApplicationsError] =
    useState(null);

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

  const fetchUserProfile = async () => {
    try {
      setProfileLoading(true);
      const response = await axios.get(
        `http://localhost:8000/api/user/profile/?userId=${localStorage.getItem(
          "userId"
        )}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUserProfile(response.data.data);
      setProfileError(null);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setProfileError(
        error.response?.data?.message || "Failed to fetch profile"
      );
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchRequestedApplications = async () => {
    try {
      setRequestedApplicationsLoading(true);
      const userId = localStorage.getItem("userId");
      // const response = await axios.get(
      //   `http://localhost:8000/api/user/requested-applications/?userId=${userId}`
      // );
      // setRequestedApplications(response.data.data);
      // setRequestedApplicationsError(null);
    } catch (error) {
      console.error("Error fetching requested applications:", error);
      setRequestedApplicationsError(
        error.response?.data?.message ||
          "Failed to fetch requested applications"
      );
    } finally {
      setRequestedApplicationsLoading(false);
    }
  };

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
          userId: userId,
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
    fetchUserProfile();
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

  useEffect(() => {
    if (activeTab === "applications") {
      fetchRequestedApplications();
    }
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
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      {profileLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : profileError ? (
        <div className="text-center text-red-600 py-8">{profileError}</div>
      ) : isEditing ? (
        <EditProfile
          profile={userProfile}
          onSave={handleSaveProfile}
          onCancel={handleCancelEdit}
        />
      ) : (
        <>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-black text-3xl font-bold">
                {userProfile.full_name?.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {userProfile.full_name}
                </h2>
                <p className="text-gray-600 text-lg">{`${userProfile.city}, ${userProfile.state}`}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Contact Details
              </h3>
              <div className="space-y-3">
                <p className="text-gray-600 flex justify-between">
                  <span className="font-medium w-1/3">Email:</span>
                  <span className="w-2/3">{userProfile.email}</span>
                </p>
                <p className="text-gray-600 flex justify-between">
                  <span className="font-medium w-1/3">Phone:</span>
                  <span className="w-2/3">{userProfile.mobile_number}</span>
                </p>
                <p className="text-gray-600 flex justify-between">
                  <span className="font-medium w-1/3">Address:</span>
                  <span className="w-2/3">{userProfile.address}</span>
                </p>
                <p className="text-gray-600 flex justify-between">
                  <span className="font-medium w-1/3">Pincode:</span>
                  <span className="w-2/3">{userProfile.pincode}</span>
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Professional Details
              </h3>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">Experience:</span>{" "}
                  {userProfile.experience} years
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Hourly Rate:</span> $
                  {userProfile.hourly_rate}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Qualification:</span>{" "}
                  {userProfile.highest_qualification}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Completed Works:</span>{" "}
                  {userProfile.works}
                </p>
              </div>
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
              {/* <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-lg">
                {`${userProfile.full_name}`}
              </div> */}
              <div>
                <p className="font-medium text-gray-900">{`${userProfile.full_name}`}</p>
                <p className="text-sm text-gray-500">Job Seeker</p>
                <p className="text-sm text-blue-600">
                  {userProfile.works} works completed
                </p>
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

                        <div className="flex flex-col gap-2">
                          <a
                            href={`https://maps.google.com/?q=${encodeURIComponent(
                              job.location
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                          >
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            View Location
                          </a>
                          <div className="flex justify-end">
                            <Button
                              className="bg-green-500 hover:bg-green-600 text-white"
                              onClick={() => handleJobApplication(job.id)}
                            >
                              Apply Now
                            </Button>
                          </div>
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

            {/* <h1 className="text-2xl font-bold text-gray-800 mt-8">
              Requested Applications
            </h1> */}

            {requestedApplicationsLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : requestedApplicationsError ? (
              <div className="text-center text-red-600 py-8">
                {requestedApplicationsError}
              </div>
            ) : requestedApplications.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                {/* No requested applications found */}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {requestedApplications.map((application) => (
                  <Card key={application.application_id} className="w-full">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {application.job_title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {application.service_category}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                            application.application_status
                          )}`}
                        >
                          {application.application_status}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Applicant</p>
                          <p className="font-medium">
                            {application.applicant_name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {application.applicant_email}
                          </p>
                          <p className="text-sm text-gray-600">
                            {application.applicant_phone}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Details</p>
                          <p className="font-medium">
                            Budget: ${application.budget}
                          </p>
                          <p className="text-sm text-gray-600">
                            Applied:{" "}
                            {new Date(
                              application.applied_date
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="text-sm text-gray-500">Job Description</p>
                        <p className="text-gray-600 mt-1">
                          {application.job_description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSeeker;
