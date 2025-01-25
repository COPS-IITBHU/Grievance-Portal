"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { authService } from "@/services/api";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User, UserProvider, useUser } from "@/services/userContext";

export interface FormData {
  name: string;
  rollNumber: string;
  branch: string;
  program: string;
  year: string;
  gender: "male" | "female";
  hostel: string;
}

function ProfilePageProps() {
  const [isEditing, setIsEditing] = useState(false);
  const { user, setUser, logout } = useUser();

  const [userEmail, setUserEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const watchGender = watch("gender");

  useEffect(() => {
    setValue("hostel", "");
  }, [watchGender, setValue]);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = authService.getToken();
      if (!token) {
        router.push("/loginPage");
        return;
      }

      try {
        const decoded = jwtDecode<{ email: string; avatar?: string }>(token);
        setUserEmail(decoded.email);
        if (decoded.avatar) {
          setProfilePicture(decoded.avatar);
        }
      } catch (error) {
        console.error("Invalid token:", error);
        logout();
        router.push("/loginPage");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  useEffect(() => {
    if (isEditing && user) {
      setValue("name", user.name);
      setValue("rollNumber", user.rollNumber);
      setValue("branch", user.branch);
      setValue("program", user.program);
      setValue("year", user.yearOfStudy);
      setValue("gender", (user.gender as "male") || "female");
      setValue("hostel", user.hostel);
    }
  }, [isEditing, user, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      const newData: User = {
        ...user,
        _id: user?._id || "",
        email: user?.email || "",
        role: user?.role || "",
        avatar: user?.avatar || "",
        name: data.name,
        rollNumber: data.rollNumber,
        branch: data.branch,
        program: data.program,
        yearOfStudy: data.year,
        gender: (data.gender as "male") || "female",
        hostel: data.hostel,
      };
      const id = user?._id as string;
      await authService.UpdateUserProfile(id, newData);
      setUser(newData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#643861]"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen my-4 p-6 bg-gray-50">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-[#fcffdf] rounded-lg p-6 shadow-md">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                {profilePicture ? (
                  <Image
                    src={profilePicture}
                    alt="Profile"
                    height={64}
                    width={64}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-[#643861] flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">
                      {userEmail ? userEmail[0].toUpperCase() : "?"}
                    </span>
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold text-[#643861]">
                    My Profile
                  </h2>
                  <p className="text-gray-600">{userEmail}</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-[#643861] hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors"
                >
                  {isEditing ? "Cancel" : "Edit"}
                </button>
                <button
                  onClick={() => {
                    logout();
                    router.push("/loginPage");
                  }}
                  className="bg-[#643861] hover:bg-red-600 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {isEditing ? (
            <div className="bg-[#fcffdf] rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold mb-6 text-[#643861]">
                Personal Info
              </h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      {...register("name", { required: "Name is required" })}
                      className="w-full border rounded-md p-2"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Roll Number
                    </label>
                    <input
                      type="text"
                      {...register("rollNumber", {
                        required: "Roll number is required",
                      })}
                      className="w-full border rounded-md p-2"
                    />
                    {errors.rollNumber && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.rollNumber.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Branch
                    </label>
                    <select
                      {...register("branch", {
                        required: "Branch is required",
                      })}
                      className="w-full border rounded-md p-2"
                    >
                      <option value="">Select Branch</option>
                      {Branches.map((branch) => (
                        <option key={branch} value={branch}>
                          {branch}
                        </option>
                      ))}
                    </select>
                    {errors.branch && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.branch.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Program
                    </label>
                    <select
                      {...register("program", {
                        required: "Program is required",
                      })}
                      className="w-full border rounded-md p-2"
                    >
                      <option value="">Select Program</option>
                      <option value="B.Tech">B.Tech</option>
                      <option value="IDD">IDD</option>
                    </select>
                    {errors.program && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.program.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Gender
                    </label>
                    <div className="flex gap-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          {...register("gender", {
                            required: "Gender is required",
                          })}
                          value="male"
                          className="form-radio"
                        />
                        <span className="ml-2">Male</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          {...register("gender")}
                          value="female"
                          className="form-radio"
                        />
                        <span className="ml-2">Female</span>
                      </label>
                    </div>
                    {errors.gender && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.gender.message}
                      </p>
                    )}
                  </div>

                  {watchGender && (
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Hostel
                      </label>
                      <select
                        {...register("hostel", {
                          required: "Hostel is required",
                        })}
                        className="w-full border rounded-md p-2"
                      >
                        <option value="">Select Hostel</option>
                        {(watchGender === "male"
                          ? maleHostels
                          : femaleHostels
                        ).map((hostel) => (
                          <option key={hostel} value={hostel}>
                            {hostel}
                          </option>
                        ))}
                      </select>
                      {errors.hostel && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.hostel.message}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    className="bg-[#643861] hover:bg-[#d35c13] text-white py-2 px-8 rounded-md transition-colors"
                  >
                    Update Profile
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-[#fcffdf] rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold mb-6 text-[#643861]">
                Personal Info
              </h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Full Name
                    </label>
                    <p className="w-full border rounded-md p-2">{user?.name}</p>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Roll Number
                    </label>
                    <p className="w-full border rounded-md p-2">
                      {user?.rollNumber}
                    </p>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Branch
                    </label>
                    <p className="w-full border rounded-md p-2">
                      {user?.branch}
                    </p>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Program
                    </label>
                    <p className="w-full border rounded-md p-2">
                      {user?.program}
                    </p>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Gender
                    </label>
                    <p className="w-full border rounded-md p-2">
                      {user?.gender}
                    </p>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Hostel
                    </label>
                    <p className="w-full border rounded-md p-2">
                      {user?.hostel}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-[#fcffdf] rounded-lg p-6 shadow-md mb-52">
            <h3 className="text-xl font-bold mb-6 text-[#643861]">
              My Grievances
            </h3>
            <p className="text-gray-500 text-center">
              No grievances found.
              <button
                onClick={() => router.push("/grievancePage")}
                className="text-[#643861] hover:text-[#d35c13] ml-2"
              >
                File a new grievance
              </button>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default function ProfilePage() {
  return (
    <UserProvider>
      <ProfilePageProps />
    </UserProvider>
  );
}
