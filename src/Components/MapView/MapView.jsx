import React, { useState, useEffect, useRef } from 'react';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useAppContext } from '../../context/AppContext';
import { AlertTriangle, Trash2, Droplets, Lightbulb, Waves, TrafficCone, Info, MapPin } from 'lucide-react';
import { STATUS_COLORS, CATEGORY_ICONS } from '../../utils/constants';

const MAPTILER_KEY = 'SAJcgN11FF9TBJH3vpCZ';

const MapView = ({ onMapClick }) => {
  const { reports } = useAppContext();
  const [viewState, setViewState] = useState({
    longitude: 77.2090, // Delhi Longitude
    latitude: 28.6139,  // Delhi Latitude
    zoom: 12,
    pitch: 45,
    bearing: 0
  });

  const [selectedReport, setSelectedReport] = useState(null);
  const mapRef = useRef(null);

  const getIcon = (category) => {
    switch (category) {
      case 'Pothole': return <AlertTriangle size={20} />;
      case 'Garbage': return <Trash2 size={20} />;
      case 'Water Leakage': return <Droplets size={20} />;
      case 'Broken Streetlight': return <Lightbulb size={20} />;
      case 'Sewage': return <Waves size={20} />;
      case 'Traffic Signal': return <TrafficCone size={20} />;
      default: return <Info size={20} />;
    }
  };

  const getMarkerColor = (status) => {
    switch (status) {
      case 'Pending': return '#ef4444'; // red-500
      case 'In Progress': return '#f97316'; // orange-500
      case 'Resolved': return '#22c55e'; // green-500
      default: return '#3b82f6';
    }
  };

  return (
    <div className="w-full h-full relative">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        onClick={(e) => onMapClick(e.lngLat)}
        mapStyle={`https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`}
        attributionControl={false}
      >
        <NavigationControl position="bottom-right" />
        
        {reports.map((report) => (
          <Marker
            key={report.id}
            longitude={report.longitude}
            latitude={report.latitude}
            anchor="bottom"
            onClick={e => {
              e.originalEvent.stopPropagation();
              setSelectedReport(report);
            }}
          >
            <div 
              className="cursor-pointer transform hover:scale-110 transition-transform duration-200"
              style={{ color: getMarkerColor(report.status) }}
            >
              <MapPin size={32} fill="currentColor" className="text-white" />
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-white">
                {React.cloneElement(getIcon(report.category), { size: 14 })}
              </div>
            </div>
          </Marker>
        ))}

        {selectedReport && (
          <Popup
            longitude={selectedReport.longitude}
            latitude={selectedReport.latitude}
            anchor="top"
            onClose={() => setSelectedReport(null)}
            closeOnClick={false}
            className="rounded-xl shadow-xl z-50"
          >
            <div className="p-3 w-64">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">{selectedReport.title}</h3>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_COLORS[selectedReport.status]}`}>
                  {selectedReport.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{selectedReport.description}</p>
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-500 block">Category</span>
                  <span className="font-medium">{selectedReport.category}</span>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-500 block">Severity</span>
                  <span className="font-medium">{selectedReport.severity}</span>
                </div>
              </div>
              <p className="text-xs text-gray-400">
                Reported: {new Date(selectedReport.createdAt).toLocaleDateString()}
              </p>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
};

export default MapView;
