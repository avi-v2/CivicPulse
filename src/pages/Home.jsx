import React, { useState, useEffect, useRef, useMemo } from 'react';
import Navbar from '../components/Navbar';
import FilterBar from '../components/FilterBar';
import StatsCard from '../components/StatsCard';
import MapView from '../components/MapView';
import Sidebar from '../components/Sidebar';
import { db } from '../firebase/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';

export default function Home() {
  const [reports, setReports] = useState([]);
  const [filters, setFilters] = useState({
    category: 'All',
    status: 'All',
    severity: 'All'
  });
  const [selectedReport, setSelectedReport] = useState(null);
  const mapRef = useRef();

  useEffect(() => {
    const q = query(collection(db, 'reports'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reportsData = [];
      snapshot.forEach((doc) => {
        reportsData.push({ id: doc.id, ...doc.data() });
      });
      setReports(reportsData);
    }, (error) => {
      console.error("Error fetching reports:", error);
    });

    return () => unsubscribe();
  }, []);

  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      if (filters.category !== 'All' && report.category !== filters.category) return false;
      if (filters.status !== 'All' && report.status !== filters.status) return false;
      if (filters.severity !== 'All' && report.severity !== filters.severity) return false;
      return true;
    });
  }, [reports, filters]);

  const handleReportClick = (report) => {
    setSelectedReport(report);
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
      <Navbar />
      
      <main className="flex-1 flex overflow-hidden p-4 gap-4">
        {/* Left Sidebar - Filters & Stats */}
        <div className="w-72 flex flex-col gap-4 flex-shrink-0">
          <FilterBar filters={filters} setFilters={setFilters} />
          <StatsCard reports={filteredReports} />
        </div>

        {/* Center - Map Area */}
        <div className="flex-1 h-full min-w-0">
          <MapView 
            reports={filteredReports} 
            mapRef={mapRef}
            selectedReport={selectedReport}
            setSelectedReport={setSelectedReport}
          />
        </div>

        {/* Right Sidebar - Recent Reports */}
        <div className="w-72 flex-shrink-0 rounded-xl overflow-hidden shadow-sm border border-slate-200">
          <Sidebar reports={filteredReports} onReportClick={handleReportClick} />
        </div>
      </main>
    </div>
  );
}
