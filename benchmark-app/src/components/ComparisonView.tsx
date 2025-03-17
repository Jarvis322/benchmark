'use client';

import { useState, useEffect } from 'react';
import { BenchmarkResult } from '../types';
import BenchmarkChart from './BenchmarkChart';

interface ComparisonViewProps {
  results: BenchmarkResult[];
  selectedIds: string[];
  onClose: () => void;
}

export default function ComparisonView({ results, selectedIds, onClose }: ComparisonViewProps) {
  const [selectedItems, setSelectedItems] = useState<BenchmarkResult[]>([]);

  useEffect(() => {
    const items = results.filter(result => selectedIds.includes(result.id));
    setSelectedItems(items);
  }, [results, selectedIds]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-blue-50">
          <h2 className="text-xl font-semibold text-blue-800">Benchmark Karşılaştırma</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-grow">
          <div className="mb-6">
            <BenchmarkChart results={results} selectedItems={selectedIds} />
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Özellik</th>
                  {selectedItems.map((item) => (
                    <th key={item.id} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {item.gpu} - {item.benchmark}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-700">Benchmark</td>
                  {selectedItems.map((item) => (
                    <td key={item.id} className="px-4 py-3 text-sm text-gray-700">{item.benchmark}</td>
                  ))}
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-700">Ekran Kartı</td>
                  {selectedItems.map((item) => (
                    <td key={item.id} className="px-4 py-3 text-sm text-gray-700">{item.gpu}</td>
                  ))}
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-700">İşlemci</td>
                  {selectedItems.map((item) => (
                    <td key={item.id} className="px-4 py-3 text-sm text-gray-700">{item.cpu}</td>
                  ))}
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-700">Çözünürlük</td>
                  {selectedItems.map((item) => (
                    <td key={item.id} className="px-4 py-3 text-sm text-gray-700">{item.resolution}</td>
                  ))}
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-700">Kalite Ayarı</td>
                  {selectedItems.map((item) => (
                    <td key={item.id} className="px-4 py-3 text-sm text-gray-700">{item.quality}</td>
                  ))}
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-700">Ray Tracing</td>
                  {selectedItems.map((item) => (
                    <td key={item.id} className="px-4 py-3 text-sm text-gray-700">{item.rayTracing}</td>
                  ))}
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-700">Upscaling</td>
                  {selectedItems.map((item) => (
                    <td key={item.id} className="px-4 py-3 text-sm text-gray-700">{item.upscaling}</td>
                  ))}
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-700">Anti-Aliasing</td>
                  {selectedItems.map((item) => (
                    <td key={item.id} className="px-4 py-3 text-sm text-gray-700">{item.antiAliasing}</td>
                  ))}
                </tr>
                <tr className="hover:bg-gray-50 bg-blue-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-700">Sonuç</td>
                  {selectedItems.map((item) => (
                    <td key={item.id} className="px-4 py-3 text-sm font-bold">
                      <span className={item.direction === 1 ? 'text-green-600' : 'text-blue-600'}>
                        {item.result} {item.tip.includes('FPS') ? 'FPS' : 'sn'}
                      </span>
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-700">Ölçüm Tipi</td>
                  {selectedItems.map((item) => (
                    <td key={item.id} className="px-4 py-3 text-sm text-gray-700">{item.tip}</td>
                  ))}
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-700">Değerlendirme Yönü</td>
                  {selectedItems.map((item) => (
                    <td key={item.id} className="px-4 py-3 text-sm text-gray-700">
                      {item.direction === 1 ? 'Yüksek daha iyi' : 'Düşük daha iyi'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
} 