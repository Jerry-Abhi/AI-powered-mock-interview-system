import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Calendar, ChevronRight, CheckCircle2, Clock, Eye, Loader2 } from 'lucide-react';
import API from '../../services/api';

function History() {
  const [searchTerm, setSearchTerm] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get('/interview/history');
        if (res.data.success) {
          setHistory(res.data.history);
        }
      } catch (err) {
        console.error("Failed to fetch history", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredHistory = history.filter(h => 
    h.role.toLowerCase().includes(searchTerm.toLowerCase()) || 
    h.difficulty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Interview History</h1>
          <p className="text-slate-400">Review your past performance and access detailed feedback.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search roles..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-full md:w-64"
            />
          </div>
          <button className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="py-4 px-6 text-sm font-medium text-slate-400">Role & Type</th>
                <th className="py-4 px-6 text-sm font-medium text-slate-400">Date</th>
                <th className="py-4 px-6 text-sm font-medium text-slate-400">Status</th>
                <th className="py-4 px-6 text-sm font-medium text-slate-400">Score</th>
                <th className="py-4 px-6 text-sm font-medium text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-2" />
                    <p className="text-slate-400">Loading your history...</p>
                  </td>
                </tr>
              ) : filteredHistory.map((item, index) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  key={item._id} 
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="py-4 px-6">
                    <p className="font-medium text-white">{item.role}</p>
                    <p className="text-xs text-slate-400 mt-1">{item.difficulty} Level</p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-slate-300 text-sm">
                      <Calendar className="w-4 h-4 text-slate-400" /> {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-sm">
                      {item.status === 'completed' ? (
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 capitalize">
                          <CheckCircle2 className="w-3.5 h-3.5" /> {item.status}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 capitalize">
                          <Clock className="w-3.5 h-3.5" /> {item.status}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${item.finalScore >= 8 ? 'bg-emerald-400' : item.finalScore >= 6 ? 'bg-blue-400' : 'bg-orange-400'}`}
                          style={{ width: `${(item.finalScore || 0) * 10}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-white">{item.finalScore || '--'}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="inline-flex items-center gap-1 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors group-hover:underline">
                      Details <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filteredHistory.length === 0 && (
            <div className="py-12 text-center text-slate-400">
              No interviews found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default History;
