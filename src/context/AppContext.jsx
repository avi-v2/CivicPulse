import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockReports } from '../services/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [reports, setReports] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [filters, setFilters] = useState({
    category: 'All',
    status: 'All',
    severity: 'All',
    search: ''
  });

  useEffect(() => {
    setReports(mockReports);
  }, []);

  const addReport = (newReport) => {
    setReports(prev => [
      { ...newReport, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString() },
      ...prev
    ]);
  };

  const updateReportStatus = (id, newStatus) => {
    setReports(prev => prev.map(report => 
      report.id === id ? { ...report, status: newStatus } : report
    ));
  };

  const deleteReport = (id) => {
    setReports(prev => prev.filter(report => report.id !== id));
  };

  const filteredReports = reports.filter(report => {
    const matchCategory = filters.category === 'All' || report.category === filters.category;
    const matchStatus = filters.status === 'All' || report.status === filters.status;
    const matchSeverity = filters.severity === 'All' || report.severity === filters.severity;
    const matchSearch = report.title.toLowerCase().includes(filters.search.toLowerCase()) || 
                        report.description.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchCategory && matchStatus && matchSeverity && matchSearch;
  });

  return (
    <AppContext.Provider value={{
      reports: filteredReports,
      allReports: reports,
      isAdmin,
      setIsAdmin,
      filters,
      setFilters,
      addReport,
      updateReportStatus,
      deleteReport
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
