"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { authService } from "@/services/api";
import { jwtDecode } from "jwt-decode";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { User, UserProvider, useUser } from "@/services/userContext";
import { Grievance } from "@/types/grievance";

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
   const [userGrievances, setUserGrievances] = useState<Grievance[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

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
    const token = searchParams.get("token");
    if (token) {
      authService.setToken(token);
      const params = new URLSearchParams(searchParams.toString());
      params.delete("token");
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      router.replace(newUrl);
    }
  }, [router]);


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
    const fetchUserGrievances = async () => {
      if (user?._id) {
        try {
          const grievances = await authService.getUserGrievances(user._id);
          setUserGrievances(grievances);
        } catch (error) {
          console.error("Error fetching grievances:", error);
        }
      }
    };

    fetchUserGrievances();
  }, [user?._id]);

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
      <div className="min-h-screen my-2 md:my-4 p-3 md:py-6 bg-gray-50">
        <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
          <div className="bg-[#fcffdf] rounded-lg p-4 md:p-6 shadow-md">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
              <div className="flex flex-col md:flex-row items-center md:space-x-4">
                {profilePicture ? (
                  <Image
                    src={profilePicture}
                    alt="Profile"
                    height={56}
                    width={56}
                    className="rounded-full w-14 h-14 md:w-16 md:h-16 border-2 border-gray-500"
                  />
                ) : (
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#643861] flex items-center justify-center">
                    <span className="text-2xl md:text-3xl font-bold text-white">
                      {userEmail ? userEmail[0].toUpperCase() : "?"}
                    </span>
                  </div>
                )}
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-[#643861]">
                    Your Profile
                  </h2>
                  <p className="text-sm md:text-base text-gray-600">{userEmail}</p>
                </div>
              </div>
              <div className="flex justify-center md:justify-end space-x-2 md:space-x-4">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-[#643861] hover:bg-[#d35c13] text-white py-1.5 md:py-2 px-3 md:px-4 rounded-md text-sm md:text-base transition-colors cursor-pointer"
                >
                  {isEditing ? "Cancel" : "Edit"}
                </button>
                <button
                  onClick={() => {
                    logout();
                    router.push("/loginPage");
                  }}
                  className="bg-[#643861] hover:bg-red-700 text-white py-1.5 md:py-2 px-3 md:px-4 rounded-md text-sm md:text-base transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {isEditing ? (
            <div className="bg-[#fcffdf] rounded-lg p-4 md:p-6 shadow-md">
              <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-[#643861]">
                Personal Info
              </h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-gray-700 text-sm md:text-base font-medium mb-1 md:mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      {...register("name", { required: "Name is required" })}
                      className="w-full border rounded-md p-1.5 md:p-2 text-sm md:text-base"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm md:text-base font-medium mb-1 md:mb-2">
                      Roll Number
                    </label>
                    <input
                      type="text"
                      {...register("rollNumber", {
                        required: "Roll number is required",
                      })}
                      className="w-full border rounded-md p-1.5 md:p-2 text-sm md:text-base"
                    />
                    {errors.rollNumber && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.rollNumber.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm md:text-base font-medium mb-1 md:mb-2">
                      Branch
                    </label>
                    <select
                      {...register("branch", {
                        required: "Branch is required",
                      })}
                      className="w-full border rounded-md p-1.5 md:p-2 text-sm md:text-base"
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
                    <label className="block text-gray-700 text-sm md:text-base font-medium mb-1 md:mb-2">
                      Program
                    </label>
                    <select
                      {...register("program", {
                        required: "Program is required",
                      })}
                      className="w-full border rounded-md p-1.5 md:p-2 text-sm md:text-base"
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
                    <label className="block text-gray-700 text-sm md:text-base font-medium mb-1 md:mb-2">
                      Gender
                    </label>
                    <div className="flex gap-2 md:gap-6">
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
                      <label className="block text-gray-700 text-sm md:text-base font-medium mb-1 md:mb-2">
                        Hostel
                      </label>
                      <select
                        {...register("hostel", {
                          required: "Hostel is required",
                        })}
                        className="w-full border rounded-md p-1.5 md:p-2 text-sm md:text-base"
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

                <div className="flex justify-end mt-4 md:mt-6">
                  <button
                    type="submit"
                    className="bg-[#643861] hover:bg-[#d35c13] text-white py-1.5 md:py-2 px-6 md:px-8 rounded-md text-sm md:text-base transition-colors cursor-pointer"
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

            <div className="bg-[#fcffdf] rounded-lg p-4 md:p-6 shadow-md mb-20 md:mb-52 pb-10">
    <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-[#643861]">
      My Grievances
    </h3>
    <div className="space-y-4">
      {userGrievances.length === 0 ? (
        <p className="text-gray-800 text-center text-sm md:text-base">
          No grievances found.
        </p>
      ) : (
        <div className="grid gap-4">
          {userGrievances.map((grievance) => (
            <div
              key={grievance._id}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow-xl border border-[#643861]"
            >
              <h4 className="font-medium text-gray-800">{grievance.heading}</h4>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  grievance.isComplete
                    ? "bg-green-100 text-green-800"
                    : grievance.isRejected
                    ? "bg-red-100 text-red-800"
                    : grievance.isPending
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {grievance.isComplete
                  ? "Completed"
                  : grievance.isRejected
                  ? "Rejected"
                  : grievance.isPending
                  ? "Pending"
                  : "Approved"}
              </span>
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => router.push("/grievancePage")}
          className="bg-[#643861] hover:bg-[#d35c13] text-white py-2 px-4 rounded-md transition-colors cursor-pointer"
        >
          Make a new Grievance
        </button>
      </div>
    </div>
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
