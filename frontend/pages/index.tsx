import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch data from backend API
    axios.get('http://localhost:5000/')
      .then(response => setMessage(response.data))
      .catch(error => console.log(error));
  }, []);

  return (
    <div>
      <h1>{message}</h1>
    </div>
  );
}
