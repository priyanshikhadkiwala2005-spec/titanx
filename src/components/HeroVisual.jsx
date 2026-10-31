import { useEffect, useRef } from 'react';

export default function HeroVisual() {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <div className="hero-visual-container hero-video-mode">
      <div className="hero-video-wrapper">
        <video
          ref={videoRef}
          className="hero-main-video"
          src="/videos/hero-video.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
        <div className="hero-video-glow" />
        <div className="hero-video-corner tl" />
        <div className="hero-video-corner tr" />
        <div className="hero-video-corner bl" />
        <div className="hero-video-corner br" />
      </div>
    </div>
  );
}