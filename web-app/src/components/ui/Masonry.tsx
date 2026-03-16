"use client";
import React, { ReactNode } from "react";

interface MasonryProps {
  children: ReactNode[];
  columns?: number;
  gap?: number;
  className?: string;
}

export const Masonry: React.FC<MasonryProps> = ({
  children,
  columns = 3,
  gap = 16,
  className = "",
}) => {
  const columnWrapper: ReactNode[][] = Array.from({ length: columns }, () => []);
  
  children.forEach((child, i) => {
    columnWrapper[i % columns].push(child);
  });

  return (
    <div className={`flex w-full ${className}`} style={{ gap: `${gap}px` }}>
      {columnWrapper.map((column, i) => (
        <div key={i} className="flex flex-col flex-1" style={{ gap: `${gap}px` }}>
          {column.map((item, j) => (
            <div key={j}>{item}</div>
          ))}
        </div>
      ))}
    </div>
  );
};
