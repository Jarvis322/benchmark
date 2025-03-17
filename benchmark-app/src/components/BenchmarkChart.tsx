'use client';

import { useEffect, useRef } from 'react';
import { BenchmarkResult } from '../types';
import Chart from 'chart.js/auto';

interface BenchmarkChartProps {
  results: BenchmarkResult[];
  selectedItems?: string[];
}

export default function BenchmarkChart({ results, selectedItems }: BenchmarkChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Filter results if selectedItems is provided
    const dataToDisplay = selectedItems 
      ? results.filter(result => selectedItems.includes(result.id))
      : results.slice(0, 10); // Display top 10 results if no selection

    // Generate random colors for each dataset
    const generateColor = (index: number) => {
      const colors = [
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 99, 132, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(255, 159, 64, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 205, 86, 0.7)',
        'rgba(201, 203, 207, 0.7)',
        'rgba(255, 99, 71, 0.7)',
        'rgba(46, 204, 113, 0.7)',
        'rgba(142, 68, 173, 0.7)',
      ];
      return colors[index % colors.length];
    };

    // Create labels and datasets
    const labels = dataToDisplay.map(result => {
      const label = `${result.gpu} - ${result.benchmark}`;
      const settingsInfo = `${result.resolution}, ${result.quality}`;
      return [label, settingsInfo];
    });

    const datasets = [{
      label: 'Benchmark Sonuçları',
      data: dataToDisplay.map(result => {
        // For metrics where lower is better (direction = -1), invert the value for visualization
        // This makes all bars point in the same direction while preserving the "better is higher" visual
        return result.direction === 1 ? result.result : -result.result;
      }),
      backgroundColor: dataToDisplay.map((_, index) => generateColor(index)),
      borderColor: dataToDisplay.map((_, index) => generateColor(index).replace('0.7', '1')),
      borderWidth: 1
    }];

    // Create chart
    const ctx = chartRef.current.getContext('2d');
    if (ctx) {
      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: datasets
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y',
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const result = dataToDisplay[context.dataIndex];
                  const value = Math.abs(result.result);
                  const unit = result.tip.includes('FPS') ? 'FPS' : 'sn';
                  const direction = result.direction === 1 ? 'Yüksek daha iyi' : 'Düşük daha iyi';
                  
                  return [
                    `${result.tip}: ${value} ${unit} (${direction})`,
                    `CPU: ${result.cpu}`,
                    `Çözünürlük: ${result.resolution}`,
                    `Kalite: ${result.quality}`,
                    `Ray Tracing: ${result.rayTracing}`,
                    `Upscaling: ${result.upscaling}`,
                    `Anti-Aliasing: ${result.antiAliasing}`
                  ];
                }
              }
            }
          },
          scales: {
            x: {
              ticks: {
                callback: function(value) {
                  // Display absolute values on the axis
                  return Math.abs(Number(value));
                }
              },
              title: {
                display: true,
                text: 'Sonuç Değeri'
              }
            },
            y: {
              ticks: {
                callback: function(_, index) {
                  // Return only the first line of the label for the y-axis
                  return labels[index][0];
                }
              }
            }
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [results, selectedItems]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-blue-100 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-blue-800">Benchmark Karşılaştırma</h2>
      <div className="h-[400px]">
        {results.length > 0 ? (
          <canvas ref={chartRef} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Görüntülenecek veri bulunamadı.
          </div>
        )}
      </div>
    </div>
  );
} 