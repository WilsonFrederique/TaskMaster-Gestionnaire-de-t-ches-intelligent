import { useState, ChangeEvent, FormEvent } from 'react';
import './ContainerParametres.css';
import { Icon } from '@iconify/react';

// Définition des types
interface Settings {
  nomEntreprise: string;
  emailContact: string;
  adresse: string;
  telephone: string;
  devise: string;
  tva: number;
  logo: File | null;
  theme: 'light' | 'dark';
  notificationsEmail: boolean;
  notificationsSms: boolean;
}

const ContainerParametres = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'entreprise' | 'notifications' | 'apparence'>('general');
  
  const [settings, setSettings] = useState<Settings>({
    nomEntreprise: 'Mon Entreprise',
    emailContact: 'contact@entreprise.com',
    adresse: '123 Rue Principale, Ville',
    telephone: '+261 34 12 345 67',
    devise: 'MGA',
    tva: 20,
    logo: null,
    theme: 'light',
    notificationsEmail: true,
    notificationsSms: false
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setSettings(prev => ({ ...prev, logo: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('Paramètres sauvegardés:', settings);
    // Ici vous ajouteriez la logique pour envoyer les données au serveur
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>Paramètres</h2>
        <div className="breadcrumb">
          <a href="/">Tableau de bord</a>
          <Icon icon="bx:chevron-right" className="breadcrumb-icon" />
          <span className="active">Paramètres</span>
        </div>
      </div>

      <div className="settings-content">
        <div className="settings-tabs">
          <button 
            className={`tab-btn ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            <Icon icon="bx:cog" className="tab-icon" />
            Général
          </button>
          <button 
            className={`tab-btn ${activeTab === 'entreprise' ? 'active' : ''}`}
            onClick={() => setActiveTab('entreprise')}
          >
            <Icon icon="bx:building" className="tab-icon" />
            Entreprise
          </button>
          <button 
            className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <Icon icon="bx:bell" className="tab-icon" />
            Notifications
          </button>
          <button 
            className={`tab-btn ${activeTab === 'apparence' ? 'active' : ''}`}
            onClick={() => setActiveTab('apparence')}
          >
            <Icon icon="bx:palette" className="tab-icon" />
            Apparence
          </button>
        </div>

        <form onSubmit={handleSubmit} className="settings-form">
          {activeTab === 'general' && (
            <div className="tab-content">
              <div className="form-group">
                <label htmlFor="nomEntreprise">Nom de l'entreprise*</label>
                <input
                  type="text"
                  id="nomEntreprise"
                  name="nomEntreprise"
                  value={settings.nomEntreprise}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="emailContact">Email de contact*</label>
                <input
                  type="email"
                  id="emailContact"
                  name="emailContact"
                  value={settings.emailContact}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="telephone">Téléphone</label>
                <input
                  type="tel"
                  id="telephone"
                  name="telephone"
                  value={settings.telephone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="devise">Devise*</label>
                <select
                  id="devise"
                  name="devise"
                  value={settings.devise}
                  onChange={handleChange}
                  required
                >
                  <option value="MGA">Ariary (MGA)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="USD">Dollar (USD)</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'entreprise' && (
            <div className="tab-content">
              <div className="form-group">
                <label htmlFor="adresse">Adresse</label>
                <textarea
                  id="adresse"
                  name="adresse"
                  value={settings.adresse}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label htmlFor="tva">Taux de TVA (%)</label>
                <input
                  type="number"
                  id="tva"
                  name="tva"
                  value={settings.tva}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>

              <div className="form-group image-upload">
                <label>Logo de l'entreprise</label>
                <div className="upload-container">
                  <label htmlFor="logo" className="upload-btn">
                    <Icon icon="bx:upload" className="upload-icon" />
                    <span>{imagePreview ? 'Changer le logo' : 'Choisir un logo'}</span>
                    <input
                      type="file"
                      id="logo"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                  {imagePreview && (
                    <div className="image-preview">
                      <img src={imagePreview} alt="Logo de l'entreprise" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="tab-content">
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="notificationsEmail"
                    checked={settings.notificationsEmail}
                    onChange={handleChange}
                  />
                  <span className="checkbox-custom"></span>
                  Notifications par email
                </label>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="notificationsSms"
                    checked={settings.notificationsSms}
                    onChange={handleChange}
                  />
                  <span className="checkbox-custom"></span>
                  Notifications par SMS
                </label>
              </div>
            </div>
          )}

          {activeTab === 'apparence' && (
            <div className="tab-content">
              <div className="form-group">
                <label>Thème de l'application</label>
                <div className="theme-options">
                  <label className="theme-option">
                    <input
                      type="radio"
                      name="theme"
                      value="light"
                      checked={settings.theme === 'light'}
                      onChange={handleChange}
                    />
                    <div className="theme-preview light">
                      <Icon icon="bx:sun" className="theme-icon" />
                      <span>Clair</span>
                    </div>
                  </label>
                  <label className="theme-option">
                    <input
                      type="radio"
                      name="theme"
                      value="dark"
                      checked={settings.theme === 'dark'}
                      onChange={handleChange}
                    />
                    <div className="theme-preview dark">
                      <Icon icon="bx:moon" className="theme-icon" />
                      <span>Sombre</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="btn-cancel">
              Annuler
            </button>
            <button type="submit" className="btn-submit">
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContainerParametres;