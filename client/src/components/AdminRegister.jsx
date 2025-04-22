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
import axios from "axios";

const AdminRegister = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    registration_code: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate all fields
    for (const [key, value] of Object.entries(formData)) {
      if (!value) {
        setError(`Please fill in the ${key.replace("_", " ")} field`);
        return;
      }
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/admin/register/",
        formData
      );

      if (response.status === 201) {
        // Redirect to login page after successful registration
        navigate("/");
      }
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response) {
        setError(error.response.data.message || "Registration failed");
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Admin Registration
          </CardTitle>
          <CardDescription className="text-center">
            Register a new admin account with the secret code
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-100 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="registration_code"
                className="text-sm font-medium block"
              >
                Secret Registration Code
              </label>
              <Input
                id="registration_code"
                type="text"
                placeholder="Enter the secret code"
                value={formData.registration_code}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    registration_code: e.target.value,
                  })
                }
                className="focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium block">
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
                className="focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium block">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Register Admin
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AdminRegister;
