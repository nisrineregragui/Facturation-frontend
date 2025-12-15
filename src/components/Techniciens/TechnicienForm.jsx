import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import '../Clients/ClientForm.css'; // Reuse styles

const TechnicienForm = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        cin: '',
        specialite: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                nom: '',
                prenom: '',
                cin: '',
                specialite: ''
            });
        }
    }, [initialData, isOpen]);

    const validate = () => {
        const newErrors = {};
        if (!formData.nom) newErrors.nom = 'Nom est obligatoire';
        if (!formData.prenom) newErrors.prenom = 'Prénom est obligatoire';
        if (!formData.cin) newErrors.cin = 'CIN est obligatoire';
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
                    <h2>{initialData ? 'Modifier Technicien' : 'Nouveau Technicien'}</h2>
                    <button className="close-btn" onClick={onClose}><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Nom</label>
                            <input
                                name="nom"
                                value={formData.nom}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Nom"
                            />
                            {errors.nom && <p className="error-msg">{errors.nom}</p>}
                        </div>

                        <div className="form-group">
                            <label>Prénom</label>
                            <input
                                name="prenom"
                                value={formData.prenom}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Prénom"
                            />
                            {errors.prenom && <p className="error-msg">{errors.prenom}</p>}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>CIN</label>
                        <input
                            name="cin"
                            value={formData.cin}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="CIN"
                        />
                        {errors.cin && <p className="error-msg">{errors.cin}</p>}
                    </div>

                    <div className="form-group">
                        <label>Spécialité</label>
                        <input
                            name="specialite"
                            value={formData.specialite}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Ex: Réparation"
                        />
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

export default TechnicienForm;
