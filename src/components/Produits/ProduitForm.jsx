import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import '../Clients/ClientForm.css'; // Reuse styles

const ProduitForm = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({
        nom: '',
        reference: '',
        typeArticle: 'Service',
        prixUnitaireHT: 0,
        tauxTVA: 20
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                nom: '',
                reference: '',
                typeArticle: 'Service',
                prixUnitaireHT: 0,
                tauxTVA: 20
            });
        }
    }, [initialData, isOpen]);

    const validate = () => {
        const newErrors = {};
        if (!formData.nom) newErrors.nom = 'Nom est obligatoire';
        if (!formData.typeArticle) newErrors.typeArticle = 'Type est obligatoire';
        if (formData.prixUnitaireHT < 0) newErrors.prixUnitaireHT = 'Prix ne peut pas être négatif';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit({
                ...formData,
                prixUnitaireHT: parseFloat(formData.prixUnitaireHT),
                tauxTVA: parseFloat(formData.tauxTVA)
            });
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
                    <h2>{initialData ? 'Modifier Article' : 'Nouvel Article'}</h2>
                    <button className="close-btn" onClick={onClose}><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nom</label>
                        <input
                            name="nom"
                            value={formData.nom}
                            onChange={handleChange}
                            className="form-input"
                        />
                        {errors.nom && <p className="error-msg">{errors.nom}</p>}
                    </div>

                    <div className="form-group">
                        <label>Référence</label>
                        <input
                            name="reference"
                            value={formData.reference}
                            onChange={handleChange}
                            className="form-input"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Type</label>
                            <select
                                name="typeArticle"
                                value={formData.typeArticle}
                                onChange={handleChange}
                                className="form-input"
                            >
                                <option value="Service">Service</option>
                                <option value="Pièce">Pièce</option>
                                <option value="Forfait">Forfait</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>TVA (%)</label>
                            <input
                                type="number"
                                name="tauxTVA"
                                value={formData.tauxTVA}
                                onChange={handleChange}
                                className="form-input"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Prix Unitaire HT (DH)</label>
                        <input
                            type="number"
                            step="0.01"
                            name="prixUnitaireHT"
                            value={formData.prixUnitaireHT}
                            onChange={handleChange}
                            className="form-input"
                        />
                        {errors.prixUnitaireHT && <p className="error-msg">{errors.prixUnitaireHT}</p>}
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

export default ProduitForm;
