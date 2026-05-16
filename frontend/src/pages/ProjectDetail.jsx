import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Plus, UserPlus, Calendar, Clock, X, MoreVertical, CheckCircle2, Circle } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectDetail = () => {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', due_date: '', assigned_to: '' });
  const [newMemberId, setNewMemberId] = useState('');
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, [id]);

  const fetchTasks = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.get(`/api/tasks?projectId=${id}`, config);
      setTasks(res.data);
    } catch (error) {
      toast.error('Error fetching tasks');
      console.error('Error fetching tasks', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    const promise = axios.post('/api/tasks', { ...newTask, project_id: id }, { headers: { Authorization: `Bearer ${user.token}` } });
    
    toast.promise(promise, {
      loading: 'Creating task...',
      success: () => {
        setShowTaskModal(false);
        setNewTask({ title: '', description: '', due_date: '', assigned_to: '' });
        fetchTasks();
        return 'Task created successfully!';
      },
      error: 'Error creating task'
    });
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    const promise = axios.post(`/api/projects/${id}/members`, { userId: newMemberId }, { headers: { Authorization: `Bearer ${user.token}` } });
    
    toast.promise(promise, {
      loading: 'Adding member...',
      success: () => {
        setShowMemberModal(false);
        setNewMemberId('');
        return 'Member added successfully!';
      },
      error: (err) => err.response?.data?.message || 'Error adding member'
    });
  };

  const updateTaskStatus = async (taskId, status) => {
    const promise = axios.put(`/api/tasks/${taskId}`, { status }, { headers: { Authorization: `Bearer ${user.token}` } });
    
    toast.promise(promise, {
      loading: 'Updating status...',
      success: () => {
        fetchTasks();
        return 'Task status updated!';
      },
      error: 'Failed to update task. You might not have permission.'
    });
  };

  const columns = ['Todo', 'In Progress', 'Completed'];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", duration: 0.5, bounce: 0.3 } },
    exit: { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2 } }
  };

  if (isLoading) return (
    <div className="p-8 space-y-8 h-full">
      <div className="h-24 bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl w-full animate-pulse"></div>
      <div className="flex gap-6 h-full overflow-hidden">
        {[1, 2, 3].map(i => <div key={i} className="flex-1 h-[600px] bg-slate-200/30 dark:bg-slate-800/30 rounded-[2.5rem] animate-pulse"></div>)}
      </div>
    </div>
  );

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8 h-full flex flex-col">
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 glass rounded-[2.5rem] p-8 shadow-2xl shadow-primary-500/5">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-[10px] font-black uppercase tracking-widest">Workspace</span>
            <span className="text-slate-300 dark:text-slate-700 font-bold">•</span>
            <span className="text-slate-500 dark:text-slate-400 text-sm font-bold tracking-tight">Active Sprint</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Task Board</h1>
        </div>
        {user.role === 'Admin' && (
          <div className="flex gap-3 w-full md:w-auto">
            <button onClick={() => setShowMemberModal(true)} className="btn-secondary group">
              <UserPlus size={18} className="transition-transform group-hover:-rotate-12" /> Add Member
            </button>
            <button onClick={() => setShowTaskModal(true)} className="btn-primary group">
              <Plus size={20} className="transition-transform group-hover:rotate-90" /> Create Task
            </button>
          </div>
        )}
      </motion.div>

      <motion.div variants={itemVariants} className="flex gap-6 overflow-x-auto pb-8 flex-1 min-h-[600px] custom-scrollbar">
        {columns.map(status => (
          <div key={status} className="flex-1 min-w-[350px] bg-slate-100/50 dark:bg-slate-900/40 rounded-[2.5rem] p-6 border border-slate-200/50 dark:border-slate-800/50 flex flex-col backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6 px-2">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${status === 'Todo' ? 'bg-slate-400' : status === 'In Progress' ? 'bg-primary-500' : 'bg-emerald-500'} shadow-lg shadow-current/20`}></div>
                <h3 className="font-black text-slate-800 dark:text-slate-100 text-lg tracking-tight uppercase tracking-widest">{status}</h3>
              </div>
              <span className="bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs px-3 py-1.5 rounded-full font-black shadow-sm border border-slate-100 dark:border-slate-700">
                {tasks.filter(t => t.status === status).length}
              </span>
            </div>
            
            <div className="space-y-4 flex-1 overflow-y-auto pr-2 pb-4 custom-scrollbar">
              {tasks.filter(t => t.status === status).map(task => (
                <motion.div 
                  layoutId={task._id}
                  key={task._id} 
                  whileHover={{ scale: 1.02 }}
                  className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 group hover:shadow-2xl hover:shadow-primary-500/10 transition-all cursor-pointer relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-black text-slate-800 dark:text-slate-100 text-base leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{task.title}</h4>
                    <button className="text-slate-300 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                  
                  {task.description && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5 line-clamp-2 leading-relaxed font-medium">
                      {task.description}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-2 mb-5">
                    {task.due_date && (
                      <div className="flex items-center gap-1.5 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 px-3 py-1.5 rounded-xl font-bold text-[10px] uppercase tracking-widest">
                        <Calendar size={12} />
                        {new Date(task.due_date).toLocaleDateString()}
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-xl font-bold text-[10px] uppercase tracking-widest">
                      <Circle size={12} className="fill-current" />
                      {task.assigned_to?.name || 'Unassigned'}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-50 dark:border-slate-700/50 flex items-center justify-between">
                    <select 
                      value={task.status} 
                      onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                      className="text-[10px] font-black uppercase tracking-[0.1em] bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-primary-500 outline-none border-none cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors"
                      onClick={e => e.stopPropagation()}
                    >
                      {columns.map(col => <option key={col} value={col}>Move to {col}</option>)}
                    </select>
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                      <CheckCircle2 size={16} className={task.status === 'Completed' ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-600'} />
                    </div>
                  </div>
                </motion.div>
              ))}
              {tasks.filter(t => t.status === status).length === 0 && (
                <div className="h-32 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] flex flex-col items-center justify-center text-sm text-slate-400 dark:text-slate-600 font-bold group hover:border-primary-500/50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center mb-2">
                    <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                  </div>
                  No tasks here
                </div>
              )}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {showTaskModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowTaskModal(false)} className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" />
            <motion.div variants={modalVariants} initial="hidden" animate="show" exit="exit" className="glass bg-white/95 dark:bg-slate-900/95 p-10 rounded-[2.5rem] w-full max-w-lg relative z-10 shadow-3xl">
              <button onClick={() => setShowTaskModal(false)} className="absolute top-8 right-8 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"><X size={24} /></button>
              
              <div className="mb-8">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Create Task</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Add a new item to your board.</p>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Task Title</label>
                  <input type="text" className="input-field" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} required placeholder="e.g. Design homepage" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Description</label>
                  <textarea className="input-field" rows="3" value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} placeholder="What needs to be done?"></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Due Date</label>
                    <input type="date" className="input-field" value={newTask.due_date} onChange={e => setNewTask({...newTask, due_date: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Assigned To</label>
                    <input type="text" className="input-field" placeholder="User ID" value={newTask.assigned_to} onChange={e => setNewTask({...newTask, assigned_to: e.target.value})} />
                  </div>
                </div>
                <div className="flex justify-end gap-4 mt-10">
                  <button type="button" onClick={() => setShowTaskModal(false)} className="btn-secondary flex-1 py-4">Cancel</button>
                  <button type="submit" className="btn-primary flex-1 py-4">Create Task</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMemberModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowMemberModal(false)} className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" />
            <motion.div variants={modalVariants} initial="hidden" animate="show" exit="exit" className="glass bg-white/95 dark:bg-slate-900/95 p-10 rounded-[2.5rem] w-full max-w-lg relative z-10 shadow-3xl">
              <button onClick={() => setShowMemberModal(false)} className="absolute top-8 right-8 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"><X size={24} /></button>
              
              <div className="mb-8">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Add Member</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Invite someone to this project.</p>
              </div>

              <form onSubmit={handleAddMember} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">User ID</label>
                  <input type="text" className="input-field" placeholder="Enter User Object ID" value={newMemberId} onChange={e => setNewMemberId(e.target.value)} required />
                </div>
                <div className="flex justify-end gap-4 mt-10">
                  <button type="button" onClick={() => setShowMemberModal(false)} className="btn-secondary flex-1 py-4">Cancel</button>
                  <button type="submit" className="btn-primary flex-1 py-4">Add Member</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProjectDetail;

