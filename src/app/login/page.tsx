'use client';

import { useEffect, useRef, useState } from 'react';
import LoginForm from './client';

export default function Login() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Array of video sources - add your other video paths here
  const videos = [
    'https://av5on64jc4.ufs.sh/f/jYAIyA6pXignHpXfl2SkSqKmkIdQ5AiYXwezrn1sLTg2DCWc',
    'https://av5on64jc4.ufs.sh/f/jYAIyA6pXignsNKhM5BuCRZ4q0fNIjAHEtS8p6bOXBvLzrKa',
    'https://av5on64jc4.ufs.sh/f/jYAIyA6pXign9LzlJhGEK7MOW2HtS8VrgBIdbz6GCRw3QsY1',
  ];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVideoEnd = () => {
      setCurrentVideoIndex((prevIndex) =>
        prevIndex === videos.length - 1 ? 0 : prevIndex + 1
      );
    };

    video.addEventListener('ended', handleVideoEnd);

    return () => {
      video.removeEventListener('ended', handleVideoEnd);
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
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Right Side - Video Section */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-background max-lg:hidden">
        {/* Video Background */}
        <video
          autoPlay
          className="absolute inset-0 h-full w-full object-cover "
          muted
          playsInline
          ref={videoRef}
        >
          <source src={videos[currentVideoIndex]} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      {/* Left Side - Login Form */}
      <div className="flex flex-1 items-center justify-center bg-[#f5f5f5] px-6 py-12 lg:px-8">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
