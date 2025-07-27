import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { CategoryService } from '../../../../services/Categories_api';
import './FrmCategorie.css';

const FrmCategorie = () => {
  const [categoryName, setCategoryName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!categoryName.trim()) {
      setErrorMessage('Le nom de la catégorie est requis');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const newCategory = await CategoryService.create({ name: categoryName });
      console.log('Catégorie créée:', newCategory);
      
      setSuccessMessage(`Catégorie "${newCategory.name}" créée avec succès!`);
      setCategoryName('');
      
      // Redirection après 3 secondes
      setTimeout(() => {
        navigate('/categorie');
      }, 3000);
    } catch (error) {
      console.error('Erreur création catégorie:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
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
            <span className="gradient-text">Gestion des Catégories</span>
          </h1>
          <nav className="breadcrumb">
            <a href="/" className="breadcrumb-link">Tableau de bord</a>
            <Icon icon="bx:chevron-right" className="breadcrumb-icon" />
            <a href="/categorie" className="breadcrumb-link">Catégories</a>
            <Icon icon="bx:chevron-right" className="breadcrumb-icon" />
            <a href="#" className="breadcrumb-link active">Nouvelle catégorie</a>
          </nav>
        </div>
      </motion.header>

      <motion.form
        onSubmit={handleSubmit}
        className="category-form glassmorphism"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <div>
          {successMessage && (
            <motion.div
              className="success-message mb"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <Icon icon="bx:check-circle" className="success-icon" />
              {successMessage}
            </motion.div>
          )}
          <div className="form-label">
            <div>
              <span>Nom de la catégorie</span>
            </div>
          </div>
          <input
            type="text"
            id="categoryName"
            value={categoryName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setCategoryName(e.target.value);
              setErrorMessage(''); // Effacer l'erreur lors de la modification
            }}
            placeholder="Ex: Projet Client"
            className={`form-input ${errorMessage ? 'error' : ''}`}
            required
            maxLength={100}
            disabled={isSubmitting}
          />
          <small className="input-hint">
            Maximum 100 caractères (reste: {100 - categoryName.length})
          </small>
          {errorMessage && (
            <motion.div 
              className="error-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Icon icon="bx:error-circle" className="error-icon" />
              {errorMessage}
            </motion.div>
          )}
        </div>

        <div className="form-actions">
          <motion.button
            type="button"
            className="secondary-button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/categorie')}
            disabled={isSubmitting}
          >
            <Icon icon="bx:arrow-back" />
            Retour
          </motion.button>
          
          <motion.button
            type="submit"
            className="primary-button"
            disabled={!categoryName.trim() || isSubmitting}
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

export default FrmCategorie;