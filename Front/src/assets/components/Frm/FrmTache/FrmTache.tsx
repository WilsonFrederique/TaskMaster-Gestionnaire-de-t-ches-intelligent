import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { TaskService, TaskCreateData } from '../../../../services/taches_api';
import { CategoryService, Category } from '../../../../services/Categories_api';
import './FrmTache.css';

type TaskStatus = 'a_faire' | 'en_cours' | 'terminee';
type TaskPriority = 'faible' | 'moyenne' | 'haute';

interface TaskFormData extends Omit<TaskCreateData, 'category_id'> {
  image_file: File | null;
  category_id: string;
}

const FrmTache = () => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    start_datetime: '',
    end_datetime: '',
    image_file: null,
    status: 'a_faire',
    priority: 'moyenne',
    category_id: ''
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const loadedCategories = await CategoryService.getAll();
        setCategories(loadedCategories);
      } catch (error) {
        console.error('Erreur chargement catégories:', error);
        setErrorMessage('Erreur lors du chargement des catégories');
      }
    };

    loadCategories();

    // Initialiser les dates par défaut
    const now = new Date();
    const defaultEndDate = new Date(now.getTime() + 60 * 60 * 1000); // +1 heure
    
    setFormData(prev => ({
      ...prev,
      start_datetime: formatDateTimeForInput(now),
      end_datetime: formatDateTimeForInput(defaultEndDate)
    }));
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setFormData(prev => ({ ...prev, image_file: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || 
        !formData.start_datetime || !formData.end_datetime || 
        !formData.category_id) {
      setErrorMessage('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const startDate = new Date(formData.start_datetime);
    const endDate = new Date(formData.end_datetime);

    if (startDate > endDate) {
      setErrorMessage('La date de fin doit être postérieure ou égale à la date de début');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const taskData: TaskCreateData = {
        title: formData.title,
        description: formData.description,
        start_datetime: formData.start_datetime,
        end_datetime: formData.end_datetime,
        status: formData.status,
        priority: formData.priority,
        category_id: parseInt(formData.category_id)
      };

      const newTask = await TaskService.create(taskData);
      
      setSuccessMessage(`Tâche "${newTask.title}" créée avec succès!`);
      
      setFormData({
        title: '',
        description: '',
        start_datetime: formatDateTimeForInput(new Date()),
        end_datetime: formatDateTimeForInput(new Date(Date.now() + 3600000)),
        image_file: null,
        status: 'a_faire',
        priority: 'moyenne',
        category_id: ''
      });
      setPreviewImage(null);

      setTimeout(() => navigate('/tache'), 3000);
    } catch (error: any) {
      console.error('Erreur création tâche:', error);
      setErrorMessage(error.message || 'Erreur lors de la création de la tâche');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDateTimeForInput = (date: Date) => {
    // Correction pour le décalage de fuseau horaire
    const offset = date.getTimezoneOffset() * 60000;
    const localISOTime = new Date(date.getTime() - offset).toISOString().slice(0, 16);
    return localISOTime;
  };

  return (
    <div className="frm-container">
      <motion.header 
        className="task-header"
        initial={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="header-content">
          <h1 className="task-title">
            <span className="gradient-text">Gestion des Tâches</span>
          </h1>
          <nav className="breadcrumb">
            <a href="/" className="breadcrumb-link">Tableau de bord</a>
            <Icon icon="bx:chevron-right" className="breadcrumb-icon" />
            <a href="/tache" className="breadcrumb-link">Tâches</a>
            <Icon icon="bx:chevron-right" className="breadcrumb-icon" />
            <a href="#" className="breadcrumb-link active">Nouvelle tâche</a>
          </nav>
        </div>
      </motion.header>

      <motion.form
        onSubmit={handleSubmit}
        className="task-form glassmorphism"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <div className="form-content">        
          {errorMessage && (
            <motion.div 
              className="error-message mb"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Icon icon="bx:error-circle" className="error-icon" />
              {errorMessage}
            </motion.div>
          )}

          <div className="mb">
            <label htmlFor="title" className="form-label">
              <Icon icon="bx:rename" className="label-icon" />
              <span>Titre de la tâche *</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ex: Préparer le rapport trimestriel"
              className="form-input"
              required
              maxLength={200}
              disabled={isSubmitting}
            />
            <small className="input-hint">
              Maximum 200 caractères ({200 - formData.title.length} restants)
            </small>
          </div>

          <div className="mb">
            <label htmlFor="description" className="form-label">
              <Icon icon="bx:detail" className="label-icon" />
              <span>Description *</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Décrivez la tâche en détail..."
              className="form-input textarea"
              rows={5}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="mb">
            <label className="form-label">
              <Icon icon="bx:calendar" className="label-icon" />
              <span>Période *</span>
            </label>
            <div className="date-grid">
              <div className="date-group">
                <label htmlFor="start_datetime" className="date-label">Début</label>
                <input
                  type="datetime-local"
                  id="start_datetime"
                  name="start_datetime"
                  value={formData.start_datetime}
                  onChange={handleChange}
                  className="form-input"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="date-group">
                <label htmlFor="end_datetime" className="date-label">Fin</label>
                <input
                  type="datetime-local"
                  id="end_datetime"
                  name="end_datetime"
                  value={formData.end_datetime}
                  onChange={handleChange}
                  className="form-input"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          <div className="mb">
            <label className="form-label">
              <Icon icon="bx:list-check" className="label-icon" />
              <span>Statut *</span>
            </label>
            <div className="radio-group">
              {(['a_faire', 'en_cours', 'terminee'] as TaskStatus[]).map(status => (
                <label key={status} className="radio-label">
                  <input
                    type="radio"
                    name="status"
                    value={status}
                    checked={formData.status === status}
                    onChange={handleChange}
                    className="radio-input"
                    disabled={isSubmitting}
                  />
                  <span className="radio-custom"></span>
                  <span className="radio-text">
                    {status === 'a_faire' && 'À faire'}
                    {status === 'en_cours' && 'En cours'}
                    {status === 'terminee' && 'Terminée'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb">
            <label className="form-label">
              <Icon icon="bx:signal-3" className="label-icon" />
              <span>Priorité *</span>
            </label>
            <div className="radio-group">
              {(['faible', 'moyenne', 'haute'] as TaskPriority[]).map(priority => (
                <label key={priority} className="radio-label">
                  <input
                    type="radio"
                    name="priority"
                    value={priority}
                    checked={formData.priority === priority}
                    onChange={handleChange}
                    className="radio-input"
                    disabled={isSubmitting}
                  />
                  <span className={`radio-custom ${priority}`}></span>
                  <span className="radio-text">
                    {priority === 'faible' && 'Faible'}
                    {priority === 'moyenne' && 'Moyenne'}
                    {priority === 'haute' && 'Haute'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb">
            <label htmlFor="category_id" className="form-label">
              <Icon icon="bx:category" className="label-icon" />
              <span>Catégorie *</span>
            </label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="form-input"
              required
              disabled={isSubmitting}
            >
              <option value="">Sélectionnez une catégorie</option>
              {categories.map(category => (
                <option key={category.id} value={category.id.toString()}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {successMessage && (
          <motion.div
            className="success-message mbi"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <Icon icon="bx:check-circle" className="success-icon" />
            {successMessage}
          </motion.div>
        )}
        <div className="form-actions">
          <motion.button
            type="button"
            className="secondary-button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/tache')}
            disabled={isSubmitting}
          >
            <Icon icon="bx:arrow-back" />
            Retour
          </motion.button>
          
          <motion.button
            type="submit"
            className="primary-button"
            disabled={isSubmitting || !formData.title || !formData.description || 
                     !formData.start_datetime || !formData.end_datetime || 
                     !formData.category_id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? (
              <>
                <Icon icon="bx:loader-alt" className="spin-animation" />
                En cours...
              </>
            ) : (
              <>
                <Icon icon="bx:save" />
                Enregistrer
              </>
            )}
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
};

export default FrmTache;