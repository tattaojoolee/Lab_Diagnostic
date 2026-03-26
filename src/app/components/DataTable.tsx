import { TestData } from '../App';
import { Trash2 } from 'lucide-react';

interface DataTableProps {
  data: TestData[];
  onDelete: (id: string) => void;
}

export function DataTable({ data, onDelete }: DataTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600">
        <h2 className="text-xl font-bold text-white">Historical Data</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Month/Year</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Total Tests</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">CBC</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Urinalysis</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Fecalysis</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No data available. Click "Add New Data" to get started.
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {row.month} {row.year}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">
                    {row.totalTests.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 text-right">
                    {row.cbc.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 text-right">
                    {row.urinalysis.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 text-right">
                    {row.fecalysis.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => onDelete(row.id)}
                      className="text-red-600 hover:text-red-800 transition-colors p-2 hover:bg-red-50 rounded-lg"
                      title="Delete record"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
