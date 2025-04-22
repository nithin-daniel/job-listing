import { useState, useEffect } from "react";
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
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();
  const [isWorker, setIsWorker] = useState(false);
  const [error, setError] = useState("");
  const [serviceCategories, setServiceCategories] = useState([]);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile_number: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    // Worker specific fields
    experience: "",
    service_category: "",
    hourly_rate: "",
    qualification_certificate: null,
  });

  useEffect(() => {
    const fetchServiceCategories = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/service-categories/"
        );
        setServiceCategories(response.data);
        // Set default service category to first category in the list
        if (response.data.length > 0) {
          setFormData((prev) => ({
            ...prev,
            service_category: response.data[0].id,
          }));
        }
      } catch (error) {
        console.error("Error fetching service categories:", error);
      }
    };

    fetchServiceCategories();
  }, []);

  const validateForm = () => {
    if (!formData.full_name || !formData.email || !formData.password) {
      setError("Please fill in all required fields");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (isWorker) {
      if (
        !formData.experience ||
        !formData.service_category ||
        !formData.hourly_rate ||
        !formData.qualification_certificate
      ) {
        setError("Please fill in all worker-specific fields");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    const formDataToSend = new FormData();
    formDataToSend.append("full_name", formData.full_name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("mobile_number", formData.mobile_number);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("city", formData.city);
    formDataToSend.append("state", formData.state);
    formDataToSend.append("pincode", formData.pincode);
    formDataToSend.append("user_type", isWorker ? "worker" : "client");

    if (isWorker) {
      formDataToSend.append("experience", formData.experience);
      formDataToSend.append("service_category", formData.service_category);
      formDataToSend.append("hourly_rate", formData.hourly_rate);
      if (formData.qualification_certificate) {
        formDataToSend.append(
          "qualification_certificate",
          formData.qualification_certificate
        );
      }
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/signup/",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        console.log("Signup successful");
        navigate("/");
      }
    } catch (error) {
      console.error("Signup error:", error);

      if (error.response) {
        // Handle specific error responses from the backend
        if (error.response.status === 400) {
          const errorData = error.response.data;
          if (typeof errorData === "object") {
            // Handle validation errors
            const errorMessages = Object.entries(errorData)
              .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
              .join("\n");
            setError(errorMessages);
          } else {
            setError(errorData || "Validation error occurred");
          }
        } else if (error.response.status === 409) {
          setError("Email already exists");
        } else {
          setError("Server error occurred. Please try again later.");
        }
      } else if (error.request) {
        setError("Network error. Please check your connection.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  // Show error message component
  const ErrorMessage = ({ message }) =>
    message ? (
      <div className="p-3 text-sm text-red-600 bg-red-100 rounded-md">
        {message.split("\n").map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
    ) : null;

  return (
    <div className="flex items-center justify-center p-4">
      <Card className="w-full max-w-5xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Create Account
          </CardTitle>
          <CardDescription className="text-center">
            Join us and start your journey
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <ErrorMessage message={error} />
            <div className="flex items-center justify-center space-x-4 mb-6">
              <label className="text-sm font-medium text-gray-700">
                Are you a worker?
              </label>
              <div
                onClick={() => setIsWorker(!isWorker)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out cursor-pointer ${
                  isWorker ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                    isWorker ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="full_name"
                    className="text-sm font-medium block text-left"
                  >
                    Full Name
                  </label>
                  <Input
                    id="full_name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                    className="focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium block text-left"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="mobile_number"
                    className="text-sm font-medium block text-left"
                  >
                    Mobile Number
                  </label>
                  <Input
                    id="mobile_number"
                    type="tel"
                    placeholder="Enter your mobile number"
                    value={formData.mobile_number}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mobile_number: e.target.value,
                      })
                    }
                    className="focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="address"
                    className="text-sm font-medium block text-left"
                  >
                    Address
                  </label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="Enter your address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="city"
                      className="text-sm font-medium block text-left"
                    >
                      City
                    </label>
                    <Input
                      id="city"
                      type="text"
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      className="focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="state"
                      className="text-sm font-medium block text-left"
                    >
                      State
                    </label>
                    <Input
                      id="state"
                      type="text"
                      placeholder="State"
                      value={formData.state}
                      onChange={(e) =>
                        setFormData({ ...formData, state: e.target.value })
                      }
                      className="focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="pincode"
                      className="text-sm font-medium block text-left"
                    >
                      Pincode
                    </label>
                    <Input
                      id="pincode"
                      type="number"
                      placeholder="Pincode"
                      value={formData.pincode}
                      onChange={(e) =>
                        setFormData({ ...formData, pincode: e.target.value })
                      }
                      className="focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium block text-left"
                  >
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium block text-left"
                  >
                    Confirm Password
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  />
                </div>

                {isWorker && (
                  <>
                    <div className="space-y-2">
                      <label
                        htmlFor="experience"
                        className="text-sm font-medium block text-left"
                      >
                        Experience (Years)
                      </label>
                      <Input
                        id="experience"
                        type="number"
                        placeholder="Enter your experience"
                        value={formData.experience}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            experience: e.target.value,
                          })
                        }
                        className="focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="hourly_rate"
                        className="text-sm font-medium block text-left"
                      >
                        Hourly Rate
                      </label>
                      <Input
                        id="hourly_rate"
                        type="number"
                        placeholder="Enter hourly rate"
                        value={formData.hourly_rate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            hourly_rate: e.target.value,
                          })
                        }
                        className="focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="service_category"
                        className="text-sm font-medium block text-left"
                      >
                        Service Category
                      </label>
                      <select
                        id="service_category"
                        value={formData.service_category}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            service_category: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      >
                        {serviceCategories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="qualification_certificate"
                        className="text-sm font-medium block text-left"
                      >
                        Upload Qualification Certificate
                      </label>
                      <Input
                        id="qualification_certificate"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            qualification_certificate: e.target.files[0],
                          })
                        }
                        className="focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      />
                      {formData.qualification_certificate && (
                        <p className="text-sm text-gray-600 mt-1">
                          Selected file:{" "}
                          {formData.qualification_certificate.name}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-200 transform hover:scale-[1.02]"
            >
              Create Account
            </Button>
            <p className="text-sm text-center text-gray-600">
              Already have an account?{" "}
              <Link
                to="/"
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Signup;
