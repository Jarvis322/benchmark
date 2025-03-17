'use client';

import { useState, useEffect } from 'react';
import BenchmarkTable from '../components/BenchmarkTable';
import BenchmarkChart from '../components/BenchmarkChart';
import BenchmarkFilter from '../components/BenchmarkFilter';
import BenchmarkForm from '../components/BenchmarkForm';
import ComparisonView from '../components/ComparisonView';
import { BenchmarkResult, FilterOptions } from '../types';
import { 
  benchmarkOptions, 
  gpuOptions, 
  cpuOptions, 
  resolutionOptions,
  qualityOptions,
  rayTracingOptions,
  upscalingOptions,
  upscalingOptionsList,
  antiAliasingOptions,
  addGpuOption,
  addCpuOption,
  addBenchmarkOption,
  addUpscalingOption
} from '../data/benchmarks';
import { fetchBenchmarks, addBenchmarkData, updateBenchmarkData, deleteBenchmarkData } from '../services/api';

export default function Home() {
  const [results, setResults] = useState<BenchmarkResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<BenchmarkResult[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [editingResult, setEditingResult] = useState<BenchmarkResult | null>(null);
  const [gpuList, setGpuList] = useState<string[]>(gpuOptions);
  const [cpuList, setCpuList] = useState<string[]>(cpuOptions);
  const [benchmarkList, setBenchmarkList] = useState<string[]>(benchmarkOptions);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentFilters, setCurrentFilters] = useState<FilterOptions>({
    benchmark: '',
    gpu: '',
    cpu: '',
    resolution: '',
    quality: '',
    rayTracing: '',
    upscaling: '',
    antiAliasing: ''
  });

  useEffect(() => {
    const loadBenchmarks = async () => {
      try {
        setLoading(true);
        const data = await fetchBenchmarks();
        setResults(data);
        setFilteredResults(data);
        
        const uniqueBenchmarks = Array.from(new Set(data.map(item => item.benchmark)));
        const uniqueGpus = Array.from(new Set(data.map(item => item.gpu).filter(gpu => gpu !== 'N/A')));
        const uniqueCpus = Array.from(new Set(data.map(item => item.cpu).filter(cpu => cpu !== 'N/A')));
        
        setBenchmarkList(uniqueBenchmarks);
        setGpuList(uniqueGpus);
        setCpuList(uniqueCpus);
        
        setError(null);
      } catch (err) {
        console.error('Benchmark verileri yüklenirken hata:', err);
        setError('Veriler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.');
      } finally {
        setLoading(false);
      }
    };
    
    loadBenchmarks();
  }, []);

  const handleFilter = (filters: FilterOptions) => {
    setCurrentFilters(filters);
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

  const handleSaveBenchmark = async (data: Omit<BenchmarkResult, 'id' | 'createdAt'>) => {
    try {
      if (editingResult) {
        const updatedBenchmark = await updateBenchmarkData(editingResult.id, data);
        const updatedResults = results.map(result => 
          result.id === editingResult.id ? updatedBenchmark : result
        );
        setResults(updatedResults);
        setFilteredResults(updatedResults);
        setEditingResult(null);
      } else {
        const newBenchmark = await addBenchmarkData(data);
        const newResults = [...results, newBenchmark];
        setResults(newResults);
        setFilteredResults(newResults);
      }
      
      if (!benchmarkList.includes(data.benchmark)) {
        setBenchmarkList([...benchmarkList, data.benchmark]);
      }
      
      if (!gpuList.includes(data.gpu) && data.gpu !== 'N/A') {
        setGpuList([...gpuList, data.gpu]);
      }
      
      if (!cpuList.includes(data.cpu) && data.cpu !== 'N/A') {
        setCpuList([...cpuList, data.cpu]);
      }
      
      setShowForm(false);
    } catch (err) {
      console.error('Benchmark kaydedilirken hata:', err);
      alert('Benchmark kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
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

  const handleAddUpscaling = (newUpscaling: string) => {
    const updatedUpscalingList = addUpscalingOption(newUpscaling);
    // Upscaling seçenekleri doğrudan data/benchmarks.ts'den geldiği için
    // burada state'e eklememize gerek yok
  };

  const handleDeleteBenchmark = async (id: string) => {
    try {
      await deleteBenchmarkData(id);
      const updatedResults = results.filter(result => result.id !== id);
      setResults(updatedResults);
      setFilteredResults(updatedResults);
    } catch (err) {
      console.error('Benchmark silinirken hata:', err);
      alert('Benchmark silinirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const handleEditBenchmark = (result: BenchmarkResult) => {
    setEditingResult(result);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      handleFilter(currentFilters);
      return;
    }

    const searchLower = term.toLowerCase();
    
    const searched = results.filter(result => 
      result.benchmark.toLowerCase().includes(searchLower) ||
      result.gpu.toLowerCase().includes(searchLower) ||
      result.cpu.toLowerCase().includes(searchLower) ||
      result.resolution.toLowerCase().includes(searchLower) ||
      result.quality.toLowerCase().includes(searchLower) ||
      result.rayTracing.toLowerCase().includes(searchLower) ||
      result.upscaling.toLowerCase().includes(searchLower) ||
      result.antiAliasing.toLowerCase().includes(searchLower) ||
      result.tip.toLowerCase().includes(searchLower) ||
      result.result.toString().includes(searchLower)
    );
    
    setFilteredResults(searched);
  };

  // Benzersiz değerleri alfabetik olarak sırala
  const getUniqueValues = (data: BenchmarkResult[], key: keyof BenchmarkResult) => {
    const values = new Set<string>();
    data.forEach(item => {
      if (item[key]) {
        values.add(item[key] as string);
      }
    });
    return Array.from(values).sort((a, b) => a.localeCompare(b));
  };

  // Filtreleme seçeneklerini hazırla
  const benchmarks = getUniqueValues(filteredResults, 'benchmark');
  const gpus = getUniqueValues(filteredResults, 'gpu');
  const cpus = getUniqueValues(filteredResults, 'cpu');
  const resolutions = getUniqueValues(filteredResults, 'resolution');
  const qualities = getUniqueValues(filteredResults, 'quality');
  const rayTracings = getUniqueValues(filteredResults, 'rayTracing');
  const upscalings = getUniqueValues(filteredResults, 'upscaling');
  const antiAliasings = getUniqueValues(filteredResults, 'antiAliasing');

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">ShiftDelete.Net Benchmark Karşılaştırma Aracı</h1>
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <button
            onClick={() => {
              setShowForm(true);
              setEditingResult(null);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Yeni Benchmark Ekle
          </button>
          
          <button
            onClick={handleClearFilters}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
          >
            Filtreleri Temizle
          </button>
        </div>
        
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Benchmark ara..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchTerm && (
            <button
              onClick={() => handleSearch('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          )}
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
            onAddUpscaling={handleAddUpscaling}
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

      {loading ? (
        <div className="bg-white p-8 rounded-lg shadow-lg border border-blue-100 text-center">
          <p className="text-gray-500">Veriler yükleniyor...</p>
        </div>
      ) : error ? (
        <div className="bg-white p-8 rounded-lg shadow-lg border border-red-100 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      ) : filteredResults.length > 0 ? (
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
