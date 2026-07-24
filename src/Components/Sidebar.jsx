import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MapPin, ThumbsUp } from 'lucide-react';

function Sidebar({ reports, onReportClick }) {
    const recentReports = [...reports].sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return timeB - timeA;
    }).slice(0, 10);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Resolved': return 'bg-green-100 text-green-800';
            case 'In Progress': return 'bg-orange-100 text-orange-800';
            default: return 'bg-red-100 text-red-800';
        }
    };

    return (
        <>
            <div>
                <div className="p-4 border-b border-slate-100 sticky top-0 bg-white/90 backdrop-blur z-10">
                    <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-500" />
                        Recent Reports
                    </h2>
                </div>
<div className="p-4 space-y-3">
        {recentReports.length === 0 ? (
          <div className="text-sm text-slate-500 text-center py-8">
            No reports found.
          </div>
        ) : (
          recentReports.map(report => (
            <div 
              key={report.id} 
              onClick={() => onReportClick(report)}
              className="p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors"
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-medium text-slate-800 text-sm line-clamp-1">{report.title}</h3>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${getStatusColor(report.status)}`}>
                  {report.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2 mb-2">
                {report.description}
              </p>
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <div className="flex items-center gap-2">
                  <span>{report.category}</span>
                  {(report.upvotes > 0) && (
                    <span className="flex items-center gap-0.5 text-blue-600 font-medium bg-blue-50 px-1.5 py-0.5 rounded">
                      <ThumbsUp className="w-3 h-3" />
                      {report.upvotes}
                    </span>
                  )}
                </div>
                <span>
                  {report.createdAt && report.createdAt.toDate 
                    ? formatDistanceToNow(report.createdAt.toDate(), { addSuffix: true }) 
                    : 'Just now'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
            
            </div>
        </>
    )
}