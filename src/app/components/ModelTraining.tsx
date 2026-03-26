import { useState } from 'react';
import { Brain, Play, CheckCircle, TrendingUp } from 'lucide-react';
import { TestData } from '../App';
import { trainMLModel, TrainingMetrics } from '../utils/mlForecasting';
import * as tf from '@tensorflow/tfjs';

interface ModelTrainingProps {
  data: TestData[];
  onModelTrained: (
    model: tf.Sequential,
    normalizationParams: {
      totalTests: { min: number; max: number };
      cbc: { min: number; max: number };
      urinalysis: { min: number; max: number };
      fecalysis: { min: number; max: number };
    }
  ) => void;
  isModelTrained: boolean;
}

export function ModelTraining({ data, onModelTrained, isModelTrained }: ModelTrainingProps) {
  const [isTraining, setIsTraining] = useState(false);
  const [trainingMetrics, setTrainingMetrics] = useState<TrainingMetrics[]>([]);
  const [currentMetric, setCurrentMetric] = useState<TrainingMetrics | null>(null);

  const handleTrainModel = async () => {
    if (data.length < 3) {
      alert('Need at least 3 data points to train the model');
      return;
    }

    setIsTraining(true);
    setTrainingMetrics([]);
    setCurrentMetric(null);

    try {
      const result = await trainMLModel(data, (metrics) => {
        setCurrentMetric(metrics);
        setTrainingMetrics(prev => [...prev, metrics]);
      });

      onModelTrained(result.model, result.normalizationParams);
    } catch (error) {
      alert('Error training model: ' + (error as Error).message);
    } finally {
      setIsTraining(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Brain className="text-purple-600" size={28} />
          <div>
            <h2 className="text-xl font-bold text-gray-800">Machine Learning Model</h2>
            <p className="text-sm text-gray-600">Neural Network Time Series Forecasting</p>
          </div>
        </div>

        {isModelTrained && (
          <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-lg">
            <CheckCircle className="text-green-600" size={20} />
            <span className="text-green-700 font-medium">Model Trained</span>
          </div>
        )}
      </div>

      {/* Model Info */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-800 mb-2">Model Architecture</h3>
        <ul className="space-y-1 text-sm text-gray-700">
          <li>• <strong>Input Layer:</strong> 8 features (2 time steps × 4 test types)</li>
          <li>• <strong>Hidden Layer 1:</strong> 32 neurons with ReLU activation + Dropout (20%)</li>
          <li>• <strong>Hidden Layer 2:</strong> 16 neurons with ReLU activation</li>
          <li>• <strong>Output Layer:</strong> 4 neurons (predictions for each test type)</li>
          <li>• <strong>Optimizer:</strong> Adam (learning rate: 0.01)</li>
          <li>• <strong>Loss Function:</strong> Mean Squared Error</li>
        </ul>
      </div>

      {/* Training Button */}
      <button
        onClick={handleTrainModel}
        disabled={isTraining || data.length < 3}
        className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
          isTraining || data.length < 3
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-purple-600 text-white hover:bg-purple-700 shadow-md hover:shadow-lg'
        }`}
      >
        {isTraining ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Training Model... ({currentMetric?.epoch || 0}/100 epochs)
          </>
        ) : (
          <>
            <Play size={20} />
            {isModelTrained ? 'Retrain Model' : 'Train Model'}
          </>
        )}
      </button>

      {data.length < 3 && (
        <p className="text-sm text-red-600 mt-2 text-center">
          Need at least 3 data points to train the model
        </p>
      )}

      {/* Training Progress */}
      {currentMetric && (
        <div className="mt-6">
          <h3 className="font-semibold text-gray-800 mb-3">Training Progress</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Epoch {currentMetric.epoch}/100</span>
                <span className="text-gray-600">{currentMetric.epoch}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${currentMetric.epoch}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Loss</p>
                <p className="text-lg font-bold text-blue-700">
                  {currentMetric.loss.toFixed(6)}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Accuracy</p>
                <p className="text-lg font-bold text-green-700">
                  {currentMetric.accuracy.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Training History Chart */}
      {trainingMetrics.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <TrendingUp size={18} />
            Training History
          </h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="h-32 flex items-end gap-1">
              {trainingMetrics.filter((_, i) => i % 5 === 0).map((metric, index) => (
                <div
                  key={index}
                  className="flex-1 bg-purple-500 rounded-t hover:bg-purple-600 transition-colors relative group"
                  style={{
                    height: `${Math.min(100, (1 - metric.loss) * 100)}%`,
                    minHeight: '4px'
                  }}
                >
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Epoch {metric.epoch}: {metric.loss.toFixed(4)}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 text-center mt-2">Loss over epochs (lower is better)</p>
          </div>
        </div>
      )}
    </div>
  );
}
