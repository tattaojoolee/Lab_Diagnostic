import { TestData } from '../App';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface Forecast {
  totalTests: number;
  cbc: number;
  urinalysis: number;
  fecalysis: number;
}

interface VisualizationChartsProps {
  data: TestData[];
  forecasts: Forecast;
}

export function VisualizationCharts({ data, forecasts }: VisualizationChartsProps) {
  const chartData = data.map((item) => ({
    name: `${item.month.substring(0, 3)} ${item.year}`,
    'Total Tests': item.totalTests,
    CBC: item.cbc,
    Urinalysis: item.urinalysis,
    Fecalysis: item.fecalysis,
  }));

  // Add forecast data point
  const forecastData = [...chartData];
  if (data.length >= 2) {
    const lastData = data[data.length - 1];
    const nextMonth = new Date(lastData.year, getMonthIndex(lastData.month) + 1);
    forecastData.push({
      name: `${getMonthName(nextMonth.getMonth())} ${nextMonth.getFullYear()}`,
      'Total Tests': forecasts.totalTests,
      CBC: forecasts.cbc,
      Urinalysis: forecasts.urinalysis,
      Fecalysis: forecasts.fecalysis,
    });
  }

  return (
    <div className="space-y-8">
      {/* Trend Line Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="text-blue-600" size={24} />
          <h2 className="text-xl font-bold text-gray-800">Test Volume Trends & Forecast</h2>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={forecastData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Legend />
            <Line
              key="total-tests"
              type="monotone"
              dataKey="Total Tests"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: '#3b82f6', r: 5 }}
              activeDot={{ r: 7 }}
            />
            <Line
              key="cbc"
              type="monotone"
              dataKey="CBC"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={{ fill: '#8b5cf6', r: 4 }}
            />
            <Line
              key="urinalysis"
              type="monotone"
              dataKey="Urinalysis"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981', r: 4 }}
            />
            <Line
              key="fecalysis"
              type="monotone"
              dataKey="Fecalysis"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ fill: '#f59e0b', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Test Type Distribution</h2>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Legend />
            <Bar key="bar-cbc" dataKey="CBC" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            <Bar key="bar-urinalysis" dataKey="Urinalysis" fill="#10b981" radius={[8, 8, 0, 0]} />
            <Bar key="bar-fecalysis" dataKey="Fecalysis" fill="#f59e0b" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function getMonthIndex(monthName: string): number {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months.indexOf(monthName);
}

function getMonthName(index: number): string {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  return months[index];
}
