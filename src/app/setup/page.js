"use client";
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SetupPage() {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await axios.post('/api/setup/api', { apiKey });
      router.push('/chat');
    } catch (error) {
      console.error('Error saving API key:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-2 text-black">
      <div className="w-full max-w-md bg-white py-6 px-4 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-4 text-black">Setup Gemini API Key</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">API Key</label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Enter your Gemini API key"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-2 rounded-md text-white ${loading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link href="/chat" className="text-blue-500 hover:underline">
            Go to Chat
          </Link>
        </div>
      </div>
    </div>
  );
}