#!/bin/bash

set -e

echo "====================================================="
echo "🚀 Memulai Setup & Deployment MedicheckID"
echo "====================================================="

echo "📦 1. Build Aset Frontend (React/Vite)..."
npm install && npm run build

echo "🐳 Membangun dan menyalakan Docker Container..."
docker-compose up -d --build

echo "⏳ Menunggu PostgreSQL siap menerima koneksi (10 detik)..."
sleep 10

echo "🐘 Menginstal Dependency Laravel (Vendor)..."
docker-compose exec app composer install --optimize-autoloader --no-dev

echo "🗄️ Menjalankan Migrasi & Seeder Database..."
docker-compose exec app php artisan migrate --force
docker-compose exec app php artisan db:seed --force

echo "🔗 Menautkan Folder Storage (Storage Link)..."
docker-compose exec app php artisan storage:link

echo "⚡ Membersihkan & Mengoptimasi Cache Laravel..."
docker-compose exec app php artisan optimize:clear
docker-compose exec app php artisan optimize

echo "====================================================="
echo "✅ Selesai! Container MedicheckID sudah berjalan."
echo "Cek status container dengan perintah: docker-compose ps"
echo "====================================================="