import { TestData } from '../App';
import { DataTable } from './DataTable';
import { VisualizationCharts } from './VisualizationCharts';
import { ForecastResults } from './ForecastResults';
import { calculateForecasts } from '../utils/forecasting';
import { predictWithML } from '../utils/mlForecasting';
import * as tf from '@tensorflow/tfjs';

interface DashboardProps {
  data: TestData[];
  onDeleteData: (id: string) => void;
  mlModel: tf.Sequential | null;
  normalizationParams: {
    totalTests: { min: number; max: number };
    cbc: { min: number; max: number };
    urinalysis: { min: number; max: number };
    fecalysis: { min: number; max: number };
  } | null;
}

export function Dashboard({ data, onDeleteData, mlModel, normalizationParams }: DashboardProps) {
  // Use ML model if available, otherwise use linear regression
  const forecasts = mlModel && normalizationParams
    ? predictWithML(mlModel, data, normalizationParams)
    : calculateForecasts(data);

  const forecastMethod = mlModel ? 'Machine Learning (Neural Network)' : 'Linear Regression';

  return (
    <div className="space-y-8">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-600 mb-1">Total Records</p>
          <p className="text-3xl font-bold text-blue-600">{data.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-600 mb-1">Avg Total Tests</p>
          <p className="text-3xl font-bold text-green-600">
            {data.length > 0
              ? Math.round(data.reduce((sum, d) => sum + d.totalTests, 0) / data.length)
              : 0}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-600 mb-1">Avg CBC Tests</p>
          <p className="text-3xl font-bold text-purple-600">
            {data.length > 0
              ? Math.round(data.reduce((sum, d) => sum + d.cbc, 0) / data.length)
              : 0}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-600 mb-1">Latest Month</p>
          <p className="text-xl font-bold text-indigo-600">
            {data.length > 0 ? `${data[data.length - 1].month} ${data[data.length - 1].year}` : 'N/A'}
          </p>
        </div>
      </div>

      {/* Forecast Results */}
      {data.length >= 2 && <ForecastResults forecasts={forecasts} forecastMethod={forecastMethod} />}

      {/* Visualization Charts */}
      {data.length > 0 && <VisualizationCharts data={data} forecasts={forecasts} />}

      {/* Data Table */}
      <DataTable data={data} onDelete={onDeleteData} />
    </div>
  );
}
