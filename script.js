// Data Storage
let data = {
    modal: 0,
    pengeluaran: 0,
    omset: 0,
    items: [],
    transactions: []
};

// Load data from localStorage
function loadData() {
    const savedData = localStorage.getItem('finansialData');
    if (savedData) {
        data = JSON.parse(savedData);
    }
    updateDashboard();
    updateStockList();
    updateTransactionHistory();
    updateSelectOptions();
    updateStatistics();
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('finansialData', JSON.stringify(data));
}

// Format currency
function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(angka);
}

// Modal functions
function openModal(modalId) {
    console.log('Opening modal:', modalId); // Debug log
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeModal(modalId) {
    console.log('Closing modal:', modalId); // Debug log
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        // Reset forms
        const form = modal.querySelector('form');
        if (form) form.reset();
        // Hide info harga
        if (modalId === 'penjualanModal') {
            const infoHarga = document.getElementById('infoHarga');
            if (infoHarga) infoHarga.classList.add('hidden');
        }
        if (modalId === 'pengeluaranModal') {
            const saldoInfo = document.getElementById('saldoInfo');
            if (saldoInfo) saldoInfo.classList.add('hidden');
        }
    }
}

// Update Dashboard
function updateDashboard() {
    const totalModalEl = document.getElementById('totalModal');
    const totalPengeluaranEl = document.getElementById('totalPengeluaran');
    const totalOmsetEl = document.getElementById('totalOmset');
    
    if (totalModalEl) totalModalEl.textContent = formatRupiah(data.modal);
    if (totalPengeluaranEl) totalPengeluaranEl.textContent = formatRupiah(data.pengeluaran);
    if (totalOmsetEl) totalOmsetEl.textContent = formatRupiah(data.omset);
}

