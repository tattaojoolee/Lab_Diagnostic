import * as tf from '@tensorflow/tfjs';
import { TestData } from '../App';

export interface TrainingMetrics {
  epoch: number;
  loss: number;
  accuracy: number;
}

export interface MLModel {
  model: tf.Sequential | null;
  isTraining: boolean;
  trainingMetrics: TrainingMetrics[];
  lastTrainedDate: Date | null;
}

// Normalize data to 0-1 range
function normalizeData(data: number[]): { normalized: number[]; min: number; max: number } {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const normalized = data.map(val => (val - min) / range);
  return { normalized, min, max };
}

// Denormalize data back to original range
function denormalizeValue(normalized: number, min: number, max: number): number {
  const range = max - min || 1;
  return normalized * range + min;
}

// Create sequences for time series prediction
function createSequences(data: number[], sequenceLength: number = 2) {
  const xs: number[][] = [];
  const ys: number[] = [];

  for (let i = 0; i < data.length - sequenceLength; i++) {
    xs.push(data.slice(i, i + sequenceLength));
    ys.push(data[i + sequenceLength]);
  }

  return { xs, ys };
}

export async function trainMLModel(
  data: TestData[],
  onProgress?: (metrics: TrainingMetrics) => void
): Promise<{
  model: tf.Sequential;
  normalizationParams: {
    totalTests: { min: number; max: number };
    cbc: { min: number; max: number };
    urinalysis: { min: number; max: number };
    fecalysis: { min: number; max: number };
  };
}> {
  if (data.length < 3) {
    throw new Error('Need at least 3 data points to train the model');
  }

  // Extract and normalize data
  const totalTestsData = data.map(d => d.totalTests);
  const cbcData = data.map(d => d.cbc);
  const urinalysisData = data.map(d => d.urinalysis);
  const fecalysisData = data.map(d => d.fecalysis);

  const totalTestsNorm = normalizeData(totalTestsData);
  const cbcNorm = normalizeData(cbcData);
  const urinalysisNorm = normalizeData(urinalysisData);
  const fecalysisNorm = normalizeData(fecalysisData);

  // Create training sequences
  const sequenceLength = 2;
  const totalSequences = createSequences(totalTestsNorm.normalized, sequenceLength);
  const cbcSequences = createSequences(cbcNorm.normalized, sequenceLength);
  const urinalysisSequences = createSequences(urinalysisNorm.normalized, sequenceLength);
  const fecalysisSequences = createSequences(fecalysisNorm.normalized, sequenceLength);

  // Combine all features into training data
  const numSamples = totalSequences.xs.length;
  const features = new Array(numSamples);

  for (let i = 0; i < numSamples; i++) {
    features[i] = [
      ...totalSequences.xs[i],
      ...cbcSequences.xs[i],
      ...urinalysisSequences.xs[i],
      ...fecalysisSequences.xs[i]
    ];
  }

  // Create target outputs (next values for all test types)
  const targets = new Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    targets[i] = [
      totalSequences.ys[i],
      cbcSequences.ys[i],
      urinalysisSequences.ys[i],
      fecalysisSequences.ys[i]
    ];
  }

  // Convert to tensors
  const xs = tf.tensor2d(features);
  const ys = tf.tensor2d(targets);

  // Create the model
  const model = tf.sequential({
    layers: [
      tf.layers.dense({
        inputShape: [sequenceLength * 4],
        units: 32,
        activation: 'relu',
        kernelInitializer: 'heNormal'
      }),
      tf.layers.dropout({ rate: 0.2 }),
      tf.layers.dense({
        units: 16,
        activation: 'relu',
        kernelInitializer: 'heNormal'
      }),
      tf.layers.dense({
        units: 4,
        activation: 'linear'
      })
    ]
  });

  // Compile the model
  model.compile({
    optimizer: tf.train.adam(0.01),
    loss: 'meanSquaredError',
    metrics: ['mae']
  });

  // Train the model
  const epochs = 100;

  await model.fit(xs, ys, {
    epochs,
    batchSize: 2,
    validationSplit: 0.2,
    shuffle: true,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        if (onProgress && logs) {
          const loss = logs.loss as number;
          const mae = logs.mae as number;
          // Convert MAE to accuracy percentage (lower MAE = higher accuracy)
          const accuracy = Math.max(0, (1 - mae) * 100);

          onProgress({
            epoch: epoch + 1,
            loss,
            accuracy
          });
        }
      }
    }
  });

  // Clean up tensors
  xs.dispose();
  ys.dispose();

  return {
    model,
    normalizationParams: {
      totalTests: { min: totalTestsNorm.min, max: totalTestsNorm.max },
      cbc: { min: cbcNorm.min, max: cbcNorm.max },
      urinalysis: { min: urinalysisNorm.min, max: urinalysisNorm.max },
      fecalysis: { min: fecalysisNorm.min, max: fecalysisNorm.max }
    }
  };
}

export function predictWithML(
  model: tf.Sequential,
  data: TestData[],
  normalizationParams: {
    totalTests: { min: number; max: number };
    cbc: { min: number; max: number };
    urinalysis: { min: number; max: number };
    fecalysis: { min: number; max: number };
  }
): { totalTests: number; cbc: number; urinalysis: number; fecalysis: number } {
  if (data.length < 2) {
    return { totalTests: 0, cbc: 0, urinalysis: 0, fecalysis: 0 };
  }

  // Take the last 2 data points
  const lastTwo = data.slice(-2);

  // Normalize the input data
  const totalTestsNorm = lastTwo.map(d =>
    (d.totalTests - normalizationParams.totalTests.min) /
    (normalizationParams.totalTests.max - normalizationParams.totalTests.min || 1)
  );
  const cbcNorm = lastTwo.map(d =>
    (d.cbc - normalizationParams.cbc.min) /
    (normalizationParams.cbc.max - normalizationParams.cbc.min || 1)
  );
  const urinalysisNorm = lastTwo.map(d =>
    (d.urinalysis - normalizationParams.urinalysis.min) /
    (normalizationParams.urinalysis.max - normalizationParams.urinalysis.min || 1)
  );
  const fecalysisNorm = lastTwo.map(d =>
    (d.fecalysis - normalizationParams.fecalysis.min) /
    (normalizationParams.fecalysis.max - normalizationParams.fecalysis.min || 1)
  );

  // Create input tensor
  const input = tf.tensor2d([
    [...totalTestsNorm, ...cbcNorm, ...urinalysisNorm, ...fecalysisNorm]
  ]);

  // Make prediction
  const prediction = model.predict(input) as tf.Tensor;
  const values = prediction.dataSync();

  // Clean up tensors
  input.dispose();
  prediction.dispose();

  // Denormalize predictions
  return {
    totalTests: Math.round(denormalizeValue(values[0], normalizationParams.totalTests.min, normalizationParams.totalTests.max)),
    cbc: Math.round(denormalizeValue(values[1], normalizationParams.cbc.min, normalizationParams.cbc.max)),
    urinalysis: Math.round(denormalizeValue(values[2], normalizationParams.urinalysis.min, normalizationParams.urinalysis.max)),
    fecalysis: Math.round(denormalizeValue(values[3], normalizationParams.fecalysis.min, normalizationParams.fecalysis.max))
  };
}
