import { NextApiRequest, NextApiResponse } from 'next';
import { updateBenchmark, deleteBenchmark } from '../../../lib/db';

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

  // ID parametresini al
  const { id } = req.query;
  
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: 'Geçersiz ID' });
  }

  const benchmarkId = parseInt(id, 10);
  
  if (isNaN(benchmarkId)) {
    return res.status(400).json({ message: 'ID bir sayı olmalıdır' });
  }

  try {
    if (req.method === 'PUT') {
      // Benchmark güncelle
      const benchmark = req.body;
      const updatedBenchmark = await updateBenchmark(benchmarkId, benchmark);
      
      if (!updatedBenchmark) {
        return res.status(404).json({ message: 'Benchmark bulunamadı' });
      }
      
      return res.status(200).json(updatedBenchmark);
    } else if (req.method === 'DELETE') {
      // Benchmark sil
      const deletedBenchmark = await deleteBenchmark(benchmarkId);
      
      if (!deletedBenchmark) {
        return res.status(404).json({ message: 'Benchmark bulunamadı' });
      }
      
      return res.status(200).json(deletedBenchmark);
    }

    // Desteklenmeyen HTTP metodu
    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (error) {
    console.error('API hatası:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: String(error) });
  }
} 