// Update Stock List
function updateStockList() {
    const stockList = document.getElementById('stockList');
    if (!stockList) return;
    
    if (data.items.length === 0) {
        stockList.innerHTML = `
            <div class="text-gray-500 text-center py-8">
                <img src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/c0eba984-059a-4c49-89f1-f7aeeee5578e.png" alt="Empty inventory illustration with boxes and question mark in light gray" class="mx-auto mb-4 opacity-50">
                Belum ada item. Tambah item baru untuk memulai.
            </div>
        `;
        return;
    }

    stockList.innerHTML = data.items.map(item => {
        let stockClass = 'stock-high';
        let stockStatus = 'Stok Aman';
        let statusColor = 'text-green-600';
        
        if (item.stok === 0) {
            stockClass = 'stock-low';
            stockStatus = 'Habis';
            statusColor = 'text-red-600';
        } else if (item.stok < 10) {
            stockClass = 'stock-low';
            stockStatus = 'Stok Menipis';
            statusColor = 'text-red-600';
        } else if (item.stok < 50) {
            stockClass = 'stock-medium';
            stockStatus = 'Stok Sedang';
            statusColor = 'text-yellow-600';
        }

        return `
            <div class="item-card bg-white rounded-lg p-4 border-l-4 ${stockClass} shadow-sm">
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <h4 class="font-semibold text-gray-800">${item.nama}</h4>
                        <p class="text-gray-600">${formatRupiah(item.harga)}</p>
                        <div class="flex items-center mt-2">
                            <span class="text-sm ${statusColor} font-medium">${stockStatus}</span>
                            <span class="ml-2 text-sm text-gray-500">• Terjual: ${item.terjual || 0}</span>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="text-2xl font-bold text-gray-800">${item.stok}</p>
                        <p class="text-xs text-gray-500">Unit</p>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Update Transaction History
function updateTransactionHistory() {
    const historyContainer = document.getElementById('transactionHistory');
    if (!historyContainer) return;
    
    if (data.transactions.length === 0) {
        historyContainer.innerHTML = `
            <div class="text-gray-500 text-center py-8">
                <img src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/257ff57e-31f8-4ccd-b8e3-d3207a3279a5.png" alt="Empty transaction history illustration with document and clock in light gray" class="mx-auto mb-4 opacity-50">
                Belum ada transaksi.
            </div>
        `;
        return;
    }

    const sortedTransactions = [...data.transactions].reverse();
    historyContainer.innerHTML = sortedTransactions.slice(0, 20).map(transaction => {
        let iconColor = 'bg-gray-100';
        let textColor = 'text-gray-600';
        
        if (transaction.type === 'modal') {
            iconColor = 'bg-blue-100';
            textColor = 'text-blue-600';
        } else if (transaction.type === 'pengeluaran') {
            iconColor = 'bg-red-100';
            textColor = 'text-red-600';
        } else if (transaction.type === 'penjualan') {
            iconColor = 'bg-green-100';
            textColor = 'text-green-600';
        }

        return `
            <div class="flex items-center p-3 bg-gray-50 rounded-lg">
                <div class="w-8 h-8 ${iconColor} rounded-full flex items-center justify-center mr-3">
                    <img src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/6b6d5a51-9fb2-4886-8f6c-5d0d605067b4.png" alt="Transaction type icon in ${transaction.type} style" class="w-4 h-4">
                </div>
                <div class="flex-1">
                    <p class="text-sm font-medium text-gray-800">${transaction.description}</p>
                    <p class="text-xs text-gray-500">${transaction.date}</p>
                </div>
                <p class="text-sm font-semibold ${textColor}">${formatRupiah(transaction.amount)}</p>
            </div>
        `;
    }).join('');
}

// Update Select Options
function updateSelectOptions() {
    const selectStok = document.getElementById('pilihItemStok');
    const selectJual = document.getElementById('pilihItemJual');
    
    if (selectStok) {
        const options = data.items.map(item => 
            `<option value="${item.nama}">${item.nama} (Stok: ${item.stok})</option>`
        ).join('');
        selectStok.innerHTML = '<option value="">Pilih Item...</option>' + options;
    }
    
    if (selectJual) {
        const availableItems = data.items.filter(item => item.stok > 0);
        const availableOptions = availableItems.map(item => 
            `<option value="${item.nama}">${item.nama} (Stok: ${item.stok})</option>`
        ).join('');
        selectJual.innerHTML = '<option value="">Pilih Item...</option>' + availableOptions;
    }
}

// Update Statistics
function updateStatistics() {
    const totalItemTerjual = data.items.reduce((sum, item) => sum + (item.terjual || 0), 0);
    const totalJenisItem = data.items.length;
    const rataPenjualan = totalJenisItem > 0 ? data.omset / totalJenisItem : 0;

    const totalItemTerjualEl = document.getElementById('totalItemTerjual');
    const totalJenisItemEl = document.getElementById('totalJenisItem');
    const rataPenjualanEl = document.getElementById('rataPenjualan');

    if (totalItemTerjualEl) totalItemTerjualEl.textContent = totalItemTerjual;
    if (totalJenisItemEl) totalJenisItemEl.textContent = totalJenisItem;
    if (rataPenjualanEl) rataPenjualanEl.textContent = formatRupiah(rataPenjualan);
}

// Add Modal
function tambahModal(event) {
    event.preventDefault();
    const inputModal = document.getElementById('inputModal');
    const keteranganModal = document.getElementById('keteranganModal');
    
    if (!inputModal) return;
    
    const jumlah = parseInt(inputModal.value);
    const keterangan = keteranganModal ? keteranganModal.value || 'Modal' : 'Modal';
    
    data.modal += jumlah;
    data.transactions.push({
        type: 'modal',
        description: keterangan,
        amount: jumlah,
        date: new Date().toLocaleString('id-ID')
    });
    
    saveData();
    updateDashboard();
    updateTransactionHistory();
    closeModal('modalModal');
    
    showNotification('Modal berhasil ditambahkan!', 'success');
}

// Add Pengeluaran
function tambahPengeluaran(event) {
    event.preventDefault();
    const kategoriPengeluaran = document.getElementById('kategoriPengeluaran');
    const inputPengeluaran = document.getElementById('inputPengeluaran');
    const keteranganPengeluaran = document.getElementById('keteranganPengeluaran');
    
    if (!kategoriPengeluaran || !inputPengeluaran || !keteranganPengeluaran) return;
    
    const kategori = kategoriPengeluaran.value;
    const jumlah = parseInt(inputPengeluaran.value);
    const keterangan = keteranganPengeluaran.value;
    
    // Check if enough balance
    if (kategori === 'modal' && data.modal < jumlah) {
        showNotification('Modal tidak mencukupi!', 'error');
        return;
    }
    
    if (kategori === 'omset' && data.omset < jumlah) {
        showNotification('Omset tidak mencukupi!', 'error');
        return;
    }
    
    // Deduct from selected category
    if (kategori === 'modal') {
        data.modal -= jumlah;
    } else if (kategori === 'omset') {
        data.omset -= jumlah;
    }
    
    data.pengeluaran += jumlah;
    data.transactions.push({
        type: 'pengeluaran',
        description: `${keterangan} (Dari ${kategori === 'modal' ? 'Modal' : 'Omset'})`,
        amount: jumlah,
        date: new Date().toLocaleString('id-ID')
    });
    
    saveData();
    updateDashboard();
    updateTransactionHistory();
    closeModal('pengeluaranModal');
    
    showNotification('Pengeluaran berhasil dicatat!', 'success');
}