"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { grievanceService } from "@/services/api";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { UserProvider, useUser } from "@/services/userContext";
import { uploadFiles } from "@/services/upload";
import ClipLoader from "react-spinners/ClipLoader";

const tagOptions = [
  "Hostel",
  "Security",
  "Web",
  "Department",
  "Academics",
  "Infrastructure",
  "Council",
  "Cells",
  "Festival",
  "Other",
];

function GrievancePageProps() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { user } = useUser();

  const toggleTag = (tag: string) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);

      // Validate file types and sizes
      const validFiles = files.filter((file) => {
        const isValidType = ["image/jpeg", "image/png", "image/jpg"].includes(
          file.type
        );
        const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
        return isValidType && isValidSize;
      });

      if (validFiles.length !== files.length) {
        alert(
          "Some files were rejected. Please only upload JPG/PNG images under 5MB."
        );
      }

      setSelectedImages((prev) => [...prev, ...validFiles]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const onSubmitStep1 = (data: any) => {
    setFormData({ ...data, tags: selectedTags });
    setStep(2);
  };

  const onSubmitStep2 = async (data: any) => {
    const combinedData = { ...formData, ...data };
    try {
      const formDataToSend = {
        name: combinedData.name,
        phoneNumber: combinedData.mobile,
        roomNumber: combinedData.room,
        heading: combinedData.heading,
        content: combinedData.description,
        userId: user?._id,
        tags: combinedData.tags,
        imagesUrl: await uploadFiles(
          selectedImages.map((image) => ({
            file: image,
          }))
        ),
      };
      setLoading(true);
      // Log the form data before sending
      console.log(formDataToSend);
      await grievanceService.create(formDataToSend);
      reset();
      setSelectedImages([]);
      setSelectedTags([]);
      setLoading(false);
      alert("Grievance submitted successfully!");
      router.push("/");
    } catch (error: any) {
      console.error("Error submitting grievance:", error);
      if (error.response?.status === 500) {
        alert(
          "Server error while uploading images. Please try with smaller images or fewer images."
        );
      } else {
        alert("Failed to submit grievance");
      }
    }
  };

  const handleReset = () => {
    reset();
    setSelectedTags([]);
    setSelectedImages([]);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center p-3 flex-col">
        <div
          className="w-full max-w-2xl bg-[#fcffdf] drop-shadow-lg rounded-lg shadow-md shadow-[#864e82] p-6 mb-5"
          style={{ border: "1px solid #643861" }}
        >
          <h1
            className="text-2xl font-bold mb-6 text-center"
            style={{ color: "#643861" }}
          >
            {step === 1 ? "User Information" : "Grievance Form"}
          </h1>
          {step === 1 ? (
            <form onSubmit={handleSubmit(onSubmitStep1)} className="space-y-6">
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
                  className="w-full border rounded-md text-[#573054] px-3 py-2"
                  {...register("name", { required: true })}
                />
              </div>
              <div>
                <label
                  htmlFor="mobile"
                  className="text-md font-medium mb-1 flex items-center gap-2"
                  style={{ color: "black" }}
                >
                  Mobile No{" "}
                  {errors.mobile && (
                    <p className="text-red-500 text-sm">*Required Field</p>
                  )}
                </label>
                <input
                  id="mobile"
                  type="text"
                  className="w-full border rounded-md text-[#573054] px-3 py-2"
                  {...register("mobile", { required: true })}
                />
              </div>
              <div>
                <label
                  htmlFor="room"
                  className="text-md font-medium mb-1 flex items-center gap-2"
                  style={{ color: "black" }}
                >
                  Room No{" "}
                  {errors.room && (
                    <p className="text-red-500 text-sm">*Required Field</p>
                  )}
                </label>
                <input
                  id="room"
                  type="text"
                  className="w-full border rounded-md text-[#573054] px-3 py-2"
                  {...register("room", { required: true })}
                />
              </div>
              <div>
                <label
                  className="block text-md font-medium mb-2"
                  style={{ color: "black" }}
                >
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {tagOptions.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedTags.includes(tag)
                          ? "bg-[#643861] text-white"
                          : "bg-gray-200 text-black"
                      }`}
                      onClick={() => toggleTag(tag)}
                    >
                      {selectedTags.includes(tag) && "🗸 "}
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center space-x-4">
                <button
                  type="submit"
                  className="w-full bg-[#643861] text-white font-bold py-2 px-4 rounded"
                >
                  Next
                </button>
                <button
                  type="button"
                  className="w-full bg-gray-300 hover:bg-zinc-400 text-black py-2 rounded-md"
                  onClick={handleReset}
                >
                  Reset
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit(onSubmitStep2)} className="space-y-6">
              <div>
                <label
                  htmlFor="heading"
                  className="text-md font-medium mb-1 flex items-center gap-2"
                  style={{ color: "black" }}
                >
                  Heading{" "}
                  {errors.heading && (
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
                  Description{" "}
                  {errors.description && (
                    <p className="text-red-500 text-sm">*Required Field</p>
                  )}
                </label>
                <textarea
                  id="description"
                  rows={4}
                  className={`w-full border rounded-md px-3 py-2 ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("description", {
                    required: "Description is required",
                  })}
                ></textarea>
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
                  onChange={handleImageChange}
                  multiple
                />
                {selectedImages.length > 0 && (
                  <div className="mt-3 space-y-1 grid grid-cols-2 items-center gap-1">
                    {selectedImages.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-200 px-2 py-1 rounded-md"
                      >
                        <span className="text-[12px] text-black">
                          {file.name}
                        </span>
                        <button
                          type="button"
                          className="text-[#643861] hover:text-[#d35c13]"
                          onClick={() => removeImage(index)}
                        >
                          ✖
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center space-x-4">
                <button
                  type="submit"
                  className="w-full bg-[#643861] text-white font-bold py-2 px-4 rounded"
                  disabled={loading}
                >
                  {!loading ? "Submit" : <ClipLoader size={30} color="#FFF" />}
                </button>
                <button
                  type="button"
                  className="w-full bg-gray-300 hover:bg-zinc-400 text-black py-2 rounded-md"
                  onClick={handleReset}
                  disabled={loading}
                >
                  Reset
                </button>
              </div>
            </form>
          )}
        </div>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            If you want to keep your identity hidden, use our{" "}
            <a
              href="https://forms.gle/GkzVG2uAVu33egxA7"
              className="text-blue-500 underline"
            >
              Google Form
            </a>
            .
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default function GrievancePage() {
  return (
    <UserProvider>
      <GrievancePageProps />
    </UserProvider>
  );
}
