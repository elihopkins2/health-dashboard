import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Activity, Heart, Moon, TrendingUp, DollarSign, Clock, Plus, X } from 'lucide-react';

const HealthROITracker = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [investments, setInvestments] = useState([
    { id: 1, name: 'Gym Membership', cost: 50, timePerWeek: 4, category: 'Exercise', active: true },
    { id: 2, name: 'Therapy', cost: 120, timePerWeek: 1, category: 'Mental Health', active: true },
    { id: 3, name: 'Meal Prep Service', cost: 80, timePerWeek: 0, category: 'Nutrition', active: true }
  ]);
  const [showAddInvestment, setShowAddInvestment] = useState(false);

  // Mock health data over 30 days
  const healthData = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    sleep: 6.5 + Math.random() * 1.5 + (i * 0.02),
    activity: 4000 + Math.random() * 3000 + (i * 50),
    hrv: 45 + Math.random() * 15 + (i * 0.3),
    stress: 7 - (i * 0.05) + Math.random() * 2,
    energy: 5 + (i * 0.08) + Math.random() * 2
  }));

  // Calculate current metrics (last 7 days average)
  const recentData = healthData.slice(-7);
  const avgSleep = (recentData.reduce((sum, d) => sum + d.sleep, 0) / 7).toFixed(1);
  const avgActivity = Math.round(recentData.reduce((sum, d) => sum + d.activity, 0) / 7);
  const avgHRV = Math.round(recentData.reduce((sum, d) => sum + d.hrv, 0) / 7);
  const avgStress = (recentData.reduce((sum, d) => sum + d.stress, 0) / 7).toFixed(1);

  // Calculate health score (0-100)
  const healthScore = Math.round(
    (avgSleep / 8) * 25 +
    (avgActivity / 10000) * 25 +
    (avgHRV / 70) * 25 +
    ((10 - avgStress) / 10) * 25
  );

  // ROI calculations
  const totalMonthlyCost = investments.reduce((sum, inv) => sum + (inv.active ? inv.cost : 0), 0);
  const totalWeeklyTime = investments.reduce((sum, inv) => sum + (inv.active ? inv.timePerWeek : 0), 0);

  const roiMetrics = [
    { metric: 'Sleep Quality', baseline: 6.5, current: parseFloat(avgSleep), unit: 'hrs', improvement: ((parseFloat(avgSleep) - 6.5) / 6.5 * 100).toFixed(0) },
    { metric: 'Daily Activity', baseline: 5000, current: avgActivity, unit: 'steps', improvement: ((avgActivity - 5000) / 5000 * 100).toFixed(0) },
    { metric: 'Heart Rate Variability', baseline: 50, current: avgHRV, unit: 'ms', improvement: ((avgHRV - 50) / 50 * 100).toFixed(0) },
    { metric: 'Stress Level', baseline: 7, current: parseFloat(avgStress), unit: '/10', improvement: ((7 - parseFloat(avgStress)) / 7 * 100).toFixed(0) }
  ];

  const radarData = [
    { category: 'Sleep', value: (parseFloat(avgSleep) / 8) * 100 },
    { category: 'Activity', value: (avgActivity / 10000) * 100 },
    { category: 'Recovery', value: (avgHRV / 70) * 100 },
    { category: 'Energy', value: (recentData.reduce((sum, d) => sum + d.energy, 0) / 7 / 10) * 100 },
    { category: 'Mental Health', value: ((10 - avgStress) / 10) * 100 }
  ];

  const MetricCard = ({ icon: Icon, title, value, subtitle, trend }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <Icon className="text-blue-500" size={24} />
        {trend && (
          <span className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <h3 className="text-gray-600 text-sm mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Health ROI Tracker</h1>
              <p className="text-sm text-gray-600 mt-1">Manage your health like you manage your finances</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right mr-4">
                <p className="text-xs text-gray-500">Health Score</p>
                <p className="text-3xl font-bold text-blue-600">{healthScore}</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                {healthScore}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            {['dashboard', 'investments', 'trends', 'insights'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <MetricCard
                icon={Moon}
                title="Avg Sleep"
                value={`${avgSleep} hrs`}
                subtitle="Last 7 days"
                trend={Math.round(((parseFloat(avgSleep) - 6.5) / 6.5) * 100)}
              />
              <MetricCard
                icon={Activity}
                title="Daily Steps"
                value={avgActivity.toLocaleString()}
                subtitle="7-day average"
                trend={Math.round(((avgActivity - 5000) / 5000) * 100)}
              />
              <MetricCard
                icon={Heart}
                title="HRV"
                value={`${avgHRV} ms`}
                subtitle="Recovery metric"
                trend={Math.round(((avgHRV - 50) / 50) * 100)}
              />
              <MetricCard
                icon={TrendingUp}
                title="Stress Level"
                value={`${avgStress}/10`}
                subtitle="Lower is better"
                trend={Math.round(((7 - parseFloat(avgStress)) / 7) * 100)}
              />
            </div>

            {/* Health Overview Radar */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Health Overview</h2>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar name="Current" dataKey="value" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* 30-Day Trends */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">30-Day Health Trends</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={healthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sleep" stroke="#8B5CF6" name="Sleep (hrs)" />
                  <Line type="monotone" dataKey="energy" stroke="#10B981" name="Energy (/10)" />
                  <Line type="monotone" dataKey="stress" stroke="#EF4444" name="Stress (/10)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'investments' && (
          <div className="space-y-6">
            {/* Investment Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <DollarSign className="text-green-500 mb-2" size={24} />
                <h3 className="text-gray-600 text-sm mb-1">Monthly Investment</h3>
                <p className="text-2xl font-bold text-gray-900">${totalMonthlyCost}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <Clock className="text-blue-500 mb-2" size={24} />
                <h3 className="text-gray-600 text-sm mb-1">Weekly Time</h3>
                <p className="text-2xl font-bold text-gray-900">{totalWeeklyTime} hrs</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <TrendingUp className="text-purple-500 mb-2" size={24} />
                <h3 className="text-gray-600 text-sm mb-1">Health Score Gain</h3>
                <p className="text-2xl font-bold text-gray-900">+{healthScore - 65}</p>
              </div>
            </div>

            {/* Investment List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Your Health Investments</h2>
                <button
                  onClick={() => setShowAddInvestment(!showAddInvestment)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={20} />
                  Add Investment
                </button>
              </div>
              
              <div className="p-6">
                <div className="space-y-3">
                  {investments.map(inv => (
                    <div key={inv.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{inv.name}</h3>
                        <p className="text-sm text-gray-500">{inv.category}</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Cost</p>
                          <p className="font-medium text-gray-900">${inv.cost}/mo</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Time</p>
                          <p className="font-medium text-gray-900">{inv.timePerWeek}h/wk</p>
                        </div>
                        <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                          <X size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity Trends</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={healthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="activity" stroke="#3B82F6" name="Steps" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recovery Metrics</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={healthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="hrv" stroke="#10B981" name="HRV (ms)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-6">
            {/* ROI Summary */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-2">Your Health ROI</h2>
              <p className="text-blue-100 mb-6">Here's how your investments are paying off</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-blue-200 text-sm">Monthly Investment</p>
                  <p className="text-3xl font-bold">${totalMonthlyCost}</p>
                </div>
                <div>
                  <p className="text-blue-200 text-sm">Health Score Improvement</p>
                  <p className="text-3xl font-bold">+{healthScore - 65} points</p>
                </div>
              </div>
            </div>

            {/* ROI Breakdown */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Metric Improvements</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {roiMetrics.map((metric, idx) => (
                    <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{metric.metric}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          parseFloat(metric.improvement) > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {metric.improvement > 0 ? '+' : ''}{metric.improvement}%
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div>
                          <span className="text-gray-500">Baseline:</span> {metric.baseline} {metric.unit}
                        </div>
                        <div>→</div>
                        <div>
                          <span className="text-gray-500">Current:</span> {metric.current} {metric.unit}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Key Insights */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h2>
              <div className="space-y-3">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    <span className="font-semibold">Great progress!</span> Your sleep quality has improved by {Math.round(((parseFloat(avgSleep) - 6.5) / 6.5) * 100)}% since starting your health investments.
                  </p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">Activity trending up:</span> You're averaging {avgActivity.toLocaleString()} steps per day, which is above the baseline of 5,000 steps.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="text-sm text-purple-800">
                    <span className="font-semibold">Recovery improving:</span> Your HRV has increased by {Math.round(((avgHRV - 50) / 50) * 100)}%, indicating better stress management and recovery.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HealthROITracker;
