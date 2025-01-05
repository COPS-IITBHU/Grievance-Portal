"use client";
import React from "react";

function Footer() {
  return (
    <footer className="fixed bottom-0 w-full">
      <div className="flex justify-center items-center bg-[#703f6c] p-2.5 shadow-[0_-2px_4px_rgba(0,0,0,0.1)]">
        <p className="text-[#fcffdf] sm:text-md text-sm font-bold">
          Made with ❤️ by{" "}
          <span
            className="hover:text-[#e0e89a] transition duration-300"
          >
            COPS IIT (BHU)
          </span>
        </p>
      </div>
    </footer>
  );
}

export default Footer;