import { useState } from 'react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import './ContainerSousTaches.css';

// Types
interface SubTask {
  id: number;
  title: string;
  is_done: number;
  task_id: number;
}

interface ContainerSousTachesProps {
  initialTaskId?: number;
}

const ContainerSousTaches: React.FC<ContainerSousTachesProps> = ({ initialTaskId = 3 }) => {
  const [subtasks, setSubtasks] = useState<SubTask[]>([
    { id: 2, title: "Créer les routes dans urls.py", is_done: 0, task_id: 3 }
  ]);
  const [newSubtask, setNewSubtask] = useState<string>('');
  const [taskId, setTaskId] = useState<number>(initialTaskId);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const toggleStatus = (id: number) => {
    setSubtasks(subtasks.map(subtask => 
      subtask.id === id ? { ...subtask, is_done: subtask.is_done ? 0 : 1 } : subtask
    ));
  };

  const addSubtask = () => {
    if (newSubtask.trim()) {
      const newSubtaskObj: SubTask = {
        id: Math.max(...subtasks.map(t => t.id), 0) + 1,
        title: newSubtask,
        is_done: 0,
        task_id: taskId
      };
      setSubtasks([...subtasks, newSubtaskObj]);
      setNewSubtask('');
      setIsAdding(false);
    }
  };

  const deleteSubtask = (id: number) => {
    setSubtasks(subtasks.filter(subtask => subtask.id !== id));
  };

  return (
    <div>
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
      </motion.header>

      <motion.div 
        className="subtask-container glassmorphism"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, type: 'spring' }}
      >
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
          >
            <Icon icon="bx:plus" />
            <span>Ajouter</span>
          </motion.button>
        </div>

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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewSubtask(e.target.value)}
                  placeholder="Nouvelle sous-tâche..."
                  autoFocus
                  onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && addSubtask()}
                />
                <div className="task-id-input">
                  <label>ID de la tâche parente:</label>
                  <input
                    type="number"
                    value={taskId}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTaskId(Number(e.target.value))}
                    min="1"
                  />
                </div>
              </div>
              <div className="subtask-input-actions">
                <button 
                  className="cancel-btn"
                  onClick={() => setIsAdding(false)}
                >
                  Annuler
                </button>
                <button 
                  className="confirm-btn"
                  onClick={addSubtask}
                >
                  Confirmer
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
                      {subtask.is_done === 1 && (
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
                    <div className="subtask-meta">
                      <span className="subtask-id">ID: {subtask.id}</span>
                      <span className="subtask-task-id">Tâche parente: {subtask.task_id}</span>
                    </div>
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