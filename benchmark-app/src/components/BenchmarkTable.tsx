'use client';

import { useState } from 'react';
import { BenchmarkResult, ComparisonSelection } from '../types';

interface BenchmarkTableProps {
  results: BenchmarkResult[];
  onCompare?: (selectedItems: string[]) => void;
  onDelete?: (id: string) => void;
  onEdit?: (result: BenchmarkResult) => void;
}

export default function BenchmarkTable({ results, onCompare, onDelete, onEdit }: BenchmarkTableProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof BenchmarkResult;
    direction: 'ascending' | 'descending';
  }>({
    key: 'result',
    direction: 'descending',
  });

  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleSort = (key: keyof BenchmarkResult) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedResults = [...results].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        if (prev.length < 3) {
          return [...prev, id];
        }
        return prev;
      }
    });
  };

  const handleCompare = () => {
    if (onCompare && selectedItems.length > 1) {
      onCompare(selectedItems);
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-lg border border-blue-100">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-blue-800">Benchmark Sonuçları</h2>
        {onCompare && (
          <button
            onClick={handleCompare}
            disabled={selectedItems.length < 2}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              selectedItems.length < 2
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
            }`}
          >
            Seçilenleri Karşılaştır ({selectedItems.length}/3)
          </button>
        )}
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {onCompare && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seç</th>}
            <th 
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('benchmark')}
            >
              Oyun / Benchmark
              {sortConfig.key === 'benchmark' && (
                <span className="ml-1">
                  {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                </span>
              )}
            </th>
            <th 
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('gpu')}
            >
              Ekran Kartı
              {sortConfig.key === 'gpu' && (
                <span className="ml-1">
                  {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                </span>
              )}
            </th>
            <th 
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('cpu')}
            >
              İşlemci
              {sortConfig.key === 'cpu' && (
                <span className="ml-1">
                  {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                </span>
              )}
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Grafik Ayarları
            </th>
            <th 
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('result')}
            >
              Sonuç
              {sortConfig.key === 'result' && (
                <span className="ml-1">
                  {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                </span>
              )}
            </th>
            {(onDelete || onEdit) && (
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedResults.map((result) => (
            <tr key={result.id} className="hover:bg-gray-50">
              {onCompare && (
                <td className="px-4 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(result.id)}
                    onChange={() => handleSelectItem(result.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </td>
              )}
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{result.benchmark}</div>
                <div className="text-xs text-gray-500">{result.tip}</div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{result.gpu}</div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{result.cpu}</div>
              </td>
              <td className="px-4 py-4">
                <div className="text-sm text-gray-900 grid grid-cols-2 gap-x-4 gap-y-1">
                  <span className="text-xs text-gray-500">Çözünürlük:</span>
                  <span className="text-xs font-medium">{result.resolution}</span>
                  
                  <span className="text-xs text-gray-500">Kalite:</span>
                  <span className="text-xs font-medium">{result.quality}</span>
                  
                  <span className="text-xs text-gray-500">Ray Tracing:</span>
                  <span className="text-xs font-medium">{result.rayTracing}</span>
                  
                  <span className="text-xs text-gray-500">Upscaling:</span>
                  <span className="text-xs font-medium">{result.upscaling}</span>
                  
                  <span className="text-xs text-gray-500">Anti-Aliasing:</span>
                  <span className="text-xs font-medium">{result.antiAliasing}</span>
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className={`text-sm font-bold ${result.direction === 1 ? 'text-green-600' : 'text-blue-600'}`}>
                  {result.result} {result.tip.includes('FPS') ? 'FPS' : 'sn'}
                </div>
                <div className="text-xs text-gray-500">
                  {result.direction === 1 ? 'Yüksek daha iyi' : 'Düşük daha iyi'}
                </div>
              </td>
              {(onDelete || onEdit) && (
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex space-x-2 justify-end">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(result)}
                        className="text-indigo-600 hover:text-indigo-900 focus:outline-none"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => {
                          if (window.confirm('Bu benchmark sonucunu silmek istediğinize emin misiniz?')) {
                            onDelete(result.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-900 focus:outline-none"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {results.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          Sonuç bulunamadı. Lütfen filtreleri değiştirin veya yeni benchmark ekleyin.
        </div>
      )}
    </div>
  );
} 