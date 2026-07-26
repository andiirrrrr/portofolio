const { execSync } = require('child_process');
const path = require('path');

console.log('🔄 Memulai sinkronisasi data & foto dari Laravel Admin...');

try {
  const rootDir = path.resolve(__dirname, '../../');
  
  // 1. Jalankan export script di backend
  console.log('📦 1. Mengisi data terbaru dari database Laravel...');
  execSync('php backend/export_data.php', { cwd: rootDir, stdio: 'inherit' });

  // 2. Salin foto-foto storage ke frontend/public/storage
  console.log('🖼️  2. Menyalin berkas media & foto ke frontend/public/storage...');
  execSync('powershell -Command "if (!(Test-Path \'frontend/public/storage\')) { New-Item -ItemType Directory -Path \'frontend/public/storage\' -Force }; Copy-Item -Path \'backend/storage/app/public/*\' -Destination \'frontend/public/storage\' -Recurse -Force"', { cwd: rootDir, stdio: 'inherit' });

  console.log('✅ Sinkronisasi Selesai!');
  console.log('➡️  Pastikan file baru di frontend/public/storage ikut di-commit (sudah tidak di-gitignore).');
  console.log('➡️  Lanjut: git add . && git commit -m "update data" && git push agar Vercel update.');
} catch (error) {
  console.error('❌ Terjadi kesalahan saat sinkronisasi:', error.message);
}
