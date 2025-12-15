import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import './ClientTable.css';

const ClientTable = ({
    data,
    onEdit,
    onDelete,
    onSelectionChange,
    loading
}) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [selectedIds, setSelectedIds] = useState([]);
    const [contextMenu, setContextMenu] = useState(null); // { x, y, clientId }

    // Reset selection when data changes
    useEffect(() => {
        setSelectedIds([]);
        onSelectionChange([]);
    }, [data]);

    // Context Menu Handling
    useEffect(() => {
        const handleClick = () => setContextMenu(null);
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    const handleContextMenu = (e, client) => {
        e.preventDefault();
        setContextMenu({
            x: e.pageX,
            y: e.pageY,
            client
        });
    };

    // Sorting
    const sortedData = React.useMemo(() => {
        let sortableItems = [...data];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [data, sortConfig]);

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(data.length / itemsPerPage);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const ids = currentItems.map(item => item.clientID);
            setSelectedIds(ids);
            onSelectionChange(ids);
        } else {
            setSelectedIds([]);
            onSelectionChange([]);
        }
    };

    const handleSelectOne = (id) => {
        const newSelected = selectedIds.includes(id)
            ? selectedIds.filter(x => x !== id)
            : [...selectedIds, id];
        setSelectedIds(newSelected);
        onSelectionChange(newSelected);
    };

    if (loading) return <div className="p-4 text-center">Chargement...</div>;

    return (
        <div className="table-container">
            <table className="data-table">
                <thead>
                    <tr>
                        <th width="40">
                            <input
                                type="checkbox"
                                onChange={handleSelectAll}
                                checked={selectedIds.length > 0 && selectedIds.length === currentItems.length}
                            />
                        </th>
                        <th onClick={() => requestSort('nomContact')}>
                            Nom {sortConfig.key === 'nomContact' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                        </th>
                        <th onClick={() => requestSort('prenomContact')}>Prénom</th>
                        <th onClick={() => requestSort('numTelephone')}>Téléphone</th>
                        <th onClick={() => requestSort('email')}>Email</th>
                        <th onClick={() => requestSort('ville')}>Ville</th>
                        <th onClick={() => requestSort('typeClient')}>Type</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.length > 0 ? (
                        currentItems.map((client) => (
                            <tr
                                key={client.clientID}
                                className={selectedIds.includes(client.clientID) ? 'selected' : ''}
                                onContextMenu={(e) => handleContextMenu(e, client)}
                            >
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(client.clientID)}
                                        onChange={() => handleSelectOne(client.clientID)}
                                    />
                                </td>
                                <td>{client.nomContact}</td>
                                <td>{client.prenomContact}</td>
                                <td>{client.numTelephone}</td>
                                <td>{client.email || '-'}</td>
                                <td>{client.ville || '-'}</td>
                                <td>
                                    <span className={`badge ${client.typeClient.toLowerCase()}`}>
                                        {client.typeClient}
                                    </span>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                                Aucun client trouvé.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        className="btn-page"
                        onClick={() => setCurrentPage(c => Math.max(c - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Précédent
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i + 1}
                            className={`btn-page ${currentPage === i + 1 ? 'active' : ''}`}
                            onClick={() => setCurrentPage(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        className="btn-page"
                        onClick={() => setCurrentPage(c => Math.min(c + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Suivant
                    </button>
                </div>
            )}

            {/* Context Menu Portal */}
            {contextMenu && (
                <div
                    className="context-menu"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="context-menu-item" onClick={() => { onEdit(contextMenu.client); setContextMenu(null); }}>
                        <Edit2 size={16} /> Modifier
                    </div>
                    <div className="context-menu-item delete" onClick={() => { onDelete(contextMenu.client.clientID); setContextMenu(null); }}>
                        <Trash2 size={16} /> Supprimer
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientTable;
