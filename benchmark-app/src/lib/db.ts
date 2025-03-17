import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Veritabanı bağlantı havuzu oluştur
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Veritabanı tablosunu oluştur (eğer yoksa)
export const initDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS benchmarks (
        id SERIAL PRIMARY KEY,
        benchmark VARCHAR(255) NOT NULL,
        gpu VARCHAR(255) NOT NULL,
        cpu VARCHAR(255) NOT NULL,
        resolution VARCHAR(100) NOT NULL,
        quality VARCHAR(100) NOT NULL,
        ray_tracing VARCHAR(100) NOT NULL,
        upscaling VARCHAR(100) NOT NULL,
        anti_aliasing VARCHAR(100) NOT NULL,
        result DECIMAL(10, 2) NOT NULL,
        tip VARCHAR(100) NOT NULL,
        direction INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Veritabanı tablosu başarıyla oluşturuldu veya zaten var');
  } catch (error) {
    console.error('Veritabanı tablosu oluşturulurken hata:', error);
  }
};

// Tüm benchmark sonuçlarını getir
export const getAllBenchmarks = async () => {
  try {
    const result = await pool.query('SELECT * FROM benchmarks ORDER BY benchmark ASC');
    return result.rows;
  } catch (error) {
    console.error('Benchmark verileri alınırken hata:', error);
    return [];
  }
};

// Yeni benchmark ekle
export const addBenchmark = async (benchmark: {
  benchmark: string;
  gpu: string;
  cpu: string;
  resolution: string;
  quality: string;
  rayTracing: string;
  upscaling: string;
  antiAliasing: string;
  result: number;
  tip: string;
  direction: number;
}) => {
  try {
    const { benchmark: benchmarkName, gpu, cpu, resolution, quality, rayTracing, upscaling, antiAliasing, result, tip, direction } = benchmark;
    
    const query = `
      INSERT INTO benchmarks (benchmark, gpu, cpu, resolution, quality, ray_tracing, upscaling, anti_aliasing, result, tip, direction)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
    
    const values = [benchmarkName, gpu, cpu, resolution, quality, rayTracing, upscaling, antiAliasing, result, tip, direction];
    const res = await pool.query(query, values);
    return res.rows[0];
  } catch (error) {
    console.error('Benchmark eklenirken hata:', error);
    throw error;
  }
};

// Benchmark güncelle
export const updateBenchmark = async (id: number, benchmark: {
  benchmark: string;
  gpu: string;
  cpu: string;
  resolution: string;
  quality: string;
  rayTracing: string;
  upscaling: string;
  antiAliasing: string;
  result: number;
  tip: string;
  direction: number;
}) => {
  try {
    const { benchmark: benchmarkName, gpu, cpu, resolution, quality, rayTracing, upscaling, antiAliasing, result, tip, direction } = benchmark;
    
    const query = `
      UPDATE benchmarks
      SET benchmark = $1, gpu = $2, cpu = $3, resolution = $4, quality = $5, 
          ray_tracing = $6, upscaling = $7, anti_aliasing = $8, result = $9, tip = $10, direction = $11
      WHERE id = $12
      RETURNING *
    `;
    
    const values = [benchmarkName, gpu, cpu, resolution, quality, rayTracing, upscaling, antiAliasing, result, tip, direction, id];
    const res = await pool.query(query, values);
    return res.rows[0];
  } catch (error) {
    console.error('Benchmark güncellenirken hata:', error);
    throw error;
  }
};

// Benchmark sil
export const deleteBenchmark = async (id: number) => {
  try {
    const query = 'DELETE FROM benchmarks WHERE id = $1 RETURNING *';
    const res = await pool.query(query, [id]);
    return res.rows[0];
  } catch (error) {
    console.error('Benchmark silinirken hata:', error);
    throw error;
  }
};

export default pool; 