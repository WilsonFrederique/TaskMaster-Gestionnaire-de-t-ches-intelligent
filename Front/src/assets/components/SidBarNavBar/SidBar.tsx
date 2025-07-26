import { useEffect, useState, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../SidBarNavBar/SidBar.css';
import Profil from '../../../assets/images/a1.png';
import { Icon } from '@iconify/react';

interface SidBarProps {
  children: ReactNode;
}

const SidBar = ({ children }: SidBarProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    localStorage.getItem('sidebarCollapsed') === 'true' || window.innerWidth < 768
  );
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [activeMenu, setActiveMenu] = useState('');
  const location = useLocation();

  const menuItems = [
    { path: '/', name: 'Tableau de bord', icon: 'bx:bxs-dashboard' },
    { path: '/categorie', name: 'Catégories de Tâches', icon: 'bx:bxs-component' },
    { path: '/tache', name: 'Tâches', icon: 'bx:bxs-edit' },
    { path: '/sousTache', name: 'Sous-tâches', icon: 'bx:bxs-detail' },
  ];


  const bottomMenuItems = [
    { path: '/parametres', name: 'Paramètres', icon: 'bx:bxs-cog' },
    { path: ' ', name: 'Déconnexion', icon: 'bx:bx-log-out' },
  ];

  useEffect(() => {
    const handleResize = () => {
      const isSmallScreen = window.innerWidth < 768;
      setSidebarCollapsed(isSmallScreen);
      localStorage.setItem('sidebarCollapsed', isSmallScreen.toString());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const currentItem = menuItems.find(item => item.path === location.pathname);
    setActiveMenu(currentItem ? currentItem.name : '');
  }, [location]);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-theme-variables');
    } else {
      document.body.classList.remove('dark-theme-variables');
    }
  }, [darkMode]);

  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', newState.toString());
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
  };

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="brand">
            <Icon icon="bx:bxs-store" className="brand-icon" />
            {!sidebarCollapsed && <span className="brand-text">TaskMaster</span>}
          </div>
          <button className="toggle-btn" onClick={toggleSidebar}>
            <Icon icon={sidebarCollapsed ? 'bx:bx-chevron-right' : 'bx:bx-chevron-left'} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul className="menu-top">
            {menuItems.map((item) => (
              <li key={item.name} className={activeMenu === item.name ? 'active' : ''}>
                <Link to={item.path} onClick={() => setActiveMenu(item.name)}>
                  <Icon icon={item.icon} className="menu-icon" />
                  {!sidebarCollapsed && <span className="menu-text">{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>

          <ul className="menu-bottom">
            {bottomMenuItems.map((item) => (
              <li key={item.name}>
                <Link to={item.path}>
                  <Icon icon={item.icon} className="menu-icon" />
                  {!sidebarCollapsed && <span className="menu-text">{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {!sidebarCollapsed && (
          <div className="sidebar-footer">
            <div className="user-profile">
              <img src={Profil} alt="Profil" className="profile-img" />
              <div className="profile-info">
                <span className="profile-name">Fred</span>
                <span className="profile-role">Admin</span>
              </div>
            </div>
          </div>
        )}
      </aside>

      <main className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <header className="navbar">
          <div className="navbar-left">
            <button className="menu-btn" onClick={toggleSidebar}>
              <Icon icon="bx:bx-menu" />
            </button>
            <nav className="breadcrumb">
              <span>{activeMenu || 'Dashboard'}</span>
            </nav>
          </div>

          <div className="navbar-right">
            <div className="search-container">
              <input type="text" placeholder="Rechercher..." />
              <button className="search-btn">
                <Icon icon="bx:bx-search" />
              </button>
            </div>

            <button className="theme-toggle" onClick={toggleDarkMode}>
              <Icon icon={darkMode ? 'bx:bxs-sun' : 'bx:bxs-moon'} />
            </button>

            <button className="notification-btn">
              <Icon icon="bx:bxs-bell" />
              <span className="badge">0</span>
            </button>

            {sidebarCollapsed && (
              <div className="profile-mini">
                <img src={Profil} alt="Profil" />
              </div>
            )}
          </div>
        </header>

        <div className="content-area">
          {children}
        </div>
      </main>
    </div>
  );
};

export default SidBar;
