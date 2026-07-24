import React, { useState } from 'react';
import { X, Upload, MapPin } from 'lucide-react';
import { CATEGORIES, SEVERITIES } from '../../utils/constants';
import { useAppContext } from '../../context/AppContext';
import uploadIcon from "../assets/upload.jpg";
const ReportModal = ({ location, onClose }) => {
  const { addReport } = useAppContext();
  const [formData, setFormData] = useState({
    title: '',
    category: CATEGORIES[0],
    severity: 'Medium',
    description: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newReport = {
      ...formData,
      status: 'Pending',
      latitude: location.lat,
      longitude: location.lng,
      imageUrl: null,
    };
    addReport(newReport);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-bold text-gray-800">Report an Issue</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="bg-blue-50 p-3 rounded-lg flex items-center gap-3 text-sm text-blue-800">
            <MapPin size={18} className="text-blue-500" />
            <span>
              Location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Issue Title</label>
            <input
              type="text"
              required
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="e.g. Large pothole on Main St"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
              <select
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                value={formData.severity}
                onChange={e => setFormData({ ...formData, severity: e.target.value })}
              >
                {SEVERITIES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              required
              rows={3}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
              placeholder="Provide details about the issue..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Photo (Optional)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer">
              <Upload className="mx-auto text-gray-400 mb-2" size={24} />
              <span className="text-sm text-gray-500">Click to upload or drag and drop</span>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;
