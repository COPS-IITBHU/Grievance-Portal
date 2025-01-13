"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/IITBHU_LOGO.png";
import IIT from "@/public/iit.jpg"

function Navbar() {
  return (
    <nav>
      <div className="flex gap-2 justify-start md:justify-around md:gap-0 items-center bg-[#fcffdf] p-1 shadow-lg">
        <Link href="/" className="flex items-center ml-4 md:ml-12">
          <Image
            src={Logo}
            alt="Logo"
            height={80}
            className="h-14 md:h-20 w-auto"
          />
        </Link>
        <div className="text-center px-2">
          <h1 className="text-xl md:text-3xl font-bold text-[#643861]">
            Grievance and Enquiry Portal
          </h1>
        </div>
        <div className="mr-4 md:mr-12 hidden md:block">
          <Image
            src={IIT}
            alt="IIT BHU Label"
            height={80}
            className="h-20 mix-blend-multiply"
          />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;