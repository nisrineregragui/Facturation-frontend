import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateInterventionPdf = (intervention, entreprise) => {
    try {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;

        // --- Header 
        doc.setFontSize(22);
        doc.setTextColor(41, 75, 126); // #294b7e
        doc.setFont('helvetica', 'bold');

        const entName = entreprise ? entreprise.nomCommercial : "ELECTRO";
        doc.text(entName.toUpperCase(), 15, 20);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);

        let headerY = 26;
        if (entreprise) {
            if (entreprise.activite) { doc.text(entreprise.activite, 15, headerY); headerY += 5; }
            if (entreprise.adresse) { doc.text(entreprise.adresse, 15, headerY); headerY += 5; }
            if (entreprise.telephone) { doc.text(`Tél: ${entreprise.telephone}`, 15, headerY); headerY += 5; }
        } else {
            doc.text("Le service de confiance", 15, headerY);
        }

        // Title Block (Right side)
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold');
        doc.text("FICHE INTERVENTION", 120, 20);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const dateDebut = intervention.dateDebut ? new Date(intervention.dateDebut).toLocaleDateString("fr-FR") : '-';
        doc.text(`DATE DÉBUT: ${dateDebut}`, 120, 27);

        if (intervention.statut === 'Terminée' && intervention.dateFin) {
            const dateFin = new Date(intervention.dateFin).toLocaleDateString("fr-FR");
            doc.text(`DATE FIN: ${dateFin}`, 120, 32);
        }

        // Warranty Check
        // If MagasinID is present, it is considered "Sous Garantie"
        const isWarranty = intervention.magasinID && intervention.magasinID !== '00000000-0000-0000-0000-000000000000' && intervention.magasinID !== '';
        const warrantyState = isWarranty ? 'SOUS GARANTIE' : 'HORS GARANTIE';

        // Colors
        const primaryColor = [41, 75, 126]; // Dark Blue
        const secondaryColor = [241, 245, 249]; // Light Gray
        const itemsHeaderColor = [23, 37, 84]; // Darker Blue for items
        const warrantyColor = [22, 163, 74]; // Green
        const noWarrantyColor = [220, 38, 38]; // Red

        if (isWarranty) {
            doc.setTextColor(warrantyColor[0], warrantyColor[1], warrantyColor[2]);
        } else {
            doc.setTextColor(noWarrantyColor[0], noWarrantyColor[1], noWarrantyColor[2]);
        }
        doc.setFontSize(12);
        doc.text(warrantyState, 120, 39);
        doc.setTextColor(0, 0, 0); // Reset

        // Magasin Info Block (if Warranty)
        if (isWarranty && intervention.nomMagasin) {
            doc.setFontSize(9);
            doc.setTextColor(60, 60, 60);
            const magInfo = `Magasin: ${intervention.nomMagasin}` +
                (intervention.magasinVille ? ` - ${intervention.magasinVille}` : '') +
                (intervention.magasinResponsable ? ` (${intervention.magasinResponsable})` : '');
            doc.text(magInfo, 120, 44);
        }

        let finalY = 50;

        // --- Section 1: INFO CLIENT & APPAREILL ---
        autoTable(doc, {
            startY: finalY,
            theme: 'grid',
            head: [[
                { content: 'CLIENT', styles: { fillColor: primaryColor, textColor: 255, fontStyle: 'bold' } },
                { content: 'APPAREIL', styles: { fillColor: primaryColor, textColor: 255, fontStyle: 'bold' } }
            ]],
            body: [[
                {
                    content: `Nom: ${intervention.nomClient || ''}\n` +
                        `Tél: ${intervention.clientTelephone || ''}\n` +
                        `Adresse: ${intervention.clientAdresse || '-'}\n` +
                        `Ville: ${intervention.clientVille || '-'}`
                },
                {
                    content: `Modèle: ${intervention.nomAppareil || ''}\n` +
                        `N° Série: ${intervention.appareilNumeroSerie || ''}\n` +
                        `Date Achat: ${intervention.appareilDateAchat ? new Date(intervention.appareilDateAchat).toLocaleDateString() : '-'}\n` +
                        `Fin Garantie: ${intervention.appareilFinGarantie ? new Date(intervention.appareilFinGarantie).toLocaleDateString() : '-'}`
                }
            ]],
            styles: { fontSize: 9, cellPadding: 3, lineColor: [200, 200, 200] },
            headStyles: { fillColor: primaryColor }
        });

        finalY = doc.lastAutoTable.finalY + 10;

        // --- Section 2: PANNES & DETAILS ---
        autoTable(doc, {
            startY: finalY,
            theme: 'grid',
            head: [[
                { content: 'PANNE RÉCLAMÉE', styles: { fillColor: secondaryColor, textColor: 0, fontStyle: 'bold', lineColor: [200, 200, 200] } },
                { content: 'PANNE CONSTATÉE', styles: { fillColor: secondaryColor, textColor: 0, fontStyle: 'bold', lineColor: [200, 200, 200] } }
            ]],
            body: [[
                intervention.panneReclamee || '-',
                intervention.panneConstatee || '-'
            ]],
            styles: { fontSize: 9, minCellHeight: 15, lineColor: [200, 200, 200] }
        });

        finalY = doc.lastAutoTable.finalY + 10;

        // --- Section 3: LISTE DES ARTICLES (Service/Pieces) ---
        const items = intervention.pieces || [];

        if (items.length > 0) {
            autoTable(doc, {
                startY: finalY,
                theme: 'striped',
                head: [[
                    { content: 'ARTICLES / INTERVENTIONS', colSpan: 4, styles: { halign: 'center', fillColor: itemsHeaderColor, textColor: 255 } }
                ], [
                    'Référence', 'Désignation', 'Qté', 'Total HT'
                ]],
                body: items.map(item => [
                    item.referenceProduit || '-',
                    item.nomProduit || '-',
                    item.quantite,
                    `${(item.totalLigneHT || 0).toFixed(2)} DH`
                ]),
                foot: [[
                    { content: 'TOTAL INTERVENTION:', colSpan: 3, styles: { halign: 'right', fontStyle: 'bold' } },
                    { content: `${(intervention.somme || 0).toFixed(2)} DH`, styles: { fontStyle: 'bold', fillColor: [23, 37, 84] } }
                ]],
                styles: { fontSize: 9, lineColor: [200, 200, 200] },
                headStyles: { fillColor: itemsHeaderColor }
            });
            finalY = doc.lastAutoTable.finalY + 10;
        }

        // --- Section 4: TRAVAIL EFFECTUE & NOTES ---
        autoTable(doc, {
            startY: finalY,
            theme: 'grid',
            head: [[{ content: 'TRAVAIL EFFECTUÉ & NOTES', styles: { fillColor: secondaryColor, textColor: 0, fontStyle: 'bold' } }]],
            body: [[
                `Travail effectué: ${intervention.travailEffectue || '-'}\n\n` +
                `Notes: ${intervention.notes || '- '}\n` +
                `Bon de Réparation: ${intervention.bonReparation || '-'}`
            ]],
            styles: { fontSize: 9, minCellHeight: 20 }
        });

        finalY = doc.lastAutoTable.finalY + 10;

        // --- Footer ---
        doc.setFontSize(8);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(100, 100, 100);

        let footerText = "Service Après-Vente";
        if (entreprise) {
            footerText = `${entreprise.nomCommercial} - ${entreprise.adresse} - ${entreprise.ville}`;
            if (entreprise.siteWeb) footerText += ` - ${entreprise.siteWeb}`;
        }

        doc.text(footerText, pageWidth / 2, 280, { align: 'center' });

        // Save
        const safeName = (intervention.nomClient || 'Client').replace(/[^a-z0-9]/gi, '_');
        const filename = `Fiche_Intervention_${safeName}.pdf`;
        doc.save(filename);

    } catch (error) {
        console.error("PDF Generation Error:", error);
        alert("Erreur lors de la génération du PDF: " + error.message);
    }
};

