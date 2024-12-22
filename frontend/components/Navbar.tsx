"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/IITBHU_LOGO.png";

function Navbar() {
  return (
    <nav>
      <div className="flex justify-between items-center bg-[#703f6c] p-2 shadow-lg">
          <Link href="/" className="flex items-center gap-3 ml-6">
            <Image
              src={Logo}
              alt="IIT BHU Logo"
              width={64} 
              height={64}
              className="h-16 w-16" 
            />
          </Link>
        <div className="mr-6">
          <a
            href="/grievancePage"
            className="text-white bg-[#106ea8] hover:bg-[#2878a9] py-2 px-4 rounded-lg font-semibold transition duration-300 shadow-md"
          >
            Submit Grievances
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
