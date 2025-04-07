import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";

const JobListing = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedJob, setSelectedJob] = useState(null);
  const [viewingApplications, setViewingApplications] = useState(false);
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

  const myPostedJobs = [
    {
      id: 3,
      title: "Kitchen Renovation",
      description:
        "Looking for a skilled contractor to renovate my kitchen. Need new cabinets, countertops, and flooring.",
      service: "Home Renovation",
      budget: "$5000",
      date: "1 day ago",
      status: "open",
      applicants: 5,
      location: "San Francisco",
      images: [
        "https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        "https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      ],
    },
    {
      id: 4,
      title: "Garden Landscaping",
      description:
        "Need a professional landscaper to design and implement a new garden layout in my backyard.",
      service: "Landscaping",
      budget: "$2000",
      date: "3 days ago",
      status: "in-progress",
      applicants: 3,
      location: "San Francisco",
      images: [
        "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      ],
    },
  ];

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
        </div>

        {/* Content based on active tab */}
        {activeTab === "all" ? (
          // All Jobs Feed
          <div className="space-y-4">
            {jobPosts.map((post) => (
              <Card
                key={post.id}
                className="hover:shadow-lg transition-shadow duration-200"
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    {/* User Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                        {post.user.avatar}
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">
                          {post.user.name}
                        </h3>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-500">
                          {post.user.location}
                        </span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-500">{post.date}</span>
                      </div>

                      <p className="mt-2 text-gray-700">{post.content.text}</p>

                      {/* Media Content */}
                      {post.content.media &&
                        post.content.media.map((media, index) => (
                          <div
                            key={index}
                            className="mt-4 rounded-lg overflow-hidden"
                          >
                            {media.type === "image" ? (
                              <img
                                src={media.url}
                                alt="Job related"
                                className="w-full h-64 object-cover"
                              />
                            ) : (
                              <div className="relative">
                                <img
                                  src={media.thumbnail}
                                  alt="Video thumbnail"
                                  className="w-full h-64 object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <button className="bg-black bg-opacity-50 p-4 rounded-full">
                                    <svg
                                      className="w-8 h-8 text-white"
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M8 5v14l11-7z" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}

                      {/* Job Details */}
                      <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {post.service}
                        </span>
                        <span>Budget: {post.budget}</span>
                        <span
                          className={`px-2 py-1 rounded-full ${
                            post.status === "open"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {post.status}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-4 flex items-center space-x-4">
                        <Button
                          variant="outline"
                          className="bg-green-500 hover:bg-green-600 text-white"
                          onClick={() => {
                            /* Handle accept */
                          }}
                        >
                          Accept Job
                        </Button>
                        <div className="flex items-center space-x-4 text-gray-500">
                          <button className="flex items-center space-x-1 hover:text-blue-600">
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
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                              />
                            </svg>
                            <span>{post.likes}</span>
                          </button>
                          <button className="flex items-center space-x-1 hover:text-blue-600">
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
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                              />
                            </svg>
                            <span>{post.comments}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          // My Posted Jobs
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myPostedJobs.map((job) => (
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
                          job.status === "open"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>

                    {/* Job Description */}
                    <p className="text-gray-600">{job.description}</p>

                    {/* Job Images */}
                    {job.images && job.images.length > 0 && (
                      <div className="grid grid-cols-2 gap-2">
                        {job.images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Job image ${index + 1}`}
                            className="w-full h-32 object-cover rounded-md"
                          />
                        ))}
                      </div>
                    )}

                    {/* Job Details */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {job.service}
                        </span>
                        <span>Budget: {job.budget}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        <span>{job.applicants} applicants</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center pt-4 border-t">
                      <span className="text-sm text-gray-500">
                        Posted {job.date}
                      </span>
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
