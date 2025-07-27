import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Task, TaskService } from '../../../../services/taches_api';
import { Category, CategoryService } from '../../../../services/Categories_api';
import './ContainerTaches.css';

const ContainerTaches = () => {
  const [activeTab, setActiveTab] = useState<'toutes' | 'a_faire' | 'en_cours' | 'terminee'>('toutes');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    start_datetime: new Date().toISOString().slice(0, 16),
    end_datetime: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
    status: 'a_faire',
    priority: 'moyenne',
    category_id: 1
  });

  // Gestion du responsive
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Gestion du scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Chargement des données
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Charger les tâches
        const tasksData = await TaskService.getAll();
        setTasks(tasksData);
        
        // Charger les catégories
        const categoriesData = await CategoryService.getAll();
        setCategories(categoriesData);
        
        // Si des catégories existent, définir la première comme valeur par défaut
        if (categoriesData.length > 0) {
          setNewTask(prev => ({ ...prev, category_id: categoriesData[0].id }));
        }
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError('Erreur lors du chargement des données');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrage des tâches
  const filteredTasks = tasks.filter(task => {
    // Filtre par statut
    if (activeTab !== 'toutes' && task.status !== activeTab) {
      return false;
    }
    
    // Filtre par catégorie
    if (selectedCategory !== 'all' && task.category?.id !== parseInt(selectedCategory, 10)) {
      return false;
    }
    
    // Filtre par recherche
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Suppression d'une tâche
  const handleDeleteTask = async () => {
    if (taskToDelete) {
      try {
        await TaskService.delete(taskToDelete.id);
        setTasks(tasks.filter(task => task.id !== taskToDelete.id));
        setTaskToDelete(null);
        showSuccessMessage('Tâche supprimée avec succès');
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        setError('Erreur lors de la suppression de la tâche');
      }
    }
  };

  // Mise à jour d'une tâche
  const handleUpdateTask = async () => {
    if (taskToEdit) {
      try {
        const updatedTask = await TaskService.update(taskToEdit.id, {
          title: taskToEdit.title,
          description: taskToEdit.description,
          start_datetime: taskToEdit.start_datetime,
          end_datetime: taskToEdit.end_datetime,
          status: taskToEdit.status,
          priority: taskToEdit.priority,
          category_id: taskToEdit.category?.id
        });
        
        setTasks(tasks.map(task => 
          task.id === taskToEdit.id ? updatedTask : task
        ));
        setTaskToEdit(null);
        showSuccessMessage('Tâche mise à jour avec succès');
      } catch (err) {
        console.error('Erreur lors de la mise à jour:', err);
        setError('Erreur lors de la mise à jour de la tâche');
      }
    }
  };

  // Création d'une nouvelle tâche
  const handleAddTask = async () => {
    try {
      const createdTask = await TaskService.create({
        title: newTask.title || '',
        description: newTask.description || '',
        start_datetime: newTask.start_datetime || new Date().toISOString(),
        end_datetime: newTask.end_datetime || new Date(Date.now() + 3600000).toISOString(),
        status: newTask.status || 'a_faire',
        priority: newTask.priority || 'moyenne',
        category_id: newTask.category_id || 1
      });
      
      setTasks([...tasks, createdTask]);
      setIsAddingTask(false);
      resetNewTask();
      showSuccessMessage('Tâche créée avec succès');
    } catch (err) {
      console.error('Erreur lors de la création:', err);
      setError('Erreur lors de la création de la tâche');
    }
  };

  // Réinitialisation du formulaire de nouvelle tâche
  const resetNewTask = () => {
    setNewTask({
      title: '',
      description: '',
      start_datetime: new Date().toISOString().slice(0, 16),
      end_datetime: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
      status: 'a_faire',
      priority: 'moyenne',
      category_id: categories.length > 0 ? categories[0].id : 1
    });
  };

  // Affichage des messages de succès
  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  // Formatage des dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Formatage des heures
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Gestion du changement de statut
  const handleStatusChange = async (taskId: number, newStatus: 'a_faire' | 'en_cours' | 'terminee') => {
    try {
      const updatedTask = await TaskService.updateStatus(taskId, newStatus);
      setTasks(tasks.map(task => 
        task.id === taskId ? updatedTask : task
      ));
      showSuccessMessage('Statut mis à jour avec succès');
    } catch (err) {
      console.error('Erreur lors du changement de statut:', err);
      setError('Erreur lors du changement de statut');
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
        <p>Chargement des tâches...</p>
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
    <div className="task-manager">
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
        {/* <motion.button 
          className="new-task-button pulse-effect"
          onClick={() => setIsAddingTask(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Icon icon="bx:bx-plus" className="button-icon" />
          {!isMobile && <span>Nouvelle tâche</span>}
        </motion.button> */}
      </motion.header>

      {/* Filter Section */}
      <motion.div 
        className="filter-container glassmorphism"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="search-bar">
          <Icon icon="bx:bx-search" className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher une tâche..."
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
              <option value="all">Toutes catégories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id.toString()}>
                  {category.name}
                </option>
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
            {[
              { id: 'toutes', icon: 'bx:list-ul', label: 'Toutes' },
              { id: 'a_faire', icon: 'bx:time', label: 'À faire' },
              { id: 'en_cours', icon: 'bx:loader-circle', label: 'En cours' },
              { id: 'terminee', icon: 'bx:check-circle', label: 'Terminées' }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id as any)}
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
            <div className="notification-badge">0</div>
          </motion.button>
        </motion.div>

        {/* Task Display */}
        <div className="task-display">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + selectedCategory + searchQuery}
              className="task-panel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="panel-header">
                <h2 className="panel-title">
                  <Icon icon={
                    activeTab === 'toutes' ? 'bx:list-ul' :
                    activeTab === 'a_faire' ? 'bx:time' :
                    activeTab === 'en_cours' ? 'bx:loader-circle' : 'bx:check-circle'
                  } className="title-icon" />
                  {activeTab === 'toutes' ? 'Toutes les tâches' :
                   activeTab === 'a_faire' ? 'Tâches à faire' :
                   activeTab === 'en_cours' ? 'Tâches en cours' : 'Tâches terminées'}
                </h2>
                <div className="category-badge">
                  {selectedCategory === 'all' ? 'Toutes catégories' : 
                   categories.find(c => c.id.toString() === selectedCategory)?.name || 'Catégorie'}
                </div>
              </div>
              
              <LayoutGroup>
                <div className="task-grid">
                  {filteredTasks.length > 0 ? (
                    filteredTasks.map((task) => (
                      <motion.div 
                        key={task.id}
                        className="task-card"
                        whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                        layout
                      >
                        <div className="task-card-header">
                          <h3>{task.title}</h3>
                          <select
                            className={`task-status ${task.status}`}
                            value={task.status}
                          >
                            <option value="a_faire">À faire</option>
                            <option value="en_cours">En cours</option>
                            <option value="terminee">Terminée</option>
                          </select>
                        </div>

                        <span className={`task ${task.priority}`}>
                          {task.priority === 'faible' ? 'Faible' :
                          task.priority === 'moyenne' ? 'Moyenne' : 'Haute'}
                        </span>

                        <p className="task-description">{task.description}</p>
                        <div className="task-meta">
                          <span className="task-date">
                            <Icon icon="bx:calendar" /> {formatDate(task.start_datetime)}
                          </span>
                          <span className="task-time">
                            <Icon icon="bx:time-five" /> {formatTime(task.start_datetime)} - {formatTime(task.end_datetime)}
                          </span>
                        </div>
                        <div className="task-footer">
                          <div className="task-category">
                            <span style={{ backgroundColor: '#6366f1' }}></span>
                            {task.category?.name || 'Sans catégorie'} 
                          </div>
                          <div className="task-actions">
                            <motion.button 
                              className="task-action-btn"
                              onClick={() => setTaskToEdit(task)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Icon icon="bx:edit" />
                            </motion.button>
                            <motion.button 
                              className="task-action-btn"
                              onClick={() => setTaskToDelete(task)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Icon icon="bx:trash" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <Icon icon="bx:task" className="empty-icon" />
                      <h3>Aucune tâche trouvée</h3>
                      <p>
                        {activeTab !== 'toutes' || selectedCategory !== 'all' || searchQuery
                          ? 'Essayez de modifier vos filtres' 
                          : 'Commencez par créer votre première tâche'}
                      </p>
                      <motion.button 
                        className="primary-button"
                        onClick={() => setIsAddingTask(true)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Icon icon="bx:bx-plus" />
                        <span>Créer une tâche</span>
                      </motion.button>
                    </div>
                  )}
                </div>
              </LayoutGroup>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Formulaire d'ajout de tâche */}
      <AnimatePresence>
        {isAddingTask && (
          <motion.div 
            className="task-form-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsAddingTask(false)}
          >
            <motion.div 
              className="task-form glassmorphism"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="form-header">
                <h3>Nouvelle Tâche</h3>
                <button 
                  className="close-button"
                  onClick={() => setIsAddingTask(false)}
                >
                  <Icon icon="bx:x" />
                </button>
              </div>
              
              <div className="form-group">
                <label>Titre</label>
                <input
                  type="text"
                  placeholder="Titre de la tâche"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  autoFocus
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea
                  placeholder="Description de la tâche"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Date de début</label>
                  <input
                    type="datetime-local"
                    value={newTask.start_datetime}
                    onChange={(e) => setNewTask({...newTask, start_datetime: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label>Date de fin</label>
                  <input
                    type="datetime-local"
                    value={newTask.end_datetime}
                    onChange={(e) => setNewTask({...newTask, end_datetime: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Statut</label>
                  <select
                    value={newTask.status}
                    onChange={(e) => setNewTask({...newTask, status: e.target.value as any})}
                  >
                    <option value="a_faire">À faire</option>
                    <option value="en_cours">En cours</option>
                    <option value="terminee">Terminée</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Priorité</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value as any})}
                  >
                    <option value="faible">Faible</option>
                    <option value="moyenne">Moyenne</option>
                    <option value="haute">Haute</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label>Catégorie</label>
                <select
                  value={newTask.category_id}
                  onChange={(e) => setNewTask({...newTask, category_id: parseInt(e.target.value)})}
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-actions">
                <motion.button 
                  className="secondary-button"
                  onClick={() => setIsAddingTask(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Annuler
                </motion.button>
                <motion.button 
                  className="primary-button"
                  onClick={handleAddTask}
                  disabled={!newTask.title?.trim()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon icon="bx:check" />
                  <span>Créer</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Formulaire de modification de tâche */}
      <AnimatePresence>
        {taskToEdit && (
          <motion.div 
            className="task-form-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setTaskToEdit(null)}
          >
            <motion.div 
              className="task-form glassmorphism"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="form-header">
                <h3>Modifier la Tâche</h3>
                <button 
                  className="close-button"
                  onClick={() => setTaskToEdit(null)}
                >
                  <Icon icon="bx:x" />
                </button>
              </div>
              
              <div className="form-group">
                <label>Titre</label>
                <input
                  type="text"
                  placeholder="Titre de la tâche"
                  value={taskToEdit.title}
                  onChange={(e) => setTaskToEdit({...taskToEdit, title: e.target.value})}
                  autoFocus
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea
                  placeholder="Description de la tâche"
                  value={taskToEdit.description}
                  onChange={(e) => setTaskToEdit({...taskToEdit, description: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Date de début</label>
                  <input
                    type="datetime-local"
                    value={taskToEdit.start_datetime.slice(0, 16)}
                    onChange={(e) => setTaskToEdit({...taskToEdit, start_datetime: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label>Date de fin</label>
                  <input
                    type="datetime-local"
                    value={taskToEdit.end_datetime.slice(0, 16)}
                    onChange={(e) => setTaskToEdit({...taskToEdit, end_datetime: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Statut</label>
                  <select
                    value={taskToEdit.status}
                    onChange={(e) => setTaskToEdit({...taskToEdit, status: e.target.value as any})}
                  >
                    <option value="a_faire">À faire</option>
                    <option value="en_cours">En cours</option>
                    <option value="terminee">Terminée</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Priorité</label>
                  <select
                    value={taskToEdit.priority}
                    onChange={(e) => setTaskToEdit({...taskToEdit, priority: e.target.value as any})}
                  >
                    <option value="faible">Faible</option>
                    <option value="moyenne">Moyenne</option>
                    <option value="haute">Haute</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label>Catégorie</label>
                <select
                  value={taskToEdit.category?.id || ''}
                  onChange={(e) => setTaskToEdit({
                    ...taskToEdit, 
                    category: categories.find(c => c.id === parseInt(e.target.value)) || null
                  })}
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-actions">
                <motion.button 
                  className="secondary-button"
                  onClick={() => setTaskToEdit(null)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Annuler
                </motion.button>
                <motion.button 
                  className="primary-button"
                  onClick={handleUpdateTask}
                  disabled={!taskToEdit.title.trim()}
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

      {/* Confirmation de suppression */}
      <AnimatePresence>
        {taskToDelete && (
          <motion.div 
            className="delete-confirmation-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setTaskToDelete(null)}
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
                <h3>Supprimer la tâche</h3>
              </div>
              <div className="form-content">
                <p>Êtes-vous sûr de vouloir supprimer la tâche <strong>"{taskToDelete.title}"</strong> ?</p>
                <p className="warning-text">Cette action est irréversible.</p>
              </div>
              <div className="form-actions">
                <motion.button 
                  className="secondary-button"
                  onClick={() => setTaskToDelete(null)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Annuler
                </motion.button>
                <motion.button 
                  className="danger-button"
                  onClick={handleDeleteTask}
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
                <p className="empty-subtasks">
                  <Icon icon="bx:info-circle" />
                  Fonctionnalité en développement
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContainerTaches;