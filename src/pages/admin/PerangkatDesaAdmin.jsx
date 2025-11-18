import React from 'react';

// Data dummy (contoh)
const dataPerangkat = [
  { id: 1, nama: 'Adib', nik: '222312***', desa: 'Nonongan Selatan' },
  { id: 2, nama: 'Alif', nik: '222312***', desa: 'Nonongan Selatan' },
  { id: 3, nama: 'Alex', nik: '222312***', desa: 'Rinding Batu' },
  { id: 4, nama: 'Anggita', nik: '222312***', desa: 'Rinding Batu' },
];

const PerangkatDesa = () => {
  return (
    <>
      <style>
        {`
          /* Mengatur font dasar dan latar belakang body */
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f0f4f8; /* Latar belakang abu-abu kebiruan */
            margin: 0;
            padding: 24px;
          }

          /* Kontainer utama untuk membungkus semuanya */
          .container {
            max-width: 1100px;
            margin: 0 auto;
          }

          /* Header (Judul dan Tombol) */
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }

          .header h2 {
            font-size: 24px;
            font-weight: 600;
            color: #1a202c; /* Warna teks gelap */
          }

          /* Tombol "Tambah" */
          .add-button {
            background-color: #ffffff;
            border: 1px solid #cbd5e0; /* Border abu-abu */
            border-radius: 6px;
            padding: 8px 16px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* Shadow tipis */
            transition: background-color 0.2s;
          }

          .add-button:hover {
            background-color: #f7fafc; /* Efek hover */
          }

          /* Kartu putih yang membungkus tabel dan paginasi */
          .content-card {
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            overflow: hidden; /* Penting agar border-radius memotong tabel */
          }

          /* Tabel */
          .table {
            width: 100%;
            border-collapse: collapse; /* Menghilangkan spasi antar sel */
          }

          .table th,
          .table td {
            padding: 16px 20px; /* Padding di dalam sel */
            text-align: left;
            border-bottom: 1px solid #e2e8f0; /* Garis horizontal antar baris */
          }

          /* Header tabel */
          .table th {
            color: #4a5568; /* Warna teks header abu-abu */
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            background-color: #f7fafc; 
          }

          /* Body tabel */
          .table td {
            color: #2d3748; /* Warna teks isi tabel */
            font-size: 14px;
          }

          /* Menghilangkan border di baris terakhir */
          .table tbody tr:last-child td {
            border-bottom: none;
          }

          /* Paginasi (footer kartu) */
          .pagination {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 20px;
            border-top: 1px solid #e2e8f0; /* Garis pemisah dari tabel */
          }

          /* Tombol "Previous" dan "Next" */
          .page-button {
            background-color: #f1f5f9; /* Warna abu-abu */
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 6px 12px;
            font-size: 14px;
            color: #718096; /* Warna teks abu-abu */
            cursor: pointer;
          }

          .page-button:disabled {
            background-color: #f1f5f9;
            color: #cbd5e0; /* Warna lebih pudar saat disabled */
            cursor: not-allowed;
          }

          .next-button {
            background-color: #f1f5f9;
            color: #718096;
          }

          /* Kontainer untuk nomor halaman */
          .page-numbers {
            display: flex;
            align-items: center;
            gap: 8px; /* Jarak antar nomor */
          }

          .page-item {
            font-size: 14px;
            color: #718096;
            padding: 4px 8px;
          }

          /* Style untuk halaman aktif (angka '1' di gambar) */
          .page-item.active {
            background-color: #e2e8f0;
            border-radius: 4px;
            color: #2d3748;
            font-weight: 600;
          }
        `}
      </style>

      {/* Konten JSX dimulai di sini */}
      <div className="container">
        {/* Bagian Header: Judul dan Tombol Tambah */}
        <header className="header">
          <h2>Daftar Perangkat Desa</h2>
          <button className="add-button">Tambah</button>
        </header>

        {/* Konten Utama: Kartu yang berisi tabel dan paginasi */}
        <div className="content-card">
          {/* Tabel Data */}
          <table className="table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>NIK</th>
                <th>Desa</th>
              </tr>
            </thead>
            <tbody>
              {dataPerangkat.map((perangkat) => (
                <tr key={perangkat.id}>
                  <td>{perangkat.id}</td>
                  <td>{perangkat.nama}</td>
                  <td>{perangkat.nik}</td>
                  <td>{perangkat.desa}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Bagian Paginasi (Footer Tabel) */}
          <footer className="pagination">
            <button className="page-button" disabled>
              Previous
            </button>
            
            <div className="page-numbers">
              <span className="page-item active">1</span>
              <span className="page-item">2</span>
              <span className="page-item">3</span>
              <span className="page-item dots">...</span>
              <span className="page-item">8</span>
              <span className="page-item">9</span>
              <span className="page-item">10</span>
            </div>

            <button className="page-button next-button">
              Next
            </button>
          </footer>
        </div>
      </div>
    </>
  );
};

export default PerangkatDesa;