"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  Maximize,
  Minimize,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

const videoPlayerVariants = cva(
  "group relative w-full overflow-hidden rounded-2xl bg-black",
  {
    variants: {
      size: {
        sm: "max-w-md",
        default: "max-w-2xl",
        lg: "max-w-4xl",
        full: "w-full",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface VideoPlayerProps
  extends React.VideoHTMLAttributes<HTMLVideoElement>,
    VariantProps<typeof videoPlayerVariants> {
  src: string;
  poster?: string;
  showControls?: boolean;
  autoHide?: boolean;
  className?: string;
}

const VideoPlayer = React.forwardRef<HTMLVideoElement, VideoPlayerProps>(
  (
    {
      className,
      size,
      src,
      poster,
      showControls = true,
      autoHide = true,
      ...props
    },
    ref
  ) => {
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [currentTime, setCurrentTime] = React.useState(0);
    const [duration, setDuration] = React.useState(0);
    const [volume, setVolume] = React.useState(1);
    const [isMuted, setIsMuted] = React.useState(false);
    const [isFullscreen, setIsFullscreen] = React.useState(false);
    const [showControlsState, setShowControlsState] = React.useState(true);

    const videoRef = React.useRef<HTMLVideoElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const hideControlsTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    React.useImperativeHandle(ref, () => videoRef.current!, []);

    const formatTime = (time: number) => {
      const hours = Math.floor(time / 3600);
      const minutes = Math.floor((time % 3600) / 60);
      const seconds = Math.floor(time % 60);

      if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`;
      }
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    const togglePlay = () => {
      if (videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          videoRef.current.play();
        }
      }
    };

    const toggleMute = () => {
      if (videoRef.current) {
        videoRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
      }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVolume = Number.parseFloat(e.target.value);
      setVolume(newVolume);
      if (videoRef.current) {
        videoRef.current.volume = newVolume;
        setIsMuted(newVolume === 0);
      }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTime = Number.parseFloat(e.target.value);
      setCurrentTime(newTime);
      if (videoRef.current) {
        videoRef.current.currentTime = newTime;
      }
    };

    const toggleFullscreen = () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
        setIsFullscreen(false);
      } else {
        containerRef.current?.requestFullscreen();
        setIsFullscreen(true);
      }
    };

    const skip = (seconds: number) => {
      if (videoRef.current) {
        videoRef.current.currentTime = Math.max(
          0,
          Math.min(duration, currentTime + seconds)
        );
      }
    };

    const resetHideControlsTimeout = () => {
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current);
      }

      if (autoHide && isPlaying) {
        hideControlsTimeoutRef.current = setTimeout(() => {
          setShowControlsState(false);
        }, 3000);
      }
    };

    const handleMouseMove = () => {
      setShowControlsState(true);
      resetHideControlsTimeout();
    };

    React.useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      const handleLoadedMetadata = () => {
        setDuration(video.duration);
      };

      const handleTimeUpdate = () => {
        setCurrentTime(video.currentTime);
      };

      const handlePlay = () => {
        setIsPlaying(true);
        resetHideControlsTimeout();
      };

      const handlePause = () => {
        setIsPlaying(false);
        setShowControlsState(true);
        if (hideControlsTimeoutRef.current) {
          clearTimeout(hideControlsTimeoutRef.current);
        }
      };

      const handleVolumeChange = () => {
        setVolume(video.volume);
        setIsMuted(video.muted);
      };

      video.addEventListener("loadedmetadata", handleLoadedMetadata);
      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("play", handlePlay);
      video.addEventListener("pause", handlePause);
      video.addEventListener("volumechange", handleVolumeChange);

      return () => {
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("play", handlePlay);
        video.removeEventListener("pause", handlePause);
        video.removeEventListener("volumechange", handleVolumeChange);
        if (hideControlsTimeoutRef.current) {
          clearTimeout(hideControlsTimeoutRef.current);
        }
      };
    }, [autoHide, isPlaying]);

    React.useEffect(() => {
      const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
      };

      document.addEventListener("fullscreenchange", handleFullscreenChange);
      return () => {
        document.removeEventListener(
          "fullscreenchange",
          handleFullscreenChange
        );
      };
    }, []);

    React.useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (!containerRef.current?.contains(document.activeElement)) return;

        switch (e.key) {
          case " ":
          case "k":
            e.preventDefault();
            togglePlay();
            break;
          case "m":
            e.preventDefault();
            toggleMute();
            break;
          case "f":
            e.preventDefault();
            toggleFullscreen();
            break;
          case "ArrowLeft":
            e.preventDefault();
            skip(-10);
            break;
          case "ArrowRight":
            e.preventDefault();
            skip(10);
            break;
          case "ArrowUp":
            e.preventDefault();
            setVolume((prev) => Math.min(1, prev + 0.1));
            break;
          case "ArrowDown":
            e.preventDefault();
            setVolume((prev) => Math.max(0, prev - 0.1));
            break;
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [currentTime, duration]);

    return (
      <div
        className={cn(videoPlayerVariants({ size }), className)}
        onMouseLeave={() =>
          autoHide && isPlaying && setShowControlsState(false)
        }
        onMouseMove={handleMouseMove}
        ref={containerRef}
        tabIndex={0}
      >
        <video
          className="h-full w-full object-cover"
          onClick={togglePlay}
          poster={poster}
          ref={videoRef}
          src={src}
          {...props}
        />

        {showControls && (
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent",
              "flex flex-col justify-end transition-opacity duration-300",
              showControlsState ? "opacity-100" : "opacity-0"
            )}
          >
            {}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                className="group flex h-16 w-16 items-center justify-center rounded-2xl border border-white/30 bg-white/20 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/30"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <Pause className="ml-0.5 h-6 w-6" />
                ) : (
                  <Play className="ml-1 h-6 w-6" />
                )}
              </button>
            </div>

            {}
            <div className="flex flex-col gap-3 p-4">
              {}
              <div className="flex items-center gap-2 text-sm text-white">
                <span className="min-w-0 font-mono text-xs">
                  {formatTime(currentTime)}
                </span>
                <div className="group/progress relative flex-1">
                  <input
                    className="h-1 w-full cursor-pointer appearance-none rounded-2xl bg-white/30 [&::-webkit-slider-thumb]: [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-2xl [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-200 group-hover/progress:[&::-webkit-slider-thumb]:scale-125"
                    max={duration || 0}
                    min={0}
                    onChange={handleSeek}
                    style={{
                      background: `linear-gradient(to right, #ffffff 0%, #ffffff ${
                        (currentTime / duration) * 100
                      }%, rgba(255,255,255,0.3) ${
                        (currentTime / duration) * 100
                      }%, rgba(255,255,255,0.3) 100%)`,
                    }}
                    type="range"
                    value={currentTime}
                  />
                </div>
                <span className="min-w-0 font-mono text-xs">
                  {formatTime(duration)}
                </span>
              </div>

              {}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    className="rounded-xl p-2 text-white transition-colors hover:bg-white/20"
                    onClick={() => skip(-10)}
                  >
                    <SkipBack className="h-4 w-4" />
                  </button>

                  <button
                    className="rounded-xl p-2 text-white transition-colors hover:bg-white/20"
                    onClick={togglePlay}
                  >
                    {isPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="ml-0.5 h-4 w-4" />
                    )}
                  </button>

                  <button
                    className="rounded-xl p-2 text-white transition-colors hover:bg-white/20"
                    onClick={() => skip(10)}
                  >
                    <SkipForward className="h-4 w-4" />
                  </button>

                  <div className="group/volume flex items-center gap-2">
                    <button
                      className="rounded-xl p-2 text-white transition-colors hover:bg-white/20"
                      onClick={toggleMute}
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className="h-4 w-4" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </button>

                    <div className="w-0 overflow-hidden transition-all duration-200 group-hover/volume:w-20">
                      <input
                        className="h-1 w-full cursor-pointer appearance-none rounded-2xl bg-white/30 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-2xl [&::-webkit-slider-thumb]:bg-white"
                        max={1}
                        min={0}
                        onChange={handleVolumeChange}
                        step={0.1}
                        style={{
                          background: `linear-gradient(to right, #ffffff 0%, #ffffff ${
                            (isMuted ? 0 : volume) * 100
                          }%, rgba(255,255,255,0.3) ${
                            (isMuted ? 0 : volume) * 100
                          }%, rgba(255,255,255,0.3) 100%)`,
                        }}
                        type="range"
                        value={isMuted ? 0 : volume}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="rounded-xl p-2 text-white transition-colors hover:bg-white/20"
                    onClick={toggleFullscreen}
                  >
                    {isFullscreen ? (
                      <Minimize className="h-4 w-4" />
                    ) : (
                      <Maximize className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

VideoPlayer.displayName = "VideoPlayer";

export { VideoPlayer, videoPlayerVariants };
