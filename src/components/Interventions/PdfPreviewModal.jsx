import React, { useState, useEffect } from 'react';
import { X, Printer, Building2 } from 'lucide-react';
import { generateInterventionPdf } from '../../utils/pdfGenerator';
import entrepriseService from '../../services/entrepriseService';

const PdfPreviewModal = ({ intervention, onClose }) => {
    const [entreprise, setEntreprise] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEntreprise = async () => {
            try {
                const ents = await entrepriseService.getAll();
                if (ents && ents.length > 0) {
                    setEntreprise(ents[0]); // Assume single enterprise for now
                }
            } catch (err) {
                console.error("Error fetching enterprise:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchEntreprise();
    }, []);

    const handleGenerate = () => {
        if (!entreprise) {
            alert("Aucune information d'entreprise trouvée. Le PDF sera incomplet.");
        }
        generateInterventionPdf(intervention, entreprise);
        onClose();
    };

    if (loading) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '500px' }}>
                <div className="modal-header">
                    <h2>Impression Fiche Intervention</h2>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </div>

                <div className="modal-body" style={{ textAlign: 'center', padding: '2rem' }}>

                    {entreprise ? (
                        <div style={{ marginBottom: '1.5rem', border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '8px' }}>
                            <Building2 size={32} style={{ color: '#0f172a', marginBottom: '0.5rem' }} />
                            <h3 style={{ margin: '0 0 0.5rem 0' }}>{entreprise.nomCommercial}</h3>
                            <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>En-tête prêt pour l'impression</p>
                        </div>
                    ) : (
                        <div className="alert-warning">
                            Attention: Aucune information d'entreprise configurée. L'en-tête du PDF sera générique.
                        </div>
                    )}

                    <p>Vous êtes sur le point d'imprimer la fiche d'intervention pour :</p>
                    <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{intervention.nomClient} - {intervention.nomAppareil}</p>

                    <button className="btn-primary" onClick={handleGenerate} style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}>
                        <Printer size={18} /> Télécharger PDF
                    </button>
                    <button className="btn-secondary" onClick={onClose} style={{ marginTop: '0.5rem', width: '100%', justifyContent: 'center' }}>
                        Annuler
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PdfPreviewModal;
