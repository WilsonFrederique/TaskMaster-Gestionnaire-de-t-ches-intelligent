import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { Task, TaskService } from '../../../../services/taches_api';
import './ContainerHome.css';

const ContainerHome = () => {
  // États avec typage
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les tâches depuis l'API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await TaskService.getAll();
        setTasks(data);
        setLoading(false);
      } catch (err) {
        setError("Erreur lors du chargement des tâches");
        setLoading(false);
        console.error(err);
      }
    };

    fetchTasks();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container loading">
        <Icon icon="bx:loader-circle" className="spinner" />
        <p>Chargement des tâches...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container error">
        <Icon icon="bx:error-circle" className="error-icon" />
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Réessayer</button>
      </div>
    );
  }

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
            <h3>{tasks.reduce((acc, task) => acc + (task.subtasks?.length || 0), 0)}</h3>
            <p>Sous-tâches</p>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="tasks-container">
        {/* Tasks List */}
        <motion.div className="tasks-list">
          
        </motion.div>
      </div>
    </div>
  );
};

export default ContainerHome;