import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import './FrmTache.css';

const FrmTache = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_datetime: '',
    end_datetime: '',
    image_path: null,
    status: 'a_faire',
    priority: 'moyenne',
    category_id: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image_path: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simuler une requête API
    setTimeout(() => {
      console.log('Tâche soumise:', formData);
      setSuccessMessage('Tâche créée avec succès!');
      setFormData({
        title: '',
        description: '',
        start_datetime: '',
        end_datetime: '',
        image_path: null,
        status: 'a_faire',
        priority: 'moyenne',
        category_id: ''
      });
      setPreviewImage(null);
      setIsSubmitting(false);
      
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 1500);
  };

  return (
    <div className="frm-container">
      {/* Main Header */}
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
        <div className="">
          {/* Titre */}
          <div className="">
            <label htmlFor="title" className="form-label">
              <Icon icon="bx:rename" className="label-icon" />
              <span>Titre de la tâche</span>
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
            />
            <small className="input-hint mb">
              Maximum 200 caractères (reste: {200 - formData.title.length})
            </small>
          </div>

          {/* Description */}
          <div className="">
            <label htmlFor="description" className="form-label">
              <Icon icon="bx:detail" className="label-icon" />
              <span>Description</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Décrivez la tâche en détail..."
              className="form-input textarea mb"
              rows="5"
              required
            />
          </div>

          {/* Dates */}
          <div className="">
            <label className="form-label">
              <Icon icon="bx:calendar" className="label-icon" />
              <span>Période</span>
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
                />
              </div>
              <div className="date-group mb">
                <label htmlFor="end_datetime" className="date-label">Fin</label>
                <input
                  type="datetime-local"
                  id="end_datetime"
                  name="end_datetime"
                  value={formData.end_datetime}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="form-group">
            <label htmlFor="image_path" className="form-label">
              <Icon icon="bx:image-add" className="label-icon" />
              <span>Image (optionnel)</span>
            </label>
            <div className="image-upload mbi">
              <input
                type="file"
                id="image_path"
                name="image_path"
                onChange={handleFileChange}
                accept="image/*"
                className="file-input mb"
              />
              <label htmlFor="image_path" className="file-label">
                {/* <Icon icon="bx:upload" /> */}
                &nbsp;&nbsp;
                <span>{previewImage ? 'Changer l\'image' : 'Choisir une image'}</span>
              </label>
              {previewImage && (
                <div className="image-preview mbi">
                  <img src={previewImage} alt="Aperçu" className="preview-image" />
                </div>
              )}
            </div>
          </div>

          {/* Status et Priorité */}
          <div className="form-group">
            <label className="form-label">
              <Icon icon="bx:list-check" className="label-icon" />
              <span>Statut</span>
            </label>
            <div className="radio-group">
              {['a_faire', 'en_cours', 'termine', 'annule'].map(status => (
                <label key={status} className="radio-label mb">
                  <input
                    type="radio"
                    name="status"
                    value={status}
                    checked={formData.status === status}
                    onChange={handleChange}
                    className="radio-input"
                  />
                  <span className="radio-custom"></span>
                  <span className="radio-text">
                    {status === 'a_faire' && 'À faire'}
                    {status === 'en_cours' && 'En cours'}
                    {status === 'termine' && 'Terminé'}
                    {status === 'annule' && 'Annulé'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <Icon icon="bx:signal-3" className="label-icon" />
              <span>Priorité</span>
            </label>
            <div className="radio-group">
              {['basse', 'moyenne', 'haute', 'urgente'].map(priority => (
                <label key={priority} className="radio-label mb">
                  <input
                    type="radio"
                    name="priority"
                    value={priority}
                    checked={formData.priority === priority}
                    onChange={handleChange}
                    className="radio-input"
                  />
                  <span className={`radio-custom ${priority}`}></span>
                  <span className="radio-text">
                    {priority === 'basse' && 'Basse'}
                    {priority === 'moyenne' && 'Moyenne'}
                    {priority === 'haute' && 'Haute'}
                    {priority === 'urgente' && 'Urgente'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Catégorie */}
          <div className="">
            <label htmlFor="category_id" className="form-label">
              <Icon icon="bx:category" className="label-icon" />
              <span>Catégorie</span>
            </label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="">Sélectionnez une catégorie</option>
              <option value="1">Travail</option>
              <option value="2">Personnel</option>
              <option value="3">Études</option>
              <option value="4">Projet</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <motion.button
            type="button"
            className="secondary-button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.history.back()}
          >
            <Icon icon="bx:arrow-back" />
            Retour
          </motion.button>
          
          <motion.button
            type="submit"
            className="primary-button"
            disabled={isSubmitting || !formData.title || !formData.description || !formData.start_datetime || !formData.end_datetime || !formData.category_id}
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

        {successMessage && (
          <motion.div
            className="success-message"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <Icon icon="bx:check-circle" className="success-icon" />
            {successMessage}
          </motion.div>
        )}
      </motion.form>
    </div>
  );
};

export default FrmTache;