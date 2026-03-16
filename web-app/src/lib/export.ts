import type { Reservation, CoworkReservation } from '@/types/database';

export function exportToCSV(
    data: (Reservation | CoworkReservation)[],
    filename: string
) {
    if (data.length === 0) return;

    // Build the headers
    const headers = [
        'ID',
        'Tipo',
        'Item/Plano',
        'Cliente',
        'Contacto',
        'Data Início',
        'Data Fim',
        'Hora Início',
        'Hora Fim',
        'Status',
        'Preço Total (€)',
        'Data de Criação'
    ];

    // Build the rows
    const rows = data.map((r) => {
        const isGearOrStudio = 'item_name' in r;
        
        return [
            r.id,
            isGearOrStudio ? (r as Reservation).item_type : 'cowork',
            isGearOrStudio ? (r as Reservation).item_name : (r as CoworkReservation).plan_id,
            r.client,
            r.contact || '',
            r.start_date,
            r.end_date,
            (r as Reservation).start_time || '',
            (r as Reservation).end_time || '',
            r.status,
            r.total_price || 0,
            new Date(r.created_at).toLocaleString('pt-PT')
        ];
    });

    // Combine headers and rows, handle escaping commas and quotes
    const csvContent = [
        headers.join(','),
        ...rows.map(row =>
            row.map(cell => {
                const cellStr = String(cell);
                // Escape quotes and wrap in quotes if it contains a comma or newline
                if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
                    return `"${cellStr.replace(/"/g, '""')}"`;
                }
                return cellStr;
            }).join(',')
        )
    ].join('\n');

    // Add BOM for correct UTF-8 rendering in Excel
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create a hidden link and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
