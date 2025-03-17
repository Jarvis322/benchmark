export interface BenchmarkResult {
  id: string;
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
  createdAt: string;
}

export interface FilterOptions {
  benchmark: string;
  gpu: string;
  cpu: string;
  resolution: string;
  quality: string;
  rayTracing: string;
  upscaling: string;
  antiAliasing: string;
}

export interface ComparisonSelection {
  selectedItems: string[];
}

export type Direction = 'higher' | 'lower';

export interface Benchmark {
  benchmark: string;
  settings: string;
  gpu: string;
  result: number;
  tip: string;
  direction: Direction;
}

export interface BenchmarkSetting {
  name: string;
  value: string;
} 