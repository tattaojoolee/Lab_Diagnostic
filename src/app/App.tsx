import { useState } from 'react';
import { DataInput } from './components/DataInput';
import { Dashboard } from './components/Dashboard';
import { Header } from './components/Header';
import { Activity } from 'lucide-react';

export interface TestData {
  id: string;
  month: string;
  year: number;
  totalTests: number;
  cbc: number;
  urinalysis: number;
  fecalysis: number;
}

export default function App() {
  const [historicalData, setHistoricalData] = useState<TestData[]>([
    {
      id: '1',
      month: 'January',
      year: 2023,
      totalTests: 1300,
      cbc: 800,
      urinalysis: 200,
      fecalysis: 300,
    },
    {
      id: '2',
      month: 'February',
      year: 2023,
      totalTests: 1500,
      cbc: 1000,
      urinalysis: 300,
      fecalysis: 200,
    },
  ]);

  const [activeView, setActiveView] = useState<'dashboard' | 'input'>('dashboard');

  const addData = (data: Omit<TestData, 'id'>) => {
    const newData: TestData = {
      ...data,
      id: Date.now().toString(),
    };
    setHistoricalData([...historicalData, newData]);
    setActiveView('dashboard');
  };

  const deleteData = (id: string) => {
    setHistoricalData(historicalData.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8 flex gap-4 justify-center">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeView === 'dashboard'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <Activity size={20} />
              Dashboard
            </div>
          </button>
          <button
            onClick={() => setActiveView('input')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeView === 'input'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Add New Data
          </button>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          {activeView === 'dashboard' ? (
            <Dashboard data={historicalData} onDeleteData={deleteData} />
          ) : (
            <DataInput onSubmit={addData} onCancel={() => setActiveView('dashboard')} />
          )}
        </div>
      </div>
    </div>
  );
}
