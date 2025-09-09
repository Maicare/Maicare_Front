"use client";
import { useState, useEffect } from 'react';

interface TimeAgoProps {
  timestamp: Date | string | number;
  className?: string;
}

export const TimeAgo = ({ timestamp, className = '' }: TimeAgoProps) => {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    const calculateTimeAgo = () => {
      const date = new Date(timestamp);
      const now = new Date();
      const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      
      let interval = seconds / 31536000;
      if (interval > 1) {
        const years = Math.floor(interval);
        setTimeAgo(`${years} year${years > 1 ? 's' : ''} ago`);
        return;
      }
      
      interval = seconds / 2592000;
      if (interval > 1) {
        const months = Math.floor(interval);
        setTimeAgo(`${months} month${months > 1 ? 's' : ''} ago`);
        return;
      }
      
      interval = seconds / 86400;
      if (interval > 1) {
        const days = Math.floor(interval);
        setTimeAgo(`${days} day${days > 1 ? 's' : ''} ago`);
        return;
      }
      
      interval = seconds / 3600;
      if (interval > 1) {
        const hours = Math.floor(interval);
        setTimeAgo(`${hours} hour${hours > 1 ? 's' : ''} ago`);
        return;
      }
      
      interval = seconds / 60;
      if (interval > 1) {
        const minutes = Math.floor(interval);
        setTimeAgo(`${minutes} minute${minutes > 1 ? 's' : ''} ago`);
        return;
      }
      
      setTimeAgo('Just now');
    };

    calculateTimeAgo();
    
    // Update every minute for recent timestamps
    const intervalId = setInterval(calculateTimeAgo, 60000);
    
    return () => clearInterval(intervalId);
  }, [timestamp]);

  return (
    <span className={className} title={new Date(timestamp).toLocaleString()}>
      {timeAgo}
    </span>
  );
};

