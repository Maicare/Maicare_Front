"use client";

import { memo, useEffect, useState } from "react";
import NProgress from "nprogress";
import { usePathname } from "next/navigation";

const ProgressBar = () => {
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname(); // Detects route changes

  NProgress.configure({ showSpinner: false });

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const handleStart = () => {
      timeout = setTimeout(() => NProgress.start(), 300);
    };

    const handleStop = () => {
      NProgress.done();
      clearTimeout(timeout);
    };

    if (pathname) {
      handleStart();
      setIsNavigating(true);
      setTimeout(() => {
        handleStop();
        setIsNavigating(false);
      }, 300); // Simulate a delay for smoother progress
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [pathname]);

  return (
    <style jsx global>{`
      #nprogress {
        pointer-events: none;
        z-index: 9999;
      }
      #nprogress .bar {
        background: #007bff; /* Replace with your desired color */
        position: fixed;
        z-index: 1031;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
        box-shadow: 0 0 2px #007bff; /* Replace with your desired color */
      }
      #nprogress .peg {
        display: block;
        position: absolute;
        right: 0px;
        width: 100px;
        height: 100%;
        opacity: 1;
        transform: rotate(3deg) translate(0px, -4px);
        box-shadow: 0 0 10px #007bff, 0 0 5px #007bff; /* Replace with your desired color */
      }
    `}</style>
  );
};

export default memo(ProgressBar);
