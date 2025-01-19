"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  const router = useRouter();

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-[#643861] mb-2">404</h1>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <button
            onClick={() => router.back()}
            className="bg-[#643861] hover:bg-[#fcffdf] hover:text-[#643861] text-white px-3 py-2 rounded-md transition-all duration-300 border-[#643861] border-2"
          >
            Go Back
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}