'use client';

import { useState, useEffect } from 'react';
import { BenchmarkResult } from '../types';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BenchmarkChartProps {
  results: BenchmarkResult[];
  selectedItems?: string[];
}

export default function BenchmarkChart({ results, selectedItems }: BenchmarkChartProps) {
  const [chartType, setChartType] = useState<'gpu' | 'benchmark'>('gpu');
  const [showStats, setShowStats] = useState<boolean>(false);
  
  // Eğer selectedItems varsa, sadece seçili öğeleri göster
  const filteredResults = selectedItems && selectedItems.length > 0
    ? results.filter(result => selectedItems.includes(result.id))
    : results;
  
  // İstatistikler
  const [stats, setStats] = useState<{
    avgResult: number;
    maxResult: number;
    minResult: number;
    gpuComparison: { gpu: string; avgResult: number }[];
    benchmarkComparison: { benchmark: string; avgResult: number }[];
  }>({
    avgResult: 0,
    maxResult: 0,
    minResult: 0,
    gpuComparison: [],
    benchmarkComparison: []
  });
  
  // GPU markasına göre renk belirleme
  const getGpuColor = (gpuName: string) => {
    const gpuNameLower = gpuName.toLowerCase();
    
    if (gpuNameLower.includes('nvidia') || gpuNameLower.includes('rtx') || gpuNameLower.includes('gtx')) {
      return {
        backgroundColor: 'rgba(118, 185, 0, 0.6)', // NVIDIA yeşil
        borderColor: 'rgb(118, 185, 0)'
      };
    } else if (gpuNameLower.includes('amd') || gpuNameLower.includes('radeon') || gpuNameLower.includes('rx')) {
      return {
        backgroundColor: 'rgba(237, 28, 36, 0.6)', // AMD kırmızı
        borderColor: 'rgb(237, 28, 36)'
      };
    } else if (gpuNameLower.includes('intel') || gpuNameLower.includes('arc')) {
      return {
        backgroundColor: 'rgba(0, 113, 197, 0.6)', // Intel mavi
        borderColor: 'rgb(0, 113, 197)'
      };
    } else {
      // Bilinmeyen markalar için varsayılan renk
      return {
        backgroundColor: 'rgba(128, 128, 128, 0.6)', // Gri
        borderColor: 'rgb(128, 128, 128)'
      };
    }
  };
  
  // İstatistikleri hesapla
  useEffect(() => {
    if (filteredResults.length === 0) return;
    
    // Ortalama, maksimum ve minimum sonuçlar
    const sum = filteredResults.reduce((acc, curr) => acc + curr.result, 0);
    const avg = sum / filteredResults.length;
    const max = Math.max(...filteredResults.map(r => r.result));
    const min = Math.min(...filteredResults.map(r => r.result));
    
    // GPU bazlı karşılaştırma
    const gpuMap = new Map<string, { sum: number; count: number }>();
    filteredResults.forEach(r => {
      if (!gpuMap.has(r.gpu)) {
        gpuMap.set(r.gpu, { sum: r.result, count: 1 });
      } else {
        const current = gpuMap.get(r.gpu)!;
        gpuMap.set(r.gpu, { sum: current.sum + r.result, count: current.count + 1 });
      }
    });
    
    const gpuComparison = Array.from(gpuMap.entries()).map(([gpu, data]) => ({
      gpu,
      avgResult: data.sum / data.count
    })).sort((a, b) => b.avgResult - a.avgResult);
    
    // Benchmark bazlı karşılaştırma
    const benchmarkMap = new Map<string, { sum: number; count: number }>();
    filteredResults.forEach(r => {
      if (!benchmarkMap.has(r.benchmark)) {
        benchmarkMap.set(r.benchmark, { sum: r.result, count: 1 });
      } else {
        const current = benchmarkMap.get(r.benchmark)!;
        benchmarkMap.set(r.benchmark, { sum: current.sum + r.result, count: current.count + 1 });
      }
    });
    
    const benchmarkComparison = Array.from(benchmarkMap.entries()).map(([benchmark, data]) => ({
      benchmark,
      avgResult: data.sum / data.count
    })).sort((a, b) => b.avgResult - a.avgResult);
    
    setStats({
      avgResult: avg,
      maxResult: max,
      minResult: min,
      gpuComparison,
      benchmarkComparison
    });
  }, [filteredResults]);

  // Grafik verilerini hazırla
  const chartData = {
    labels: chartType === 'gpu' 
      ? filteredResults.map(result => `${result.gpu} (${result.benchmark})`)
      : filteredResults.map(result => `${result.benchmark} (${result.gpu})`),
    datasets: [
      {
        label: 'Sonuç',
        data: filteredResults.map(result => result.result),
        backgroundColor: filteredResults.map(result => {
          const colors = getGpuColor(result.gpu);
          return colors.backgroundColor;
        }),
        borderColor: filteredResults.map(result => {
          const colors = getGpuColor(result.gpu);
          return colors.borderColor;
        }),
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    indexAxis: 'y', // Yatay çubuklar için
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: chartType === 'gpu' ? 'GPU Performans Karşılaştırması' : 'Benchmark Karşılaştırması',
      },
      tooltip: {
        callbacks: {
          afterLabel: function(context) {
            const index = context.dataIndex;
            const result = filteredResults[index];
            return [
              `CPU: ${result.cpu}`,
              `Çözünürlük: ${result.resolution}`,
              `Kalite: ${result.quality}`,
              `Ray Tracing: ${result.rayTracing}`,
              `Upscaling: ${result.upscaling}`,
              `Anti-Aliasing: ${result.antiAliasing}`,
              `Tip: ${result.tip}`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Sonuç'
        }
      },
      y: {
        ticks: {
          autoSkip: false,
          maxRotation: 0,
          minRotation: 0
        }
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-blue-100">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 mb-2 sm:mb-0">Benchmark Grafiği</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setChartType('gpu')}
            className={`px-3 py-1 rounded text-sm ${
              chartType === 'gpu' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            GPU Bazlı
          </button>
          <button
            onClick={() => setChartType('benchmark')}
            className={`px-3 py-1 rounded text-sm ${
              chartType === 'benchmark' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Benchmark Bazlı
          </button>
          <button
            onClick={() => setShowStats(!showStats)}
            className={`px-3 py-1 rounded text-sm ${
              showStats 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {showStats ? 'İstatistikleri Gizle' : 'İstatistikleri Göster'}
          </button>
        </div>
      </div>
      
      {showStats && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-3">Benchmark İstatistikleri</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white p-3 rounded shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500">Ortalama Sonuç</p>
              <p className="text-xl font-bold">{stats.avgResult.toFixed(2)}</p>
            </div>
            <div className="bg-white p-3 rounded shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500">En Yüksek Sonuç</p>
              <p className="text-xl font-bold">{stats.maxResult.toFixed(2)}</p>
            </div>
            <div className="bg-white p-3 rounded shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500">En Düşük Sonuç</p>
              <p className="text-xl font-bold">{stats.minResult.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-md font-semibold mb-2">GPU Performans Karşılaştırması</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-2 px-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GPU</th>
                      <th className="py-2 px-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ortalama Sonuç</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.gpuComparison.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="py-2 px-3 border-b border-gray-200 text-sm">{item.gpu}</td>
                        <td className="py-2 px-3 border-b border-gray-200 text-sm font-medium">{item.avgResult.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div>
              <h4 className="text-md font-semibold mb-2">Benchmark Karşılaştırması</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-2 px-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Benchmark</th>
                      <th className="py-2 px-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ortalama Sonuç</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.benchmarkComparison.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="py-2 px-3 border-b border-gray-200 text-sm">{item.benchmark}</td>
                        <td className="py-2 px-3 border-b border-gray-200 text-sm font-medium">{item.avgResult.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="h-[500px]">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
} 