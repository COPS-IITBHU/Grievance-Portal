"use client";
import React from "react";

function Navbar() {
  return (
    <nav>
      <div className="flex justify-between items-center bg-blue-500 p-2 shadow-lg">
        <a href="/" className="flex items-center gap-3 ml-6">
          <img
            src="./IITBHU_LOGO.png"
            alt="IIT BHU Logo"
            className="h-16 w-16"
          />
        </a>

        <div className="mr-6">
          <a
            href="/grievancePage"
            className="text-white bg-[#643861] hover:bg-[#50274a] py-2 px-4 rounded-lg font-semibold transition duration-300 shadow-md"
          >
            Submit Grievances
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
