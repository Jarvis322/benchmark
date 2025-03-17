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
}

export interface FilterOptions {
  benchmark: string;
  gpu: string;
  cpu: string;
  resolution: string;
}

export interface ComparisonSelection {
  selectedItems: string[];
} 