export const generateMagasinInvoicePDF = (facture, entreprise) => {
    try {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;

        // --- Logo / Header (Enterprise) ---
        doc.setFontSize(22);
        doc.setTextColor(41, 75, 126); // Brand Color
        doc.setFont('helvetica', 'bold');

        const entName = entreprise ? (entreprise.nomCommercial || entreprise.NomCommercial || "ADANISSO ELECTRO") : "ADANISSO ELECTRO";
        doc.text(entName.toUpperCase(), 15, 20);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);

        let headerY = 26;
        if (entreprise) {
            const activite = entreprise.activite || entreprise.Activite;
            const adresse = entreprise.adresse || entreprise.Adresse;
            const telephone = entreprise.telephone || entreprise.Telephone;

            if (activite) { doc.text(activite, 15, headerY); headerY += 5; }
            if (adresse) { doc.text(adresse, 15, headerY); headerY += 5; }
            if (telephone) { doc.text(`Tél: ${telephone}`, 15, headerY); headerY += 5; }
        }

        // --- Invoice Info (Right) ---
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold');
        doc.text("FACTURE", 140, 20);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`N°: ${facture.numeroFacture || '-'}`, 140, 28);
        doc.text(`Date: ${new Date(facture.dateFacturation).toLocaleDateString("fr-FR")}`, 140, 33);
        if (facture.dateEcheance) {
            doc.text(`Échéance: ${new Date(facture.dateEcheance).toLocaleDateString("fr-FR")}`, 140, 38);
        }

        // --- Bill To (Magasin) ---
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text("FACTURÉ À:", 15, 60);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(40, 40, 40);
        doc.text(facture.nomMagasin || "Magasin Inconnu", 15, 66);
        // If we had address, we'd add it here.

        let finalY = 75;

        // --- Clients List Summary ---
        const uniqueClients = [...new Set((facture.interventions || []).map(i => i.nomClient))].filter(Boolean);
        if (uniqueClients.length > 0) {
            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(60, 60, 60);
            doc.text("Clients concernés:", 15, finalY);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            // Wrap text if too long
            const clientsStr = uniqueClients.join(", ");
            const splitClients = doc.splitTextToSize(clientsStr, 180);
            doc.text(splitClients, 15, finalY + 5);

            finalY += (splitClients.length * 4) + 10;
        }

        // --- Interventions Table ---
        const columns = ["Date", "Réf", "Client Final", "Appareil", "Panne / Note", "Montant (DH)"];
        const rows = (facture.interventions || []).map(i => [
            new Date(i.dateDebut).toLocaleDateString("fr-FR"),
            `INT-${i.interventionID.substring(0, 8).toUpperCase()}`, // Fake Short Ref
            i.nomClient || '-',
            i.nomAppareil || '-',
            i.panneReclamee || '-',
            (i.somme || 0).toFixed(2)
        ]);

        autoTable(doc, {
            startY: finalY,
            theme: 'striped',
            head: [columns],
            body: rows,
            styles: { fontSize: 8, cellPadding: 2 },
            headStyles: { fillColor: [41, 75, 126] },
            columnStyles: {
                0: { cellWidth: 20 },
                1: { cellWidth: 25 },
                2: { cellWidth: 30 },
                3: { cellWidth: 30 },
                4: { cellWidth: 40 },
                5: { cellWidth: 20, halign: 'right' }
            }
        });

        finalY = doc.lastAutoTable.finalY + 10;

        // --- Totals ---
        const totalTTC = facture.montantTotalTTC || 0;
        const totalHT = facture.montantTotalHT || (totalTTC / 1.2);
        const tva = totalTTC - totalHT;

        // Draw Totals Box
        const boxX = 130;
        const boxWidth = 60;
        // const startBoxY = finalY;

        autoTable(doc, {
            startY: finalY,
            theme: 'plain',
            body: [
                ["Total HT:", `${totalHT.toFixed(2)} DH`],
                ["TVA (20%):", `${tva.toFixed(2)} DH`],
                ["NET À PAYER:", `${totalTTC.toFixed(2)} DH`]
            ],
            styles: { fontSize: 10, cellPadding: 2 },
            columnStyles: {
                0: { fontStyle: 'bold', halign: 'right', cellWidth: 30 },
                1: { halign: 'right', cellWidth: 30 }
            },
            margin: { left: boxX }
        });

        // --- Footer ---
        doc.setFontSize(8);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(150, 150, 150);

        let footerText = "Merci de votre confiance.";
        if (entreprise) {
            const nom = entreprise.nomCommercial || entreprise.NomCommercial;
            const adr = entreprise.adresse || entreprise.Adresse;
            const mail = entreprise.email || entreprise.Email || '';

            if (nom && adr) {
                footerText = `${nom} - ${adr} - ${mail}`;
            }
        }

        doc.text(footerText, pageWidth / 2, 280, { align: 'center' });

        // Save
        const filename = `Facture_${(facture.nomMagasin || 'Magasin').replace(/\s+/g, '_')}_${facture.numeroFacture}.pdf`;
        doc.save(filename);

    } catch (error) {
        console.error("PDF Invoice Error:", error);
        alert("Erreur PDF Facture: " + error.message);
    }
};
