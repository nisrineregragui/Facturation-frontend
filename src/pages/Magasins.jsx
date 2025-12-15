import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search, ShoppingBag } from 'lucide-react';
import magasinService from '../services/magasinService';
import MagasinTable from '../components/Magasins/MagasinTable';
import MagasinForm from '../components/Magasins/MagasinForm';
import './Clients.css';

const Magasins = () => {
    const [magasins, setMagasins] = useState([]);
    const [filteredMagasins, setFilteredMagasins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);

    // Fetch
    const fetchMagasins = async () => {
        setLoading(true);
        try {
            const data = await magasinService.getAll();
            setMagasins(data);
            setFilteredMagasins(data);
        } catch (error) {
            console.error("Error fetching magasins:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMagasins();
    }, []);

    // Filter
    useEffect(() => {
        if (!search) {
            setFilteredMagasins(magasins);
        } else {
            const lowerSearch = search.toLowerCase();
            const filtered = magasins.filter(m =>
                m.nomMagasin.toLowerCase().includes(lowerSearch) ||
                (m.ville && m.ville.toLowerCase().includes(lowerSearch))
            );
            setFilteredMagasins(filtered);
        }
    }, [search, magasins]);

    // CRUD
    const handleCreate = async (formData) => {
        try {
            await magasinService.create(formData);
            setIsModalOpen(false);
            fetchMagasins();
        } catch (error) {
            console.error("Error creating magasin:", error);
            alert("Erreur lors de la création.");
        }
    };

    const handleUpdate = async (formData) => {
        try {
            await magasinService.update(editingItem.magasinID, formData);
            setIsModalOpen(false);
            setEditingItem(null);
            fetchMagasins();
        } catch (error) {
            console.error("Error updating magasin:", error);
            alert("Erreur mise à jour.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Supprimer ce magasin ?")) {
            try {
                await magasinService.remove(id);
                fetchMagasins();
            } catch (error) {
                console.error("Error deleting:", error);
            }
        }
    };

    const handleBulkDelete = async () => {
        if (window.confirm(`Supprimer ${selectedIds.length} magasins ?`)) {
            try {
                await magasinService.removeBulk(selectedIds);
                setSelectedIds([]);
                fetchMagasins();
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
                <h1 className="page-title">Gestion des Magasins Partenaires</h1>
                <button className="btn-primary" onClick={openCreateModal}>
                    <Plus size={20} /> Nouveau Magasin
                </button>
            </div>

            <div className="toolbar">
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                        type="text"
                        placeholder="Rechercher par nom ou ville..."
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

            <MagasinTable
                data={filteredMagasins}
                loading={loading}
                onEdit={openEditModal}
                onDelete={handleDelete}
                onSelectionChange={setSelectedIds}
            />

            <MagasinForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={editingItem ? handleUpdate : handleCreate}
                initialData={editingItem}
            />
        </div>
    );
};

export default Magasins;
