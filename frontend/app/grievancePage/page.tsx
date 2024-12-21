"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";

function GrievancePage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    console.log("Submitted Data:", data);
    alert("Grievance submitted successfully!");
    reset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div
        className="w-full max-w-2xl bg-[#fcffdf] drop-shadow-lg rounded-lg p-8"
        style={{ border: "1px solid #643861" }}
      >
        <h1
          className="text-2xl font-bold mb-6 text-center"
          style={{ color: "#643861" }}
        >
          Grievance Form
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          <div>
            <label
              htmlFor="heading"
              className="text-md font-medium mb-1 flex items-center gap-2"
              style={{ color: "black" }}
            >
              Heading {errors.heading && (
              <p className="text-red-500 text-sm">*Required Field</p>
            )}
            </label>
            <input
              id="heading"
              type="text"
              className={`w-full border rounded-md text-[#573054] px-3 py-2 ${
                errors.heading ? "border-red-500" : "border-gray-300"
              }`}
              {...register("heading", { required: "Heading is required" })}
            />
          </div>

          <div>
            <label
              htmlFor="content"
              className="text-md font-medium mb-1 flex items-center gap-2"
              style={{ color: "black" }}
            >
              Description {errors.description && (
              <p className="text-red-500 text-sm">*Required Field</p>
            )}
            </label>
            <textarea
              id="description"
              rows={4}
              className={`w-full border rounded-md px-3 py-2 ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              {...register("description", { required: "description is required" })}
            ></textarea>
          </div>

          <div>
            <label
              htmlFor="tags"
              className="block text-md font-medium mb-1"
              style={{ color: "black" }}
            >
              Tags (comma-separated)
            </label>
            <input
              id="tags"
              type="text"
              className={`w-full border rounded-md px-3 py-2 ${
                errors.tags ? "border-red-500" : "border-gray-300"
              }`}
            />
            
          </div>

          <div>
            <label
              htmlFor="images"
              className="block text-sm font-medium mb-1"
              style={{ color: "black" }}
            >
              Related Images
            </label>
            <input
              id="images"
              type="file"
              className="w-full border rounded-md px-3 py-2"
              {...register("images")}
              multiple
            />
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
  );
}

export default GrievancePage;
