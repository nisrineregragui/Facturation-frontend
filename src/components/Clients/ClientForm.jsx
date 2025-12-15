import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import magasinService from '../../services/magasinService';
import './ClientForm.css';

const ClientForm = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({
        typeClient: 'particulier',
        nomContact: '',
        prenomContact: '',
        numTelephone: '',
        email: '',
        adresse: '',
        ville: '',
        magasinPartenaireID: null
    });
    const [errors, setErrors] = useState({});
    const [magasins, setMagasins] = useState([]);

    useEffect(() => {
        const fetchMagasins = async () => {
            try {
                const data = await magasinService.getAll();
                setMagasins(data);
            } catch (error) {
                console.error("Error fetching magasins:", error);
            }
        };
        fetchMagasins();
    }, []);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                typeClient: 'particulier',
                nomContact: '',
                prenomContact: '',
                numTelephone: '',
                email: '',
                adresse: '',
                ville: '',
                magasinPartenaireID: null
            });
        }
    }, [initialData, isOpen]);

    const validate = () => {
        const newErrors = {};
        if (!formData.nomContact) newErrors.nomContact = 'Nom est obligatoire';
        if (!formData.numTelephone) newErrors.numTelephone = 'Téléphone est obligatoire';
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

    const handleMagasinChange = (e) => {
        const selectedId = e.target.value;
        if (!selectedId) {
            setFormData(prev => ({
                ...prev,
                magasinPartenaireID: null,
                nomContact: ''
            }));
            return;
        }

        const selectedMagasin = magasins.find(m => m.magasinID === selectedId);
        if (selectedMagasin) {
            setFormData(prev => ({
                ...prev,
                magasinPartenaireID: selectedId,
                nomContact: selectedMagasin.nomMagasin,
                ville: selectedMagasin.ville || prev.ville
            }));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{initialData ? 'Modifier Client' : 'Nouveau Client'}</h2>
                    <button className="close-btn" onClick={onClose}><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Type Client</label>
                        <select
                            name="typeClient"
                            value={formData.typeClient}
                            onChange={(e) => {
                                handleChange(e);
                                if (e.target.value !== 'magasin') {
                                    setFormData(prev => ({ ...prev, magasinPartenaireID: null, nomContact: '' }));
                                }
                            }}
                            className="form-input"
                        >
                            <option value="particulier">Particulier</option>
                            <option value="magasin">Magasin Partenaire</option>
                        </select>
                    </div>

                    {formData.typeClient === 'magasin' && (
                        <div className="form-group">
                            <label>Sélectionnez le Magasin</label>
                            <select
                                name="magasinPartenaireID"
                                value={formData.magasinPartenaireID || ''}
                                onChange={handleMagasinChange}
                                className="form-input"
                            >
                                <option value="">-- Choisir un magasin --</option>
                                {magasins.map(m => (
                                    <option key={m.magasinID} value={m.magasinID}>
                                        {m.nomMagasin} - {m.ville}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Nom {formData.typeClient === 'magasin' ? '(Auto-rempli)' : '(Contact)'}</label>
                            <input
                                name="nomContact"
                                value={formData.nomContact}
                                onChange={handleChange}
                                className="form-input"
                                placeholder={formData.typeClient === 'magasin' ? 'Nom du magasin' : 'Nom'}
                                readOnly={formData.typeClient === 'magasin'}
                            />
                            {errors.nomContact && <p className="error-msg">{errors.nomContact}</p>}
                        </div>

                        <div className="form-group">
                            <label>Prénom</label>
                            <input
                                name="prenomContact"
                                value={formData.prenomContact}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Prénom"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Téléphone</label>
                        <input
                            name="numTelephone"
                            value={formData.numTelephone}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="+212 ..."
                        />
                        {errors.numTelephone && <p className="error-msg">{errors.numTelephone}</p>}
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="form-input"
                            type="email"
                            placeholder="client@example.com"
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Adresse</label>
                            <input
                                name="adresse"
                                value={formData.adresse}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Adresse complète"
                            />
                        </div>

                        <div className="form-group">
                            <label>Ville</label>
                            <input
                                name="ville"
                                value={formData.ville}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Ville"
                            />
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

export default ClientForm;
