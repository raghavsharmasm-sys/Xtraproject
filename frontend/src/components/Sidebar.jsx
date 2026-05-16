import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, LayoutDashboard, FolderKanban, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/projects', icon: FolderKanban, label: 'Projects' },
  ];

  return (
    <>
      {/* Mobile toggle button */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="md:hidden fixed top-4 left-4 z-50 p-2 glass rounded-xl shadow-lg text-slate-700 dark:text-slate-200"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={{ x: -300 }}
        animate={{ 
          x: isOpen ? 0 : -300,
          width: isCollapsed ? 80 : 280
        }}
        transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
        className="fixed md:sticky top-0 left-0 z-40 h-screen glass border-r border-slate-200/50 dark:border-slate-800/50 flex flex-col justify-between"
      >
        <div>
          <div className="h-24 flex items-center justify-between px-6 border-b border-slate-200/30 dark:border-slate-800/30">
            <NavLink to="/" className="flex items-center gap-3 overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-600 text-white flex items-center justify-center shadow-lg shadow-primary-500/30 shrink-0">
                <span className="text-xl font-bold">T</span>
              </div>
              {!isCollapsed && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xl font-bold text-gradient tracking-tight"
                >
                  Ethara
                </motion.span>
              )}
            </NavLink>
            
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:flex p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
            >
              {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>

          <div className="p-4 space-y-2 mt-4">
            {!isCollapsed && <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 px-4">Main Menu</div>}
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 font-medium group ${
                    isActive 
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 shadow-sm shadow-primary-100/50 dark:shadow-none' 
                      : 'text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100'
                  }`
                }
              >
                <item.icon size={22} className="shrink-0 transition-transform group-hover:scale-110" />
                {!isCollapsed && <span>{item.label}</span>}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-2`}>
            {!isCollapsed && <span className="text-xs font-semibold text-slate-400">Appearance</span>}
            <ThemeToggle />
          </div>

          <div className="bg-slate-50/50 dark:bg-slate-900/40 rounded-3xl p-4 border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md">
            <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : 'mb-4'}`}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 text-primary-700 dark:text-primary-300 flex items-center justify-center font-bold text-lg shrink-0 shadow-inner">
                {user.name.charAt(0).toUpperCase()}
              </div>
              {!isCollapsed && (
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{user.name}</p>
                  <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">{user.role}</p>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <button
                onClick={handleLogout}
                className="w-full py-2.5 flex items-center justify-center gap-2 text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all active:scale-95"
              >
                <LogOut size={16} />
                Logout
              </button>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;

