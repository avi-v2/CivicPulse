import React, { useRef, useState, useCallback, useEffect } from 'react';
import Map, { NavigationControl, Source, Layer } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import IssueMarker from './IssueMarker';
import IssuePopup from './IssuePopup';
import ReportForm from './ReportForm';
import MapSearch from './MapSearch';

const MAPTILER_KEY = 'SAJcgN11FF9TBJH3vpCZ';

const centerLng = 77.2090;
const centerLat = 28.6139;
const radius = 0.35; // reverted back to original size for the clear hole
const circleCoords = [];
for (let i = 0; i <= 64; i++) {
  const angle = (i * 360) / 64;
  const radians = angle * (Math.PI / 180);
  const x = centerLng + radius * Math.cos(radians);
  const y = centerLat + radius * Math.sin(radians);
  circleCoords.push([x, y]);
}
// Ensure it's a closed ring
circleCoords[64] = circleCoords[0];

const maskGeoJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]],
          circleCoords
        ]
      }
    }
  ]
};

const maskLayerStyle = {
  id: 'mask-layer',
  type: 'fill',
  paint: {
    'fill-color': '#1e293b',
    'fill-opacity': 0.5
  }
};

export default function MapView({ reports, mapRef, selectedReport, setSelectedReport }) {
  const [viewState, setViewState] = useState({
    longitude: 77.2090,
    latitude: 28.6139,
    zoom: 11,
    pitch: 45,
    bearing: 0
  });
  
  const [newReportLocation, setNewReportLocation] = useState(null);

  useEffect(() => {
    if (selectedReport && mapRef.current) {
      mapRef.current.flyTo({
        center: [selectedReport.longitude, selectedReport.latitude],
        zoom: 15,
        duration: 1500
      });
    }
  }, [selectedReport, mapRef]);

const handleMapClick = useCallback((e) => {
  console.log("CLICKED");

  if (e.originalEvent.target.closest(".maplibregl-marker")) return;

  setNewReportLocation({
    lng: e.lngLat.lng,
    lat: e.lngLat.lat
  });

  setSelectedReport(null);
}, [setSelectedReport]);
  const handleLocationSearch = (lng, lat) => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [lng, lat],
        zoom: 14,
        duration: 1500
      });
    }
  };

  return (
    <div className="relative w-full h-full bg-slate-100 overflow-hidden rounded-xl shadow-sm border border-slate-200">
      <MapSearch onLocationSelect={handleLocationSearch} />
      <Map
        ref={mapRef}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        onClick={handleMapClick}
        mapStyle={`https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`}
        interactiveLayerIds={['building']}
      >
        <Source id="mask-source" type="geojson" data={maskGeoJSON}>
          <Layer {...maskLayerStyle} />
        </Source>
        <NavigationControl position="top-right" />

        {reports.map(report => (
          <IssueMarker 
            key={report.id} 
            report={report} 
            onClick={setSelectedReport}
          />
        ))}

        {selectedReport && (
          <IssuePopup 
            report={selectedReport} 
            onClose={() => setSelectedReport(null)}
          />
        )}
      </Map>

      {newReportLocation && (
        <ReportForm 
          location={newReportLocation} 
          onClose={() => setNewReportLocation(null)} 
        />
      )}
    </div>
  );
}
