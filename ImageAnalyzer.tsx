import React, { useState } from 'react';
import { FileUpload } from './FileUpload';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Download } from 'lucide-react';
import * as tf from '@tensorflow/tfjs';

export const ImageAnalyzer: React.FC = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzePressureMap = async (imageElement: HTMLImageElement): Promise<string> => {
    // Convert image to tensor
    const tensor = tf.browser.fromPixels(imageElement);
    const normalized = tensor.toFloat().div(255);

    // Calculate pressure metrics using TensorFlow.js
    const meanTensor = normalized.mean();
    const maxTensor = normalized.max();
    const minTensor = normalized.min();
    const stdTensor = normalized.sub(meanTensor).square().mean().sqrt();

    // Get values from tensors
    const [meanPressure, maxPressure, minPressure, stdDev] = await Promise.all([
      meanTensor.data(),
      maxTensor.data(),
      minTensor.data(),
      stdTensor.data(),
    ]);

    // Calculate high-pressure regions
    const highPressureMask = normalized.greater(0.8);
    const highPressureCount = (await highPressureMask.sum().data())[0];

    // Cleanup tensors
    tensor.dispose();
    normalized.dispose();
    meanTensor.dispose();
    maxTensor.dispose();
    minTensor.dispose();
    stdTensor.dispose();
    highPressureMask.dispose();

    // Scale values for better readability
    const scaledMean = (meanPressure[0] * 1000).toFixed(2);
    const scaledMax = (maxPressure[0] * 1000).toFixed(2);
    const scaledMin = (minPressure[0] * 1000).toFixed(2);
    const scaledStd = (stdDev[0] * 1000).toFixed(2);

    return `
Pressure Analysis Results:

Mean Pressure: ${scaledMean} kPa
Maximum Pressure: ${scaledMax} kPa
Minimum Pressure: ${scaledMin} kPa
Pressure Variation (StdDev): ${scaledStd} kPa
High-Pressure Regions: ${highPressureCount.toFixed(0)} pixels

Key Observations:
${meanPressure[0] > 0.5 ? '- High average pressure detected across the field' : '- Lower average pressure distribution'}
${stdDev[0] > 0.2 ? '- Significant pressure variations present' : '- Relatively uniform pressure distribution'}
${highPressureCount > 1000 ? '- Multiple high-pressure zones identified' : '- Limited high-pressure areas detected'}

Analysis Details:
- Pressure distribution appears ${stdDev[0] > 0.2 ? 'non-uniform' : 'uniform'} across the field
- ${highPressureCount > 1000 ? 'Large areas' : 'Small areas'} of high pressure concentration
- Overall pressure intensity is ${meanPressure[0] > 0.5 ? 'high' : 'moderate to low'}

Recommendations:
${meanPressure[0] > 0.5 ? '- Consider pressure reduction strategies in high-pressure regions' : '- Monitor low-pressure areas for optimization'}
${stdDev[0] > 0.2 ? '- Investigate causes of pressure variations' : '- Maintain current uniform pressure distribution'}
${highPressureCount > 1000 ? '- Evaluate the impact of multiple high-pressure zones' : '- Focus on existing high-pressure points'}
    `;
  };

  const handleUpload = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    try {
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
      setAnalyzing(true);
      setResult(null);
      setError(null);

      // Create an image element and wait for it to load
      const img = new Image();
      img.src = imageUrl;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      // Perform analysis using TensorFlow.js
      const analysis = await analyzePressureMap(img);
      setResult(analysis);
    } catch (err) {
      setError('Failed to analyze the image. Please try again.');
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const downloadReport = () => {
    if (!result) return;
    
    const report = `CFD Pressure Map Analysis Report\n\n${result}`;
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pressure-analysis-report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-400 mb-4">Pressure Map Analyzer</h1>
        <p className="text-gray-400">Upload your CFD pressure map images for instant analysis</p>
      </div>

      <div className="bg-gradient-to-br from-gray-900 to-black border border-green-500/20 rounded-xl p-6">
        <FileUpload onUpload={handleUpload} />
      </div>
      
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 bg-red-500/20 border border-red-500/40 rounded-lg text-red-400"
          >
            {error}
          </motion.div>
        )}

        {previewUrl && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-gradient-to-br from-gray-900 to-black border border-green-500/20 rounded-xl overflow-hidden"
          >
            <img src={previewUrl} alt="Preview" className="w-full h-auto" />
          </motion.div>
        )}

        {analyzing && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-2 p-4 bg-gradient-to-br from-gray-900 to-black border border-green-500/20 rounded-xl"
          >
            <Loader2 className="w-5 h-5 animate-spin text-green-400" />
            <span className="text-green-400">Analyzing pressure map...</span>
          </motion.div>
        )}

        {result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-gradient-to-br from-gray-900 to-black border border-green-500/20 rounded-xl p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-green-400">Analysis Results</h3>
              <button
                onClick={downloadReport}
                className="flex items-center gap-2 px-3 py-1 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-400 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download Report
              </button>
            </div>
            <div className="prose prose-invert max-w-none whitespace-pre-wrap">
              {result}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};