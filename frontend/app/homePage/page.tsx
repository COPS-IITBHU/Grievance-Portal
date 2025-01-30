"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import GrievanceCard from "@/components/GrievanceCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { grievanceService, authService } from "@/services/api";
import { Grievance } from "@/types/grievance";

export default function HomePage() {
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  
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
    if (!authService.isLoggedIn()) {
      router.push("/loginPage");
      return;
    }

    const fetchGrievances = async () => {
      try {
        const data = await grievanceService.getAll();
        setGrievances(data);
      } catch (err) {
        setError("Failed to fetch grievances");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGrievances();
  }, [router]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center">
        <button
          onClick={() => router.push("/grievancePage")}
          className="bg-[#643861] hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors mt-5 ml-auto mr-5"
        >
          Make Your Grievance
        </button>
        <div className="flex flex-wrap align-middle justify-center items-center mt-10 mb-14 w-[80%] ">
          {grievances.length === 0 ? (
            <div className="text-gray-500 text-lg">No active grievances found.</div>
          ) : (
            grievances.map((grievance) => (
              <GrievanceCard
          key={grievance._id}
          id={grievance._id}
          title={grievance.heading}
          description={grievance.content}
          status={grievance.isComplete}
          votes={grievance.upvote_count}
          tags={grievance.tags}
          userImages={grievance.related_images}
          adminImages={grievance.progress_images}
          adminComments={[]}
              />
            ))
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
