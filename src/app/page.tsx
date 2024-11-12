import React from "react";

export default function Home() {
  return (
    <div className="wrapper">

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h2 className="text-5xl font-bold mb-6">
          Voice AI for <span className="text-blue-600">Emotional Work</span>
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Guide yourself through emotional blocks and into flow.
        </p>
        <a href="/start" className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg hover:bg-blue-700">
          Start Your Journey
        </a>
        <p className="mt-4 text-gray-500">Your first 60 minutes are free</p>
      </div>
    </div>
  );
}
