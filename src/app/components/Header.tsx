import { FlaskConical, Building2 } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4">
          <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
            <FlaskConical size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Laboratory Diagnostic Forecasting System</h1>
            <div className="flex items-center gap-2 mt-1 text-blue-100">
              <Building2 size={16} />
              <p className="text-sm">MamatayHealthyLab Diagnostics Center</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
