import Navbar from '../components/Navbar';
import StatsCard from '../Components/StatsCard';
import React,{useState,useRef,useEffect,useMemo} from 'react';
import FilterBar from '../Components/FilterBar';
import MapView from "../Components/MapView/MapView";
function Home(){
  const [reports, setReports] = useState([]);
  const [filters, setFilters] = useState({
    category: 'All',
    status: 'All',
    severity: 'All'
  });
  const [selectedReport, setSelectedReport] = useState(null);
  const mapRef = useRef();

    const filteredReports = useMemo(() => {
    return reports.filter(report => {
      if (filters.category !== 'All' && report.category !== filters.category) return false;
      if (filters.status !== 'All' && report.status !== filters.status) return false;
      if (filters.severity !== 'All' && report.severity !== filters.severity) return false;
      return true;
    });
  }, [reports, filters]);
    return(
        <>
            <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
            <Navbar/>

            <main className='flex-1 flex overflow-hidden p-4 gap-4 '>
                <div className="w-72 flex flex-col gap-4 flex-shrink-0">
          <FilterBar filters={filters} setFilters={setFilters} />
          <StatsCard reports={filteredReports} />
        </div>
         <div className="flex-1 h-full min-w-0">
          <MapView 
            reports={filteredReports} 
            mapRef={mapRef}
            selectedReport={selectedReport}
            setSelectedReport={setSelectedReport}
          />
        </div>
            </main>
            </div>
        </>
    )
}
export default Home