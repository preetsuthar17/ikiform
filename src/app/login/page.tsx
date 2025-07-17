"use client";

import LoginForm from "./client";
import { useState, useEffect, useRef } from "react";

export default function Login() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Array of video sources - add your other video paths here
  const videos = [
    "https://av5on64jc4.ufs.sh/f/jYAIyA6pXignHpXfl2SkSqKmkIdQ5AiYXwezrn1sLTg2DCWc",
    "https://av5on64jc4.ufs.sh/f/jYAIyA6pXignsNKhM5BuCRZ4q0fNIjAHEtS8p6bOXBvLzrKa",
    "https://av5on64jc4.ufs.sh/f/jYAIyA6pXign9LzlJhGEK7MOW2HtS8VrgBIdbz6GCRw3QsY1",
  ];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVideoEnd = () => {
      setCurrentVideoIndex((prevIndex) =>
        prevIndex === videos.length - 1 ? 0 : prevIndex + 1,
      );
    };

    video.addEventListener("ended", handleVideoEnd);

    return () => {
      video.removeEventListener("ended", handleVideoEnd);
    };
  }, [videos.length]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.load(); // Reload the video element with new source
      video.play().catch(console.error);
    }
  }, [currentVideoIndex]);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Right Side - Video Section */}
      <div className="flex-1 relative bg-background flex items-center justify-center overflow-hidden max-lg:hidden">
        {/* Video Background */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover "
          muted
          playsInline
          autoPlay
        >
          <source src={videos[currentVideoIndex]} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center bg-[#f5f5f5]  px-6 py-12 lg:px-8">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
