import React from 'react';
import { Marker } from 'react-map-gl/maplibre';

export default function IssueMarker({ report, onClick }) {
  const getMarkerColor = (status) => {
    switch (status) {
      case 'Resolved': return '#22c55e'; // Green
      case 'In Progress': return '#f97316'; // Orange
      default: return '#ef4444'; // Red (Pending)
    }
  };

  return (
    <Marker 
      longitude={report.longitude} 
      latitude={report.latitude} 
      anchor="bottom"
      onClick={e => {
        e.originalEvent.stopPropagation();
        onClick(report);
      }}
    >
      <svg 
        height="32" 
        viewBox="0 0 24 24" 
        style={{
          fill: getMarkerColor(report.status),
          stroke: 'white',
          strokeWidth: 2,
          cursor: 'pointer',
          filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.3))'
        }}
      >
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
      </svg>
    </Marker>
  );
}
