import { BenchmarkResult } from '../types';

// Başlangıç verileri
const initialBenchmarkData: BenchmarkResult[] = [
  {
    id: '1',
    benchmark: 'Cyberpunk 2077',
    gpu: 'NVIDIA RTX 4090',
    cpu: 'Intel Core i9-13900K',
    resolution: '3840x2160 (4K)',
    quality: 'Ultra',
    rayTracing: 'Ultra',
    upscaling: 'DLSS Kalite',
    antiAliasing: 'TAA',
    result: 118.5,
    tip: 'Ort. FPS',
    direction: 1,
    createdAt: '2023-10-15T14:30:00Z'
  },
  {
    id: '2',
    benchmark: 'Cyberpunk 2077',
    gpu: 'AMD Radeon RX 7900 XTX',
    cpu: 'AMD Ryzen 9 7950X',
    resolution: '3840x2160 (4K)',
    quality: 'Ultra',
    rayTracing: 'Ultra',
    upscaling: 'FSR 2.1 Kalite',
    antiAliasing: 'TAA',
    result: 89.2,
    tip: 'Ort. FPS',
    direction: 1,
    createdAt: '2023-10-15T15:45:00Z'
  },
  {
    id: '3',
    benchmark: 'Cyberpunk 2077',
    gpu: 'NVIDIA RTX 4080',
    cpu: 'Intel Core i7-13700K',
    resolution: '3840x2160 (4K)',
    quality: 'Ultra',
    rayTracing: 'Ultra',
    upscaling: 'DLSS Kalite',
    antiAliasing: 'TAA',
    result: 92.7,
    tip: 'Ort. FPS',
    direction: 1,
    createdAt: '2023-10-16T09:20:00Z'
  },
  {
    id: '4',
    benchmark: 'Red Dead Redemption 2',
    gpu: 'NVIDIA RTX 4090',
    cpu: 'Intel Core i9-13900K',
    resolution: '3840x2160 (4K)',
    quality: 'Ultra',
    rayTracing: 'Kapalı',
    upscaling: 'Kapalı',
    antiAliasing: 'TAA',
    result: 142.3,
    tip: 'Ort. FPS',
    direction: 1,
    createdAt: '2023-10-17T11:15:00Z'
  },
  {
    id: '5',
    benchmark: 'Red Dead Redemption 2',
    gpu: 'AMD Radeon RX 7900 XTX',
    cpu: 'AMD Ryzen 9 7950X',
    resolution: '3840x2160 (4K)',
    quality: 'Ultra',
    rayTracing: 'Kapalı',
    upscaling: 'Kapalı',
    antiAliasing: 'TAA',
    result: 128.6,
    tip: 'Ort. FPS',
    direction: 1,
    createdAt: '2023-10-18T16:40:00Z'
  },
  {
    id: '6',
    benchmark: 'Forza Horizon 5',
    gpu: 'NVIDIA RTX 4090',
    cpu: 'Intel Core i9-13900K',
    resolution: '3840x2160 (4K)',
    quality: 'Extreme',
    rayTracing: 'Açık',
    upscaling: 'DLSS Kalite',
    antiAliasing: 'TAA',
    result: 165.8,
    tip: 'Ort. FPS',
    direction: 1,
    createdAt: '2023-10-19T10:30:00Z'
  },
  {
    id: '7',
    benchmark: 'Forza Horizon 5',
    gpu: 'AMD Radeon RX 7900 XTX',
    cpu: 'AMD Ryzen 9 7950X',
    resolution: '3840x2160 (4K)',
    quality: 'Extreme',
    rayTracing: 'Açık',
    upscaling: 'FSR 2.1 Kalite',
    antiAliasing: 'TAA',
    result: 152.4,
    tip: 'Ort. FPS',
    direction: 1,
    createdAt: '2023-10-20T14:25:00Z'
  },
  {
    id: '8',
    benchmark: 'Cinebench R23',
    gpu: 'N/A',
    cpu: 'Intel Core i9-13900K',
    resolution: 'N/A',
    quality: 'N/A',
    rayTracing: 'N/A',
    upscaling: 'N/A',
    antiAliasing: 'N/A',
    result: 40012,
    tip: 'Çoklu Çekirdek Puanı',
    direction: 1,
    createdAt: '2023-10-21T09:10:00Z'
  },
  {
    id: '9',
    benchmark: 'Cinebench R23',
    gpu: 'N/A',
    cpu: 'AMD Ryzen 9 7950X',
    resolution: 'N/A',
    quality: 'N/A',
    rayTracing: 'N/A',
    upscaling: 'N/A',
    antiAliasing: 'N/A',
    result: 38764,
    tip: 'Çoklu Çekirdek Puanı',
    direction: 1,
    createdAt: '2023-10-22T11:45:00Z'
  },
  {
    id: '10',
    benchmark: 'Windows Açılış Süresi',
    gpu: 'NVIDIA RTX 4090',
    cpu: 'Intel Core i9-13900K',
    resolution: 'N/A',
    quality: 'N/A',
    rayTracing: 'N/A',
    upscaling: 'N/A',
    antiAliasing: 'N/A',
    result: 12.3,
    tip: 'Saniye',
    direction: -1,
    createdAt: '2023-10-23T15:30:00Z'
  }
];

