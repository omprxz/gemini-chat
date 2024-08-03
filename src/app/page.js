"use client";
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 flex items-center justify-center">
      <div className="text-center p-8 bg-white shadow-lg rounded-lg max-w-md mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to Gemini Chat
        </h1>
        <p className="text-gray-600 mb-6">
          Experience the power of advanced AI chat models right in your browser.
          Select your model and start chatting!
        </p>
        <Link href="/chat" className="inline-block px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-md text-lg font-semibold transition duration-300 ease-in-out">
            Start Chatting
        </Link>
      </div>
    </div>
  );
}