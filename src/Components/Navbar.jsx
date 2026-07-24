import React from 'react';
import { Activity, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

function Navbar(){


    return(
        <nav className='bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm'>
            <Link to="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
        <Activity className="h-6 w-6 text-blue-600" />
        <span className="text-xl font-bold text-slate-800">CivicPulse</span>
      </Link>
      <div className="flex items-center gap-4 text-sm font-medium">
        <link to="/admin" className="flex items-center gap-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors">
        <ShieldCheck className="w-4 h-4" />
        Admin Dashboard</link>

      </div>
        </nav>
    )
}
export default Navbar