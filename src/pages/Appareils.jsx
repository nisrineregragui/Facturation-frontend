import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search, Smartphone } from 'lucide-react';
import appareilService from '../services/appareilService';
import AppareilTable from '../components/Appareils/AppareilTable';
import AppareilForm from '../components/Appareils/AppareilForm';
import './Clients.css';

const Appareils = () => {
    const [appareils, setAppareils] = useState([]);
    const [filteredAppareils, setFilteredAppareils] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);

    // Fetch
    const fetchAppareils = async () => {
        setLoading(true);
        try {
            const data = await appareilService.getAll();
            setAppareils(data);
            setFilteredAppareils(data);
        } catch (error) {
            console.error("Error fetching appareils:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppareils();
    }, []);

    // Filter
    useEffect(() => {
        if (!search) {
            setFilteredAppareils(appareils);
        } else {
            const lowerSearch = search.toLowerCase();
            const filtered = appareils.filter(a =>
                a.numeroSerie.toLowerCase().includes(lowerSearch)
            );
            setFilteredAppareils(filtered);
        }
    }, [search, appareils]);

    // CRUD
    const handleCreate = async (formData) => {
        try {
            await appareilService.create(formData);
            setIsModalOpen(false);
            fetchAppareils();
        } catch (error) {
            // Log detailed error from DTO validation if available
            console.error("Error creating appareil:", error.response?.data || error);
            alert("Erreur création (Vérifiez ModelID et ClientID).");
        }
    };

    const handleUpdate = async (formData) => {
        try {
            await appareilService.update(editingItem.appareilID, formData);
            setIsModalOpen(false);
            setEditingItem(null);
            fetchAppareils();
        } catch (error) {
            console.error("Error updating appareil:", error);
            alert("Erreur mise à jour.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Supprimer cet appareil ?")) {
            try {
                await appareilService.remove(id);
                fetchAppareils();
            } catch (error) {
                console.error("Error deleting:", error);
            }
        }
    };

    const handleBulkDelete = async () => {
        if (window.confirm(`Supprimer ${selectedIds.length} appareils ?`)) {
            try {
                await appareilService.removeBulk(selectedIds);
                setSelectedIds([]);
                fetchAppareils();
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
                <h1 className="page-title">Gestion des Appareils</h1>
                <button className="btn-primary" onClick={openCreateModal}>
                    <Plus size={20} /> Nouvel Appareil
                </button>
            </div>

            <div className="toolbar">
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                        type="text"
                        placeholder="Rechercher par numéro de série..."
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

            <AppareilTable
                data={filteredAppareils}
                loading={loading}
                onEdit={openEditModal}
                onDelete={handleDelete}
                onSelectionChange={setSelectedIds}
            />

            <AppareilForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={editingItem ? handleUpdate : handleCreate}
                initialData={editingItem}
            />
        </div>
    );
};

export default Appareils;
