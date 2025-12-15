import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search, Filter } from 'lucide-react';
import clientService from '../services/clientService';
import ClientTable from '../components/Clients/ClientTable';
import ClientForm from '../components/Clients/ClientForm';
import './Clients.css';

const Clients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [villeFilter, setVilleFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);

    // Fetch Clients
    const fetchClients = async () => {
        setLoading(true);
        try {
            const params = {};
            if (search) params.search = search;
            if (villeFilter) params.ville = villeFilter;
            if (typeFilter) params.typeClient = typeFilter;

            const data = await clientService.getAll(params);
            setClients(data);
        } catch (error) {
            console.error("Error fetching clients:", error);
            // Optional: Add toast notification here
        } finally {
            setLoading(false);
        }
    };

    // Debouce search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchClients();
        }, 500);
        return () => clearTimeout(timer);
    }, [search, villeFilter, typeFilter]);

    // CRUD Operations
    const handleCreate = async (formData) => {
        try {
            await clientService.create(formData);
            setIsModalOpen(false);
            fetchClients();
        } catch (error) {
            console.error("Error creating client:", error);
            alert("Erreur lors de la création du client.");
        }
    };

    const handleUpdate = async (formData) => {
        try {
            await clientService.update(editingClient.clientID, formData);
            setIsModalOpen(false);
            setEditingClient(null);
            fetchClients();
        } catch (error) {
            console.error("Error updating client:", error);
            alert("Erreur lors de la mise à jour.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
            try {
                await clientService.remove(id);
                fetchClients();
            } catch (error) {
                console.error("Error deleting client:", error);
            }
        }
    };

    const handleBulkDelete = async () => {
        if (window.confirm(`Supprimer ${selectedIds.length} clients sélectionnés ?`)) {
            try {
                await clientService.removeBulk(selectedIds);
                setSelectedIds([]);
                fetchClients();
            } catch (error) {
                console.error("Error deleting clients:", error);
            }
        }
    };

    const openCreateModal = () => {
        setEditingClient(null);
        setIsModalOpen(true);
    };

    const openEditModal = (client) => {
        setEditingClient(client);
        setIsModalOpen(true);
    };

    return (
        <div className="clients-page">
            <div className="page-header">
                <h1 className="page-title">Gestion des Clients</h1>
                <button className="btn-primary" onClick={openCreateModal}>
                    <Plus size={20} /> Nouveau Client
                </button>
            </div>

            <div className="toolbar">
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                        type="text"
                        placeholder="Rechercher par nom, email, téléphone..."
                        className="search-input"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <select
                    className="filter-select"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                >
                    <option value="">Tous les types</option>
                    <option value="particulier">Particulier</option>
                    <option value="magasin">Magasin</option>
                </select>

                <input
                    type="text"
                    placeholder="Filtrer par Ville"
                    className="filter-select"
                    value={villeFilter}
                    onChange={(e) => setVilleFilter(e.target.value)}
                />

                {selectedIds.length > 0 && (
                    <button className="btn-danger" onClick={handleBulkDelete}>
                        <Trash2 size={18} /> Supprimer ({selectedIds.length})
                    </button>
                )}
            </div>

            <ClientTable
                data={clients}
                loading={loading}
                onEdit={openEditModal}
                onDelete={handleDelete}
                onSelectionChange={setSelectedIds}
            />

            <ClientForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={editingClient ? handleUpdate : handleCreate}
                initialData={editingClient}
            />
        </div>
    );
};

export default Clients;
