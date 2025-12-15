import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search, Smartphone } from 'lucide-react';
import modeleService from '../services/modeleService';
import ModeleTable from '../components/Modeles/ModeleTable';
import ModeleForm from '../components/Modeles/ModeleForm';
import './Clients.css';

const Modeles = () => {
    const [modeles, setModeles] = useState([]);
    const [filteredModeles, setFilteredModeles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);

    // Fetch
    const fetchModeles = async () => {
        setLoading(true);
        try {
            const data = await modeleService.getAll();
            setModeles(data);
            setFilteredModeles(data);
        } catch (error) {
            console.error("Error fetching modeles:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchModeles();
    }, []);

    // Filter
    useEffect(() => {
        if (!search) {
            setFilteredModeles(modeles);
        } else {
            const lowerSearch = search.toLowerCase();
            const filtered = modeles.filter(m =>
                m.marque.toLowerCase().includes(lowerSearch) ||
                m.designation.toLowerCase().includes(lowerSearch) ||
                (m.referenceGenerique && m.referenceGenerique.toLowerCase().includes(lowerSearch))
            );
            setFilteredModeles(filtered);
        }
    }, [search, modeles]);

    // CRUD
    const handleCreate = async (formData) => {
        try {
            await modeleService.create(formData);
            setIsModalOpen(false);
            fetchModeles();
        } catch (error) {
            console.error("Error creating modele:", error);
            alert("Erreur lors de la création.");
        }
    };

    const handleUpdate = async (formData) => {
        try {
            await modeleService.update(editingItem.modeleID, formData);
            setIsModalOpen(false);
            setEditingItem(null);
            fetchModeles();
        } catch (error) {
            console.error("Error updating modele:", error);
            alert("Erreur mise à jour.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Supprimer ce modèle ?")) {
            try {
                await modeleService.remove(id);
                fetchModeles();
            } catch (error) {
                console.error("Error deleting:", error);
            }
        }
    };

    const handleBulkDelete = async () => {
        if (window.confirm(`Supprimer ${selectedIds.length} modèles ?`)) {
            try {
                await modeleService.removeBulk(selectedIds);
                setSelectedIds([]);
                fetchModeles();
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
                <h1 className="page-title">Reférenciel des Modèles</h1>
                <button className="btn-primary" onClick={openCreateModal}>
                    <Plus size={20} /> Nouveau Modèle
                </button>
            </div>

            <div className="toolbar">
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                        type="text"
                        placeholder="Rechercher par marque, désignation..."
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

            <ModeleTable
                data={filteredModeles}
                loading={loading}
                onEdit={openEditModal}
                onDelete={handleDelete}
                onSelectionChange={setSelectedIds}
            />

            <ModeleForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={editingItem ? handleUpdate : handleCreate}
                initialData={editingItem}
            />
        </div>
    );
};

export default Modeles;
