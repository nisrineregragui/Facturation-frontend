import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import clientService from '../../services/clientService';
import technicienService from '../../services/technicienService';
import appareilService from '../../services/appareilService';
import modeleService from '../../services/modeleService';
import magasinService from '../../services/magasinService';
import '../Clients/ClientForm.css'; // Reuse styles

const InterventionForm = ({ isOpen, onClose, onSubmit, initialData }) => {
  // Composite State
  const [formData, setFormData] = useState({
    // Client Info (New)
    client: {
      typeClient: 'particulier',
      nomContact: '',
      prenomContact: '',
      numTelephone: '',
      email: '',
      adresse: '',
      ville: ''
    },
    // Appareil Info (New)
    appareil: {
      modeleID: '',
      numeroSerie: '',
      dateAchat: '',
      finGarantie: ''
    },
    // Intervention Info
    intervention: {
      technicienID: '',
      magasinID: '', // Added Magasin
      dateDebut: new Date().toISOString().split('T')[0],
      panneReclamee: '',
      panneConstatee: '',
      travailEffectue: '',
      statut: 'Planifiée',
      bonReparation: '',
      notes: ''
    }
  });

  const [techniciens, setTechniciens] = useState([]);
  const [modeles, setModeles] = useState([]);
  const [magasins, setMagasins] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [techs, mods, mags] = await Promise.all([
          technicienService.getAll(),
          modeleService.getAll(),
          magasinService.getAll()
        ]);
        setTechniciens(techs);
        setModeles(mods);
        setMagasins(mags);
      } catch (err) {
        console.error("Error loading form data", err);
      }
    };
    if (isOpen) fetchData();
  }, [isOpen]);

  const handleClientChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, client: { ...prev.client, [name]: value } }));
  };

  const handleAppareilChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, appareil: { ...prev.appareil, [name]: value } }));
  };

  const handleInterventionChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, intervention: { ...prev.intervention, [name]: value } }));
  };

  // Initialize Form Data
  useEffect(() => {
    if (initialData) {
      setFormData({
        client: { nomContact: initialData.nomClient || '' },
        appareil: {
          modeleID: '',
          numeroSerie: '',
          dateAchat: '',
          finGarantie: ''
        },
        intervention: {
          technicienID: initialData.technicienID || '',
          magasinID: initialData.magasinID || '',
          dateDebut: initialData.dateDebut ? initialData.dateDebut.split('T')[0] : '',
          panneReclamee: initialData.panneReclamee || '',
          panneConstatee: initialData.panneConstatee || '',
          travailEffectue: initialData.travailEffectue || '',
          statut: initialData.statut || 'Planifiée',
          bonReparation: initialData.bonReparation || '',
          notes: initialData.notes || ''
        }
      });
    } else {
      setFormData({
        client: { typeClient: 'particulier', nomContact: '', prenomContact: '', numTelephone: '', email: '', adresse: '', ville: '' },
        appareil: { modeleID: '', numeroSerie: '', dateAchat: '', finGarantie: '' },
        intervention: { technicienID: '', magasinID: '', dateDebut: new Date().toISOString().split('T')[0], panneReclamee: '', panneConstatee: '', travailEffectue: '', statut: 'Planifiée', bonReparation: '', notes: '' }
      });
    }
  }, [initialData, isOpen]);

  // Auto-calculate FinGarantie (Create only)
  useEffect(() => {
    if (!initialData && formData.appareil.dateAchat) {
      const dateAchat = new Date(formData.appareil.dateAchat);
      const finGarantie = new Date(dateAchat);
      finGarantie.setFullYear(dateAchat.getFullYear() + 2);
      setFormData(prev => ({
        ...prev,
        appareil: { ...prev.appareil, finGarantie: finGarantie.toISOString().split('T')[0] }
      }));
    }
  }, [formData.appareil.dateAchat, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.intervention.magasinID) {
      alert("Le Magasin est obligatoire.");
      return;
    }
    setLoading(true);

    try {
      if (initialData) {
        // --- EDIT MODE ---
        console.log("Updating Intervention...", formData.intervention);
        const interventionPayload = {
          technicienID: formData.intervention.technicienID || null,
          magasinID: formData.intervention.magasinID,
          dateDebut: formData.intervention.dateDebut,
          panneReclamee: formData.intervention.panneReclamee,
          panneConstatee: formData.intervention.panneConstatee,
          travailEffectue: formData.intervention.travailEffectue,
          statut: formData.intervention.statut,
          bonReparation: formData.intervention.bonReparation,
          notes: formData.intervention.notes
        };
        await onSubmit(interventionPayload);

      } else {
        // --- CREATE MODE ---
        // 1. Create Client
        console.log("Creating Client...", formData.client);
        const newClient = await clientService.create(formData.client);
        const clientID = newClient.clientID || newClient.id;

        // 2. Create Appareil
        console.log("Creating Appareil...", formData.appareil);
        const appareilPayload = {
          clientID: clientID,
          modeleID: formData.appareil.modeleID,
          numeroSerie: formData.appareil.numeroSerie,
          dateAchat: formData.appareil.dateAchat,
          finGarantie: formData.appareil.finGarantie
        };
        const newAppareil = await appareilService.create(appareilPayload);
        const appareilID = newAppareil.appareilID || newAppareil.id;

        // 3. Create Intervention
        console.log("Creating Intervention...", formData.intervention);
        const interventionPayload = {
          clientID: clientID,
          appareilID: appareilID,
          technicienID: formData.intervention.technicienID || null,
          magasinID: formData.intervention.magasinID,
          dateDebut: formData.intervention.dateDebut,
          panneReclamee: formData.intervention.panneReclamee,
          panneConstatee: formData.intervention.panneConstatee,
          travailEffectue: formData.intervention.travailEffectue,
          statut: formData.intervention.statut,
          bonReparation: formData.intervention.bonReparation,
          notes: formData.intervention.notes
        };

        onSubmit(interventionPayload);
      }

    } catch (error) {
      console.error("Error in operation:", error);
      alert("Erreur lors de l'opération. Vérifiez les données.");
    } finally {
      setLoading(false);
    }
  };



  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="modal-header">
          <h2>{initialData ? 'Modifier Intervention' : 'Nouvelle Intervention (Création Complète)'}</h2>
          <button className="close-btn" onClick={onClose}><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="composite-form">

          {/* Context for Edit Mode */}
          {initialData && (
            <div className="form-section" style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
              <h3>Informations Contextuelles</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div><strong>Client:</strong> {initialData.nomClient}</div>
                <div><strong>Appareil:</strong> {initialData.nomAppareil}</div>
              </div>
            </div>
          )}

          {/* Create Mode Sections */}
          {!initialData && (
            <>
              {/* Section Client */}
              <div className="form-section">
                <h3>1. Nouveau Client</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Nom</label>
                    <input name="nomContact" value={formData.client.nomContact} onChange={handleClientChange} className="form-input" placeholder="Nom" required />
                  </div>
                  <div className="form-group">
                    <label>Prénom</label>
                    <input name="prenomContact" value={formData.client.prenomContact} onChange={handleClientChange} className="form-input" placeholder="Prénom" />
                  </div>
                  <div className="form-group">
                    <label>Téléphone</label>
                    <input name="numTelephone" value={formData.client.numTelephone} onChange={handleClientChange} className="form-input" placeholder="06..." required />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input name="email" value={formData.client.email} onChange={handleClientChange} className="form-input" placeholder="Email" />
                  </div>
                  <div className="form-group">
                    <label>Adresse</label>
                    <input name="adresse" value={formData.client.adresse} onChange={handleClientChange} className="form-input" placeholder="Adresse" />
                  </div>
                  <div className="form-group">
                    <label>Ville</label>
                    <input name="ville" value={formData.client.ville} onChange={handleClientChange} className="form-input" placeholder="Ville" />
                  </div>
                </div>
              </div>

              <hr style={{ margin: '1rem 0', borderColor: '#e2e8f0' }} />

              {/* Section Appareil */}
              <div className="form-section">
                <h3>2. Nouvel Appareil</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Modèle</label>
                    <select name="modeleID" value={formData.appareil.modeleID} onChange={handleAppareilChange} className="form-input" required>
                      <option value="">-- Choisir Modèle --</option>
                      {modeles.map(m => (
                        <option key={m.modeleID} value={m.modeleID}>{m.marque} - {m.designation}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Numéro Série</label>
                    <input name="numeroSerie" value={formData.appareil.numeroSerie} onChange={handleAppareilChange} className="form-input" placeholder="SN123456" required />
                  </div>
                  <div className="form-group">
                    <label>Date Achat</label>
                    <input type="date" name="dateAchat" value={formData.appareil.dateAchat} onChange={handleAppareilChange} className="form-input" required />
                  </div>
                  <div className="form-group">
                    <label>Fin Garantie</label>
                    <input type="date" name="finGarantie" value={formData.appareil.finGarantie} onChange={handleAppareilChange} className="form-input" required />
                  </div>
                </div>
              </div>

              <hr style={{ margin: '1rem 0', borderColor: '#e2e8f0' }} />
            </>
          )}

          {/* Section Intervention */}
          <div className="form-section">
            <h3>{initialData ? 'Détails Intervention' : '3. Détails Intervention'}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Technicien</label>
                <select name="technicienID" value={formData.intervention.technicienID} onChange={handleInterventionChange} className="form-input" required>
                  <option value="">-- Technicien --</option>
                  {techniciens.map(t => (
                    <option key={t.technicienID} value={t.technicienID}>{t.nom} {t.prenom}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Magasin (Optionnel)</label>
                <select name="magasinID" value={formData.intervention.magasinID || ''} onChange={handleInterventionChange} className="form-input">
                  <option value="">-- Aucun --</option>
                  {magasins.map(m => (
                    <option key={m.magasinID} value={m.magasinID}>{m.nomMagasin}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Date Début</label>
                <input type="date" name="dateDebut" value={formData.intervention.dateDebut} onChange={handleInterventionChange} className="form-input" required />
              </div>
              <div className="form-group">
                <label>Bon de Réparation</label>
                <input name="bonReparation" value={formData.intervention.bonReparation} onChange={handleInterventionChange} className="form-input" placeholder="N° Bon..." />
              </div>
            </div>
            <div className="form-group">
              <label>Notes d'Intervention</label>
              <textarea name="notes" value={formData.intervention.notes} onChange={handleInterventionChange} className="form-input" rows="2" placeholder="Notes internes..." />
            </div>
            <div className="form-group">
              <label>Panne Réclamée</label>
              <textarea name="panneReclamee" value={formData.intervention.panneReclamee} onChange={handleInterventionChange} className="form-input" rows="2" required />
            </div>
            <div className="form-group">
              <label>Panne Constatée</label>
              <textarea name="panneConstatee" value={formData.intervention.panneConstatee} onChange={handleInterventionChange} className="form-input" rows="2" />
            </div>
            <div className="form-group">
              <label>Travail Effectué</label>
              <textarea name="travailEffectue" value={formData.intervention.travailEffectue} onChange={handleInterventionChange} className="form-input" rows="2" />
            </div>
            <div className="form-group">
              <label>Statut</label>
              <select name="statut" value={formData.intervention.statut} onChange={handleInterventionChange} className="form-input">
                <option value="Planifiée">Planifiée</option>
                <option value="En Cours">En Cours</option>
                <option value="Terminée">Terminée</option>
                <option value="Annulée">Annulée</option>
                <option value="À Facturer">À Facturer</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-cancel" disabled={loading}>Annuler</button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Enregistrement...' : (initialData ? 'Modifier' : 'Créer Tout')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InterventionForm;
