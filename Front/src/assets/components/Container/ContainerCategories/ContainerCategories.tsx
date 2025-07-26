import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import './ContainerCategories.css';

// Types
type Category = {
  id: number;
  name: string;
  taskCount: number;
  createdAt: Date;
  color: string;
};

// Données de démonstration avec couleurs générées dynamiquement
const generateCategories = (): Category[] => {
  const colors = [
    '#6366f1', '#f43f5e', '#10b981', '#f59e0b', 
    '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'
  ];
  
  return [
    { id: 1, name: 'Travail', taskCount: 12, createdAt: new Date('2023-01-15'), color: colors[0] },
    { id: 4, name: 'Développement', taskCount: 8, createdAt: new Date('2023-02-20'), color: colors[1] },
    { id: 2, name: 'Personnel', taskCount: 5, createdAt: new Date('2023-03-10'), color: colors[2] },
    { id: 3, name: 'Urgent', taskCount: 3, createdAt: new Date('2023-01-05'), color: colors[3] }
  ];
};

const ContainerCategories = () => {
  const [activeTab, setActiveTab] = useState<'toutes' | 'croissant' | 'decroissant' | 'recentes'>('toutes');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categories, setCategories] = useState<Category[]>(generateCategories());

  // Gestion du responsive
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filtrage et tri des catégories
  const filteredCategories = categories
    .filter(category => 
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (activeTab === 'croissant') return a.name.localeCompare(b.name);
      if (activeTab === 'decroissant') return b.name.localeCompare(a.name);
      if (activeTab === 'recentes') return b.createdAt.getTime() - a.createdAt.getTime();
      return 0;
    });

  // Ajout d'une nouvelle catégorie
  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const colors = [
        '#6366f1', '#f43f5e', '#10b981', '#f59e0b', 
        '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'
      ];
      const newCategory: Category = {
        id: Math.max(0, ...categories.map(c => c.id)) + 1,
        name: newCategoryName,
        taskCount: 0,
        createdAt: new Date(),
        color: colors[Math.floor(Math.random() * colors.length)]
      };
      setCategories([...categories, newCategory]);
      setNewCategoryName('');
      setIsAddingCategory(false);
    }
  };

  // Suppression d'une catégorie avec confirmation
  const handleDeleteCategory = (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      setCategories(categories.filter(category => category.id !== id));
    }
  };

  return (
    <div className="categories-app">
      {/* En-tête animé */}
      <motion.header 
        className="task-header"
        initial={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="header-content">
          <h1 className="task-title">
            <span className="gradient-text">Catégories de Tâches</span>
          </h1>
          <nav className="breadcrumb">
            <a href="#" className="breadcrumb-link">Tableau de bord</a>
            <Icon icon="bx:chevron-right" className="breadcrumb-icon" />
            <a href="#" className="breadcrumb-link active">Catégories</a>
          </nav>
        </div>
        <a href="/frmCategories">
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

      {/* Barre de recherche et filtres */}
      <motion.section 
        className="filters-section glassmorphism"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <div className="search-bar">
          <Icon icon="bx:bx-search" className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher une catégorie..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <motion.button 
              className="clear-search"
              onClick={() => setSearchQuery('')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Icon icon="bx:x" />
            </motion.button>
          )}
        </div>
        
        <div className="sort-tabs">
          {[
            { id: 'toutes', icon: 'bx:list-ul', label: 'Toutes' },
            { id: 'croissant', icon: 'bx:sort-a-z', label: 'A-Z' },
            { id: 'decroissant', icon: 'bx:sort-z-a', label: 'Z-A' },
            { id: 'recentes', icon: 'bx:time', label: 'Récentes' }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              className={`sort-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id as any)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              layout
            >
              <Icon icon={tab.icon} />
              {!isMobile && <span>{tab.label}</span>}
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* Formulaire d'ajout (modal-like) */}
      <AnimatePresence>
        {isAddingCategory && (
          <motion.div 
            className="add-category-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsAddingCategory(false)}
          >
            <motion.div 
              className="add-category-form glassmorphism"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="form-header">
                <h3>Nouvelle Catégorie</h3>
                <button 
                  className="close-button"
                  onClick={() => setIsAddingCategory(false)}
                >
                  <Icon icon="bx:x" />
                </button>
              </div>
              <div className="form-group">
                <label>Nom de la catégorie</label>
                <input
                  type="text"
                  placeholder="Ex: Marketing"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                />
              </div>
              <div className="form-actions">
                <motion.button 
                  className="secondary-button"
                  onClick={() => setIsAddingCategory(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Annuler
                </motion.button>
                <motion.button 
                  className="primary-button"
                  onClick={handleAddCategory}
                  disabled={!newCategoryName.trim()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Créer
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenu principal */}
      <LayoutGroup>
        <main className="categories-grid-container">
          <AnimatePresence mode="wait">
            {filteredCategories.length > 0 ? (
              <motion.div
                key="categories-grid"
                className="categories-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {filteredCategories.map((category) => (
                  <motion.div
                    key={category.id}
                    className="category-card glassmorphism"
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ 
                      type: "spring", 
                      damping: 20, 
                      stiffness: 300,
                      bounce: 0.25
                    }}
                    whileHover={{ 
                      y: -5,
                      boxShadow: '0 10px 30px -10px rgba(0,0,0,0.15)'
                    }}
                  >
                    <div 
                      className="category-color-bar"
                      style={{ backgroundColor: category.color }}
                    />
                    <div className="category-content">
                      <div className="category-info">
                        <h3>{category.name}</h3>
                        <div className="task-count">
                          <Icon icon="bx:task" />
                          <span>{category.taskCount} tâche{category.taskCount !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                      <div className="category-actions">
                        <motion.button 
                          className="icon-button edit"
                          whileHover={{ scale: 1.1, backgroundColor: 'rgba(99, 102, 241, 0.1)' }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Icon icon="bx:edit" />
                        </motion.button>
                        <motion.button 
                          className="icon-button delete"
                          onClick={() => handleDeleteCategory(category.id)}
                          whileHover={{ scale: 1.1, backgroundColor: 'rgba(244, 63, 94, 0.1)' }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Icon icon="bx:trash" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty-state"
                className="empty-state glassmorphism"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="empty-icon-container">
                  <Icon icon="bx:folder-open" className="empty-icon" />
                </div>
                <h3>Aucune catégorie trouvée</h3>
                <p>
                  {searchQuery 
                    ? 'Essayez une autre recherche' 
                    : 'Commencez par créer votre première catégorie'
                  }
                </p>
                {!searchQuery && (
                  <motion.button 
                    className="primary-button"
                    onClick={() => setIsAddingCategory(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon icon="bx:bx-plus" />
                    <span>Créer une catégorie</span>
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </LayoutGroup>
    </div>
  );
};

export default ContainerCategories;