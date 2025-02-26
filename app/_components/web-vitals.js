'use client'
 
import { useReportWebVitals } from 'next/web-vitals'
 
import React from 'react';

const WebVitals = () => {
  return (
    <div>
      { 
        useReportWebVitals((metric) => {
        console.log(metric)
        })
      }
    </div>
  );
};

export default WebVitals;