// LocalStorage'dan verileri yükleme
const loadBenchmarksFromStorage = (): BenchmarkResult[] => {
  if (typeof window === 'undefined') {
    return initialBenchmarkData;
  }
  
  const savedData = localStorage.getItem('benchmarkData');
  if (savedData) {
    try {
      return JSON.parse(savedData);
    } catch (error) {
      console.error('Benchmark verilerini yüklerken hata oluştu:', error);
      return initialBenchmarkData;
    }
  }
  return initialBenchmarkData;
};

// LocalStorage'a verileri kaydetme
export const saveBenchmarksToStorage = (data: BenchmarkResult[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('benchmarkData', JSON.stringify(data));
  }
};

// Verileri yükle
export const benchmarkData = loadBenchmarksFromStorage();

// Seçenekler
export let benchmarkOptions = Array.from(new Set(benchmarkData.map(item => item.benchmark))).sort((a, b) => a.localeCompare(b));
export let gpuOptions = Array.from(new Set(benchmarkData.map(item => item.gpu).filter(gpu => gpu !== 'N/A'))).sort((a, b) => a.localeCompare(b));
export let cpuOptions = Array.from(new Set(benchmarkData.map(item => item.cpu).filter(cpu => cpu !== 'N/A'))).sort((a, b) => a.localeCompare(b));
export const resolutionOptions = [
  '1920x1080 (FHD)',
  '2560x1440 (QHD)',
  '3440x1440 (UW-QHD)',
  '3840x2160 (4K)',
  'N/A'
];
export const qualityOptions = [
  'Düşük',
  'Orta',
  'Yüksek',
  'Ultra',
  'Extreme',
  'N/A'
];
export const rayTracingOptions = [
  'Kapalı',
  'Düşük',
  'Orta',
  'Yüksek',
  'Ultra',
  'N/A'
];
export const upscalingOptions = [
  'Kapalı',
  'DLSS Kalite',
  'DLSS Dengeli',
  'DLSS Performans',
  'DLSS Ultra Performans',
  'DLSS 3.0 Frame Generation',
  'DLSS 4 Multi Frame Generation 2x',
  'DLSS 4 Multi Frame Generation 3x',
  'DLSS 4 Multi Frame Generation 4x',
  'FSR 1.0 Kalite',
  'FSR 1.0 Dengeli',
  'FSR 1.0 Performans',
  'FSR 2.1 Kalite',
  'FSR 2.1 Dengeli',
  'FSR 2.1 Performans',
  'FSR 2.1 Ultra Performans',
  'FSR 3.0 Kalite',
  'FSR 3.0 Dengeli',
  'FSR 3.0 Performans',
  'FSR 3.0 Frame Generation',
  'FSR 4 Kalite',
  'FSR 4 Dengeli',
  'FSR 4 Performans',
  'FSR 4 Ultra Performans',
  'FSR 4 Frame Generation',
  'XeSS Kalite',
  'XeSS Dengeli',
  'XeSS Performans',
  'XeSS Ultra Performans',
  'N/A'
];
export const antiAliasingOptions = [
  'Kapalı',
  'FXAA',
  'SMAA',
  'TAA',
  'MSAA 2x',
  'MSAA 4x',
  'MSAA 8x',
  'N/A'
];

// Yeni seçenek ekleme fonksiyonları
export const addGpuOption = (newGpu: string): string[] => {
  if (!gpuOptions.includes(newGpu)) {
    gpuOptions = [...gpuOptions, newGpu].sort((a, b) => a.localeCompare(b));
  }
  return gpuOptions;
};

export const addCpuOption = (newCpu: string): string[] => {
  if (!cpuOptions.includes(newCpu)) {
    cpuOptions = [...cpuOptions, newCpu].sort((a, b) => a.localeCompare(b));
  }
  return cpuOptions;
};

export const addBenchmarkOption = (newBenchmark: string): string[] => {
  if (!benchmarkOptions.includes(newBenchmark)) {
    benchmarkOptions = [...benchmarkOptions, newBenchmark].sort((a, b) => a.localeCompare(b));
  }
  return benchmarkOptions;
};

export let upscalingOptionsList = [...upscalingOptions];

export const addUpscalingOption = (newUpscaling: string): string[] => {
  if (!upscalingOptionsList.includes(newUpscaling)) {
    upscalingOptionsList = [...upscalingOptionsList, newUpscaling].sort((a, b) => a.localeCompare(b));
  }
  return upscalingOptionsList;
}; 