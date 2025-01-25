"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { authService, grievanceService } from "@/services/api";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSearchParams } from "next/navigation";

function page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  useEffect(() => {
    const localToken =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (localToken) {
      router.push("/homePage");
    }
  }, [router]);

  const token = searchParams.get("token") as string;
  if (token.trim() == "") return router.push("/homePage");
  const maleHostels: string[] = [
    "Aryabhatta Hostel",
    "CV Raman Hostel",
    "Dhanrajgiri Hostel",
    "Morvi Hostel",
    "PC Ray Hostel",
    "Rajputana Hostel",
    "Ramanujan Hostel",
    "S N Bose Hostel",
    "S. S. Saluja Hostel",
    "Satish Dhawan Hostel",
    "Vishwakarma Hostel",
    "Vivekanand Hostel",
  ];
  const femaleHostels: string[] = [
    "GSMC Old & Ext. Hostel",
    "Limdi Hostel",
    "New Girls Hostel",
    "Nivedita Girls Hostel",
    "S. C. De. Girls Hostel",
  ];
  const Branches: string[] = [
    "Architecture Planning and Design",
    "Biochemical Engineering",
    "Biomedical Engineering",
    "Ceramic Engineering",
    "Chemical Engineering",
    "Civil Engineering",
    "Computer Science  Engineering",
    "Electrical Engineering",
    "Electronics Engineering",
    "Engineering Physics",
    "Humanistic Studies",
    "Industrial Chemistry",
    "Material Science and Technology",
    "Mathematics and Computing",
    "Mechanical Engineering",
    "Metallurgical Engineering",
    "Mining Engineering",
    "Pharmaceutical Engineering",
  ];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm();

  const onSubmit = async (data: any) => {
    try {
      const userData = {
        name: data.name,
        branch: data.branch,
        gender: data.gender,
        rollNumber: data.rollNumber,
        program: data.program,
        year: data.year,
        hostel: data.hostel,
      };
      authService.onboardUser(userData, token);
      router.push(`/homePage?token=${token}`);
    } catch (error: any) {
      console.error("Error submitting grievance:", error);
      if (error.response?.status === 500) {
        alert(
          "Server error while uploading images. Please try with smaller images or fewer images."
        );
      } else {
        alert("Failed to submit grievance");
      }
      reset();
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center p-3">
        <div
          className="w-full max-w-2xl bg-[#fcffdf] drop-shadow-lg rounded-lg shadow-md shadow-[#864e82] p-6 mb-5"
          style={{ border: "1px solid #643861" }}
        >
          <h1
            className="text-2xl font-bold mb-6 text-center"
            style={{ color: "#643861" }}
          >
            User Data
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="text-md font-medium mb-1 flex items-center gap-2"
                  style={{ color: "black" }}
                >
                  Name{" "}
                  {errors.name && (
                    <p className="text-red-500 text-sm">*Required Field</p>
                  )}
                </label>
                <input
                  id="name"
                  type="text"
                  className={`w-full border rounded-md text-[#573054] px-3 py-2 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Student Name"
                  {...register("name", { required: "Name is required" })}
                />
              </div>

              <div>
                <label
                  htmlFor="Branch"
                  className="text-md font-medium mb-1 flex items-center gap-2"
                  style={{ color: "black" }}
                >
                  Branch{" "}
                  {errors.branch && (
                    <p className="text-red-500 text-sm">*Required Field</p>
                  )}
                </label>
                <select
                  id="Branch"
                  className={`w-full border rounded-md text-[#573054] px-3 py-2 ${
                    errors.branch ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("branch", { required: "Branch is required" })}
                >
                  <option value="">Select Branch</option>
                  {Branches.map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="gender"
                  className="text-md font-medium mb-1 flex items-center gap-2"
                  style={{ color: "black" }}
                >
                  Gender{" "}
                  {errors.gender && (
                    <p className="text-red-500 text-sm">*Required Field</p>
                  )}
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="male"
                      {...register("gender", {
                        required: "Gender is required",
                      })}
                    />
                    <span>Male</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="female"
                      {...register("gender", {
                        required: "Gender is required",
                      })}
                    />
                    <span>Female</span>
                  </label>
                </div>
              </div>

              <div>
                <label
                  htmlFor="rollNumber"
                  className="text-md font-medium mb-1 flex items-center gap-2"
                  style={{ color: "black" }}
                >
                  Roll Number{" "}
                  {errors.rollNumber && (
                    <p className="text-red-500 text-sm">*Required Field</p>
                  )}
                </label>
                <input
                  id="rollNumber"
                  type="number"
                  min={0}
                  className={`w-full border rounded-md text-[#573054] px-3 py-2 ${
                    errors.rollNumber ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your roll number"
                  {...register("rollNumber", {
                    required: "Roll number is required",
                  })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="program"
                  className="text-md font-medium mb-1 flex items-center gap-2"
                  style={{ color: "black" }}
                >
                  Program{" "}
                  {errors.program && (
                    <p className="text-red-500 text-sm">*Required Field</p>
                  )}
                </label>
                <select
                  id="program"
                  className={`w-full border rounded-md text-[#573054] px-3 py-2 ${
                    errors.program ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("program", { required: "Program is required" })}
                >
                  <option value="">Select Program</option>
                  <option value="Btech">BTech</option>
                  <option value="Mtech">MTech</option>
                  <option value="IDD">IDD</option>
                  <option value="PHD">PHD</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="year"
                  className="text-md font-medium mb-1 flex items-center gap-2"
                  style={{ color: "black" }}
                >
                  Year Of Study{" "}
                  {errors.year && (
                    <p className="text-red-500 text-sm">*Required Field</p>
                  )}
                </label>
                <select
                  id="year"
                  className={`w-full border rounded-md text-[#573054] px-3 py-2 ${
                    errors.year ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("year", {
                    required: "Year of study is required",
                  })}
                >
                  <option value="">Select Year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                  <option value="5">5th Year</option>
                  <option value="6">6th Year</option>
                  <option value="other">Other</option>
                </select>
                {watch("year") === "other" && (
                  <input
                    type="number"
                    min={0}
                    className={`w-full border rounded-md text-[#573054] px-3 py-2 mt-2 ${
                      errors.customYear ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your year"
                    {...register("customYear", {
                      required: " year is required",
                    })}
                  />
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor="hostel"
                className="text-md font-medium mb-1 flex items-center gap-2"
                style={{ color: "black" }}
              >
                Hostel{" "}
                {errors.hostel && (
                  <p className="text-red-500 text-sm">*Required Field</p>
                )}
              </label>
              <select
                id="hostel"
                className={`w-full border rounded-md text-[#573054] px-3 py-2 ${
                  errors.hostel ? "border-red-500" : "border-gray-300"
                }`}
                {...register("hostel", { required: "Hostel is required" })}
              >
                {watch("gender") !== "male" && watch("gender") !== "female" && (
                  <option value="">Select Gender First</option>
                )}
                {watch("gender") === "male" && (
                  <option value="">Select Hostel</option>
                )}
                {watch("gender") === "female" && (
                  <option value="">Select Hostel</option>
                )}
                {watch("gender") === "male" &&
                  maleHostels.map((hostel) => (
                    <option key={hostel} value={hostel}>
                      {hostel}
                    </option>
                  ))}
                {watch("gender") === "female" &&
                  femaleHostels.map((hostel) => (
                    <option key={hostel} value={hostel}>
                      {hostel}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex justify-between items-center space-x-4">
              <button
                type="submit"
                className="w-full bg-[#643861] hover:bg-[#d35c13] text-white py-2 rounded-md transition-all transform duration-300"
              >
                Submit
              </button>
              <button
                type="button"
                className="w-full bg-gray-300 hover:bg-zinc-400 text-black py-2 rounded-md"
                onClick={() => reset()}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default page;
