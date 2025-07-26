import { useState, useEffect } from 'react';
import './ContainerTaches.css';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';

const ContainerTaches = () => {
  const [activeTab, setActiveTab] = useState('toutes');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const tabs = [
    { id: 'toutes', icon: 'bx:list-ul', label: 'Toutes' },
    { id: 'a_faire', icon: 'bx:time', label: 'À faire' },
    { id: 'en_cours', icon: 'bx:loader-circle', label: 'En cours' },
    { id: 'terminee', icon: 'bx:check-circle', label: 'Terminées' }
  ];

  const categories = [
    { id: 'all', name: 'Toutes catégories' },
    { id: 'travail', name: 'Travail' },
    { id: 'développement', name: 'Développement' },
    { id: 'personnel', name: 'Personnel' },
    { id: 'urgent', name: 'Urgent' }
  ];

  return (
    <div className="task-manager">
      {/* Floating Header (appears on scroll) */}
      <motion.div 
        className={`floating-header ${isScrolled ? 'visible' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: isScrolled ? 0 : -100 }}
        transition={{ type: 'spring', damping: 25 }}
      >
        <div className="header-content">
          <h1 className="task-title">
            <span className="gradient-text">Tâches</span>
          </h1>
          <button className="new-task-button">
            <Icon icon="bx:bx-plus" className="button-icon" />
            {!isMobile && <span>Nouveau</span>}
          </button>
        </div>
      </motion.div>

      {/* Main Header */}
      <motion.header 
        className="task-header"
        initial={{ opacity: 1 }}
        animate={{ opacity: isScrolled ? 0.5 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="header-content">
          <h1 className="task-title">
            <span className="gradient-text">Gestion des Tâches</span>
          </h1>
          <nav className="breadcrumb">
            <a href="#" className="breadcrumb-link">Tableau de bord</a>
            <Icon icon="bx:chevron-right" className="breadcrumb-icon" />
            <a href="#" className="breadcrumb-link active">Tâches</a>
          </nav>
        </div>
        <a href="/frmTaches">
          <motion.button 
            className="new-task-button pulse-effect"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon icon="bx:bx-plus" className="button-icon" />
            {!isMobile && <span>Nouvelle tâche</span>}
          </motion.button>
        </a>
      </motion.header>

      {/* Filter Section */}
      <motion.div 
        className="filter-container glassmorphism"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="filter-group">
          <label htmlFor="categoryFilter" className="filter-label">
            <Icon icon="bx:filter-alt" className="filter-icon" />
            {!isMobile && <span>Filtrer par catégorie</span>}
          </label>
          <div className="select-container">
            <select
              id="categoryFilter"
              className="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            <Icon icon="bx:chevron-down" className="select-arrow" />
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="task-content glassmorphism">
        {/* Tab Navigation */}
        <motion.div 
          className="tab-navigation"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="tab-scroll-container">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Icon icon={tab.icon} className="tab-icon" />
                {!isMobile && tab.label}
                {activeTab === tab.id && (
                  <motion.div 
                    className="tab-indicator"
                    layoutId="tabIndicator"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
          <motion.button 
            className={`subtask-toggle ${showSubtasks ? 'active' : ''}`}
            onClick={() => setShowSubtasks(!showSubtasks)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Icon icon="bx:list-check" className="subtask-icon" />
            {!isMobile && <span>Sous-tâches</span>}
            <div className="notification-badge">3</div>
          </motion.button>
        </motion.div>

        {/* Task Display */}
        <div className="task-display">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              className="task-panel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="panel-header">
                <h2 className="panel-title">
                  <Icon icon={tabs.find(t => t.id === activeTab)?.icon || 'bx:list-ul'} className="title-icon" />
                  {tabs.find(t => t.id === activeTab)?.label || 'Tâches'}
                </h2>
                <div className="category-badge">
                  {categories.find(c => c.id === selectedCategory)?.name || 'Toutes'}
                </div>
              </div>
              
              <div className="task-grid">
                {/* Exemple 1 - Tâche de travail */}
                <motion.div 
                  className="task-card"
                  whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  <div className="task-card-header">
                    <h3>Préparer le rapport</h3>
                  </div>
                  <span className="task-priority haute">Haute</span>
                  <p className="task-description">Rédiger le rapport pour la réunion de lundi</p>
                  <div className="task-meta">
                    <span className="task-date">
                      <Icon icon="bx:calendar" /> 26 juil. 2025
                    </span>
                    <span className="task-time">
                      <Icon icon="bx:time-five" /> 09:00 - 11:00
                    </span>
                  </div>
                  <div className="task-footer">
                    <div className="task-progress">
                      <span>0/1 sous-tâches</span>
                    </div>
                    <div className="task-actions">
                      <button className="task-action-btn">
                        <Icon icon="bx:edit" />
                      </button>
                      <button className="task-action-btn">
                        <Icon icon="bx:trash" />
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* Exemple 2 - Tâche de développement */}
                <motion.div 
                  className="task-card"
                  whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  <div className="task-card-header">
                    <h3>Créer l'API REST</h3>
                  </div>
                  <span className="task-priority haute">Haute</span>
                  <p className="task-description">Développer les endpoints CRUD pour la gestion des tâches</p>
                  <div className="task-meta">
                    <span className="task-date">
                      <Icon icon="bx:calendar" /> 25 juil. 2025
                    </span>
                    <span className="task-time">
                      <Icon icon="bx:time-five" /> 09:00 - 12:00
                    </span>
                  </div>
                  <div className="task-footer">
                    <div className="task-progress">
                      <span>1/4 sous-tâches</span>
                    </div>
                    <div className="task-actions">
                      <button className="task-action-btn">
                        <Icon icon="bx:edit" />
                      </button>
                      <button className="task-action-btn">
                        <Icon icon="bx:trash" />
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* Exemple 3 - Tâche personnelle */}
                <motion.div 
                  className="task-card"
                  whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  <div className="task-card-header">
                    <h3>Faire les courses</h3>                    
                  </div>
                  <span className="task-priority moyenne">Moyenne</span>
                  <p className="task-description">Acheter des produits alimentaires pour la semaine</p>
                  <div className="task-meta">
                    <span className="task-date">
                      <Icon icon="bx:calendar" /> 27 juil. 2025
                    </span>
                    <span className="task-time">
                      <Icon icon="bx:time-five" /> 18:00 - 19:00
                    </span>
                  </div>
                  <div className="task-footer">
                    <div className="task-progress">
                      <span>0/1 sous-tâches</span>
                    </div>
                    <div className="task-actions">
                      <button className="task-action-btn">
                        <Icon icon="bx:edit" />
                      </button>
                      <button className="task-action-btn">
                        <Icon icon="bx:trash" />
                      </button>
                    </div>
                  </div>
                </motion.div>
                
                {/* Add more task cards or empty state */}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Subtasks Panel */}
      <AnimatePresence>
        {showSubtasks && (
          <>
            <motion.div 
              className="subtasks-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSubtasks(false)}
            />
            <motion.div 
              className="subtasks-panel glassmorphism"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
            >
              <div className="subtasks-header">
                <h3>Sous-tâches</h3>
                <button 
                  className="close-subtasks"
                  onClick={() => setShowSubtasks(false)}
                >
                  <Icon icon="bx:x" />
                </button>
              </div>
              <div className="subtasks-list">
                {/* Subtask items would go here */}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContainerTaches;