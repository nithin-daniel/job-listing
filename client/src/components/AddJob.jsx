import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    service_category: "",
    budget: "",
    location: "",
    deadline: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle job creation logic here
    navigate("/jobs");
  };

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
                <Input
                  id="service_category"
                  type="text"
                  placeholder="Enter service category"
                  value={formData.service_category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      service_category: e.target.value,
                    })
                  }
                  className="focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
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
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-200 transform hover:scale-[1.02]"
            >
              Post Job
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => navigate("/jobs")}
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
