import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import axios from "axios";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [nonVerifiedUsers, setNonVerifiedUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completedJobs, setCompletedJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState(null);

  const fetchNonVerifiedUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://127.0.0.1:8000/api/non-verified-users/"
      );
      setNonVerifiedUsers(response.data.data);
    } catch (err) {
      console.error("Error fetching non-verified users:", err);
      setError("Failed to fetch non-verified users");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://127.0.0.1:8000/api/users/");
      setAllUsers(response.data.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const fetchCompletedJobs = async () => {
    try {
      setJobsLoading(true);
      const response = await axios.get(
        "http://127.0.0.1:8000/api/jobs/completed/"
      );
      setCompletedJobs(response.data.data);
    } catch (err) {
      console.error("Error fetching completed jobs:", err);
      setJobsError("Failed to fetch completed jobs");
    } finally {
      setJobsLoading(false);
    }
  };

  const handleAcceptUser = async (userId) => {
    try {
      const response = await axios.patch(
        "http://127.0.0.1:8000/api/accept-user/",
        {
          userId: userId,
        }
      );
      if (response.data.status === "success") {
        fetchNonVerifiedUsers();
        fetchAllUsers();
      }
    } catch (err) {
      console.error("Error accepting user:", err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await axios.delete(
          `http://127.0.0.1:8000/api/user/delete/?userId=${userId}`
        );
        if (response.data.status === "success") {
          fetchAllUsers();
          fetchNonVerifiedUsers();
        }
      } catch (err) {
        console.error("Error deleting user:", err);
      }
    }
  };

  useEffect(() => {
    fetchNonVerifiedUsers();
    fetchAllUsers();
    fetchCompletedJobs();
  }, []);

  // Mock users data
  const [users] = useState([
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@example.com",
      type: "job_seeker",
      status: "active",
      joinDate: "2024-01-15",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      type: "job_poster",
      status: "active",
      joinDate: "2024-02-20",
    },
    {
      id: 3,
      name: "Michael Brown",
      email: "michael.b@example.com",
      type: "job_seeker",
      status: "suspended",
      joinDate: "2024-03-01",
    },
  ]);

  // Mock complaints data
  const [complaints] = useState([
    {
      id: 1,
      user: "John Smith",
      type: "job_seeker",
      subject: "Payment Issue",
      description: "Client hasn't paid for completed work",
      status: "pending",
      date: "2024-03-20",
    },
    {
      id: 2,
      user: "Sarah Johnson",
      type: "job_poster",
      subject: "Quality of Work",
      description: "Work completed doesn't meet expectations",
      status: "resolved",
      date: "2024-03-18",
    },
    {
      id: 3,
      user: "Michael Brown",
      type: "job_seeker",
      subject: "Account Suspension",
      description: "Account was suspended without explanation",
      status: "in-progress",
      date: "2024-03-15",
    },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getUserTypeColor = (type) => {
    switch (type) {
      case "job_seeker":
        return "bg-blue-100 text-blue-800";
      case "job_poster":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900">Admin Dashboard</h2>
            <p className="text-sm text-gray-500">Welcome, Admin</p>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab("users")}
              className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                activeTab === "users"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              User Management
            </button>
            <button
              onClick={() => setActiveTab("non-verified")}
              className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                activeTab === "non-verified"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Non-Verified Users
            </button>
            <button
              onClick={() => setActiveTab("jobs")}
              className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                activeTab === "jobs"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Completed Jobs
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {activeTab === "users" ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">
                User Management
              </h1>
            </div>

            {error && (
              <div className="p-4 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-center">
                          Loading...
                        </td>
                      </tr>
                    ) : allUsers.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-center">
                          No users found
                        </td>
                      </tr>
                    ) : (
                      allUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {user.full_name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.user_type === "worker"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-purple-100 text-purple-800"
                              }`}
                            >
                              {user.user_type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                className="bg-red-500 hover:bg-red-600 text-white"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : activeTab === "non-verified" ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">
                Non-Verified Users
              </h1>
            </div>

            {error && (
              <div className="p-4 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-center">
                          Loading...
                        </td>
                      </tr>
                    ) : nonVerifiedUsers.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-center">
                          No non-verified users found
                        </td>
                      </tr>
                    ) : (
                      nonVerifiedUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {user.full_name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.user_type === "worker"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-purple-100 text-purple-800"
                              }`}
                            >
                              {user.user_type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                className="bg-green-500 hover:bg-green-600 text-white"
                                onClick={() => handleAcceptUser(user.id)}
                              >
                                Accept
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">
                Completed Jobs
              </h1>
            </div>

            {jobsError && (
              <div className="p-4 bg-red-100 text-red-700 rounded-md">
                {jobsError}
              </div>
            )}

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Budget
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Completed Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {jobsLoading ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center">
                          Loading...
                        </td>
                      </tr>
                    ) : completedJobs.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center">
                          No completed jobs found
                        </td>
                      </tr>
                    ) : (
                      completedJobs.map((job) => (
                        <tr key={job.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {job.title}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {job.description}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              ${job.budget}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {job.location}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {new Date(job.created_at).toLocaleDateString()}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
