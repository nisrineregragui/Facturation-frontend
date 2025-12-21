import React, { useState, useEffect } from 'react';
import { Search, FileText, ChevronDown, ChevronUp, CheckSquare, Square } from 'lucide-react';
import factureService from '../services/factureService';
import interventionService from '../services/interventionService';
import entrepriseService from '../services/entrepriseService';
import { generateMagasinInvoicePDF } from '../utils/pdfGenerator';
import FactureTable from '../components/Factures/FactureTable';
import './Clients.css';
import '../components/Clients/ClientTable.css';

const Facturation = () => {
    // State for existing invoices
    const [factures, setFactures] = useState([]);
    const [filteredFactures, setFilteredFactures] = useState([]);
    const [loadingFactures, setLoadingFactures] = useState(true);
    const [searchFacture, setSearchFacture] = useState('');

    // State for Billings (Interventions to bill)
    const [billingGroups, setBillingGroups] = useState({}); // { magasinID: { magasinName, interventions: [] } }
    const [loadingInterventions, setLoadingInterventions] = useState(false);

    // Filters
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 1-12
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    // Selection for generation
    // { magasinID: [interventionID1, interventionID2] }
    const [selectedInterventions, setSelectedInterventions] = useState({});

    const [entreprise, setEntreprise] = useState(null);

    // Toggle view
    const [activeTab, setActiveTab] = useState('generate'); // 'generate' or 'history'

    // --- Fetch Data ---
    const fetchData = async () => {
        setLoadingFactures(true);
        setLoadingInterventions(true);
        try {
            // 1. Fetch Existing Factures
            const facts = await factureService.getAll();
            setFactures(facts);
            setFilteredFactures(facts);

            // 2. Fetch Interventions looking for billable ones
            // Ideal: API endpoint for "Billable Interventions"
            // Current: Fetch All and filter client-side (Not scalable but functional for now)
            const allInterventions = await interventionService.getAll();

            // Filter: Terminée AND Not Billed (FactureID is null) AND Has Magasin
            const billable = allInterventions.filter(i =>
                i.statut === 'Terminée' &&
                !i.factureID &&
                i.magasinID
            );

            // Group by Magasin
            const groups = {};
            billable.forEach(i => {
                const magID = i.magasinID;
                if (!groups[magID]) {
                    groups[magID] = {
                        magasinID: magID,
                        magasinName: i.nomMagasin || 'Magasin Inconnu',
                        interventions: []
                    };
                }
                groups[magID].interventions.push(i);
            });

            setBillingGroups(groups);

            // 3. Fetch Entreprise for PDF
            try {
                // Now using the newly added helper
                const ent = await entrepriseService.getData();
                console.log("Facturation PDF Enterprise Data:", ent);
                if (ent) setEntreprise(ent);
            } catch (e) {
                console.warn("Could not fetch entreprise data for PDF", e);
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoadingFactures(false);
            setLoadingInterventions(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- Filter Factures Search ---
    useEffect(() => {
        if (!searchFacture) {
            setFilteredFactures(factures);
        } else {
            const lowerSearch = searchFacture.toLowerCase();
            const filtered = factures.filter(f =>
                (f.nomClient && f.nomClient.toLowerCase().includes(lowerSearch)) ||
                (f.numeroFacture && f.numeroFacture.toLowerCase().includes(lowerSearch)) ||
                (f.nomMagasin && f.nomMagasin.toLowerCase().includes(lowerSearch))
            );
            setFilteredFactures(filtered);
        }
    }, [searchFacture, factures]);

    // --- Handling Date Filter for Displaying Billable Items ---
    const getFilteredBillableInterventions = (interventions) => {
        if (!interventions) return [];
        return interventions.filter(i => {
            const date = new Date(i.dateDebut);
            // Check Year (if 0, ignore)
            if (parseInt(selectedYear) !== 0) {
                if (date.getFullYear() !== parseInt(selectedYear)) return false;
            }

            // Check Month (if 0, ignore month)
            if (parseInt(selectedMonth) !== 0) {
                if ((date.getMonth() + 1) !== parseInt(selectedMonth)) return false;
            }
            return true;
        });
    };

    // --- Selection Logic ---
    const toggleSelection = (magasinID, interventionID) => {
        const currentSelected = selectedInterventions[magasinID] || [];
        let newSelected;
        if (currentSelected.includes(interventionID)) {
            newSelected = currentSelected.filter(id => id !== interventionID);
        } else {
            newSelected = [...currentSelected, interventionID];
        }

        setSelectedInterventions({
            ...selectedInterventions,
            [magasinID]: newSelected
        });
    };

    const toggleSelectAll = (magasinID, visibleInterventions) => {
        const currentSelected = selectedInterventions[magasinID] || [];
        const allVisibleIds = visibleInterventions.map(i => i.interventionID);

        // Check if all visible are selected
        const allSelected = allVisibleIds.every(id => currentSelected.includes(id));

        if (allSelected) {
            // Unselect all visible
            const newSelected = currentSelected.filter(id => !allVisibleIds.includes(id));
            setSelectedInterventions({ ...selectedInterventions, [magasinID]: newSelected });
        } else {
            // Select all visible
            // Merge unique
            const newSelected = [...new Set([...currentSelected, ...allVisibleIds])];
            setSelectedInterventions({ ...selectedInterventions, [magasinID]: newSelected });
        }
    };

    // --- Actions ---
    const handleGenerateFacture = async (magasinID) => {
        const idsToBill = selectedInterventions[magasinID];
        if (!idsToBill || idsToBill.length === 0) return alert("Veuillez sélectionner au moins une intervention.");

        if (!window.confirm(`Générer une facture pour ${idsToBill.length} intervention(s) ?`)) return;

        try {
            const createdFacture = await factureService.generateMagasin({
                magasinID: magasinID,
                interventionIDs: idsToBill
            });
            alert("Facture générée avec succès ! Téléchargement du PDF...");

            // Fetch Full Details for PDF (because response might lack nested objects)
            const fullFacture = await factureService.getById(createdFacture.factureID);

            generateMagasinInvoicePDF(fullFacture, entreprise);

            // Refresh
            fetchData();
            setSelectedInterventions({ ...selectedInterventions, [magasinID]: [] });
            setActiveTab('history'); // Switch to history to see it
        } catch (error) {
            console.error("Creation Errors: ", error);
            const msg = error.response?.data || error.message || "Erreur inconnue";
            alert(`Erreur lors de la création de la facture: ${typeof msg === 'object' ? JSON.stringify(msg) : msg}`);
        }
    };

    // Handler for History Print
    const handlePrint = async (factureID) => {
        try {
            let entData = entreprise;
            if (!entData) {
                try {
                    entData = await entrepriseService.getData();
                    setEntreprise(entData);
                } catch (e) { console.warn("No Ent Data"); }
            }

            const fullFacture = await factureService.getById(factureID);
            console.log("Printing Facture Data:", fullFacture);
            if (!fullFacture.interventions || fullFacture.interventions.length === 0) {
                console.warn("Generating PDF: Interventions list is empty!", fullFacture);
                alert("Attention: Aucune intervention trouvée dans cette facture pour le PDF.");
            }
            generateMagasinInvoicePDF(fullFacture, entData);
        } catch (error) {
            console.error("Print Error:", error);
            alert("Erreur lors de l'impression.");
        }
    };

    return (
        <div className="clients-page">
            <div className="page-header">
                <h1 className="page-title">Facturation</h1>
            </div>

            <div className="tabs-container" style={{ marginBottom: '20px', borderBottom: '1px solid #e2e8f0' }}>
                <button
                    className={`tab-btn ${activeTab === 'generate' ? 'active' : ''}`}
                    onClick={() => setActiveTab('generate')}
                    style={{ padding: '10px 20px', marginRight: '10px', fontWeight: 'bold', borderBottom: activeTab === 'generate' ? '2px solid #2563eb' : 'none', color: activeTab === 'generate' ? '#2563eb' : '#64748b' }}
                >
                    Générer Factures
                </button>
                <button
                    className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                    onClick={() => setActiveTab('history')}
                    style={{ padding: '10px 20px', fontWeight: 'bold', borderBottom: activeTab === 'history' ? '2px solid #2563eb' : 'none', color: activeTab === 'history' ? '#2563eb' : '#64748b' }}
                >
                    Historique
                </button>
            </div>

            {activeTab === 'generate' && (
                <div className="billing-section">
                    <div className="filters-bar" style={{ display: 'flex', gap: '15px', marginBottom: '20px', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                        <div className="form-group">
                            <label>Mois</label>
                            <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="form-input">
                                <option value="0">Tous les mois</option>
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('fr-FR', { month: 'long' })}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Année</label>
                            <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} className="form-input">
                                <option value="0">Toutes les années</option>
                                <option value="2024">2024</option>
                                <option value="2025">2025</option>
                                <option value="2026">2026</option>
                            </select>
                        </div>
                    </div>

                    {loadingInterventions ? (
                        <div className="text-center p-4">Chargement des interventions...</div>
                    ) : Object.keys(billingGroups).length === 0 ? (
                        <div className="text-center p-4 text-gray-500">Aucune intervention à facturer pour le moment.</div>
                    ) : (
                        <div className="groups-container">
                            {Object.values(billingGroups).map(group => {
                                const visibleInterventions = getFilteredBillableInterventions(group.interventions);
                                if (visibleInterventions.length === 0) return null;

                                const selectedCount = (selectedInterventions[group.magasinID] || []).length;
                                const isAllSelected = visibleInterventions.length > 0 &&
                                    visibleInterventions.every(i => (selectedInterventions[group.magasinID] || []).includes(i.interventionID));

                                const totalAmount = visibleInterventions
                                    .filter(i => (selectedInterventions[group.magasinID] || []).includes(i.interventionID))
                                    .reduce((sum, i) => sum + (i.somme || 0), 0);

                                return (
                                    <div key={group.magasinID} className="magasin-group-card" style={{ border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '20px', overflow: 'hidden' }}>
                                        <div className="group-header" style={{ padding: '15px', backgroundColor: '#f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <h3 style={{ margin: 0, color: '#1e293b' }}>{group.magasinName} <span className="badge">{visibleInterventions.length} intervention(s)</span></h3>
                                            <div className="group-actions">
                                                {selectedCount > 0 && (
                                                    <button
                                                        onClick={() => handleGenerateFacture(group.magasinID)}
                                                        className="btn-primary"
                                                        style={{ backgroundColor: '#16a34a' }}
                                                    >
                                                        Générer Facture ({totalAmount.toFixed(2)} DH)
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="group-table-container">
                                            <table className="data-table">
                                                <thead>
                                                    <tr>
                                                        <th width="40">
                                                            <input
                                                                type="checkbox"
                                                                checked={isAllSelected}
                                                                onChange={() => toggleSelectAll(group.magasinID, visibleInterventions)}
                                                            />
                                                        </th>
                                                        <th>Client</th>
                                                        <th>Appareil</th>
                                                        <th>Date Début</th>
                                                        <th>Panne</th>
                                                        <th>Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {visibleInterventions.map(item => {
                                                        const isSelected = (selectedInterventions[group.magasinID] || []).includes(item.interventionID);
                                                        return (
                                                            <tr key={item.interventionID} className={isSelected ? 'selected-row' : ''} style={{ backgroundColor: isSelected ? '#f0fdf4' : 'transparent' }}>
                                                                <td>
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={isSelected}
                                                                        onChange={() => toggleSelection(group.magasinID, item.interventionID)}
                                                                    />
                                                                </td>
                                                                <td>{item.nomClient}</td>
                                                                <td>{item.nomAppareil}</td>
                                                                <td>{new Date(item.dateDebut).toLocaleDateString()}</td>
                                                                <td>{item.panneReclamee}</td>
                                                                <td style={{ fontWeight: 'bold' }}>{(item.somme || 0).toFixed(2)} DH</td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'history' && (
                <div className="history-section">
                    <div className="toolbar">
                        <div style={{ position: 'relative', flex: 1 }}>
                            <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="text"
                                placeholder="Rechercher une facture..."
                                className="search-input"
                                value={searchFacture}
                                onChange={(e) => setSearchFacture(e.target.value)}
                            />
                        </div>
                    </div>
                    <FactureTable
                        data={filteredFactures}
                        loading={loadingFactures}
                        onView={(f) => alert(`Facture #${f.numeroFacture}`)}
                        onPrint={handlePrint}
                    />
                </div>
            )}
        </div>
    );
};

export default Facturation;
