import Navbar from '../components/Navbar';
import React,{useState} from 'react';
import FilterBar from '../Components/FilterBar';
function Home(){
    const [filters, setFilters] = useState({
    category: 'All',
    status: 'All',
    severity: 'All'
  });
  const [reports, setReports] = useState([]);
    return(
        <>
            <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
            <Navbar/>

            <main className='flex-1 flex overflow-hidden p-4 gap-4 '>
                <div className="w-72 flex flex-col gap-4 flex-shrink-0">
          <FilterBar filters={filters} setFilters={setFilters} />
        </div>
            </main>
            </div>
        </>
    )
}
export default Home