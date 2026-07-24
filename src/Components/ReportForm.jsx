import React, { useState } from 'react';
import { db, storage } from '../firebase/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { X, Upload, Loader2 } from 'lucide-react';

const CATEGORIES = ['Pothole', 'Garbage', 'Water Leakage', 'Street Light', 'Sewage', 'Other'];
const SEVERITIES = ['Low', 'Medium', 'High'];

export default function ReportForm({ location, onClose }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Pothole',
    description: '',
    severity: 'Medium'
  });
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;
    onClose();
    try {
      const docRef = await addDoc(collection(db, 'reports'), {
        ...formData,
        latitude: location.lat,
        longitude: location.lng,
        imageUrl: null,
        status: 'Pending',
        upvotes: 0,
        createdAt: serverTimestamp()
      });

      if (imageFile) {
        try {
          const { updateDoc } = await import('firebase/firestore');
          const fileRef = ref(storage, `reports/${docRef.id}_${imageFile.name}`);
          const uploadResult = await uploadBytes(fileRef, imageFile);
          const imageUrl = await getDownloadURL(uploadResult.ref);
          await updateDoc(docRef, { imageUrl });
        } catch (uploadError) {
          console.error("Background image upload failed:", uploadError);
        }
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Failed to submit report. Ensure Firebase config is correct.");
    }
  };

  return (
    <div className="absolute top-4 left-4 z-20 bg-white w-[350px] rounded-xl shadow-xl border border-slate-200 overflow-hidden flex flex-col">
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h2 className="font-semibold">Report an Issue</h2>
        <button onClick={onClose} className="hover:bg-blue-700 p-1 rounded-full transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Title</label>
          <input 
            type="text" 
            required
            placeholder="e.g. Large pothole on Main St"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            value={formData.title}
            onChange={e => setFormData(prev => ({...prev, title: e.target.value}))}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Category</label>
            <select 
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              value={formData.category}
              onChange={e => setFormData(prev => ({...prev, category: e.target.value}))}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Severity</label>
            <select 
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              value={formData.severity}
              onChange={e => setFormData(prev => ({...prev, severity: e.target.value}))}
            >
              {SEVERITIES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Description</label>
          <textarea 
            required
            rows="3"
            placeholder="Describe the issue in detail..."
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            value={formData.description}
            onChange={e => setFormData(prev => ({...prev, description: e.target.value}))}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Photo (Optional)</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg hover:bg-slate-50 transition-colors">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-8 w-8 text-slate-400" />
              <div className="flex text-sm text-slate-600 justify-center">
                <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                  <span>Upload a file</span>
                  <input 
                    type="file" 
                    className="sr-only" 
                    accept="image/*"
                    onChange={e => {
                      if(e.target.files && e.target.files[0]) {
                        setImageFile(e.target.files[0]);
                      }
                    }}
                  />
                </label>
              </div>
              <p className="text-xs text-slate-500">
                {imageFile ? imageFile.name : 'PNG, JPG, GIF up to 10MB'}
              </p>
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg shadow-sm transition-colors flex justify-center items-center gap-2 disabled:bg-blue-400"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Report'
          )}
        </button>
      </form>
    </div>
  );
}
