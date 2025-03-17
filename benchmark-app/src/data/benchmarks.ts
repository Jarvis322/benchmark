import { BenchmarkResult } from '../types';

export const benchmarkData: BenchmarkResult[] = [
  {
    id: '1',
    benchmark: 'Forza Horizon 5',
    gpu: 'AMD Radeon RX 7900 XTX',
    cpu: 'AMD Ryzen 9 7950X',
    resolution: '4K',
    quality: 'Extreme',
    rayTracing: 'Ultra',
    upscaling: 'Kapalı',
    antiAliasing: 'FXAA + TAA Kapalı',
    result: 118,
    tip: 'Ort. FPS',
    direction: 1
  },
  {
    id: '2',
    benchmark: 'Forza Horizon 5',
    gpu: 'AMD Radeon RX 9070',
    cpu: 'AMD Ryzen 7 7800X3D',
    resolution: '4K',
    quality: 'Extreme',
    rayTracing: 'Ultra',
    upscaling: 'Kapalı',
    antiAliasing: 'FXAA + TAA Kapalı',
    result: 112,
    tip: 'Ort. FPS',
    direction: 1
  },
  {
    id: '3',
    benchmark: 'Forza Horizon 5',
    gpu: 'AMD Radeon RX 9070 XT',
    cpu: 'Intel Core i9-14900K',
    resolution: '4K',
    quality: 'Extreme',
    rayTracing: 'Ultra',
    upscaling: 'Kapalı',
    antiAliasing: 'FXAA + TAA Kapalı',
    result: 124,
    tip: 'Ort. FPS',
    direction: 1
  },
  {
    id: '4',
    benchmark: 'Forza Horizon 5',
    gpu: 'NVIDIA RTX 4070 Ti Super',
    cpu: 'Intel Core i7-14700K',
    resolution: '4K',
    quality: 'Extreme',
    rayTracing: 'Ultra',
    upscaling: 'Kapalı',
    antiAliasing: 'FXAA + TAA Kapalı',
    result: 105,
    tip: 'Ort. FPS',
    direction: 1
  },
  {
    id: '5',
    benchmark: 'Forza Horizon 5',
    gpu: 'NVIDIA RTX 5070 Ti',
    cpu: 'AMD Ryzen 9 7950X',
    resolution: '4K',
    quality: 'Extreme',
    rayTracing: 'Ultra',
    upscaling: 'Kapalı',
    antiAliasing: 'FXAA + TAA Kapalı',
    result: 123,
    tip: 'Ort. FPS',
    direction: 1
  },
  {
    id: '6',
    benchmark: 'Forza Horizon 5',
    gpu: 'NVIDIA RTX 5080',
    cpu: 'Intel Core i9-14900K',
    resolution: '4K',
    quality: 'Extreme',
    rayTracing: 'Ultra',
    upscaling: 'Kapalı',
    antiAliasing: 'FXAA + TAA Kapalı',
    result: 135,
    tip: 'Ort. FPS',
    direction: 1
  },
  {
    id: '7',
    benchmark: 'Cyberpunk 2077',
    gpu: 'NVIDIA RTX 5080',
    cpu: 'Intel Core i9-14900K',
    resolution: '4K',
    quality: 'Ultra',
    rayTracing: 'Psycho',
    upscaling: 'DLSS Kalite',
    antiAliasing: 'TAA',
    result: 95,
    tip: 'Ort. FPS',
    direction: 1
  },
  {
    id: '8',
    benchmark: 'Cyberpunk 2077',
    gpu: 'AMD Radeon RX 7900 XTX',
    cpu: 'AMD Ryzen 9 7950X',
    resolution: '4K',
    quality: 'Ultra',
    rayTracing: 'Psycho',
    upscaling: 'FSR 3 Kalite',
    antiAliasing: 'TAA',
    result: 82,
    tip: 'Ort. FPS',
    direction: 1
  }
];

export let benchmarkOptions = [
  'Forza Horizon 5',
  'Cyberpunk 2077',
  'Assassin\'s Creed Mirage',
  'Alan Wake 2',
  'Starfield',
  'Call of Duty: Modern Warfare III'
];

export let gpuOptions = [
  'NVIDIA RTX 5080',
  'NVIDIA RTX 5070 Ti',
  'NVIDIA RTX 4090',
  'NVIDIA RTX 4080 Super',
  'NVIDIA RTX 4070 Ti Super',
  'AMD Radeon RX 7900 XTX',
  'AMD Radeon RX 9070 XT',
  'AMD Radeon RX 9070',
  'Intel Arc A770'
];

export let cpuOptions = [
  'Intel Core i9-14900K',
  'Intel Core i7-14700K',
  'Intel Core i5-14600K',
  'AMD Ryzen 9 7950X',
  'AMD Ryzen 7 7800X3D',
  'AMD Ryzen 5 7600X'
];

export const resolutionOptions = [
  '4K',
  '1440p',
  '1080p'
];

export const qualityOptions = [
  'Extreme',
  'Ultra',
  'Yüksek',
  'Orta',
  'Düşük'
];

export const rayTracingOptions = [
  'Ultra',
  'Yüksek',
  'Orta',
  'Düşük',
  'Psycho',
  'Kapalı'
];

export const upscalingOptions = [
  'DLSS Kalite',
  'DLSS Dengeli',
  'DLSS Performans',
  'FSR 3 Kalite',
  'FSR 3 Dengeli',
  'FSR 3 Performans',
  'XeSS Kalite',
  'XeSS Dengeli',
  'XeSS Performans',
  'Kapalı'
];

export const antiAliasingOptions = [
  'TAA',
  'FXAA',
  'FXAA + TAA',
  'SMAA',
  'MSAA 2x',
  'MSAA 4x',
  'MSAA 8x',
  'Kapalı'
];

export const addGpuOption = (newGpu: string) => {
  if (!gpuOptions.includes(newGpu)) {
    gpuOptions = [...gpuOptions, newGpu];
  }
  return gpuOptions;
};

export const addCpuOption = (newCpu: string) => {
  if (!cpuOptions.includes(newCpu)) {
    cpuOptions = [...cpuOptions, newCpu];
  }
  return cpuOptions;
};

export const addBenchmarkOption = (newBenchmark: string) => {
  if (!benchmarkOptions.includes(newBenchmark)) {
    benchmarkOptions = [...benchmarkOptions, newBenchmark];
  }
  return benchmarkOptions;
}; 