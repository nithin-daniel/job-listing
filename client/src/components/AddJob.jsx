import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

const AddJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    service_category: "",
    budget: "",
    deadline: "",
    user: localStorage.getItem("userId") || "",
    location: localStorage.getItem("pincode") || "",
    image: null,
  });

  // Fetch service categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/service-categories/"
        );
        setCategories(response.data);
        // Set the first category as default if available
        if (response.data.length > 0) {
          setFormData((prev) => ({
            ...prev,
            service_category: response.data[0].id,
          }));
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError("Failed to load service categories");
      }
    };

    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const submitFormData = new FormData();
      submitFormData.append("title", formData.title);
      submitFormData.append("description", formData.description);
      submitFormData.append("service_category", formData.service_category);
      submitFormData.append("budget", parseFloat(formData.budget));
      submitFormData.append("deadline", formData.deadline || "");
      submitFormData.append("user", formData.user);
      submitFormData.append("location", formData.location);
      if (formData.image) {
        submitFormData.append("image", formData.image);
      }

      const response = await axios.post(
        "http://localhost:8000/api/jobs/create/",
        submitFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        navigate("/jobs");
      }
    } catch (err) {
      console.error("Error creating job:", err);
      setError(err.response?.data?.message || "Failed to create job");
    } finally {
      setLoading(false);
    }
  };

  // Update the service category input to use a select element
  const ServiceCategorySelect = () => (
    <select
      id="service_category"
      value={formData.service_category}
      onChange={(e) =>
        setFormData({ ...formData, service_category: e.target.value })
      }
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
    >
      <option value="" disabled>
        Select a category
      </option>
      {categories.length > 0 ? (
        <>
          {categories.map((category, index) => (
            <option
              key={category.id}
              value={category.id}
              selected={index === 0} // Select first option
            >
              {category.name}
            </option>
          ))}
        </>
      ) : (
        <option value="">Loading categories...</option>
      )}
    </select>
  );

  return (
    <div className="flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Create New Job
          </CardTitle>
          <CardDescription className="text-center">
            Fill in the details to post a new job
          </CardDescription>
        </CardHeader>

        {error && (
          <div className="mx-6 p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="title"
                className="text-sm font-medium block text-left"
              >
                Job Title
              </label>
              <Input
                id="title"
                type="text"
                placeholder="Enter job title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="description"
                className="text-sm font-medium block text-left"
              >
                Description
              </label>
              <textarea
                id="description"
                placeholder="Enter job description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="service_category"
                  className="text-sm font-medium block text-left"
                >
                  Service Category
                </label>
                <ServiceCategorySelect />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="budget"
                  className="text-sm font-medium block text-left"
                >
                  Budget
                </label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="Enter budget"
                  value={formData.budget}
                  onChange={(e) =>
                    setFormData({ ...formData, budget: e.target.value })
                  }
                  className="focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="location"
                  className="text-sm font-medium block text-left"
                >
                  Location
                </label>
                <Input
                  id="location"
                  type="text"
                  placeholder="Enter location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="deadline"
                  className="text-sm font-medium block text-left"
                >
                  Deadline
                </label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) =>
                    setFormData({ ...formData, deadline: e.target.value })
                  }
                  className="focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="image"
                className="text-sm font-medium block text-left"
              >
                Job Image
              </label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-40 rounded-md"
                  />
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-200 transform hover:scale-[1.02]"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                  Creating...
                </div>
              ) : (
                "Post Job"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => navigate("/jobs")}
              disabled={loading}
            >
              Cancel
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AddJob;
