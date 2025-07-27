import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { SubTask, SubTaskService } from '../../../../services/Soustaches_api';
import './ContainerSousTaches.css';

interface ContainerSousTachesProps {
  taskId?: number;
  onClose?: () => void;
}

const ContainerSousTaches: React.FC<ContainerSousTachesProps> = ({ taskId, onClose }) => {
  const [subtasks, setSubtasks] = useState<SubTask[]>([]);
  const [newSubtask, setNewSubtask] = useState<string>('');
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Charger les sous-tâches
  useEffect(() => {
    const fetchSubtasks = async () => {
      if (!taskId) return;
      
      try {
        setIsLoading(true);
        setError(null);
        const data = await SubTaskService.getByTask(taskId);
        setSubtasks(data);
      } catch (err) {
        console.error('Erreur lors du chargement des sous-tâches:', err);
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubtasks();
  }, [taskId]);

  const toggleStatus = async (id: number) => {
    try {
      const updatedSubtask = await SubTaskService.toggleStatus(id);
      setSubtasks(subtasks.map(subtask => 
        subtask.id === id ? updatedSubtask : subtask
      ));
      showSuccessMessage('Statut mis à jour');
    } catch (err) {
      console.error('Erreur lors du changement de statut:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
    }
  };

  const addSubtask = async () => {
    if (!newSubtask.trim() || !taskId) return;

    try {
      setIsAdding(true);
      const createdSubtask = await SubTaskService.create({
        title: newSubtask,
        task_id: taskId
      });
      setSubtasks([...subtasks, createdSubtask]);
      setNewSubtask('');
      setIsAdding(false);
      showSuccessMessage('Sous-tâche ajoutée');
    } catch (err) {
      console.error('Erreur lors de l\'ajout:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'ajout');
      setIsAdding(false);
    }
  };

  const deleteSubtask = async (id: number) => {
    try {
      await SubTaskService.delete(id);
      setSubtasks(subtasks.filter(subtask => subtask.id !== id));
      showSuccessMessage('Sous-tâche supprimée');
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
  };

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  if (!taskId) {
    return (
      <div className="subtask-empty-state">
        <Icon icon="bx:info-circle" className="empty-icon" />
        <p>Aucune tâche sélectionnée</p>
        <p>Sélectionnez une tâche pour voir ses sous-tâches</p>
      </div>
    );
  }

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
        <p>Chargement des sous-tâches...</p>
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
    <div className="subtask-manager">
      {/* En-tête */}
      <motion.header 
        className="task-header"
        initial={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="header-content">
          <h1 className="task-title">
            <span className="gradient-text">Sous-tâches</span>
          </h1>
          <nav className="breadcrumb">
            <a href="#" className="breadcrumb-link">Tableau de bord</a>
            <Icon icon="bx:chevron-right" className="breadcrumb-icon" />
            <a href="#" className="breadcrumb-link active">Sous-tâches</a>
          </nav>
        </div>
        {onClose && (
          <motion.button 
            className="close-button"
            onClick={onClose}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon icon="bx:x" />
          </motion.button>
        )}
      </motion.header>

      {/* Contenu principal */}
      <motion.div 
        className="subtask-container glassmorphism"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, type: 'spring' }}
      >
        {/* Notification de succès */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              className="success-notification"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="success-content">
                <Icon icon="bx:check-circle" className="success-icon" />
                <span>{successMessage}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="subtask-header">
          <motion.h2 
            className="subtask-title"
            initial={{ x: -10 }}
            animate={{ x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Icon icon="bx:list-check" className="title-icon" />
            Liste des sous-tâches
            <motion.span 
              className="subtask-count"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              {subtasks.length}
            </motion.span>
          </motion.h2>
          
          <motion.button
            className="subtask-add-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAdding(!isAdding)}
            disabled={isAdding}
          >
            <Icon icon="bx:plus" />
            <span>Ajouter</span>
          </motion.button>
        </div>

        {/* Formulaire d'ajout */}
        <AnimatePresence>
          {isAdding && (
            <motion.div
              className="subtask-input-container"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="input-group">
                <input
                  type="text"
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  placeholder="Nouvelle sous-tâche..."
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && addSubtask()}
                  disabled={isAdding}
                />
              </div>
              <div className="subtask-input-actions">
                <button 
                  className="cancel-btn"
                  onClick={() => {
                    setIsAdding(false);
                    setNewSubtask('');
                  }}
                  disabled={isAdding}
                >
                  Annuler
                </button>
                <button 
                  className="confirm-btn"
                  onClick={addSubtask}
                  disabled={!newSubtask.trim() || isAdding}
                >
                  {isAdding ? (
                    <>
                      <Icon icon="bx:loader-alt" className="spin-animation" />
                      Ajout...
                    </>
                  ) : (
                    'Confirmer'
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Liste des sous-tâches */}
        <div className="subtask-list">
          <AnimatePresence>
            {subtasks.length > 0 ? (
              subtasks.map((subtask) => (
                <motion.div
                  key={subtask.id}
                  className={`subtask-item ${subtask.is_done ? 'completed' : ''}`}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  whileHover={{ 
                    scale: 1.01,
                    boxShadow: '0 10px 20px -5px rgba(0,0,0,0.05)'
                  }}
                >
                  <div 
                    className="subtask-checkbox"
                    onClick={() => toggleStatus(subtask.id)}
                  >
                    <motion.div
                      className="checkbox-inner"
                      animate={{ 
                        backgroundColor: subtask.is_done ? 'var(--primary)' : 'transparent',
                        borderColor: subtask.is_done ? 'var(--primary)' : 'var(--border)'
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {subtask.is_done && (
                        <Icon 
                          icon="bx:check"
                          className="checkbox-icon"
                        />
                      )}
                    </motion.div>
                  </div>
                  
                  <div className="subtask-content">
                    <p className={subtask.is_done ? 'completed-text' : ''}>
                      {subtask.title}
                    </p>
                  </div>
                  
                  <motion.button 
                    className="subtask-delete-btn"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => deleteSubtask(subtask.id)}
                  >
                    <Icon icon="bx:trash" />
                  </motion.button>
                </motion.div>
              ))
            ) : (
              <motion.div
                className="subtask-empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Icon 
                  icon="bx:list-check" 
                  className="empty-icon"
                />
                <p>Aucune sous-tâche trouvée</p>
                <button 
                  className="add-first-btn"
                  onClick={() => setIsAdding(true)}
                >
                  Ajouter votre première sous-tâche
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ContainerSousTaches;