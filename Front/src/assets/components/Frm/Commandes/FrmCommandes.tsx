import React, { useState } from 'react';
import './FrmCommandes.css';
import { Icon } from '@iconify/react';

const FrmCommandes = () => {
  const [commande, setCommande] = useState({
    client: '',
    date: '',
    statut: 'en attente',
    produits: [],
    montantTotal: '',
    modePaiement: '',
    adresseLivraison: ''
  });

  const [produitAjout, setProduitAjout] = useState({
    produitId: '',
    quantite: 1,
    prixUnitaire: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCommande(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProduitChange = (e) => {
    const { name, value } = e.target;
    setProduitAjout(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const ajouterProduit = () => {
    if (produitAjout.produitId && produitAjout.quantite > 0) {
      const nouveauProduit = {
        ...produitAjout,
        total: produitAjout.quantite * produitAjout.prixUnitaire
      };
      
      setCommande(prev => ({
        ...prev,
        produits: [...prev.produits, nouveauProduit],
        montantTotal: prev.montantTotal + nouveauProduit.total
      }));
      
      setProduitAjout({
        produitId: '',
        quantite: 1,
        prixUnitaire: ''
      });
    }
  };

  const supprimerProduit = (index) => {
    const produitASupprimer = commande.produits[index];
    setCommande(prev => ({
      ...prev,
      produits: prev.produits.filter((_, i) => i !== index),
      montantTotal: prev.montantTotal - produitASupprimer.total
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Commande soumise:', commande);
    // Logique pour envoyer les données au serveur
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>Formulaire Commande</h2>
        <div className="breadcrumb">
          <a href="/">Tableau de bord</a>
          <Icon icon="bx:chevron-right" className="breadcrumb-icon" />
          <a href="/commandes">Commandes</a>
          <Icon icon="bx:chevron-right" className="breadcrumb-icon" />
          <span className="active">Nouvelle Commande</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="commande-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="client">Client*</label>
            <input
              type="text"
              id="client"
              name="client"
              value={commande.client}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">Date*</label>
            <input
              type="date"
              id="date"
              name="date"
              value={commande.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="statut">Statut*</label>
            <select
              id="statut"
              name="statut"
              value={commande.statut}
              onChange={handleChange}
              required
            >
              <option value="en attente">En attente</option>
              <option value="en cours">En cours de traitement</option>
              <option value="expediee">Expédiée</option>
              <option value="livree">Livrée</option>
              <option value="annulee">Annulée</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="modePaiement">Mode de paiement*</label>
            <select
              id="modePaiement"
              name="modePaiement"
              value={commande.modePaiement}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionnez un mode</option>
              <option value="especes">Espèces</option>
              <option value="cheque">Chèque</option>
              <option value="virement">Virement</option>
              <option value="mobile">Paiement mobile</option>
              <option value="carte">Carte bancaire</option>
            </select>
          </div>

          <div className="form-group full-width">
            <label htmlFor="adresseLivraison">Adresse de livraison</label>
            <textarea
              id="adresseLivraison"
              name="adresseLivraison"
              value={commande.adresseLivraison}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-group full-width">
            <label>Produits commandés*</label>
            <div className="produits-container">
              <div className="ajout-produit">
                <select
                  name="produitId"
                  value={produitAjout.produitId}
                  onChange={handleProduitChange}
                  className="produit-select"
                  required
                >
                  <option value="">Sélectionnez un produit</option>
                  <option value="1">Produit 1</option>
                  <option value="2">Produit 2</option>
                  <option value="3">Produit 3</option>
                </select>
                <input
                  type="number"
                  name="quantite"
                  value={produitAjout.quantite}
                  onChange={handleProduitChange}
                  min="1"
                  placeholder="Quantité"
                  className="quantite-input"
                  required
                />
                <input
                  type="number"
                  name="prixUnitaire"
                  value={produitAjout.prixUnitaire}
                  onChange={handleProduitChange}
                  min="0"
                  step="100"
                  placeholder="Prix unitaire"
                  className="prix-input"
                  required
                />
                <button type="button" onClick={ajouterProduit} className="btn-ajouter">
                  <Icon icon="bx:plus" /> Ajouter
                </button>
              </div>

              {commande.produits.length > 0 && (
                <div className="liste-produits">
                  <table>
                    <thead>
                      <tr>
                        <th>Produit</th>
                        <th>Quantité</th>
                        <th>Prix unitaire</th>
                        <th>Total</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {commande.produits.map((produit, index) => (
                        <tr key={index}>
                          <td>Produit {produit.produitId}</td>
                          <td>{produit.quantite}</td>
                          <td>{produit.prixUnitaire} Ar</td>
                          <td>{produit.total} Ar</td>
                          <td>
                            <button 
                              type="button" 
                              onClick={() => supprimerProduit(index)}
                              className="btn-supprimer"
                            >
                              <Icon icon="bx:trash" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

        </div>
        <div className="form-group margin">
        <label htmlFor="montantTotal">Montant total (Ar)</label>
        <input
            type="number"
            id="montantTotal"
            name="montantTotal"
            value={commande.montantTotal}
            readOnly
            className="montant-total"
        />
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel">
            Annuler
          </button>
          <button type="submit" className="btn-submit">
            Enregistrer la commande
          </button>
        </div>
      </form>
    </div>
  );
};

export default FrmCommandes;