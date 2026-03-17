import React, { useState, useEffect } from "react";
import Navbar from "./components/common/Navbar";
import HomePage from "./pages/HomePage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  const [page, setPage] = useState("home");
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");

  // Restore admin session from localStorage
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const username = localStorage.getItem("admin_username");
    if (token && username) {
      setIsAdmin(true);
      setAdminUsername(username);
    }
  }, []);

  function handleAdminLogin(token, username) {
    setIsAdmin(true);
    setAdminUsername(username);
    setPage("admin");
  }

  function handleLogout() {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_username");
    setIsAdmin(false);
    setAdminUsername("");
    setPage("home");
  }

  function renderPage() {
    if (page === "admin-login") {
      if (isAdmin) { setPage("admin"); return null; }
      return <AdminLoginPage onLogin={handleAdminLogin} />;
    }
    if (page === "admin") {
      if (!isAdmin) { setPage("admin-login"); return null; }
      return <AdminPage username={adminUsername} />;
    }
    return <HomePage />;
  }

  const hideNavbar = page === "admin-login";

  return (
    <div className="min-h-screen bg-gray-50">
      {!hideNavbar && (
        <Navbar
          page={page}
          setPage={setPage}
          isAdmin={isAdmin}
          onLogout={handleLogout}
        />
      )}
      {renderPage()}
    </div>
  );
}
