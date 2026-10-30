import { useEffect } from "react";

export function useRobustVideo(videoRef: React.RefObject<HTMLVideoElement | null>) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;

    const tryPlay = () => {
      if (video) {
        video.muted = true;
        const p = video.play();
        if (p !== undefined) p.catch(() => {});
      }
    };

    video.addEventListener("loadeddata", tryPlay);
    video.addEventListener("canplay", tryPlay);
    tryPlay();

    const interval = setInterval(() => { if (video && video.paused) tryPlay(); }, 1000);

    const onGesture = () => { tryPlay(); };
    document.addEventListener("click", onGesture, { once: true });
    document.addEventListener("touchstart", onGesture, { once: true });

    return () => {
      clearInterval(interval);
      if (video) {
        video.removeEventListener("loadeddata", tryPlay);
        video.removeEventListener("canplay", tryPlay);
      }
      document.removeEventListener("click", onGesture);
      document.removeEventListener("touchstart", onGesture);
    };
  }, [videoRef]);
}
