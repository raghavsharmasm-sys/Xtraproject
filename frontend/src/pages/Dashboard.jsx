import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle, Clock, AlertCircle, ListTodo, Activity, ArrowRight, TrendingUp, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const res = await axios.get('/api/dashboard', config);
        setStats(res.data);
      } catch (error) {
        console.error('Error fetching dashboard stats', error);
      }
    };
    fetchStats();
  }, [user]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  if (!stats) return (
    <div className="space-y-8 p-6">
      <div className="h-12 bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl w-1/3 animate-pulse"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl animate-pulse"></div>)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 h-64 bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl animate-pulse"></div>
        <div className="h-64 bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl animate-pulse"></div>
      </div>
    </div>
  );

  const StatCard = ({ title, value, icon: Icon, colorClass, bgClass, trend }) => (
    <motion.div variants={itemVariants} className="glass-card group">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:rotate-6 ${bgClass} ${colorClass}`}>
          <Icon size={28} />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg text-xs font-bold">
            <TrendingUp size={12} /> {trend}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-slate-500 dark:text-slate-400 font-semibold text-sm uppercase tracking-wider">{title}</h3>
        <p className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">{value}</p>
      </div>
    </motion.div>
  );

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-10"
    >
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-bold uppercase tracking-widest">Overview</span>
            <span className="text-slate-400 dark:text-slate-600">•</span>
            <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm font-medium">
              <Calendar size={14} /> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-none">
            Welcome, <span className="text-gradient">{user.name.split(' ')[0]}</span>!
          </h1>
        </div>
        <Link to="/projects" className="btn-primary group">
          New Project <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Tasks" value={stats.total} icon={ListTodo} colorClass="text-primary-600" bgClass="bg-primary-100/50 dark:bg-primary-900/20" trend="+12%" />
        <StatCard title="In Progress" value={stats.pending} icon={Clock} colorClass="text-amber-600" bgClass="bg-amber-100/50 dark:bg-amber-900/20" />
        <StatCard title="Completed" value={stats.completed} icon={CheckCircle} colorClass="text-emerald-600" bgClass="bg-emerald-100/50 dark:bg-emerald-900/20" trend="+5%" />
        <StatCard title="Overdue" value={stats.overdue} icon={AlertCircle} colorClass="text-rose-600" bgClass="bg-rose-100/50 dark:bg-rose-900/20" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div variants={itemVariants} className="lg:col-span-2 glass rounded-[2.5rem] p-10 flex flex-col justify-center items-start relative overflow-hidden group shadow-2xl shadow-primary-500/5">
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary-400/10 dark:bg-primary-400/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-primary-400/20 transition-colors duration-700"></div>
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-accent-400/10 dark:bg-accent-400/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-accent-400/20 transition-colors duration-700"></div>
          
          <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 mb-4 relative z-10 tracking-tight">Boost your productivity</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-lg relative z-10 text-xl leading-relaxed">
            Manage your projects effectively with Ethara. Track time, collaborate with team members, and hit your deadlines with ease.
          </p>
          <div className="flex gap-4 relative z-10">
            <Link to="/projects" className="btn-primary">
              Manage Projects
            </Link>
            <button className="btn-secondary">
              View Analytics
            </button>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass rounded-[2.5rem] p-8 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Activity size={24} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Activity</h2>
            </div>
            <button className="text-sm font-bold text-primary-600 dark:text-primary-400 hover:underline">See All</button>
          </div>
          
          <div className="space-y-6 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
            {stats.recentActivity && stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((task, idx) => (
                <div key={task._id} className="relative pl-8 pb-6 border-l-2 border-slate-100 dark:border-slate-800 last:border-transparent last:pb-0">
                  <div className="absolute left-[-9px] top-1 w-4 h-4 rounded-full border-4 border-white dark:border-slate-950 bg-primary-500 shadow-sm shadow-primary-500/50"></div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate leading-tight mb-1">{task.title}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
                      {task.project_id?.name || 'General'}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">• {task.status}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4 border border-slate-100 dark:border-slate-800">
                  <Activity size={24} className="text-slate-300 dark:text-slate-700" />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium italic">No activity yet.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;

