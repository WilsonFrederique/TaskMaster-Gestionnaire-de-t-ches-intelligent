import React, { useState } from 'react';
import './FrmClients.css';
import { Icon } from '@iconify/react';

const FrmClients = () => {
  const [client, setClient] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    ville: '',
    codePostal: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClient(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Client soumis:', client);
    // Ici vous ajouteriez la logique pour envoyer les données au serveur
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>Formulaire Client</h2>
        <div className="breadcrumb">
          <a href="/">Tableau de bord</a>
          <Icon icon="bx:chevron-right" className="breadcrumb-icon" />
          <a href="/clients">Clients</a>
          <Icon icon="bx:chevron-right" className="breadcrumb-icon" />
          <span className="active">Nouveau Client</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="client-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="nom">Nom*</label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={client.nom}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="prenom">Prénom*</label>
            <input
              type="text"
              id="prenom"
              name="prenom"
              value={client.prenom}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={client.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="telephone">Téléphone*</label>
            <input
              type="tel"
              id="telephone"
              name="telephone"
              value={client.telephone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="adresse">Adresse</label>
            <input
              type="text"
              id="adresse"
              name="adresse"
              value={client.adresse}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="ville">Ville</label>
            <input
              type="text"
              id="ville"
              name="ville"
              value={client.ville}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="codePostal">Code Postal</label>
            <input
              type="text"
              id="codePostal"
              name="codePostal"
              value={client.codePostal}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel">
            Annuler
          </button>
          <button type="submit" className="btn-submit">
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
};

export default FrmClients;