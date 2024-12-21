"use client";
import { useEffect, useState } from 'react';
import GrievanceCard from '@/components/GrievanceCard';
import axios from 'axios';
import Navbar from '@/components/Navbar';

export default function Home() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch data from backend API
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    axios.get(`${backendUrl}/`)
      .then(response => setMessage(response.data))
      .catch(error => console.log(error));
  }, []);

  const props = {
    title: 'Test Title',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    status: false,
    votes: 0,
    tags: ['tag 1', 'tag 2', 'tag 3'],
    adminComments: ['comm 1', 'comm 2', 'comm 3'],
  }

  return (
    <>
    <Navbar />
    <div className='flex flex-col items-center mt-10' >
      <GrievanceCard {...props}/>
      <GrievanceCard {...props}/>
      <GrievanceCard {...props}/>
      <GrievanceCard {...props}/>
      {message}
    </div>
    </>
  );
}