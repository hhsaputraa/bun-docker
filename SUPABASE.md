# Integrasi Supabase dengan Aplikasi Bun-Docker

## Error: Could not find the table 'public.tasks'

Jika Anda mendapatkan error ini, artinya tabel `tasks` belum dibuat di database Supabase Anda. Ikuti langkah-langkah di bawah untuk mengatur Supabase dengan benar.

## Setup Supabase

1. Buat akun di [Supabase](https://supabase.com) jika belum memilikinya
2. Buat project baru di Supabase
3. Dapatkan URL dan API Key dari halaman Settings > API
4. Update file `.env` dengan URL dan API Key Supabase Anda:

```
SUPABASE_URL=https://your-project-url.supabase.co
SUPABASE_KEY=your-anon-key
```

## Membuat Tabel di Supabase

### Opsi 1: Menggunakan SQL Editor di Dashboard Supabase

1. Login ke dashboard Supabase
2. Pilih project Anda
3. Klik "SQL Editor" di sidebar
4. Buat query baru dan paste SQL berikut:

```sql
-- Buat tabel tasks
CREATE TABLE public.tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Tambahkan RLS (Row Level Security)
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Buat policy untuk mengizinkan semua operasi untuk pengguna yang terautentikasi
CREATE POLICY "Allow full access to authenticated users" 
  ON public.tasks 
  USING (true) 
  WITH CHECK (true);

-- Izinkan akses publik untuk keperluan demo (hapus di production)
CREATE POLICY "Allow public access" 
  ON public.tasks 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Insert sample data
INSERT INTO public.tasks (title, description, is_completed) VALUES
  ('Complete Supabase integration', 'Implement full Supabase integration with the API', false),
  ('Add authentication', 'Implement user authentication using Supabase Auth', false),
  ('Deploy to production', 'Deploy the application to production environment', false);
```

5. Klik "Run" untuk mengeksekusi SQL

### Opsi 2: Menggunakan Supabase CLI

Jika Anda memiliki Supabase CLI, Anda dapat menjalankan:

```bash
supabase db push --db-url "postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres" ./supabase_setup.sql
```

## Mode Development vs Production

Aplikasi ini mendukung dua mode operasi:

1. **Mode Development** (`NODE_ENV=development`)
   - Jika kredensial Supabase tidak valid, aplikasi akan menggunakan data mock
   - Berguna untuk pengembangan lokal tanpa koneksi Supabase

2. **Mode Production** (`NODE_ENV=production`)
   - Memerlukan kredensial Supabase yang valid
   - Akan error jika kredensial tidak tersedia atau tidak valid

## Operasi CRUD

Aplikasi ini mendukung operasi CRUD lengkap melalui API:

- **GET /api/tasks** - Mendapatkan semua tasks
- **GET /api/tasks/:id** - Mendapatkan task berdasarkan ID
- **POST /api/tasks** - Membuat task baru
- **PUT /api/tasks/:id** - Memperbarui task yang ada
- **DELETE /api/tasks/:id** - Menghapus task

## Contoh Penggunaan API

### Mendapatkan semua tasks
```bash
curl http://localhost:8081/api/tasks
```

### Membuat task baru
```bash
curl -X POST http://localhost:8081/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Task baru","description":"Deskripsi task baru"}'
```

### Memperbarui task
```bash
curl -X PUT http://localhost:8081/api/tasks/[task-id] \
  -H "Content-Type: application/json" \
  -d '{"title":"Task diperbarui","is_completed":true}'
```

### Menghapus task
```bash
curl -X DELETE http://localhost:8081/api/tasks/[task-id]
```

## Troubleshooting

### Error: Could not find the table 'public.tasks'

Ini berarti tabel `tasks` belum dibuat di database Supabase Anda. Ikuti langkah-langkah di bagian "Membuat Tabel di Supabase" di atas.

### Menggunakan Mock Data untuk Development

Jika Anda ingin menggunakan mock data untuk development tanpa perlu mengatur Supabase, pastikan `NODE_ENV=development` di file `.env` dan hapus atau ubah kredensial Supabase menjadi tidak valid.