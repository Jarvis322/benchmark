'use client';

import { useState, useEffect } from 'react';
import { BenchmarkResult } from '../types';

interface BenchmarkFormProps {
  benchmarkOptions: string[];
  gpuOptions: string[];
  cpuOptions: string[];
  resolutionOptions: string[];
  qualityOptions: string[];
  rayTracingOptions: string[];
  upscalingOptions: string[];
  antiAliasingOptions: string[];
  onSave: (data: Omit<BenchmarkResult, 'id'>) => void;
  onAddGpu?: (newGpu: string) => void;
  onAddCpu?: (newCpu: string) => void;
  onAddBenchmark?: (newBenchmark: string) => void;
  initialData?: BenchmarkResult | null;
}

export default function BenchmarkForm({
  benchmarkOptions,
  gpuOptions,
  cpuOptions,
  resolutionOptions,
  qualityOptions,
  rayTracingOptions,
  upscalingOptions,
  antiAliasingOptions,
  onSave,
  onAddGpu,
  onAddCpu,
  onAddBenchmark,
  initialData
}: BenchmarkFormProps) {
  const [formData, setFormData] = useState<Omit<BenchmarkResult, 'id'>>({
    benchmark: '',
    gpu: '',
    cpu: '',
    resolution: '',
    quality: '',
    rayTracing: '',
    upscaling: '',
    antiAliasing: '',
    result: 0,
    tip: 'Ort. FPS',
    direction: 1
  });

  const [showNewGpuInput, setShowNewGpuInput] = useState(false);
  const [newGpu, setNewGpu] = useState('');
  const [showNewCpuInput, setShowNewCpuInput] = useState(false);
  const [newCpu, setNewCpu] = useState('');
  const [showNewBenchmarkInput, setShowNewBenchmarkInput] = useState(false);
  const [newBenchmark, setNewBenchmark] = useState('');

  useEffect(() => {
    if (initialData) {
      const { id, ...rest } = initialData;
      setFormData(rest);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'result' || name === 'direction' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    
    // Formu sıfırla
    if (!initialData) {
      setFormData({
        benchmark: '',
        gpu: '',
        cpu: '',
        resolution: '',
        quality: '',
        rayTracing: '',
        upscaling: '',
        antiAliasing: '',
        result: 0,
        tip: 'Ort. FPS',
        direction: 1
      });
    }
  };

  const handleAddGpu = () => {
    if (newGpu.trim() && onAddGpu) {
      onAddGpu(newGpu.trim());
      setFormData(prev => ({ ...prev, gpu: newGpu.trim() }));
      setNewGpu('');
      setShowNewGpuInput(false);
    }
  };

  const handleAddCpu = () => {
    if (newCpu.trim() && onAddCpu) {
      onAddCpu(newCpu.trim());
      setFormData(prev => ({ ...prev, cpu: newCpu.trim() }));
      setNewCpu('');
      setShowNewCpuInput(false);
    }
  };

  const handleAddBenchmark = () => {
    if (newBenchmark.trim() && onAddBenchmark) {
      onAddBenchmark(newBenchmark.trim());
      setFormData(prev => ({ ...prev, benchmark: newBenchmark.trim() }));
      setNewBenchmark('');
      setShowNewBenchmarkInput(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-blue-100">
      <h2 className="text-xl font-semibold mb-4 text-blue-800">
        {initialData ? 'Benchmark Düzenle' : 'Yeni Benchmark Ekle'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-medium text-gray-700 mb-2 border-b pb-1">Temel Bilgiler</h3>
          </div>
          
          <div>
            <label htmlFor="benchmark" className="block text-sm font-medium text-gray-700 mb-1">
              Oyun / Benchmark
            </label>
            {!showNewBenchmarkInput ? (
              <div className="flex space-x-2">
                <select
                  id="benchmark"
                  name="benchmark"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  value={formData.benchmark}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Seçiniz</option>
                  {benchmarkOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowNewBenchmarkInput(true)}
                  className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  +
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newBenchmark}
                  onChange={(e) => setNewBenchmark(e.target.value)}
                  placeholder="Yeni oyun/benchmark adı"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddBenchmark}
                  className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Ekle
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewBenchmarkInput(false)}
                  className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  İptal
                </button>
              </div>
            )}
          </div>
          
          <div>
            <label htmlFor="tip" className="block text-sm font-medium text-gray-700 mb-1">
              Ölçüm Tipi
            </label>
            <select
              id="tip"
              name="tip"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={formData.tip}
              onChange={handleChange}
              required
            >
              <option value="Ort. FPS">Ortalama FPS</option>
              <option value="Min. FPS">Minimum FPS</option>
              <option value="Max. FPS">Maksimum FPS</option>
              <option value="1% Low">1% Low FPS</option>
              <option value="0.1% Low">0.1% Low FPS</option>
              <option value="Yükleme Süresi">Yükleme Süresi (sn)</option>
            </select>
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-medium text-gray-700 mb-2 border-b pb-1 mt-2">Donanım</h3>
          </div>
          
          <div>
            <label htmlFor="gpu" className="block text-sm font-medium text-gray-700 mb-1">
              Ekran Kartı
            </label>
            {!showNewGpuInput ? (
              <div className="flex space-x-2">
                <select
                  id="gpu"
                  name="gpu"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  value={formData.gpu}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Seçiniz</option>
                  {gpuOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowNewGpuInput(true)}
                  className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  +
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newGpu}
                  onChange={(e) => setNewGpu(e.target.value)}
                  placeholder="Yeni ekran kartı adı"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddGpu}
                  className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Ekle
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewGpuInput(false)}
                  className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  İptal
                </button>
              </div>
            )}
          </div>
          
          <div>
            <label htmlFor="cpu" className="block text-sm font-medium text-gray-700 mb-1">
              İşlemci
            </label>
            {!showNewCpuInput ? (
              <div className="flex space-x-2">
                <select
                  id="cpu"
                  name="cpu"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  value={formData.cpu}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Seçiniz</option>
                  {cpuOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowNewCpuInput(true)}
                  className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  +
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newCpu}
                  onChange={(e) => setNewCpu(e.target.value)}
                  placeholder="Yeni işlemci adı"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddCpu}
                  className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Ekle
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewCpuInput(false)}
                  className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  İptal
                </button>
              </div>
            )}
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-medium text-gray-700 mb-2 border-b pb-1 mt-2">Grafik Ayarları</h3>
          </div>
          
          <div>
            <label htmlFor="resolution" className="block text-sm font-medium text-gray-700 mb-1">
              Çözünürlük
            </label>
            <select
              id="resolution"
              name="resolution"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={formData.resolution}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Seçiniz</option>
              {resolutionOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="quality" className="block text-sm font-medium text-gray-700 mb-1">
              Kalite Ayarı
            </label>
            <select
              id="quality"
              name="quality"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={formData.quality}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Seçiniz</option>
              {qualityOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="rayTracing" className="block text-sm font-medium text-gray-700 mb-1">
              Ray Tracing
            </label>
            <select
              id="rayTracing"
              name="rayTracing"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={formData.rayTracing}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Seçiniz</option>
              {rayTracingOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="upscaling" className="block text-sm font-medium text-gray-700 mb-1">
              Upscaling Teknolojisi
            </label>
            <select
              id="upscaling"
              name="upscaling"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={formData.upscaling}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Seçiniz</option>
              {upscalingOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="antiAliasing" className="block text-sm font-medium text-gray-700 mb-1">
              Anti-Aliasing
            </label>
            <select
              id="antiAliasing"
              name="antiAliasing"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={formData.antiAliasing}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Seçiniz</option>
              {antiAliasingOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="result" className="block text-sm font-medium text-gray-700 mb-1">
              Sonuç Değeri
            </label>
            <input
              type="number"
              id="result"
              name="result"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.result || ''}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
          </div>
          
          <div>
            <label htmlFor="direction" className="block text-sm font-medium text-gray-700 mb-1">
              Değerlendirme Yönü
            </label>
            <select
              id="direction"
              name="direction"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={formData.direction}
              onChange={handleChange}
              required
            >
              <option value={1}>Yüksek daha iyi (FPS vb.)</option>
              <option value={-1}>Düşük daha iyi (Yükleme süresi vb.)</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Kaydet
          </button>
        </div>
      </form>
    </div>
  );
} 