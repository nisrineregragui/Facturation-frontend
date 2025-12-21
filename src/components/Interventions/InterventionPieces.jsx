import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Package } from 'lucide-react';
import produitService from '../../services/produitService';
import interventionService from '../../services/interventionService';

const InterventionPieces = ({ interventionId, pieces = [], onUpdate, mode = 'edit', onChange }) => {
    const [produits, setProduits] = useState([]);
    const [loading, setLoading] = useState(false);

    // New Piece Form
    const [selectedProduitId, setSelectedProduitId] = useState('');
    const [quantite, setQuantite] = useState(1);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        produitService.getAll().then(setProduits).catch(console.error);
    }, []);

    const handleAdd = async () => {
        if (!selectedProduitId || quantite <= 0) return;

        if (mode === 'create') {
            // Local Mode
            const produit = produits.find(p => p.produitServiceID === selectedProduitId);
            if (!produit) return;

            const newItem = {
                id: Date.now(), // Temp ID
                produitServiceID: selectedProduitId,
                referenceProduit: produit.reference,
                nomProduit: produit.nom,
                prixAppliqueHT: produit.prixUnitaireHT,
                quantite: parseFloat(quantite),
                totalLigneHT: parseFloat(quantite) * produit.prixUnitaireHT
            };

            // Notify parent
            if (onChange) onChange(newItem);

            // Reset
            setSelectedProduitId('');
            setQuantite(1);
        } else {
            // Edit Mode (API)
            setAdding(true);
            try {
                await interventionService.addPiece(interventionId, {
                    produitServiceID: selectedProduitId,
                    quantite: parseFloat(quantite)
                });
                onUpdate();
                setSelectedProduitId('');
                setQuantite(1);
            } catch (error) {
                console.error("Error adding piece:", error);
                alert("Erreur lors de l'ajout de la pièce.");
            } finally {
                setAdding(false);
            }
        }
    };

    const handleRemove = async (item) => {
        if (!window.confirm("Retirer cet élément ?")) return;

        if (mode === 'create') {
            // Local removal handled by parent usually, but we need a way to callback removal
            // For simplicity in Create Mode, we might pass the full list down or just rely on parent
            // If we only pass 'newItem' up in onChange, we can't easily remove locally here without local state.
            // Let's assume 'pieces' prop passed to us is the source of truth.
            if (onChange) onChange(null, item.id); // Signal removal with null item and ID
        } else {
            try {
                await interventionService.removePiece(interventionId, item.ligneInterventionID);
                onUpdate();
            } catch (error) {
                console.error("Error removing piece:", error);
            }
        }
    };

    // Calculate total
    const totalHT = pieces.reduce((sum, p) => sum + (p.totalLigneHT || 0), 0);

    return (
        <div className="form-section pieces-section" style={{ marginTop: '1rem', borderTop: '2px solid #e2e8f0', paddingTop: '1rem' }}>
            <h3>
                <Package size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Pièces et Services Utilisés
            </h3>

            {/* List of used pieces */}
            <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
                <table className="data-table" style={{ width: '100%', fontSize: '0.9rem' }}>
                    <thead>
                        <tr>
                            <th>Référence</th>
                            <th>Description</th>
                            <th>Prix Unit. HT</th>
                            <th>Qté</th>
                            <th>Total HT</th>
                            <th width="50">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pieces.map((piece) => (
                            <tr key={piece.ligneInterventionID || piece.id}>
                                <td>{piece.referenceProduit}</td>
                                <td>{piece.nomProduit}</td>
                                <td>{piece.prixAppliqueHT} DH</td>
                                <td>{piece.quantite}</td>
                                <td>{piece.totalLigneHT?.toFixed(2)} DH</td>
                                <td>
                                    <button
                                        type="button"
                                        onClick={() => handleRemove(piece)}
                                        className="btn-icon danger"
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {pieces.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', color: '#64748b', padding: '1rem' }}>
                                    Aucune pièce ou service ajouté.
                                </td>
                            </tr>
                        )}
                        {/* Total Row */}
                        {pieces.length > 0 && (
                            <tr style={{ background: '#f8fafc', fontWeight: 'bold' }}>
                                <td colSpan="4" style={{ textAlign: 'right' }}>Total HT :</td>
                                <td colSpan="2">{totalHT.toFixed(2)} DH</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Piece Form */}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end', background: '#f1f5f9', padding: '1rem', borderRadius: '8px' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Ajouter Article</label>
                    <select
                        value={selectedProduitId}
                        onChange={(e) => setSelectedProduitId(e.target.value)}
                        className="form-input"
                        style={{ width: '100%' }}
                    >
                        <option value="">-- Choisir Article --</option>
                        {produits.map(p => (
                            <option key={p.produitServiceID} value={p.produitServiceID}>
                                {p.nom} ({p.prixUnitaireHT} DH)
                            </option>
                        ))}
                    </select>
                </div>
                <div style={{ width: '80px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Qté</label>
                    <input
                        type="number"
                        min="1"
                        value={quantite}
                        onChange={(e) => setQuantite(e.target.value)}
                        className="form-input"
                        style={{ width: '100%' }}
                    />
                </div>
                <button
                    type="button"
                    onClick={handleAdd}
                    disabled={!selectedProduitId || adding}
                    className="btn-primary"
                    style={{ height: '38px', whiteSpace: 'nowrap' }}
                >
                    {adding ? '...' : <><Plus size={16} /> Ajouter</>}
                </button>
            </div>
        </div>
    );
};

export default InterventionPieces;
