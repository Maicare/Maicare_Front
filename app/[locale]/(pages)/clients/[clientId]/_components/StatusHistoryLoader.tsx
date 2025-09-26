// StatusHistoryLoader.tsx
import React from 'react';

const StatusHistoryLoader = () => {
  return (
    <div className="w-full h-[287px] rounded-sm shadow-md p-4 bg-white">
      <div className="flex justify-between items-center">
        <div className="h-6 w-40 bg-slate-200 rounded animate-pulse"></div>
        <div className="h-8 w-24 bg-slate-200 rounded animate-pulse"></div>
      </div>
      <div className="mt-4 w-full p-2 flex flex-col gap-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="flex items-center justify-between p-3 bg-slate-50 rounded-md border border-slate-200 animate-pulse"
          >
            <div className="flex flex-col gap-2">
              <div className="h-4 w-48 bg-slate-200 rounded"></div>
              <div className="h-3 w-32 bg-slate-200 rounded"></div>
            </div>
            <div className="h-3 w-12 bg-slate-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusHistoryLoader;