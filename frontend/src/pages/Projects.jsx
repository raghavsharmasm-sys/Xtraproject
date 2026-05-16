import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Plus, FolderKanban, Users, X, LayoutTemplate, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.get('/api/projects', config);
      setProjects(res.data);
    } catch (error) {
      toast.error('Error fetching projects');
      console.error('Error fetching projects', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    const promise = axios.post('/api/projects', { name, description }, { headers: { Authorization: `Bearer ${user.token}` } });
    
    toast.promise(promise, {
      loading: 'Creating project...',
      success: () => {
        setShowModal(false);
        setName('');
        setDescription('');
        fetchProjects();
        return 'Project created successfully!';
      },
      error: 'Error creating project'
    });
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
    <div className="p-8 space-y-8">
      <div className="h-12 bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl w-1/4 animate-pulse"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-64 bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl animate-pulse"></div>)}
      </div>
    </div>
  );

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-10">
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Projects</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-3 text-lg font-medium tracking-tight">Manage and oversee all your workspaces.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search projects..." 
              className="input-field pl-11 py-2.5 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {user.role === 'Admin' && (
            <button onClick={() => setShowModal(true)} className="btn-primary whitespace-nowrap">
              <Plus size={20} /> New Project
            </button>
          )}
        </div>
      </motion.div>

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <motion.div variants={itemVariants} key={project._id}>
              <Link to={`/projects/${project._id}`} className="glass-card group block h-full flex flex-col p-8 rounded-[2rem] border border-slate-200/40 dark:border-slate-800/40 shadow-2xl shadow-primary-500/5">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-500/10 to-accent-500/10 dark:from-primary-500/20 dark:to-accent-500/20 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 shadow-inner">
                    <LayoutTemplate size={28} />
                  </div>
                  <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 group-hover:text-gradient transition-all leading-tight tracking-tight">{project.name}</h2>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-base mb-8 line-clamp-2 leading-relaxed font-medium">{project.description || 'Seamlessly manage your team tasks and project milestones in one unified workspace.'}</p>
                
                <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500">
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                    {project.members?.length > 3 && (
                      <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-[10px] font-bold text-primary-600 dark:text-primary-400">
                        +{project.members.length - 3}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 px-3 py-1.5 rounded-xl font-bold text-xs uppercase tracking-widest border border-slate-200/50 dark:border-slate-800/50">
                    <Users size={14} className="text-primary-500" />
                    <span>{project.members?.length || 0} Members</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div variants={itemVariants} className="text-center py-24 glass rounded-[3rem] border-dashed border-2 border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/20">
          <div className="w-24 h-24 bg-slate-50 dark:bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
            <FolderKanban size={48} className="text-slate-300 dark:text-slate-700" />
          </div>
          <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">No projects found</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-4 text-xl max-w-md mx-auto leading-relaxed">
            {searchTerm ? "We couldn't find any projects matching your search." : "Get started by creating a new project to organize your team's work."}
          </p>
          {user.role === 'Admin' && !searchTerm && (
            <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2 mx-auto mt-10 text-lg py-4 px-8">
              <Plus size={24} /> Create Your First Project
            </button>
          )}
        </motion.div>
      )}

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" />
            <motion.div variants={modalVariants} initial="hidden" animate="show" exit="exit" className="glass bg-white/95 dark:bg-slate-900/95 p-10 rounded-[2.5rem] w-full max-w-lg relative z-10 shadow-3xl">
              <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"><X size={24} /></button>
              
              <div className="mb-8">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">New Project</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Create a workspace for your team.</p>
              </div>

              <form onSubmit={handleCreateProject} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Project Name</label>
                  <input type="text" className="input-field" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Website Redesign" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Description</label>
                  <textarea className="input-field" rows="4" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What's the goal of this project?"></textarea>
                </div>
                <div className="flex justify-end gap-4 mt-10">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1 py-4">Cancel</button>
                  <button type="submit" className="btn-primary flex-1 py-4">Create Project</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Projects;

