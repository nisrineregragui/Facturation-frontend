import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import '../Clients/ClientForm.css'; // Reuse styles

const MagasinForm = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({
        nomMagasin: '',
        numResponsable: '',
        ville: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                nomMagasin: '',
                numResponsable: '',
                ville: ''
            });
        }
    }, [initialData, isOpen]);

    const validate = () => {
        const newErrors = {};
        if (!formData.nomMagasin) newErrors.nomMagasin = 'Nom du magasin est obligatoire';
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
                    <h2>{initialData ? 'Modifier Magasin' : 'Nouveau Magasin'}</h2>
                    <button className="close-btn" onClick={onClose}><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nom du Magasin</label>
                        <input
                            name="nomMagasin"
                            value={formData.nomMagasin}
                            onChange={handleChange}
                            className="form-input"
                        />
                        {errors.nomMagasin && <p className="error-msg">{errors.nomMagasin}</p>}
                    </div>

                    <div className="form-group">
                        <label>Nom/Numéro Responsable</label>
                        <input
                            name="numResponsable"
                            value={formData.numResponsable}
                            onChange={handleChange}
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label>Ville</label>
                        <input
                            name="ville"
                            value={formData.ville}
                            onChange={handleChange}
                            className="form-input"
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

export default MagasinForm;
