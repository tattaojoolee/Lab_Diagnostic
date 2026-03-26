import { TrendingUp, Activity, Droplet, FileText } from 'lucide-react';

interface Forecast {
  totalTests: number;
  cbc: number;
  urinalysis: number;
  fecalysis: number;
}

interface ForecastResultsProps {
  forecasts: Forecast;
  forecastMethod?: string;
}

export function ForecastResults({ forecasts, forecastMethod = 'Linear Regression' }: ForecastResultsProps) {
  const isMLMethod = forecastMethod.includes('Machine Learning');

  return (
    <div className={`bg-gradient-to-r ${isMLMethod ? 'from-purple-500 to-indigo-600' : 'from-green-500 to-emerald-600'} rounded-xl shadow-xl p-8 text-white`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <TrendingUp size={32} />
          <div>
            <h2 className="text-2xl font-bold">Forecast for Next Month</h2>
            <p className={`${isMLMethod ? 'text-purple-100' : 'text-green-100'} text-sm`}>
              Forecast Method: <strong>{forecastMethod}</strong>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <Activity size={20} />
            <p className="text-sm font-medium text-green-100">Total Tests</p>
          </div>
          <p className="text-4xl font-bold">{forecasts.totalTests.toLocaleString()}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <Droplet size={20} />
            <p className="text-sm font-medium text-green-100">CBC Tests</p>
          </div>
          <p className="text-4xl font-bold">{forecasts.cbc.toLocaleString()}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={20} />
            <p className="text-sm font-medium text-green-100">Urinalysis</p>
          </div>
          <p className="text-4xl font-bold">{forecasts.urinalysis.toLocaleString()}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={20} />
            <p className="text-sm font-medium text-green-100">Fecalysis</p>
          </div>
          <p className="text-4xl font-bold">{forecasts.fecalysis.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
