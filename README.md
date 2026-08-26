# Portofolio SvelteKit + Supabase + Bun + Docker

Sistem Manajemen Portofolio & CMS Personal modern yang dibangun menggunakan **SvelteKit 2** (Svelte 5 Runes), **Supabase** sebagai Backend-as-a-Service, **Bun** sebagai runtime/package manager, dan didukung oleh **Docker Compose** multi-stage build tingkat produksi.

---

## 🛠️ Tech Stack

- **Frontend Framework**: [SvelteKit 2](https://kit.svelte.dev/) & [Svelte 5](https://svelte.dev/)
- **Runtime & Package Manager**: [Bun](https://bun.sh/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database & Auth**: [Supabase](https://supabase.com/) (Database, Auth, Storage)
- **Adapter**: `@sveltejs/adapter-node`
- **Containerization**: Docker & Docker Compose (Multi-Stage Build)
- **Icon Library**: `lucide-svelte` & `@iconify/svelte`

---

## 📁 Struktur Project

```text
├── src/
│   ├── hooks.server.ts          # Middleware Supabase SSR & Auth session handling
│   ├── lib/
│   │   ├── auth/                # Guards & helper autentikasi admin
│   │   ├── components/          # Komponen UI (Navbar, Footer, Section Portofolio)
│   │   ├── supabase/            # Client/Server Supabase initialization & Types
│   │   └── utils/               # Utility fungsi & penanganan error
│   └── routes/
│       ├── +page.svelte         # Halaman Portofolio Utama
│       ├── +page.server.ts      # SSR loader paralel data portofolio dari Supabase
│       └── (admin)/             # Dashboard Admin CMS & Halaman Login
├── supabase/
│   └── migrations/              # Skrip SQL pembuatan tabel, RLS, storage, & user admin
├── Dockerfile                   # Production Multi-Stage Dockerfile (Non-root user 'bun')
├── docker-compose.yaml          # Production Docker Compose (Port 5173:3000, Healthcheck, Logging)
├── Dockerfile.dev               # Development Dockerfile (HMR Live-reload)
├── compose.dev.yaml             # Development Docker Compose dengan Volume Mount
├── .dockerignore                # Mengabaikan file sensitif/sampah lokal dari Docker context
├── svelte.config.js             # Konfigurasi SvelteKit dengan adapter-node
└── vite.config.ts               # Konfigurasi Vite & optimasi pre-bundling icon
```

---

## 🔑 Konfigurasi Environment Variables (`.env`)

Buat file `.env` di root project berdasarkan `.env.example`:

```env
# Supabase Public Keys (Aman untuk Client-side / Build ARG)
PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key-here
PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Supabase Private Key (Server-side Runtime Only - JANGAN dimasukkan ke client bundle/ARG)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

---

## 🗄️ Setup Database & Migrasi Supabase

File migrasi database berada di folder `supabase/migrations/`:
1. `20260827000000_create_portfolio_tables.sql` (Skema Tabel, RLS Policies, Triggers, & Storage Buckets)
2. `20260827000001_create_admin_user.sql` (Pembuatan User Admin awal)

### Cara Eksekusi Migrasi:

#### Opsi 1: Lewat SQL Editor Dashboard Supabase (Rekomendasi)
1. Buka Dashboard Supabase Cloud Anda -> **SQL Editor** -> **New Query**.
2. Salin dan jalankan isi file `supabase/migrations/20260827000000_create_portfolio_tables.sql`.
3. Salin dan jalankan isi file `supabase/migrations/20260827000001_create_admin_user.sql`.

#### Opsi 2: Lewat Supabase CLI
```bash
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

> **Akun Admin Default**:
> - **Email**: `yusrilmaqoshidana.work@gmail.com`
> - **Password**: `Yusril2064.`

---

## 🚀 Jalankan Secara Lokal (Tanpa Docker)

1. **Install Dependensi**:
   ```bash
   bun install --frozen-lockfile
   ```

2. **Jalankan Dev Server**:
   ```bash
   bun run dev
   ```
   Aplikasi dapat diakses di `http://localhost:5173`.

3. **Build & Preview Production Lokal**:
   ```bash
   bun run build
   bun build/index.js
   ```

---

## 🐳 Jalankan Menggunakan Docker

### Mode Development (Dengan Live-Reload / HMR)
```bash
sudo docker compose -f compose.dev.yaml up --build
```
*Aplikasi berjalan di `http://localhost:5173` dengan auto-reload saat kode diubah.*

### Mode Production (Multi-Stage Build, Ringan, & Aman)
```bash
# 1. Build image production
sudo BUILDKIT_PROGRESS=plain docker compose build

# 2. Jalankan container di background
sudo docker compose up -d

# 3. Cek status container & healthcheck
sudo docker compose ps

# 4. Cek log aplikasi
sudo docker compose logs -f portofolio-svelte
```
- **Port Mapping**: Host `5173` -> Container `3000` (`http://localhost:5173`)
- **Fitur Keamanan Production**:
  - Dijalankan oleh non-root user `bun` (`USER bun`).
  - Healthcheck otomatis terpusat di `docker-compose.yaml`.
  - Rotasi log otomatis (`max-size: 10m`, `max-file: 3`).
  - Pemisahan build-time variable (`PUBLIC_*`) dan runtime secret.

---

## 🌐 Integrasi Cloudflare Tunnel (Opsional)

Jika ingin mempublikasikan portofolio ke internet via Cloudflare Tunnel, tambahkan ingress berikut di `~/.cloudflared/config.yml`:

```yaml
ingress:
  - hostname: portofolio.domain-anda.com
    service: http://localhost:5173
  - service: http_status:404
```

Lalu restart service `cloudflared`:
```bash
systemctl --user restart cloudflared
```
