import { useState } from 'react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import './ContainerHome.css';

// Définition des types
interface Subtask {
  id: number;
  title: string;
  is_done: boolean;
  task_id: number;
}

interface Task {
  id: number;
  title: string;
  description: string;
  start_datetime: string;
  end_datetime: string;
  status: 'a_faire' | 'en_cours' | 'terminee';
  priority: 'haute' | 'moyenne' | 'basse';
  category_id: number;
  category_name: string;
  image_path: string;
  subtasks: Subtask[];
}

// Données simulées avec typage
const tasks: Task[] = [
  {
    id: 1,
    title: "Préparer le rapport",
    description: "Rédiger le rapport pour la réunion de lundi",
    start_datetime: "2025-07-26 09:00:00",
    end_datetime: "2025-07-26 11:00:00",
    status: "a_faire",
    priority: "haute",
    category_id: 1,
    category_name: "Travail",
    image_path: "",
    subtasks: []
  },
  {
    id: 3,
    title: "Créer l'API REST",
    description: "Développer les endpoints CRUD pour la gestion des tâches",
    start_datetime: "2025-07-25 09:00:00",
    end_datetime: "2025-07-25 12:00:00",
    status: "a_faire",
    priority: "haute",
    category_id: 4,
    category_name: "Développement",
    image_path: "images/api.png",
    subtasks: [
      {
        id: 2,
        title: "Créer les routes dans urls.py",
        is_done: false,
        task_id: 3
      }
    ]
  }
];

// Typage des objets de configuration
const priorityColors: Record<string, string> = {
  haute: "#ef4444",
  moyenne: "#f59e0b",
  basse: "#10b981"
};

const priorityLabels: Record<string, string> = {
  haute: "Haute",
  moyenne: "Moyenne",
  basse: "Basse"
};

const statusLabels: Record<string, string> = {
  a_faire: "À faire",
  en_cours: "En cours",
  terminee: "Terminée"
};

