import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search } from 'lucide-react';
import interventionService from '../services/interventionService';
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

    useEffect(() => {
        fetchInterventions();
    }, []);

    // Filter
    useEffect(() => {
        if (!search) {
            setFilteredInterventions(interventions);
        } else {
            const lowerSearch = search.toLowerCase();
            const filtered = interventions.filter(i =>
                (i.nomClient && i.nomClient.toLowerCase().includes(lowerSearch)) ||
                (i.nomTechnicien && i.nomTechnicien.toLowerCase().includes(lowerSearch)) ||
                (i.nomAppareil && i.nomAppareil.toLowerCase().includes(lowerSearch)) ||
                (i.statut && i.statut.toLowerCase().includes(lowerSearch))
            );
            setFilteredInterventions(filtered);
        }
    }, [search, interventions]);

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
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                        type="text"
                        placeholder="Rechercher par client, technicien, statut..."
                        className="search-input"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
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
