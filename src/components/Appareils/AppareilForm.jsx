import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import clientService from '../../services/clientService';
import '../Clients/ClientForm.css'; // Reuse styles

const AppareilForm = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({
        clientID: '',
        modeleID: '',
        numeroSerie: '',
        dateAchat: '',
        finGarantie: ''
    });
    const [clients, setClients] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        // Fetch clients for dropdown
        const fetchClients = async () => {
            try {
                const data = await clientService.getAll();
                setClients(data);
            } catch (err) { console.error(err) }
        };
        if (isOpen) fetchClients();
    }, [isOpen]);

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                dateAchat: initialData.dateAchat ? initialData.dateAchat.split('T')[0] : '',
                finGarantie: initialData.finGarantie ? initialData.finGarantie.split('T')[0] : ''
            });
        } else {
            setFormData({
                clientID: '',
                modeleID: '', // Ideally dropdown, text for now
                numeroSerie: '',
                dateAchat: '',
                finGarantie: ''
            });
        }
    }, [initialData, isOpen]);

    const validate = () => {
        const newErrors = {};
        if (!formData.clientID) newErrors.clientID = 'Le client est obligatoire';
        if (!formData.modeleID) newErrors.modeleID = 'Le modèle est obligatoire (UUID)';
        if (!formData.numeroSerie) newErrors.numeroSerie = 'Numéro de série est obligatoire';
        if (!formData.dateAchat) newErrors.dateAchat = 'Date achat requise';
        if (!formData.finGarantie) newErrors.finGarantie = 'Fin garantie requise';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{initialData ? 'Modifier Appareil' : 'Nouvel Appareil'}</h2>
                    <button className="close-btn" onClick={onClose}><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Client</label>
                        <select
                            name="clientID"
                            value={formData.clientID}
                            onChange={handleChange}
                            className="form-input"
                        >
                            <option value="">Sélectionner un client</option>
                            {clients.map(c => (
                                <option key={c.clientID} value={c.clientID}>
                                    {c.nomContact} {c.prenomContact}
                                </option>
                            ))}
                        </select>
                        {errors.clientID && <p className="error-msg">{errors.clientID}</p>}
                    </div>

                    <div className="form-group">
                        <label>Modele ID (UUID)</label>
                        <input
                            name="modeleID"
                            value={formData.modeleID}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="e.g. 3fa85f64-..."
                        />
                        {errors.modeleID && <p className="error-msg">{errors.modeleID}</p>}
                    </div>

                    <div className="form-group">
                        <label>Numéro de Série</label>
                        <input
                            name="numeroSerie"
                            value={formData.numeroSerie}
                            onChange={handleChange}
                            className="form-input"
                        />
                        {errors.numeroSerie && <p className="error-msg">{errors.numeroSerie}</p>}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Date Achat</label>
                            <input
                                type="date"
                                name="dateAchat"
                                value={formData.dateAchat}
                                onChange={handleChange}
                                className="form-input"
                            />
                            {errors.dateAchat && <p className="error-msg">{errors.dateAchat}</p>}
                        </div>

                        <div className="form-group">
                            <label>Fin Garantie</label>
                            <input
                                type="date"
                                name="finGarantie"
                                value={formData.finGarantie}
                                onChange={handleChange}
                                className="form-input"
                            />
                            {errors.finGarantie && <p className="error-msg">{errors.finGarantie}</p>}
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={onClose} className="btn-cancel">Annuler</button>
                        <button type="submit" className="btn-submit">
                            {initialData ? 'Enregistrer' : 'Créer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AppareilForm;
