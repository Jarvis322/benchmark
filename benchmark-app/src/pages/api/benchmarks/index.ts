import { NextApiRequest, NextApiResponse } from 'next';
import { getAllBenchmarks, addBenchmark, initDatabase } from '../../../lib/db';

// Veritabanını başlat
initDatabase().catch(console.error);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS başlıkları
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      // Tüm benchmark verilerini getir
      const benchmarks = await getAllBenchmarks();
      return res.status(200).json(benchmarks);
    } else if (req.method === 'POST') {
      // Yeni benchmark ekle
      const benchmark = req.body;
      const newBenchmark = await addBenchmark(benchmark);
      return res.status(201).json(newBenchmark);
    }

    // Desteklenmeyen HTTP metodu
    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (error) {
    console.error('API hatası:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: String(error) });
  }
} 