// Fonctions avec typage des paramètres et retour
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const ContainerHome = () => {
  // États avec typage
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newSubtask, setNewSubtask] = useState<string>('');
  const [isAddingSubtask, setIsAddingSubtask] = useState<boolean>(false);

  const toggleSubtaskStatus = (_taskId: number, subtaskId: number): void => {
    setSelectedTask(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        subtasks: prev.subtasks.map(subtask => 
          subtask.id === subtaskId 
            ? { ...subtask, is_done: !subtask.is_done } 
            : subtask
        )
      };
    });
  };

  const addSubtask = (taskId: number): void => {
    if (!newSubtask.trim()) return;

    const newSubtaskObj: Subtask = {
      id: Math.floor(Math.random() * 1000),
      title: newSubtask,
      is_done: false,
      task_id: taskId
    };
    
    setSelectedTask(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        subtasks: [...prev.subtasks, newSubtaskObj]
      };
    });
    
    setNewSubtask('');
    setIsAddingSubtask(false);
  };

  const deleteSubtask = (_taskId: number, subtaskId: number): void => {
    setSelectedTask(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        subtasks: prev.subtasks.filter(st => st.id !== subtaskId)
      };
    });
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <motion.header 
        className="dashboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="header-content">
          <h1 className="gradient-text">Gestion des Tâches</h1>
          <nav className="breadcrumb">
            <a href="#" className="breadcrumb-link">Tableau de bord</a>
            <Icon icon="bx:chevron-right" className="breadcrumb-icon" />
            <a href="#" className="breadcrumb-link active">Tâches & Sous-tâches</a>
          </nav>
        </div>
      </motion.header>

      {/* Stats Cards */}
      <div className="stats-grid">
        <motion.div 
          className="stat-card"
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <div className="stat-icon" style={{ background: "rgba(99, 102, 241, 0.1)" }}>
            <Icon icon="bx:list-check" color="#6366f1" />
          </div>
          <div className="stat-info">
            <h3>{tasks.length}</h3>
            <p>Tâches totales</p>
          </div>
        </motion.div>

        <motion.div 
          className="stat-card"
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <div className="stat-icon" style={{ background: "rgba(239, 68, 68, 0.1)" }}>
            <Icon icon="bx:time" color="#ef4444" />
          </div>
          <div className="stat-info">
            <h3>{tasks.filter(t => t.status === 'a_faire').length}</h3>
            <p>À faire</p>
          </div>
        </motion.div>

        <motion.div 
          className="stat-card"
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <div className="stat-icon" style={{ background: "rgba(16, 185, 129, 0.1)" }}>
            <Icon icon="bx:check-circle" color="#10b981" />
          </div>
          <div className="stat-info">
            <h3>{tasks.filter(t => t.status === 'terminee').length}</h3>
            <p>Terminées</p>
          </div>
        </motion.div>

        <motion.div 
          className="stat-card"
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <div className="stat-icon" style={{ background: "rgba(245, 158, 11, 0.1)" }}>
            <Icon icon="bx:loader-circle" color="#f59e0b" />
          </div>
          <div className="stat-info">
            <h3>{tasks.reduce((acc, task) => acc + task.subtasks.length, 0)}</h3>
            <p>Sous-tâches</p>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="tasks-container">
        {/* Tasks List */}
        <motion.div 
          className="tasks-list"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="section-header">
            <h2>Liste des Tâches</h2>
            <div className="actions">
              <button className="action-btn">
                <Icon icon="bx:filter-alt" />
              </button>
              <button className="action-btn">
                <Icon icon="bx:search" />
              </button>
            </div>
          </div>

          <div className="tasks-scroll-container">
            {tasks.map(task => (
              <motion.div
                key={task.id}
                className={`task-item ${selectedTask?.id === task.id ? 'active' : ''}`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedTask(task)}
              >
                <div className="task-priority" style={{ backgroundColor: priorityColors[task.priority] }}></div>
                <div className="task-content">
                  <div className="task-header">
                    <h3>{task.title}</h3>
                    <span className="task-category">{task.category_name}</span>
                  </div>
                  <p className="task-description">{task.description}</p>
                  <div className="task-meta">
                    <span className={`task-status ${task.status}`}>
                      {statusLabels[task.status]}
                    </span>
                    <span className="task-date">
                      <Icon icon="bx:calendar" /> {formatDate(task.start_datetime)}
                    </span>
                    {task.subtasks.length > 0 && (
                      <span className="task-subtasks">
                        <Icon icon="bx:list-check" /> {task.subtasks.length}
                      </span>
                    )}
                  </div>
                </div>
                <div className="task-arrow">
                  <Icon icon="bx:chevron-right" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Task Details & Subtasks */}
        <motion.div 
          className="task-details"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {selectedTask ? (
            <>
              <div className="section-header">
                <h2>Détails de la tâche</h2>
                <button 
                  className="add-subtask-btn"
                  onClick={() => setIsAddingSubtask(!isAddingSubtask)}
                >
                  <Icon icon="bx:plus" />
                  <span>Ajouter une sous-tâche</span>
                </button>
              </div>

              <div className="task-info">
                {selectedTask.image_path ? (
                  <div className="task-image">
                    <img src={selectedTask.image_path} alt={selectedTask.title} />
                  </div>
                ) : (
                  <div className="task-image-placeholder">
                    <Icon icon="bx:image-alt" />
                  </div>
                )}
                
                <h3>{selectedTask.title}</h3>
                <p className="task-description">{selectedTask.description}</p>
                
                <div className="task-meta-grid">
                  <div className="meta-item">
                    <Icon icon="bx:calendar" className="meta-icon" />
                    <div>
                      <p className="meta-label">Date de début</p>
                      <p className="meta-value">
                        {formatDate(selectedTask.start_datetime)} à {formatTime(selectedTask.start_datetime)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="meta-item">
                    <Icon icon="bx:calendar-check" className="meta-icon" />
                    <div>
                      <p className="meta-label">Date de fin</p>
                      <p className="meta-value">
                        {formatDate(selectedTask.end_datetime)} à {formatTime(selectedTask.end_datetime)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="meta-item">
                    <Icon icon="bx:flag" className="meta-icon" />
                    <div>
                      <p className="meta-label">Priorité</p>
                      <p className="meta-value" style={{ color: priorityColors[selectedTask.priority] }}>
                        {priorityLabels[selectedTask.priority]}
                      </p>
                    </div>
                  </div>
                  
                  <div className="meta-item">
                    <Icon icon="bx:category" className="meta-icon" />
                    <div>
                      <p className="meta-label">Catégorie</p>
                      <p className="meta-value">
                        {selectedTask.category_name}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Subtasks Section */}
                <div className="subtasks-section">
                  <h4>Sous-tâches ({selectedTask.subtasks.length})</h4>

                  <AnimatePresence>
                    {isAddingSubtask && (
                      <motion.div
                        className="add-subtask-form"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <input
                          type="text"
                          value={newSubtask}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewSubtask(e.target.value)}
                          placeholder="Entrez le titre de la sous-tâche..."
                          autoFocus
                          onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && addSubtask(selectedTask.id)}
                        />
                        <div className="form-actions">
                          <button 
                            className="cancel-btn"
                            onClick={() => setIsAddingSubtask(false)}
                          >
                            Annuler
                          </button>
                          <button 
                            className="confirm-btn"
                            onClick={() => addSubtask(selectedTask.id)}
                          >
                            Ajouter
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {selectedTask.subtasks.length > 0 ? (
                    <div className="subtasks-list">
                      {selectedTask.subtasks.map(subtask => (
                        <motion.div
                          key={subtask.id}
                          className="subtask-item"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div 
                            className={`subtask-checkbox ${subtask.is_done ? 'checked' : ''}`}
                            onClick={() => toggleSubtaskStatus(selectedTask.id, subtask.id)}
                          >
                            {subtask.is_done && <Icon icon="bx:check" />}
                          </div>
                          <div className="subtask-content">
                            <p className={subtask.is_done ? 'completed' : ''}>{subtask.title}</p>
                            <div className="subtask-meta">
                              <span className="subtask-id">ID: {subtask.id}</span>
                              <span className="subtask-status">
                                {subtask.is_done ? (
                                  <span className="status-done">Terminée</span>
                                ) : (
                                  <span className="status-todo">À faire</span>
                                )}
                              </span>
                            </div>
                          </div>
                          <button 
                            className="subtask-delete-btn"
                            onClick={() => deleteSubtask(selectedTask.id, subtask.id)}
                          >
                            <Icon icon="bx:trash" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-subtasks">
                      <Icon icon="bx:list-check" className="empty-icon" />
                      <p>Aucune sous-tâche pour cette tâche</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="no-task-selected">
              <Icon icon="bx:select-multiple" className="empty-icon" />
              <h3>Sélectionnez une tâche</h3>
              <p>Cliquez sur une tâche dans la liste pour afficher ses détails et sous-tâches</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ContainerHome;