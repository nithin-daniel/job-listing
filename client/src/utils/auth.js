export const isAuthenticated = () => {
  const userId = localStorage.getItem("userId");
  return !!userId;
};

export const getUserRole = () => {
  const isAdmin = localStorage.getItem("isAdmin");
  const isWorker = localStorage.getItem("isWorker");

  if (isAdmin === "true") {
    return "admin";
  } else if (isWorker === "true") {
    return "worker";
  } else {
    return "client";
  }
};

export const handleLogout = (navigate) => {
  // Clear all localStorage items
  localStorage.clear();

  // Redirect to login page
  navigate("/");
};
