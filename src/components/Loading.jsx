import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center space-x-1">
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className="w-2 h-2 bg-gray-400 rounded-full"
          style={{
            animation: `jumpingDot 0.9s ease-in-out ${index * 0.1}s infinite`,
          }}
        ></div>
      ))}
    </div>
  );
};

export default Loading;
