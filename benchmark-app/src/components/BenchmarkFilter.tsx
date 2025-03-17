'use client';

import { useState } from 'react';
import { FilterOptions } from '../types';

interface BenchmarkFilterProps {
  benchmarkOptions: string[];
  gpuOptions: string[];
  cpuOptions: string[];
  resolutionOptions: string[];
  onFilter: (filters: FilterOptions) => void;
  onClear: () => void;
}

export default function BenchmarkFilter({
  benchmarkOptions,
  gpuOptions,
  cpuOptions,
  resolutionOptions,
  onFilter,
  onClear
}: BenchmarkFilterProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    benchmark: '',
    gpu: '',
    cpu: '',
    resolution: '',
    quality: '',
    rayTracing: '',
    upscaling: '',
    antiAliasing: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleClear = () => {
    setFilters({
      benchmark: '',
      gpu: '',
      cpu: '',
      resolution: '',
      quality: '',
      rayTracing: '',
      upscaling: '',
      antiAliasing: ''
    });
    onClear();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-blue-100 mb-8">
      <h2 className="text-xl font-semibold mb-4 text-blue-800">Filtreleme Seçenekleri</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="benchmark-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Oyun / Benchmark
            </label>
            <select
              id="benchmark-filter"
              name="benchmark"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={filters.benchmark}
              onChange={handleChange}
            >
              <option value="">Tümü</option>
              {benchmarkOptions.sort((a, b) => a.localeCompare(b)).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="gpu-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Ekran Kartı
            </label>
            <select
              id="gpu-filter"
              name="gpu"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={filters.gpu}
              onChange={handleChange}
            >
              <option value="">Tümü</option>
              {gpuOptions.sort((a, b) => a.localeCompare(b)).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="cpu-filter" className="block text-sm font-medium text-gray-700 mb-1">
              İşlemci
            </label>
            <select
              id="cpu-filter"
              name="cpu"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={filters.cpu}
              onChange={handleChange}
            >
              <option value="">Tümü</option>
              {cpuOptions.sort((a, b) => a.localeCompare(b)).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="resolution-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Çözünürlük
            </label>
            <select
              id="resolution-filter"
              name="resolution"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={filters.resolution}
              onChange={handleChange}
            >
              <option value="">Tümü</option>
              {resolutionOptions.sort((a, b) => a.localeCompare(b)).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 mt-4">
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Temizle
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Filtrele
          </button>
        </div>
      </form>
    </div>
  );
} 