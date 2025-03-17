import { BenchmarkResult } from '../types';

const API_URL = '/api/benchmarks';

// Tüm benchmark verilerini getir
export const fetchBenchmarks = async (): Promise<BenchmarkResult[]> => {
  try {
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`API hatası: ${response.status}`);
    }
    
    const data = await response.json();
    
    // API'den gelen verileri frontend tipine dönüştür
    return data.map((item: {
      id: number;
      benchmark: string;
      gpu: string;
      cpu: string;
      resolution: string;
      quality: string;
      ray_tracing: string;
      upscaling: string;
      anti_aliasing: string;
      result: string;
      tip: string;
      direction: number;
      created_at: string;
    }) => ({
      id: item.id.toString(),
      benchmark: item.benchmark,
      gpu: item.gpu,
      cpu: item.cpu,
      resolution: item.resolution,
      quality: item.quality,
      rayTracing: item.ray_tracing,
      upscaling: item.upscaling,
      antiAliasing: item.anti_aliasing,
      result: parseFloat(item.result),
      tip: item.tip,
      direction: item.direction,
      createdAt: item.created_at
    }));
  } catch (error) {
    console.error('Benchmark verileri alınırken hata:', error);
    throw error;
  }
};

// Yeni benchmark ekle
export const addBenchmarkData = async (benchmark: Omit<BenchmarkResult, 'id' | 'createdAt'>): Promise<BenchmarkResult> => {
  try {
    // Frontend'den gelen veriyi API formatına dönüştür
    const apiData = {
      benchmark: benchmark.benchmark,
      gpu: benchmark.gpu,
      cpu: benchmark.cpu,
      resolution: benchmark.resolution,
      quality: benchmark.quality,
      rayTracing: benchmark.rayTracing,
      upscaling: benchmark.upscaling,
      antiAliasing: benchmark.antiAliasing,
      result: benchmark.result,
      tip: benchmark.tip,
      direction: benchmark.direction
    };
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiData),
    });
    
    if (!response.ok) {
      throw new Error(`API hatası: ${response.status}`);
    }
    
    const data = await response.json();
    
    // API'den gelen veriyi frontend tipine dönüştür
    return {
      id: data.id.toString(),
      benchmark: data.benchmark,
      gpu: data.gpu,
      cpu: data.cpu,
      resolution: data.resolution,
      quality: data.quality,
      rayTracing: data.ray_tracing,
      upscaling: data.upscaling,
      antiAliasing: data.anti_aliasing,
      result: parseFloat(data.result),
      tip: data.tip,
      direction: data.direction,
      createdAt: data.created_at
    };
  } catch (error) {
    console.error('Benchmark eklenirken hata:', error);
    throw error;
  }
};

// Benchmark güncelle
export const updateBenchmarkData = async (id: string, benchmark: Omit<BenchmarkResult, 'id' | 'createdAt'>): Promise<BenchmarkResult> => {
  try {
    // Frontend'den gelen veriyi API formatına dönüştür
    const apiData = {
      benchmark: benchmark.benchmark,
      gpu: benchmark.gpu,
      cpu: benchmark.cpu,
      resolution: benchmark.resolution,
      quality: benchmark.quality,
      rayTracing: benchmark.rayTracing,
      upscaling: benchmark.upscaling,
      antiAliasing: benchmark.antiAliasing,
      result: benchmark.result,
      tip: benchmark.tip,
      direction: benchmark.direction
    };
    
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiData),
    });
    
    if (!response.ok) {
      throw new Error(`API hatası: ${response.status}`);
    }
    
    const data = await response.json();
    
    // API'den gelen veriyi frontend tipine dönüştür
    return {
      id: data.id.toString(),
      benchmark: data.benchmark,
      gpu: data.gpu,
      cpu: data.cpu,
      resolution: data.resolution,
      quality: data.quality,
      rayTracing: data.ray_tracing,
      upscaling: data.upscaling,
      antiAliasing: data.anti_aliasing,
      result: parseFloat(data.result),
      tip: data.tip,
      direction: data.direction,
      createdAt: data.created_at
    };
  } catch (error) {
    console.error('Benchmark güncellenirken hata:', error);
    throw error;
  }
};

// Benchmark sil
export const deleteBenchmarkData = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`API hatası: ${response.status}`);
    }
  } catch (error) {
    console.error('Benchmark silinirken hata:', error);
    throw error;
  }
}; 