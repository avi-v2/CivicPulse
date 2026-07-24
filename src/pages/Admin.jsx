import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { db } from '../firebase/firebase';
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { CheckCircle2, Clock, MapPin, AlertCircle, Trash2, RotateCcw, ThumbsUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function Admin() {
  const [reports, setReports] = useState([]);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'reports'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reportsData = [];
      snapshot.forEach((docSnap) => {
        reportsData.push({ id: docSnap.id, ...docSnap.data() });
      });
      setReports(reportsData);
    });

    return () => unsubscribe();
  }, []);

  const markResolved = async (reportId) => {
    try {
      const reportRef = doc(db, 'reports', reportId);
      await updateDoc(reportRef, { status: 'Resolved' });
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Failed to update status");
    }
  };

  const markInProgress = async (reportId) => {
    try {
      const reportRef = doc(db, 'reports', reportId);
      await updateDoc(reportRef, { status: 'In Progress' });
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Failed to update status");
    }
  };

  const deleteReport = async (reportId) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    try {
      const reportRef = doc(db, 'reports', reportId);
      await deleteDoc(reportRef);
    } catch (error) {
      console.error("Failed to delete report", error);
      alert("Failed to delete report");
    }
  };

  const resetAllReports = async () => {
    if (!window.confirm("WARNING: This will permanently delete ALL reports and reset the count to zero. Are you sure?")) return;
    setIsResetting(true);
    try {
      await Promise.all(reports.map(report => deleteDoc(doc(db, 'reports', report.id))));
    } catch (error) {
      console.error("Failed to reset reports", error);
      alert("Failed to reset reports");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
            <p className="text-sm text-slate-500">Manage and resolve reported civic issues.</p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm flex gap-4 text-sm font-medium">
              <span className="text-slate-600">Total: {reports.length}</span>
              <span className="text-red-600">Pending: {reports.filter(r => r.status === 'Pending').length}</span>
              <span className="text-green-600">Resolved: {reports.filter(r => r.status === 'Resolved').length}</span>
            </div>
            <button 
              onClick={resetAllReports}
              disabled={isResetting || reports.length === 0}
              className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg border border-red-200 hover:bg-red-100 transition-colors font-medium text-sm disabled:opacity-50"
            >
              <RotateCcw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
              Reset All
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
              <tr>
                <th className="px-6 py-3">Report Details</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Severity</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-800 mb-1">{report.title}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                      <MapPin className="w-3 h-3" />
                      {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
                    </div>
                    <div className="text-xs text-slate-400 flex items-center justify-between">
                      <span>{report.createdAt?.toDate ? formatDistanceToNow(report.createdAt.toDate(), { addSuffix: true }) : 'Recently'}</span>
                      {report.upvotes > 0 && (
                        <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-medium">
                          <ThumbsUp className="w-3 h-3" /> {report.upvotes}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2 py-1 bg-slate-100 rounded text-slate-600 text-xs font-medium">
                      {report.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                      report.severity === 'High' ? 'text-red-600' :
                      report.severity === 'Medium' ? 'text-orange-600' : 'text-yellow-600'
                    }`}>
                      <AlertCircle className="w-3 h-3" />
                      {report.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                      report.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                      report.status === 'In Progress' ? 'bg-orange-100 text-orange-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {report.status === 'Resolved' && <CheckCircle2 className="w-3 h-3" />}
                      {report.status === 'In Progress' && <Clock className="w-3 h-3" />}
                      {report.status === 'Pending' && <Clock className="w-3 h-3" />}
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                    {report.status !== 'Resolved' && (
                      <>
                        {report.status === 'Pending' && (
                          <button 
                            onClick={() => markInProgress(report.id)}
                            className="text-xs font-medium px-3 py-1.5 bg-orange-50 text-orange-600 border border-orange-200 rounded hover:bg-orange-100 transition-colors"
                          >
                            Mark In Progress
                          </button>
                        )}
                        <button 
                          onClick={() => markResolved(report.id)}
                          className="text-xs font-medium px-3 py-1.5 bg-green-50 text-green-600 border border-green-200 rounded hover:bg-green-100 transition-colors"
                        >
                          Resolve
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => deleteReport(report.id)}
                      className="text-xs font-medium px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100 transition-colors"
                      title="Delete Report"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              
              {reports.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    No reports found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
