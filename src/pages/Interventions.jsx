import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search } from 'lucide-react';
import interventionService from '../services/interventionService';
import technicienService from '../services/technicienService';
import InterventionTable from '../components/Interventions/InterventionTable';
import InterventionForm from '../components/Interventions/InterventionForm';
import './Clients.css'; // Reuse common page styles

const Interventions = () => {
    const [interventions, setInterventions] = useState([]);
    const [filteredInterventions, setFilteredInterventions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);

    // Fetch
    const fetchInterventions = async () => {
        setLoading(true);
        try {
            const data = await interventionService.getAll();
            setInterventions(data);
            setFilteredInterventions(data);
        } catch (error) {
            console.error("Error fetching interventions:", error);
        } finally {
            setLoading(false);
        }
    };

    const [filterMagasin, setFilterMagasin] = useState('');
    const [filterStatut, setFilterStatut] = useState('');
    const [filterVille, setFilterVille] = useState('');
    const [filterTechnicien, setFilterTechnicien] = useState('');
    const [magasins, setMagasins] = useState([]);
    const [techniciens, setTechniciens] = useState([]);
    const [villes, setVilles] = useState([]);

    useEffect(() => {
        import('../services/magasinService').then(module => {
            module.default.getAll().then(setMagasins);
        });
        technicienService.getAll().then(setTechniciens);
        fetchInterventions();
    }, []);

    // Extract Villes on interventions change
    useEffect(() => {
        if (interventions.length > 0) {
            const uniqueVilles = [...new Set(interventions.map(i => i.clientVille).filter(v => v))].sort();
            setVilles(uniqueVilles);
        }
    }, [interventions]);

    // Filter
    useEffect(() => {
        let filtered = interventions;

        if (search) {
            const lowerSearch = search.toLowerCase();
            filtered = filtered.filter(i =>
                (i.nomClient && i.nomClient.toLowerCase().includes(lowerSearch)) ||
                (i.nomTechnicien && i.nomTechnicien.toLowerCase().includes(lowerSearch)) ||
                (i.nomAppareil && i.nomAppareil.toLowerCase().includes(lowerSearch))
            );
        }

        if (filterMagasin) {
            filtered = filtered.filter(i => i.magasinID === filterMagasin);
        }

        if (filterStatut) {
            filtered = filtered.filter(i => i.statut === filterStatut);
        }

        if (filterVille) {
            filtered = filtered.filter(i => i.clientVille === filterVille);
        }

        if (filterTechnicien) {
            filtered = filtered.filter(i => i.technicienID === filterTechnicien);
        }

        setFilteredInterventions(filtered);
    }, [search, filterMagasin, filterStatut, filterVille, filterTechnicien, interventions]);

    // CRUD
    const handleCreate = async (formData) => {
        try {
            await interventionService.create(formData);
            setIsModalOpen(false);
            fetchInterventions();
        } catch (error) {
            console.error("Error creating intervention:", error);
            alert("Erreur lors de la création.");
        }
    };

    const handleUpdate = async (formData) => {
        try {
            await interventionService.update(editingItem.interventionID, formData);
            setIsModalOpen(false);
            setEditingItem(null);
            fetchInterventions();
        } catch (error) {
            console.error("Error updating intervention:", error);
            alert("Erreur mise à jour.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Supprimer cette intervention ?")) {
            try {
                await interventionService.remove(id);
                fetchInterventions();
            } catch (error) {
                console.error("Error deleting:", error);
            }
        }
    };

    const handleBulkDelete = async () => {
        if (window.confirm(`Supprimer ${selectedIds.length} interventions ?`)) {
            try {
                await interventionService.removeBulk(selectedIds);
                setSelectedIds([]);
                fetchInterventions();
            } catch (error) {
                console.error("Error deleting items:", error);
            }
        }
    };

    const openCreateModal = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const openEditModal = (item) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    return (
        <div className="clients-page">
            <div className="page-header">
                <h1 className="page-title">Gestion des Interventions</h1>
                <button className="btn-primary" onClick={openCreateModal}>
                    <Plus size={20} /> Nouvelle Intervention
                </button>
            </div>

            <div className="toolbar">
                <div style={{ display: 'flex', gap: '1rem', flex: 1 }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            className="search-input"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <select
                        className="filter-select"
                        value={filterMagasin}
                        onChange={(e) => setFilterMagasin(e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                    >
                        <option value="">Tous les Magasins</option>
                        {magasins.map(m => (
                            <option key={m.magasinID} value={m.magasinID}>{m.nomMagasin}</option>
                        ))}
                    </select>

                    <select
                        className="filter-select"
                        value={filterStatut}
                        onChange={(e) => setFilterStatut(e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                    >
                        <option value="">Tous les Statuts</option>
                        <option value="Planifiée">Planifiée</option>
                        <option value="En Cours">En Cours</option>
                        <option value="Terminée">Terminée</option>
                        <option value="Facturée">Facturée</option>
                        <option value="Annulée">Annulée</option>
                    </select>

                    <select
                        className="filter-select"
                        value={filterVille}
                        onChange={(e) => setFilterVille(e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                    >
                        <option value="">Toutes les Villes</option>
                        {villes.map(v => (
                            <option key={v} value={v}>{v}</option>
                        ))}
                    </select>

                    <select
                        className="filter-select"
                        value={filterTechnicien}
                        onChange={(e) => setFilterTechnicien(e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                    >
                        <option value="">Tous les Techniciens</option>
                        {techniciens.map(t => (
                            <option key={t.technicienID} value={t.technicienID}>{t.nom} {t.prenom}</option>
                        ))}
                    </select>
                </div>

                {selectedIds.length > 0 && (
                    <button className="btn-danger" onClick={handleBulkDelete}>
                        <Trash2 size={18} /> Supprimer ({selectedIds.length})
                    </button>
                )}
            </div>

            <InterventionTable
                data={filteredInterventions}
                loading={loading}
                onEdit={openEditModal}
                onDelete={handleDelete}
                onSelectionChange={setSelectedIds}
            />

            <InterventionForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={editingItem ? handleUpdate : handleCreate}
                initialData={editingItem}
            />
        </div>
    );
};

export default Interventions;
