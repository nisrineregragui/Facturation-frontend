import React, { useEffect, useState } from 'react';
import entrepriseService from '../services/entrepriseService';
import { Save, Building, Phone, Mail, MapPin, Briefcase, FileText } from 'lucide-react';
import './Settings.css';

const Settings = () => {
    const [formData, setFormData] = useState({
        entrepriseID: '',
        nomCommercial: '',
        adresse: '',
        ville: '',
        telephone: '',
        email: '',
        siteWeb: '',
        ice: '',
        identifiantFiscal: '',
        taxeProfessionnelle: '',
        cnss: '',
        activite: '',
        registreCommerce: '',
        logoPath: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await entrepriseService.getData();
            if (data) {
                setFormData(data);
            } else {
                setError("Aucune information d'entreprise trouvée.");
            }
        } catch (err) {
            console.error("Error fetching settings:", err);
            setError("Erreur lors du chargement des paramètres.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSuccess('');
        setError(null);
        try {
            await entrepriseService.update(formData.entrepriseID, formData);
            setSuccess("Informations mises à jour avec succès !");
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error("Error saving settings:", err);
            setError("Erreur lors de l'enregistrement.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-gray-500">Chargement...</div>;

    return (
        <div className="settings-container">
            <div className="settings-header">
                <h1>Paramètres de l'Entreprise</h1>
                <p>Gérez les informations légales et coordonnées de votre entreprise.</p>
            </div>

            {error && <div className="alert-box alert-error">{error}</div>}
            {success && <div className="alert-box alert-success"><Save size={18} style={{ marginRight: '8px' }} /> {success}</div>}

            <form onSubmit={handleSubmit} className="settings-card">

                {/* Identity */}
                <div className="full-width">
                    <h3 className="section-title">
                        <Building size={20} className="text-blue-600" /> Identité & Coordonnées
                    </h3>
                </div>

                <div className="form-group">
                    <label>Nom Commercial</label>
                    <input type="text" name="nomCommercial" value={formData.nomCommercial || ''} onChange={handleChange} className="form-input" required />
                </div>

                <div className="form-group">
                    <label>Activité</label>
                    <input type="text" name="activite" value={formData.activite || ''} onChange={handleChange} className="form-input" placeholder="Ex: Réparation Électronique" />
                </div>

                <div className="form-group full-width">
                    <label>Adresse Complète</label>
                    <input type="text" name="adresse" value={formData.adresse || ''} onChange={handleChange} className="form-input" required />
                </div>

                <div className="form-group">
                    <label>Ville</label>
                    <input type="text" name="ville" value={formData.ville || ''} onChange={handleChange} className="form-input" />
                </div>

                <div className="form-group">
                    <label>Téléphone</label>
                    <input type="text" name="telephone" value={formData.telephone || ''} onChange={handleChange} className="form-input" />
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" value={formData.email || ''} onChange={handleChange} className="form-input" />
                </div>

                <div className="form-group">
                    <label>Site Web</label>
                    <input type="text" name="siteWeb" value={formData.siteWeb || ''} onChange={handleChange} className="form-input" />
                </div>

                {/* Legal Info */}
                <div className="full-width" style={{ marginTop: '2rem' }}>
                    <h3 className="section-title">
                        <FileText size={20} className="text-purple-600" /> Informations Légales
                    </h3>
                </div>

                <div className="form-group">
                    <label>ICE</label>
                    <input type="text" name="ice" value={formData.ice || ''} onChange={handleChange} className="form-input" />
                </div>

                <div className="form-group">
                    <label>Identifiant Fiscal (IF)</label>
                    <input type="text" name="identifiantFiscal" value={formData.identifiantFiscal || ''} onChange={handleChange} className="form-input" />
                </div>

                <div className="form-group">
                    <label>Taxe Professionnelle (TP)</label>
                    <input type="text" name="taxeProfessionnelle" value={formData.taxeProfessionnelle || ''} onChange={handleChange} className="form-input" />
                </div>

                <div className="form-group">
                    <label>Registre Commerce (RC)</label>
                    <input type="text" name="registreCommerce" value={formData.registreCommerce || ''} onChange={handleChange} className="form-input" />
                </div>

                <div className="form-group">
                    <label>CNSS</label>
                    <input type="text" name="cnss" value={formData.cnss || ''} onChange={handleChange} className="form-input" />
                </div>

                {/* Actions */}
                <div className="btn-container">
                    <button type="submit" disabled={saving} className="btn-save">
                        {saving ? 'Enregistrement...' : <><Save size={18} style={{ marginRight: '8px' }} /> Enregistrer les modifications</>}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default Settings;
