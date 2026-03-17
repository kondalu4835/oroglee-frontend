import React, { useState } from "react";

export default function Navbar({ page, setPage, isAdmin, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setPage("home")}>
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-lg">🦷</span>
            </div>
            <span className="text-xl font-bold text-blue-700">OroGlee</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            <NavBtn label="Find Dentists" active={page === "home"} onClick={() => setPage("home")} />
            {isAdmin ? (
              <>
                <NavBtn label="Admin Panel" active={page === "admin"} onClick={() => setPage("admin")} />
                <button onClick={onLogout} className="ml-2 px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition">Logout</button>
              </>
            ) : (
              <NavBtn label="Admin" active={page === "admin-login"} onClick={() => setPage("admin-login")} />
            )}
          </div>

          {/* Mobile menu btn */}
          <button className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t bg-white px-4 py-3 space-y-1">
          <MobileBtn label="Find Dentists" onClick={() => { setPage("home"); setMenuOpen(false); }} />
          {isAdmin ? (
            <>
              <MobileBtn label="Admin Panel" onClick={() => { setPage("admin"); setMenuOpen(false); }} />
              <button onClick={() => { onLogout(); setMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-red-600 rounded-lg hover:bg-red-50">Logout</button>
            </>
          ) : (
            <MobileBtn label="Admin Login" onClick={() => { setPage("admin-login"); setMenuOpen(false); }} />
          )}
        </div>
      )}
    </nav>
  );
}

function NavBtn({ label, active, onClick }) {
  return (
    <button onClick={onClick} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${active ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"}`}>
      {label}
    </button>
  );
}

function MobileBtn({ label, onClick }) {
  return (
    <button onClick={onClick} className="block w-full text-left px-3 py-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600">{label}</button>
  );
}
