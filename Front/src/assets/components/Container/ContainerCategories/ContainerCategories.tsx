import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Category, CategoryService } from '../../../../services/Categories_api';
import './ContainerCategories.css';

// Type étendu pour inclure les propriétés supplémentaires nécessaires à l'UI
type UICategory = Category & {
  taskCount: number;
  createdAt: Date;
  color: string;
};

const generateColors = () => {
  return [
    '#6366f1', '#f43f5e', '#10b981', '#f59e0b', 
    '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'
  ];
};

const ContainerCategories = () => {
  const [activeTab, setActiveTab] = useState<'toutes' | 'croissant' | 'decroissant' | 'recentes'>('toutes');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState<number | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categories, setCategories] = useState<UICategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<UICategory | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Gestion du responsive
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Chargement des catégories depuis l'API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const apiCategories = await CategoryService.getAll();
        
        // Transformation des catégories pour l'UI
        const colors = generateColors();
        const uiCategories: UICategory[] = apiCategories.map((cat, index) => ({
          ...cat,
          taskCount: 0, // À remplacer par le vrai count si disponible
          createdAt: new Date(), // À remplacer par la vraie date si disponible
          color: colors[index % colors.length]
        }));
        
        setCategories(uiCategories);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des catégories:', err);
        setError('Erreur lors du chargement des catégories');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
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
  const handleAddCategory = async () => {
    if (newCategoryName.trim()) {
      try {
        const newCategory = await CategoryService.create({ name: newCategoryName });
        
        const colors = generateColors();
        const uiCategory: UICategory = {
          ...newCategory,
          taskCount: 0,
          createdAt: new Date(),
          color: colors[Math.floor(Math.random() * colors.length)]
        };
        
        setCategories([...categories, uiCategory]);
        setNewCategoryName('');
        setIsAddingCategory(false);
        showSuccessMessage('Catégorie créée avec succès');
      } catch (err) {
        console.error('Erreur lors de la création de la catégorie:', err);
        setError('Erreur lors de la création de la catégorie');
      }
    }
  };

  // Suppression d'une catégorie
  const handleDeleteCategory = async () => {
    if (categoryToDelete) {
      try {
        await CategoryService.delete(categoryToDelete.id);
        setCategories(categories.filter(category => category.id !== categoryToDelete.id));
        setCategoryToDelete(null);
        showSuccessMessage('Catégorie supprimée avec succès');
      } catch (err) {
        console.error('Erreur lors de la suppression de la catégorie:', err);
        setError('Erreur lors de la suppression de la catégorie');
      }
    }
  };

  // Affichage du message de succès
  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  // Ouverture du formulaire de modification
  const handleEditClick = (category: UICategory) => {
    setIsEditingCategory(category.id);
    setEditCategoryName(category.name);
  };

  // Mise à jour d'une catégorie
  const handleUpdateCategory = async () => {
    if (isEditingCategory && editCategoryName.trim()) {
      try {
        const updatedCategory = await CategoryService.update(isEditingCategory, { name: editCategoryName });
        setCategories(categories.map(cat => 
          cat.id === isEditingCategory ? { ...cat, name: updatedCategory.name } : cat
        ));
        setIsEditingCategory(null);
        setEditCategoryName('');
        showSuccessMessage('Catégorie modifiée avec succès');
      } catch (err) {
        console.error('Erreur lors de la mise à jour de la catégorie:', err);
        setError('Erreur lors de la mise à jour de la catégorie');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          style={{ originX: 0.5, originY: 0.5 }}
        >
          <Icon icon="eos-icons:loading" width="48" height="48" />
        </motion.div>
        <p>Chargement des catégories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <Icon icon="material-symbols:error-outline" width="48" height="48" color="#f43f5e" />
        <h3>Une erreur est survenue</h3>
        <p>{error}</p>
        <motion.button 
          className="primary-button"
          onClick={() => window.location.reload()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Icon icon="ic:baseline-refresh" />
          <span>Recharger</span>
        </motion.button>
      </div>
    );
  }

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
            {!isMobile && <span>Nouvelle catégorie</span>}
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

      {/* Formulaire de modification (modal-like) */}
      <AnimatePresence>
        {isEditingCategory !== null && (
          <motion.div 
            className="edit-category-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsEditingCategory(null)}
          >
            <motion.div 
              className="edit-category-form glassmorphism"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="form-header">
                <h3>Modifier la Catégorie</h3>
                <button 
                  className="close-button"
                  onClick={() => setIsEditingCategory(null)}
                >
                  <Icon icon="bx:x" />
                </button>
              </div>
              <div className="form-group">
                <label>Nouveau nom</label>
                <input
                  type="text"
                  placeholder="Entrez le nouveau nom"
                  value={editCategoryName}
                  onChange={(e) => setEditCategoryName(e.target.value)}
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleUpdateCategory()}
                />
              </div>
              <div className="form-actions">
                <motion.button 
                  className="secondary-button"
                  onClick={() => setIsEditingCategory(null)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Annuler
                </motion.button>
                <motion.button 
                  className="primary-button"
                  onClick={handleUpdateCategory}
                  disabled={!editCategoryName.trim()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon icon="bx:check" />
                  <span>Enregistrer</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation de suppression (modal-like) */}
      <AnimatePresence>
        {categoryToDelete && (
          <motion.div 
            className="delete-confirmation-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCategoryToDelete(null)}
          >
            <motion.div 
              className="delete-confirmation-form glassmorphism"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="form-header">
                <Icon icon="bx:trash" className="delete-icon" />
                <h3>Supprimer la catégorie</h3>
              </div>
              <div className="form-content">
                <p>Êtes-vous sûr de vouloir supprimer la catégorie <strong>"{categoryToDelete.name}"</strong> ?</p>
                <p className="warning-text">Cette action est irréversible.</p>
              </div>
              <div className="form-actions">
                <motion.button 
                  className="secondary-button"
                  onClick={() => setCategoryToDelete(null)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Annuler
                </motion.button>
                <motion.button 
                  className="danger-button"
                  onClick={handleDeleteCategory}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon icon="bx:trash" />
                  <span>Supprimer</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification de succès */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="success-notification"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="success-content">
              <Icon icon="bx:check-circle" className="success-icon" />
              <span>{successMessage}</span>
            </div>
            <motion.button 
              className="close-notification"
              onClick={() => setShowSuccess(false)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Icon icon="bx:x" />
            </motion.button>
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
                          onClick={() => handleEditClick(category)}
                          whileHover={{ scale: 1.1, backgroundColor: 'rgba(99, 102, 241, 0.1)' }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Icon icon="bx:edit" />
                        </motion.button>
                        <motion.button 
                          className="icon-button delete"
                          onClick={() => setCategoryToDelete(category)}
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