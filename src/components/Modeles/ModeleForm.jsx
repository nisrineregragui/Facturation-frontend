import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import '../Clients/ClientForm.css'; // Reuse styles

const ModeleForm = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({
        marque: '',
        designation: '',
        referenceGenerique: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                marque: '',
                designation: '',
                referenceGenerique: ''
            });
        }
    }, [initialData, isOpen]);

    const validate = () => {
        const newErrors = {};
        if (!formData.marque) newErrors.marque = 'Marque obligatoire';
        if (!formData.designation) newErrors.designation = 'Désignation obligatoire';
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
                    <h2>{initialData ? 'Modifier Modèle' : 'Nouveau Modèle'}</h2>
                    <button className="close-btn" onClick={onClose}><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Marque</label>
                        <input
                            name="marque"
                            value={formData.marque}
                            onChange={handleChange}
                            className="form-input"
                        />
                        {errors.marque && <p className="error-msg">{errors.marque}</p>}
                    </div>

                    <div className="form-group">
                        <label>Désignation</label>
                        <input
                            name="designation"
                            value={formData.designation}
                            onChange={handleChange}
                            className="form-input"
                        />
                        {errors.designation && <p className="error-msg">{errors.designation}</p>}
                    </div>

                    <div className="form-group">
                        <label>Référence Générique</label>
                        <input
                            name="referenceGenerique"
                            value={formData.referenceGenerique}
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

export default ModeleForm;
