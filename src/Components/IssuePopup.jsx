import React, { useState, useEffect } from 'react';
import { Popup } from 'react-map-gl/maplibre';
import { formatDistanceToNow } from 'date-fns';
import { Clock, Info, CheckCircle2, ThumbsUp } from 'lucide-react';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export default function IssuePopup({ report, onClose }) {
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [isUpvoting, setIsUpvoting] = useState(false);

  useEffect(() => {
    const upvotedReports = JSON.parse(localStorage.getItem('upvotedReports') || '{}');
    if (upvotedReports[report.id]) {
      setHasUpvoted(true);
    }
  }, [report.id]);

  const handleUpvote = async () => {
    if (hasUpvoted || isUpvoting) return;
    setIsUpvoting(true);

    try {
      const reportRef = doc(db, 'reports', report.id);
      await updateDoc(reportRef, {
        upvotes: increment(1)
      });
      
      const upvotedReports = JSON.parse(localStorage.getItem('upvotedReports') || '{}');
      upvotedReports[report.id] = true;
      localStorage.setItem('upvotedReports', JSON.stringify(upvotedReports));
      
      setHasUpvoted(true);
    } catch (error) {
      console.error("Failed to upvote", error);
    } finally {
      setIsUpvoting(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Resolved': return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'In Progress': return <Clock className="w-4 h-4 text-orange-600" />;
      default: return <Clock className="w-4 h-4 text-red-600" />;
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'High': return 'bg-red-100 text-red-700 border-red-200';
      case 'Medium': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  return (
    <Popup
      longitude={report.longitude}
      latitude={report.latitude}
      anchor="top"
      onClose={onClose}
      closeOnClick={false}
      className="z-10"
      maxWidth="300px"
    >
      <div className="w-[280px]">
        {report.imageUrl ? (
          <img 
            src={report.imageUrl} 
            alt={report.title} 
            className="w-full h-32 object-cover"
          />
        ) : (
          <div className="w-full h-24 bg-slate-100 flex items-center justify-center border-b border-slate-200">
            <Info className="w-8 h-8 text-slate-300" />
          </div>
        )}
        
        <div className="p-4">
          <div className="flex justify-between items-start gap-2 mb-2">
            <h3 className="font-bold text-slate-800 text-sm leading-tight">{report.title}</h3>
            <span className={`text-[10px] px-2 py-0.5 rounded border font-medium ${getSeverityBadge(report.severity)}`}>
              {report.severity}
            </span>
          </div>
          
          <p className="text-xs text-slate-600 mb-3 line-clamp-3">
            {report.description}
          </p>
          
          <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100 mb-3">
            <div className="flex items-center gap-1 font-medium text-slate-700">
              {getStatusIcon(report.status)}
              {report.status}
            </div>
            
            <span className="text-slate-400">
              {report.createdAt && report.createdAt.toDate 
                ? formatDistanceToNow(report.createdAt.toDate(), { addSuffix: true }) 
                : 'Just now'}
            </span>
          </div>
          
          <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-100">
            <div className="text-[10px] text-slate-500 font-medium">
              {report.category}
            </div>
            
            <button
              onClick={handleUpvote}
              disabled={hasUpvoted || isUpvoting}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                hasUpvoted 
                  ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <ThumbsUp className={`w-3.5 h-3.5 ${hasUpvoted ? 'fill-current' : ''}`} />
              {report.upvotes || 0}
            </button>
          </div>
        </div>
      </div>
    </Popup>
  );
}
