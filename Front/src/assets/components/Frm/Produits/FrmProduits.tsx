import React, { useState } from 'react';
import './FrmProduits.css';
import { Icon } from '@iconify/react';

const FrmProduits = () => {
  const [produit, setProduit] = useState({
    nom: '',
    description: '',
    prix: '',
    categorie: '',
    stock: '',
    sku: '',
    fournisseur: ''
  });

  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduit(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Produit soumis:', produit);
    // Ici vous ajouteriez la logique pour envoyer les données au serveur
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>Formulaire Produit</h2>
        <div className="breadcrumb">
          <a href="/">Tableau de bord</a>
          <Icon icon="bx:chevron-right" className="breadcrumb-icon" />
          <a href="/produits">Produits</a>
          <Icon icon="bx:chevron-right" className="breadcrumb-icon" />
          <span className="active">Nouveau Produit</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="produit-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="nom">Nom du produit*</label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={produit.nom}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="categorie">Catégorie*</label>
            <select
              id="categorie"
              name="categorie"
              value={produit.categorie}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionnez une catégorie</option>
              <option value="electronique">Électronique</option>
              <option value="informatique">Informatique</option>
              <option value="mobilier">Mobilier</option>
              <option value="bureautique">Bureautique</option>
            </select>
          </div>

          <div className="form-group full-width">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={produit.description}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="prix">Prix unitaire (Ar)*</label>
            <input
              type="number"
              id="prix"
              name="prix"
              value={produit.prix}
              onChange={handleChange}
              min="0"
              step="100"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="stock">Stock disponible*</label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={produit.stock}
              onChange={handleChange}
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="sku">Référence SKU</label>
            <input
              type="text"
              id="sku"
              name="sku"
              value={produit.sku}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="fournisseur">Fournisseur</label>
            <input
              type="text"
              id="fournisseur"
              name="fournisseur"
              value={produit.fournisseur}
              onChange={handleChange}
            />
          </div>

        </div>
        <div className="form-group image-upload margin">
            <label htmlFor="image">Image du produit</label>
            <div className="upload-container">
                <label htmlFor="image" className="upload-btn">
                <Icon icon="bx:upload" className="upload-icon" />
                <span>Choisir une image</span>
                <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                />
                </label>
                {imagePreview && (
                <div className="image-preview">
                    <img src={imagePreview} alt="Aperçu du produit" />
                </div>
                )}
            </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel">
            Annuler
          </button>
          <button type="submit" className="btn-submit">
            Enregistrer le produit
          </button>
        </div>
      </form>
    </div>
  );
};

export default FrmProduits;