import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    fetch(`${API_URL}/`)
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => setMessage("Failed to connect to backend"));
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Recipe Tracker</h1>
      <h1>{message}</h1>
    </div>
  );
}

export default App;
