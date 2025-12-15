import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search } from 'lucide-react';
import technicienService from '../services/technicienService';
import TechnicienTable from '../components/Techniciens/TechnicienTable';
import TechnicienForm from '../components/Techniciens/TechnicienForm';
import './Clients.css'; // Reuse basic layout styles

const Techniciens = () => {
    const [techniciens, setTechniciens] = useState([]);
    const [filteredTechniciens, setFilteredTechniciens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTechnicien, setEditingTechnicien] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);

    // Fetch Techniciens
    const fetchTechniciens = async () => {
        setLoading(true);
        try {
            const data = await technicienService.getAll();
            setTechniciens(data);
            setFilteredTechniciens(data);
        } catch (error) {
            console.error("Error fetching techniciens:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTechniciens();
    }, []);

    // Filter Logic (Client Side)
    useEffect(() => {
        if (!search) {
            setFilteredTechniciens(techniciens);
        } else {
            const lowerSearch = search.toLowerCase();
            const filtered = techniciens.filter(t =>
                t.nom.toLowerCase().includes(lowerSearch) ||
                t.prenom.toLowerCase().includes(lowerSearch) ||
                (t.cIN && t.cIN.toLowerCase().includes(lowerSearch))
            );
            setFilteredTechniciens(filtered);
        }
    }, [search, techniciens]);

    // CRUD Operations
    const handleCreate = async (formData) => {
        try {
            await technicienService.create(formData);
            setIsModalOpen(false);
            fetchTechniciens();
        } catch (error) {
            console.error("Error creating technicien:", error);
            alert("Erreur lors de la création.");
        }
    };

    const handleUpdate = async (formData) => {
        try {
            await technicienService.update(editingTechnicien.technicienID, formData);
            setIsModalOpen(false);
            setEditingTechnicien(null);
            fetchTechniciens();
        } catch (error) {
            console.error("Error updating technicien:", error);
            alert("Erreur lors de la mise à jour.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce technicien ?")) {
            try {
                await technicienService.remove(id);
                fetchTechniciens();
            } catch (error) {
                console.error("Error deleting technicien:", error);
            }
        }
    };

    const handleBulkDelete = async () => {
        if (window.confirm(`Supprimer ${selectedIds.length} techniciens sélectionnés ?`)) {
            try {
                await technicienService.removeBulk(selectedIds);
                setSelectedIds([]);
                fetchTechniciens();
            } catch (error) {
                console.error("Error deleting techniciens:", error);
            }
        }
    };

    const openCreateModal = () => {
        setEditingTechnicien(null);
        setIsModalOpen(true);
    };

    const openEditModal = (tech) => {
        setEditingTechnicien(tech);
        setIsModalOpen(true);
    };

    return (
        <div className="clients-page">
            <div className="page-header">
                <h1 className="page-title">Gestion des Techniciens</h1>
                <button className="btn-primary" onClick={openCreateModal}>
                    <Plus size={20} /> Nouveau Technicien
                </button>
            </div>

            <div className="toolbar">
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                        type="text"
                        placeholder="Rechercher par nom, prénom, CIN..."
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

            <TechnicienTable
                data={filteredTechniciens}
                loading={loading}
                onEdit={openEditModal}
                onDelete={handleDelete}
                onSelectionChange={setSelectedIds}
            />

            <TechnicienForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={editingTechnicien ? handleUpdate : handleCreate}
                initialData={editingTechnicien}
            />
        </div>
    );
};

export default Techniciens;
