import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Dumbbell, Utensils, Activity, MessageCircle, BarChart, Home, Menu, X, BookOpen, Camera, UserCircle } from 'lucide-react';

const Layout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const navItems = [
    { to: "/", icon: <Home size={20} />, label: "Início", color: "text-slate-600 group-hover:text-indigo-600" },
    { to: "/live-coach", icon: <Camera size={20} />, label: "Coach Ao Vivo", color: "text-rose-500 group-hover:text-rose-600", special: true },
    { to: "/workout", icon: <Dumbbell size={20} />, label: "Treino", color: "text-indigo-500 group-hover:text-indigo-600" },
    { to: "/diet", icon: <Utensils size={20} />, label: "Dieta", color: "text-emerald-500 group-hover:text-emerald-600" },
    { to: "/exercises", icon: <BookOpen size={20} />, label: "Biblioteca", color: "text-cyan-500 group-hover:text-cyan-600" },
    { to: "/progress", icon: <Activity size={20} />, label: "Progresso", color: "text-amber-500 group-hover:text-amber-600" },
    { to: "/chat", icon: <MessageCircle size={20} />, label: "Chat", color: "text-pink-500 group-hover:text-pink-600" },
    { to: "/my-workouts", icon: <BarChart size={20} />, label: "Meus Planos", color: "text-purple-500 group-hover:text-purple-600" },
    { to: "/profile", icon: <UserCircle size={20} />, label: "Minha Conta", color: "text-blue-500 group-hover:text-blue-600" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navbar with Glassmorphism */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="flex items-center gap-2 text-2xl font-extrabold tracking-tight">
                <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 p-2 rounded-lg text-white shadow-lg shadow-indigo-200">
                  <Dumbbell size={20} fill="currentColor" />
                </div>
                <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Fitness AI
                </span>
              </span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-1 items-center">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ease-out ${
                      isActive 
                        ? 'bg-slate-100 text-slate-900 shadow-sm ring-1 ring-slate-200' 
                        : 'text-slate-500 hover:bg-white hover:shadow-md hover:-translate-y-0.5'
                    } ${item.special ? 'ring-2 ring-rose-100 bg-rose-50 hover:bg-rose-100' : ''}`
                  }
                >
                  <span className={`${item.color} transition-colors`}>{item.icon}</span>
                  {item.label}
                  {item.special && <span className="absolute -top-1 -right-1 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span></span>}
                </NavLink>
              ))}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 focus:outline-none transition-colors"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-100 absolute w-full shadow-xl">
            <div className="px-4 pt-4 pb-6 space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                      isActive 
                        ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                   <span className={item.color}>{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <Outlet />
      </main>
      
      <footer className="bg-white border-t border-slate-100 mt-auto">
        <div className="max-w-7xl mx-auto py-8 px-4 text-center">
          <p className="text-slate-400 text-sm font-medium">
            &copy; {new Date().getFullYear()} Fitness AI. Alimentado por <span className="text-indigo-500">Inteligência Artificial</span>.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;