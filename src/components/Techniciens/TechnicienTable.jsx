import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Edit2, Trash2 } from 'lucide-react';
import '../Clients/ClientTable.css'; // Reuse styles

const TechnicienTable = ({
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
    const [contextMenu, setContextMenu] = useState(null);

    useEffect(() => {
        setSelectedIds([]);
        onSelectionChange([]);
    }, [data]);

    useEffect(() => {
        const handleClick = () => setContextMenu(null);
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    const handleContextMenu = (e, item) => {
        e.preventDefault();
        setContextMenu({
            x: e.pageX,
            y: e.pageY,
            item
        });
    };

    const sortedData = React.useMemo(() => {
        let sortableItems = [...data];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [data, sortConfig]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(data.length / itemsPerPage);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
        setSortConfig({ key, direction });
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const ids = currentItems.map(item => item.technicienID);
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
                        <th onClick={() => requestSort('nom')}>Nom {sortConfig.key === 'nom' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}</th>
                        <th onClick={() => requestSort('prenom')}>Prénom</th>
                        <th onClick={() => requestSort('cin')}>CIN</th>
                        <th onClick={() => requestSort('specialite')}>Spécialité</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.length > 0 ? (
                        currentItems.map((tech) => (
                            <tr
                                key={tech.technicienID}
                                className={selectedIds.includes(tech.technicienID) ? 'selected' : ''}
                                onContextMenu={(e) => handleContextMenu(e, tech)}
                            >
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(tech.technicienID)}
                                        onChange={() => handleSelectOne(tech.technicienID)}
                                    />
                                </td>
                                <td>{tech.nom}</td>
                                <td>{tech.prenom}</td>
                                <td>{tech.cin}</td>
                                <td>{tech.specialite}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                                Aucun technicien trouvé.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

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

            {contextMenu && (
                <div
                    className="context-menu"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="context-menu-item" onClick={() => { onEdit(contextMenu.item); setContextMenu(null); }}>
                        <Edit2 size={16} /> Modifier
                    </div>
                    <div className="context-menu-item delete" onClick={() => { onDelete(contextMenu.item.technicienID); setContextMenu(null); }}>
                        <Trash2 size={16} /> Supprimer
                    </div>
                </div>
            )}
        </div>
    );
};

export default TechnicienTable;
