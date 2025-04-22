import { useNavigate } from "react-router-dom";

export const isAuthenticated = () => {
  const userId = localStorage.getItem("userId");
  return !!userId;
};

export const getUserRole = () => {
  const isWorker = localStorage.getItem("isWorker");
  return isWorker === "true" ? "worker" : "client";
};

export const handleLogout = (navigate) => {
  // Clear all localStorage items
  localStorage.clear();

  // Redirect to login page
  navigate("/");
};
