#!/bin/bash

set -e

echo "====================================================="
echo "🚀 Memulai Setup & Deployment MedicheckID"
echo "====================================================="

echo "🐳 2. Membangun dan menyalakan Docker Container..."
docker-compose up -d --build

echo "⏳ Menunggu PostgreSQL siap menerima koneksi (10 detik)..."
sleep 300

echo "🐘 3. Menginstal Dependency Laravel (Vendor)..."
docker-compose exec app composer install --optimize-autoloader --no-dev

echo "🗄️ 4. Menjalankan Migrasi & Seeder Database..."
docker-compose exec app php artisan migrate --force
docker-compose exec app php artisan db:seed --force

echo "🔗 5. Menautkan Folder Storage (Storage Link)..."
docker-compose exec app php artisan storage:link

echo "⚡ 6. Membersihkan & Mengoptimasi Cache Laravel..."
docker-compose exec app php artisan optimize:clear
docker-compose exec app php artisan optimize

echo "====================================================="
echo "✅ Selesai! Container MedicheckID sudah berjalan."
echo "Cek status container dengan perintah: docker-compose ps"
echo "====================================================="