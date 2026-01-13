const whatsappNumber = "6285275284400";
let selectedProduct = "";

// 1. DATA REVIEW AWAL
const reviews = [
    { name: "Siska Amelia", rating: 5, text: "Bahannya adem banget, warna lilacnya benar-benar premium!" },
    { name: "Andi Pratama", rating: 5, text: "Kemeja salurnya pas banget di badan. Jahitan sangat rapi." }
];

document.addEventListener('DOMContentLoaded', () => {
    // Tampilkan Review
    const revContainer = document.getElementById('reviews-container');
    if (revContainer) {
        revContainer.innerHTML = reviews.map(rev => `
            <div class="testi-card">
                <div class="stars">${"★".repeat(rev.rating)}</div>
                <h5>${rev.name}</h5>
                <p>"${rev.text}"</p>
            </div>
        `).join('');
    }

    // Tampilkan Data Pesanan dari LocalStorage
    displayOrders();
});

function openModal(productName) {
    selectedProduct = productName;
    document.getElementById('modal-product-name').innerText = productName;
    document.getElementById('checkout-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('checkout-modal').style.display = 'none';
}

// 2. FUNGSI SIMPAN & KIRIM PESANAN
function sendWhatsApp() {
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const size = document.getElementById('size-select').value;
    
    if (!name || !address) {
        alert("Mohon isi Nama dan Alamat!");
        return;
    }

    // --- LOGIKA SIMPAN DATA UNTUK DOSEN ---
    const newOrder = {
        name: name,
        product: selectedProduct,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        date: new Date().toLocaleDateString()
    };

    // Ambil data lama dari browser, tambah yang baru
    let orders = JSON.parse(localStorage.getItem('dermaOrders')) || [];
    orders.unshift(newOrder); // Tambah ke urutan paling atas
    localStorage.setItem('dermaOrders', JSON.stringify(orders));
    // --------------------------------------

    // Format Pesan WA
    const message = `Halo DERMA, saya *${name}* ingin pesan *${selectedProduct}* ukuran *${size}*.`;
    const waUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;
    
    window.open(waUrl, '_blank');
    
    displayOrders(); // Update tabel di web
    closeModal();
}

// 3. FUNGSI MENAMPILKAN DATA DI TABEL
function displayOrders() {
    const list = document.getElementById('orders-list');
    let orders = JSON.parse(localStorage.getItem('dermaOrders')) || [];

    if (orders.length === 0) {
        list.innerHTML = `<tr><td colspan="4" style="text-align:center;">Belum ada pesanan masuk hari ini.</td></tr>`;
        return;
    }

    list.innerHTML = orders.map(order => `
        <tr>
            <td>${order.time}</td>
            <td><strong>${order.name}</strong></td>
            <td>${order.product}</td>
            <td><span class="status-badge">Dikemas</span></td>
        </tr>
    `).join('');
}