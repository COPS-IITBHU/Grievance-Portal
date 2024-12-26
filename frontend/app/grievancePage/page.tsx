"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import Link from "next/link";
import { grievanceService } from '@/services/api';
import { useRouter } from 'next/navigation';

function GrievancePage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

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
  
  const toggleTag = (tag: string) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag] 
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedImages((prevImages) => [...prevImages, ...filesArray]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prevImages) =>
      prevImages.filter((_, i) => i !== index)
    );
  };

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append('heading', data.heading);
      formData.append('content', data.description);
      selectedTags.forEach(tag => formData.append('tags[]', tag));
      selectedImages.forEach(image => formData.append('images', image));

      await grievanceService.create(formData);
      alert("Grievance submitted successfully!");
      router.push('/homePage');
    } catch (error) {
      console.error('Error submitting grievance:', error);
      alert("Failed to submit grievance");
    }
  };

  function Navbar() {
    return (
      <nav>
        <div className="flex justify-between items-center bg-[#703f6c] p-2 shadow-lg">
          <Link href="/" className="flex items-center gap-3 ml-6">
            <Image
              src="/IITBHU_LOGO.png"
              alt="IIT BHU Logo"
              width={64} 
              height={64}
              className="h-16 w-16" 
            />
          </Link>
        </div>
      </nav>
    );
  }
  

  return (
    <>
    <Navbar />
    <div className="min-h-screen flex items-center justify-center p-3">
      <div
        className="w-full max-w-2xl bg-[#fcffdf] drop-shadow-lg rounded-lg shadow-md shadow-[#864e82] p-6"
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
              {...register("description", { required: "Description is required" })}
            ></textarea>
          </div>

          <div>
            <label className="block text-md font-medium mb-2" style={{ color: "black" }}>
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
                    <span className="text-[12px] text-black">{file.name}</span>
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
              className="w-full bg-[#643861] hover:bg-[#d35c13] text-white py-2 rounded-md transition-all transform duration-300"
            >
              Submit
            </button>
            <button
              type="button"
              className="w-full bg-gray-300 hover:bg-zinc-400 text-black py-2 rounded-md"
              onClick={() => {
                reset();
                setSelectedTags([]); 
              }}
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}

export default GrievancePage;
