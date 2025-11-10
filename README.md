# Sistem Informasi Desa Cantik (Frontend)

Repositori ini berisi kode frontend untuk project **Sistem Informasi Desa Cinta Statistik (Cantik)** BPS Toraja Utara.

Project ini dibangun sebagai Single-Page Application (SPA) menggunakan React (Vite) dan akan berinteraksi dengan backend (Laravel) melalui RESTful API, sesuai dengan rancangan arsitektur 3-lapis (3-Tier Architecture).

## Teknologi Utama

- **Framework**: React 19+ dengan Next.js
- **Styling**: Tailwind CSS v4
- **Komponen UI**: shadcn/ui
- **Routing**: Next.js App Router
- **Arsitektur**: Decoupled (Terpisah dari Backend)
- **Build Tool**: Turbopack (default Next.js 16)

## Panduan Instalasi (Untuk Anggota Tim)

Project starter ini sudah dikonfigurasi sepenuhnya oleh Lead Dev. Anda **TIDAK PERLU** menjalankan `npx tailwindcss init` atau `npx shadcn@latest init`.

Cukup ikuti tiga langkah sederhana ini:

### 1. Clone Project

Salin repositori dan masuk ke dalam folder:

\`\`\`bash
git clone https://git.stis.ac.id/rpl-lancarnyaman
cd desa-cantik-frontend-develop
\`\`\`

### 2. Install Semua Dependency

Pastikan Anda memiliki Node.js (versi 18+). Perintah ini akan menginstal semua yang kita butuhkan (React, Next.js, Tailwind, React Router, dll.):

\`\`\`bash
npm install
\`\`\`

### 3. Jalankan Project

Jalankan server development lokal:

\`\`\`bash
npm run dev
\`\`\`

Buka browser Anda dan akses: **http://localhost:3000/**

Jika tampilan awal React muncul, Anda siap bekerja!

## Cara Bekerja

### Menambahkan Komponen (shadcn/ui)

Anda tidak perlu menjalankan init. Gunakan perintah `add` untuk menambahkan komponen baru yang Anda butuhkan:

\`\`\`bash
# Untuk menambahkan tombol
npx shadcn@latest add button

# Untuk menambahkan modal
npx shadcn@latest add dialog

# Untuk menambahkan input form
npx shadcn@latest add input
\`\`\`

Komponen akan otomatis ditambahkan ke `src/components/ui/`.

### Struktur Folder

Kami menggunakan struktur folder standar untuk memisahkan logika. Fokus utama Anda akan ada di folder `src/`:

\`\`\`
src/
├── assets/         (Gambar, font, dan aset statis)
├── components/
│   ├── shared/     (Navbar, Sidebar, dan komponen yang digunakan di banyak tempat)
│   └── ui/         (Komponen shadcn, jangan diedit manual)
├── hooks/          (Custom hooks, misal: useAuth)
├── layouts/        (Pembungkus halaman, misal: DashboardLayout)
├── pages/          (Halaman utama, dibagi per-aktor)
│   ├── public/     (Halaman publik: login, register, dll.)
│   ├── admin/      (Halaman admin)
│   └── desa/       (Halaman desa)
├── routes/         (Konfigurasi routing)
├── services/       (Tempat logic API call menggunakan fetch atau axios)
├── types/          (TypeScript interfaces dan types)
├── utils/          (Fungsi utility dan helper)
└── lib/            (Folder utilitas umum)
\`\`\`

### Build untuk Production

\`\`\`bash
npm run build
npm run start
\`\`\`

## Alur Kerja Git (Git Workflow)

Ikuti workflow berikut untuk menjaga kualitas kode:

1. **Pull Latest Changes**: Selalu tarik (pull) dari `develop` sebelum memulai tugas baru:
   \`\`\`bash
   git pull origin develop
   \`\`\`

2. **Buat Branch Baru**: Buat branch baru untuk setiap task/feature:
   \`\`\`bash
   git checkout -b feature/halaman-login
   git checkout -b fix/bug-header
   \`\`\`

3. **Commit Berkala**: Lakukan commit secara berkala dengan pesan yang jelas:
   \`\`\`bash
   git commit -m "feat: tambah halaman login dengan validasi"
   git commit -m "fix: perbaiki bug pada responsive navbar"
   git commit -m "style: update styling button primary"
   \`\`\`

4. **Push dan Pull Request**: Push branch Anda dan buat Pull Request (PR) ke `develop` untuk di-review:
   \`\`\`bash
   git push origin feature/halaman-login
   \`\`\`

### Konvensi Commit

Gunakan prefix berikut pada pesan commit Anda:
- `feat:` - Fitur baru
- `fix:` - Bug fix
- `style:` - Perubahan styling
- `refactor:` - Refactoring kode
- `docs:` - Perubahan dokumentasi
- `test:` - Penambahan atau perbaikan test

⚠️ **PENTING**: **DILARANG push langsung ke `develop` atau `main`**. Selalu gunakan Pull Request.

## Scripts Tersedia

\`\`\`bash
npm run dev      # Jalankan development server
npm run build    # Build untuk production
npm run start    # Jalankan production server
npm run lint     # Jalankan ESLint
\`\`\`