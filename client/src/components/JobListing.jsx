import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import axios from "axios";

const JobListing = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedJob, setSelectedJob] = useState(null);
  const [viewingApplications, setViewingApplications] = useState(false);
  const [serviceCategories, setServiceCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [clientJobs, setClientJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const userInitials = "AK"; // This should come from user context/state

  // Mock applicants data
  const applicants = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@example.com",
      experience: "5 years",
      status: "pending",
      appliedDate: "2024-03-20",
      coverLetter: "I have extensive experience in home renovation...",
      attachments: ["resume.pdf", "portfolio.pdf"],
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      experience: "8 years",
      status: "pending",
      appliedDate: "2024-03-19",
      coverLetter: "As a certified contractor with 8 years of experience...",
      attachments: ["resume.pdf"],
    },
  ];

  const jobPosts = [
    {
      id: 1,
      user: {
        name: "John Doe",
        avatar: "JD",
        location: "New York",
      },
      content: {
        text: "Looking for a professional plumber to fix a leaking pipe in my kitchen. The issue needs immediate attention.",
        media: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          },
        ],
      },
      service: "Plumbing",
      budget: "$150",
      date: "2h ago",
      status: "open",
      likes: 12,
      comments: 3,
    },
    {
      id: 2,
      user: {
        name: "Jane Smith",
        avatar: "JS",
        location: "Los Angeles",
      },
      content: {
        text: "Need an electrician to install new lighting fixtures in my living room. Must have experience with modern LED systems.",
        media: [
          {
            type: "video",
            url: "https://example.com/video.mp4",
            thumbnail:
              "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          },
        ],
      },
      service: "Electrical",
      budget: "$300",
      date: "5h ago",
      status: "open",
      likes: 8,
      comments: 2,
    },
  ];

  const fetchServiceCategories = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/service-categories/"
      );
      if (response.ok) {
        const data = await response.json();
        setServiceCategories(data);
      } else {
        console.error("Failed to fetch service categories");
      }
    } catch (error) {
      console.error("Error fetching service categories:", error);
    }
  };

  const fetchClientJobs = async (clientId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/jobs/client/?client_id=${clientId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching jobs:", error);
      throw error;
    }
  };

  const fetchAvailableJobs = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/jobs/available/`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching available jobs:", error);
      throw error;
    }
  };

  const fetchUserPostedJobs = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.get(
        `http://localhost:8000/api/jobs/user-posted/?userId=${userId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching user posted jobs:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchServiceCategories();
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        if (activeTab === "my") {
          const response = await fetchUserPostedJobs();
          setClientJobs(response.data);
        } else {
          const response = await fetchAvailableJobs();
          setClientJobs(response.data);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [activeTab]);

  const handleViewApplications = (job) => {
    setSelectedJob(job);
    setViewingApplications(true);
  };

  const handleApplicationAction = (applicantId, action) => {
    // Handle accept/reject logic here
    console.log(`Applicant ${applicantId} ${action}`);
  };

  const ApplicationsView = () => {
    if (!selectedJob) return null;

    return (
      <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white/95 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl">
          <div className="p-6">
            {/* Header with close button */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Applications</h2>
              <button
                onClick={() => {
                  setViewingApplications(false);
                  setSelectedJob(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
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
              </button>
            </div>

            {/* Job Details Section */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {selectedJob.title}
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">
                    Location: {selectedJob.location}
                  </p>
                  <p className="text-gray-600">
                    Service: {selectedJob.service}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Budget: {selectedJob.budget}</p>
                  <p className="text-gray-600">Status: {selectedJob.status}</p>
                </div>
              </div>
              <p className="mt-2 text-gray-600">{selectedJob.description}</p>
            </div>

            {/* Applicants Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applicant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Experience
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applicants.map((applicant) => (
                    <tr key={applicant.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium text-gray-900">
                            {applicant.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {applicant.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {applicant.experience}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {applicant.appliedDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            applicant.status === "accepted"
                              ? "bg-green-100 text-green-800"
                              : applicant.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {applicant.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            className="bg-green-500 hover:bg-green-600 text-white"
                            onClick={() =>
                              handleApplicationAction(applicant.id, "accept")
                            }
                          >
                            Accept
                          </Button>
                          <Button
                            variant="outline"
                            className="bg-red-500 hover:bg-red-600 text-white"
                            onClick={() =>
                              handleApplicationAction(applicant.id, "reject")
                            }
                          >
                            Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
                <p className="font-medium text-gray-900">Arjun Krishna</p>
                <p className="text-sm text-gray-500">Client</p>
              </div>
            </div>
          </div>

          <Button className="w-full mb-4">
            <Link to="/add-job" className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Job
            </Link>
          </Button>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab("all")}
              className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                activeTab === "all"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              All Jobs
            </button>
            <button
              onClick={() => setActiveTab("my")}
              className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                activeTab === "my"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              My Jobs
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {activeTab === "all" ? "All Jobs" : "My Jobs"}
          </h1>
          <div className="flex items-center space-x-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-48 rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">All Categories</option>
              {serviceCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === "all" ? (
          loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : clientJobs.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No available jobs found
            </div>
          ) : (
            <div className="space-y-4">
              {clientJobs.map((job) => (
                <Card
                  key={job.id}
                  className="hover:shadow-lg transition-shadow duration-200"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      {/* User Avatar */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                          {job.client_name?.charAt(0) || "U"}
                        </div>
                      </div>

                      {/* Post Content */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900">
                            {job.client_name}
                          </h3>
                          <span className="text-gray-500">•</span>
                          <span className="text-gray-500">{job.location}</span>
                          <span className="text-gray-500">•</span>
                          <span className="text-gray-500">
                            {new Date(job.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        <p className="mt-2 text-gray-700">{job.description}</p>

                        {/* Job Image */}
                        {job.image && (
                          <div className="mt-4 rounded-lg overflow-hidden">
                            <img
                              src={`http://localhost:8000${job.image}`}
                              alt="Job related"
                              className="w-full h-64 object-cover"
                            />
                          </div>
                        )}

                        {/* Job Details */}
                        <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {job.service_category_name}
                          </span>
                          <span>Budget: ${job.budget}</span>
                          <span
                            className={`px-2 py-1 rounded-full ${
                              job.is_completed
                                ? "bg-gray-100 text-gray-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {job.is_completed ? "Completed" : "Open"}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-4 flex items-center space-x-4">
                          <Button
                            variant="outline"
                            className="bg-green-500 hover:bg-green-600 text-white"
                            onClick={() => {
                              /* Handle apply for job */
                            }}
                          >
                            Apply for Job
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )
        ) : loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : clientJobs.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No jobs posted yet
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {clientJobs.map((job) => (
              <Card
                key={job.id}
                className="hover:shadow-lg transition-shadow duration-200"
              >
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {/* Job Header */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {job.title}
                        </h3>
                        <p className="text-sm text-gray-500">{job.location}</p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          job.is_completed
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {job.is_completed ? "Completed" : "Open"}
                      </span>
                    </div>

                    {/* Job Description */}
                    <p className="text-gray-600">{job.description}</p>

                    {/* Job Images */}
                    {job.image && (
                      <div className="w-full">
                        <img
                          src={`http://localhost:8000${job.image}`}
                          alt="Job image"
                          className="w-full h-32 object-cover rounded-md"
                        />
                      </div>
                    )}

                    {/* Job Details */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {job.service_category_name}
                        </span>
                        <span>Budget: ${job.budget}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>
                          {new Date(job.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center pt-4 border-t">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          className="text-blue-600 hover:bg-blue-50"
                          onClick={() => handleViewApplications(job)}
                        >
                          View Applicants
                        </Button>
                        <Button
                          variant="outline"
                          className="text-red-600 hover:bg-red-50"
                        >
                          Delete Job
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

      {viewingApplications && <ApplicationsView />}
    </div>
  );
};

export default JobListing;
