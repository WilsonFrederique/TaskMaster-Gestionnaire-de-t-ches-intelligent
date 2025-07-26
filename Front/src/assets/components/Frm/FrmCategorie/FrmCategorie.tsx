import { useState } from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import './FrmCategorie.css';

const FrmCategorie = () => {
  const [categoryName, setCategoryName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simuler une requête API
    setTimeout(() => {
      console.log('Catégorie soumise:', { name: categoryName });
      setSuccessMessage('Catégorie créée avec succès!');
      setCategoryName('');
      setIsSubmitting(false);
      
      // Effacer le message après 3 secondes
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 1000);
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
            <a href="/categorie" className="breadcrumb-link">Tâches</a>
            <Icon icon="bx:chevron-right" className="breadcrumb-icon" />
            <a href="#" className="breadcrumb-link active">Nouveau tâches</a>
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
        <div className="">
          <div className="form-label">
            <div>
              <span>Nom de la catégorie</span>
            </div>
          </div>
          <input
            type="text"
            id="categoryName"
            value={categoryName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCategoryName(e.target.value)}
            placeholder="Ex: Projet Client"
            className="form-input"
            required
            maxLength={100}
          />
          <small className="input-hint">
            Maximum 100 caractères (reste: {100 - categoryName.length})
          </small>
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

export default FrmCategorie;