import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search, Package } from 'lucide-react';
import produitService from '../services/produitService';
import ProduitTable from '../components/Produits/ProduitTable';
import ProduitForm from '../components/Produits/ProduitForm';
import './Clients.css'; // Reuse common page styles

const Produits = () => {
    const [produits, setProduits] = useState([]);
    const [filteredProduits, setFilteredProduits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);

    const fetchProduits = async () => {
        setLoading(true);
        try {
            const data = await produitService.getAll();
            setProduits(data);
            setFilteredProduits(data);
        } catch (error) {
            console.error("Error fetching produits:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduits();
    }, []);

    useEffect(() => {
        if (!search) {
            setFilteredProduits(produits);
        } else {
            const lowerSearch = search.toLowerCase();
            const filtered = produits.filter(p =>
                p.nom.toLowerCase().includes(lowerSearch) ||
                (p.reference && p.reference.toLowerCase().includes(lowerSearch))
            );
            setFilteredProduits(filtered);
        }
    }, [search, produits]);

    const handleCreate = async (formData) => {
        try {
            await produitService.create(formData);
            setIsModalOpen(false);
            fetchProduits();
        } catch (error) {
            console.error("Error creating produit:", error);
            alert("Erreur lors de la création.");
        }
    };

    const handleUpdate = async (formData) => {
        try {
            await produitService.update(editingItem.produitServiceID, formData);
            setIsModalOpen(false);
            setEditingItem(null);
            fetchProduits();
        } catch (error) {
            console.error("Error updating produit:", error);
            alert("Erreur mise à jour.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Supprimer cet article ?")) {
            try {
                await produitService.remove(id);
                fetchProduits();
            } catch (error) {
                console.error("Error deleting:", error);
            }
        }
    };

    const handleBulkDelete = async () => {
        // Bulk delete not explicitly in service, usually loop
        if (window.confirm(`Supprimer ${selectedIds.length} articles ?`)) {
            try {
                const promises = selectedIds.map(id => produitService.remove(id));
                await Promise.all(promises);
                setSelectedIds([]);
                fetchProduits();
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
                <h1 className="page-title">Gestion du Catalogue</h1>
                <button className="btn-primary" onClick={openCreateModal}>
                    <Plus size={20} /> Nouvel Article
                </button>
            </div>

            <div className="toolbar">
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                        type="text"
                        placeholder="Rechercher un service ou produit..."
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

            <ProduitTable
                data={filteredProduits}
                loading={loading}
                onEdit={openEditModal}
                onDelete={handleDelete}
                onSelectionChange={setSelectedIds}
            />

            <ProduitForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={editingItem ? handleUpdate : handleCreate}
                initialData={editingItem}
            />
        </div>
    );
};

export default Produits;
