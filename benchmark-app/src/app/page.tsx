'use client';

import { useState } from 'react';
import BenchmarkTable from '../components/BenchmarkTable';
import BenchmarkChart from '../components/BenchmarkChart';
import BenchmarkFilter from '../components/BenchmarkFilter';
import BenchmarkForm from '../components/BenchmarkForm';
import ComparisonView from '../components/ComparisonView';
import { BenchmarkResult, FilterOptions } from '../types';
import { 
  benchmarkData, 
  benchmarkOptions, 
  gpuOptions, 
  cpuOptions, 
  resolutionOptions,
  qualityOptions,
  rayTracingOptions,
  upscalingOptions,
  antiAliasingOptions,
  addGpuOption,
  addCpuOption,
  addBenchmarkOption
} from '../data/benchmarks';

export default function Home() {
  const [results, setResults] = useState<BenchmarkResult[]>(benchmarkData);
  const [filteredResults, setFilteredResults] = useState<BenchmarkResult[]>(benchmarkData);
  const [showForm, setShowForm] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [editingResult, setEditingResult] = useState<BenchmarkResult | null>(null);
  const [gpuList, setGpuList] = useState<string[]>(gpuOptions);
  const [cpuList, setCpuList] = useState<string[]>(cpuOptions);
  const [benchmarkList, setBenchmarkList] = useState<string[]>(benchmarkOptions);

  const handleFilter = (filters: FilterOptions) => {
    const filtered = results.filter((result) => {
      if (filters.benchmark && result.benchmark !== filters.benchmark) return false;
      if (filters.gpu && result.gpu !== filters.gpu) return false;
      if (filters.cpu && result.cpu !== filters.cpu) return false;
      if (filters.resolution && result.resolution !== filters.resolution) return false;
      return true;
    });
    setFilteredResults(filtered);
  };

  const handleClearFilters = () => {
    setFilteredResults(results);
  };

  const handleSaveBenchmark = (data: Omit<BenchmarkResult, 'id'>) => {
    if (editingResult) {
      // Düzenleme modu
      const updatedResult = { ...data, id: editingResult.id };
      const updatedResults = results.map(result => 
        result.id === editingResult.id ? updatedResult : result
      );
      setResults(updatedResults);
      setFilteredResults(updatedResults);
      setEditingResult(null);
    } else {
      // Yeni ekleme modu
      const newResult: BenchmarkResult = {
        ...data,
        id: (results.length + 1).toString()
      };
      const newResults = [...results, newResult];
      setResults(newResults);
      setFilteredResults(newResults);
    }
    setShowForm(false);
  };

  const handleCompare = (selectedItems: string[]) => {
    setSelectedForComparison(selectedItems);
    setShowComparison(true);
  };

  const handleCloseComparison = () => {
    setShowComparison(false);
    setSelectedForComparison([]);
  };

  const handleAddGpu = (newGpu: string) => {
    const updatedGpuList = addGpuOption(newGpu);
    setGpuList([...updatedGpuList]);
  };

  const handleAddCpu = (newCpu: string) => {
    const updatedCpuList = addCpuOption(newCpu);
    setCpuList([...updatedCpuList]);
  };

  const handleAddBenchmark = (newBenchmark: string) => {
    const updatedBenchmarkList = addBenchmarkOption(newBenchmark);
    setBenchmarkList([...updatedBenchmarkList]);
  };

  const handleDeleteBenchmark = (id: string) => {
    const updatedResults = results.filter(result => result.id !== id);
    setResults(updatedResults);
    setFilteredResults(updatedResults);
  };

  const handleEditBenchmark = (result: BenchmarkResult) => {
    setEditingResult(result);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-blue-800 mb-4 md:mb-0">
          Benchmark Karşılaştırma Aracı
        </h1>
        <div className="flex space-x-3">
          <button
            onClick={() => {
              setEditingResult(null);
              setShowForm(!showForm);
            }}
            className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            {showForm ? 'Formu Gizle' : 'Yeni Benchmark Ekle'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mb-8">
          <BenchmarkForm
            benchmarkOptions={benchmarkList}
            gpuOptions={gpuList}
            cpuOptions={cpuList}
            resolutionOptions={resolutionOptions}
            qualityOptions={qualityOptions}
            rayTracingOptions={rayTracingOptions}
            upscalingOptions={upscalingOptions}
            antiAliasingOptions={antiAliasingOptions}
            onSave={handleSaveBenchmark}
            onAddGpu={handleAddGpu}
            onAddCpu={handleAddCpu}
            onAddBenchmark={handleAddBenchmark}
            initialData={editingResult}
          />
        </div>
      )}

      <BenchmarkFilter
        benchmarkOptions={benchmarkList}
        gpuOptions={gpuList}
        cpuOptions={cpuList}
        resolutionOptions={resolutionOptions}
        onFilter={handleFilter}
        onClear={handleClearFilters}
      />

      {filteredResults.length > 0 ? (
        <>
          <div className="mb-8">
            <BenchmarkChart results={filteredResults} />
          </div>
          <BenchmarkTable 
            results={filteredResults} 
            onCompare={handleCompare} 
            onDelete={handleDeleteBenchmark}
            onEdit={handleEditBenchmark}
          />
        </>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-lg border border-blue-100 text-center">
          <p className="text-gray-500">Sonuç bulunamadı. Lütfen filtreleri değiştirin veya yeni benchmark ekleyin.</p>
        </div>
      )}

      {showComparison && (
        <ComparisonView 
          results={results} 
          selectedIds={selectedForComparison} 
          onClose={handleCloseComparison} 
        />
      )}
    </main>
  );
}
