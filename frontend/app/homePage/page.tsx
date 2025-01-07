"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import GrievanceCard from '@/components/GrievanceCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { grievanceService, authService } from '@/services/api';
import { Grievance } from '@/types/grievance';

export default function Home() {
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!authService.isLoggedIn()) {
      router.push('/loginPage');
      return;
    }

    const fetchGrievances = async () => {
      try {
        const data = await grievanceService.getAll();
        setGrievances(data);
      } catch (err) {
        setError('Failed to fetch grievances');
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
      <div className='flex flex-col items-center mt-10 mb-5'>
        {grievances.map((grievance) => (
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
        ))}
      </div>
      <Footer />
    </>
  );
}