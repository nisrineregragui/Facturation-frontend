import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Eye, FileText, Printer } from 'lucide-react';
import '../Clients/ClientTable.css'; // Reuse styles

const FactureTable = ({
    data,
    onView,
    onPrint,
    loading
}) => {
    const [sortConfig, setSortConfig] = useState({ key: 'dateFacturation', direction: 'desc' });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const sortedData = React.useMemo(() => {
        let sortableItems = [...data];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                let aVal = a[sortConfig.key];
                let bVal = b[sortConfig.key];

                // Handle dates
                if (sortConfig.key === 'dateFacturation') {
                    aVal = new Date(aVal);
                    bVal = new Date(bVal);
                }

                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
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

    if (loading) return <div className="p-4 text-center">Chargement...</div>;

    return (
        <div className="table-container">
            <table className="data-table">
                <thead>
                    <tr>
                        <th onClick={() => requestSort('numeroFacture')}>Référence</th>
                        <th onClick={() => requestSort('dateFacturation')}>Date</th>
                        <th onClick={() => requestSort('nomClient')}>Client</th>
                        <th onClick={() => requestSort('montantTotalHT')}>Montant HT</th>
                        <th onClick={() => requestSort('montantTotalTTC')}>Total TTC</th>
                        <th width="100">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.length > 0 ? (
                        currentItems.map((item) => (
                            <tr key={item.factureID}>
                                <td><span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{item.numeroFacture || item.factureID.substring(0, 8)}</span></td>
                                <td>{item.dateFacturation ? new Date(item.dateFacturation).toLocaleDateString() : '-'}</td>
                                <td>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: 'bold' }}>{item.nomMagasin || item.nomClient}</span>
                                        {item.nomMagasin && <span style={{ fontSize: '0.8em', color: '#666' }}>{item.nomClient}</span>}
                                    </div>
                                </td>
                                <td>{item.montantTotalHT.toFixed(2)} DH</td>
                                <td style={{ fontWeight: 'bold' }}>{item.montantTotalTTC.toFixed(2)} DH</td>
                                <td style={{ display: 'flex', gap: '5px' }}>
                                    <button
                                        className="btn-icon"
                                        onClick={() => onView(item)}
                                        title="Voir Détails"
                                        style={{ color: '#64748b' }}
                                    >
                                        <Eye size={18} />
                                    </button>
                                    <button
                                        className="btn-icon"
                                        onClick={() => onPrint && onPrint(item.factureID)}
                                        title="Imprimer PDF"
                                        style={{ color: '#2563eb' }}
                                    >
                                        <Printer size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                                Aucune facture trouvée.
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
        </div>
    );
};

export default FactureTable;
