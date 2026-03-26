import { TestData } from '../App';

interface Forecast {
  totalTests: number;
  cbc: number;
  urinalysis: number;
  fecalysis: number;
}

export function calculateForecasts(data: TestData[]): Forecast {
  if (data.length < 2) {
    return {
      totalTests: 0,
      cbc: 0,
      urinalysis: 0,
      fecalysis: 0,
    };
  }

  // Simple linear regression for forecasting
  const forecast = {
    totalTests: linearForecast(data.map(d => d.totalTests)),
    cbc: linearForecast(data.map(d => d.cbc)),
    urinalysis: linearForecast(data.map(d => d.urinalysis)),
    fecalysis: linearForecast(data.map(d => d.fecalysis)),
  };

  return forecast;
}

function linearForecast(values: number[]): number {
  const n = values.length;

  // Calculate the slope using simple linear regression
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;

  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += values[i];
    sumXY += i * values[i];
    sumX2 += i * i;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Forecast for the next period
  const nextValue = slope * n + intercept;

  // Ensure non-negative values
  return Math.max(0, Math.round(nextValue));
}
