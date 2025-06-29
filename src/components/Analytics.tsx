import React from 'react';
import { TrendingUp, Calendar, Star, AlertTriangle, Award, Target, Activity, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Analytics as AnalyticsType } from '../types/medication';

interface AnalyticsProps {
  analytics: AnalyticsType;
  darkMode: boolean;
}

export default function Analytics({ analytics, darkMode }: AnalyticsProps) {
  const getComplianceColor = (rate: number) => {
    if (rate >= 90) return 'text-green-500';
    if (rate >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getComplianceBgColor = (rate: number) => {
    if (rate >= 90) return darkMode ? 'bg-green-500/20' : 'bg-green-100';
    if (rate >= 70) return darkMode ? 'bg-yellow-500/20' : 'bg-yellow-100';
    return darkMode ? 'bg-red-500/20' : 'bg-red-100';
  };

  const getStreakColor = (days: number) => {
    if (days >= 30) return 'text-purple-500';
    if (days >= 14) return 'text-blue-500';
    if (days >= 7) return 'text-green-500';
    return 'text-gray-500';
  };

  const getStreakBgColor = (days: number) => {
    if (days >= 30) return darkMode ? 'bg-purple-500/20' : 'bg-purple-100';
    if (days >= 14) return darkMode ? 'bg-blue-500/20' : 'bg-blue-100';
    if (days >= 7) return darkMode ? 'bg-green-500/20' : 'bg-green-100';
    return darkMode ? 'bg-gray-500/20' : 'bg-gray-100';
  };

  // Calculate weekly averages for better visualization
  const getWeeklyData = () => {
    const weeks = [];
    const trends = analytics.medicationTrends;
    
    for (let i = 0; i < trends.length; i += 7) {
      const weekData = trends.slice(i, i + 7);
      const totalTaken = weekData.reduce((sum, day) => sum + day.taken, 0);
      const totalScheduled = weekData.reduce((sum, day) => sum + day.total, 0);
      const weekCompliance = totalScheduled > 0 ? Math.round((totalTaken / totalScheduled) * 100) : 0;
      
      weeks.push({
        week: Math.floor(i / 7) + 1,
        compliance: weekCompliance,
        taken: totalTaken,
        total: totalScheduled,
        startDate: weekData[0]?.date || '',
        endDate: weekData[weekData.length - 1]?.date || ''
      });
    }
    
    return weeks.reverse(); // Most recent first
  };

  const weeklyData = getWeeklyData();

  return (
    <div className="space-y-8">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Compliance Rate */}
        <div className={`p-6 rounded-xl backdrop-blur-sm border ${
          darkMode ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/20'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-3xl font-light mb-2 ${getComplianceColor(analytics.complianceRate)}`}>
                {analytics.complianceRate}%
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Overall Compliance
              </p>
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {analytics.totalDosesTaken} of {analytics.totalDosesTaken + analytics.totalDosesMissed} doses
              </p>
            </div>
            <div className={`p-3 rounded-lg ${getComplianceBgColor(analytics.complianceRate)}`}>
              <Target className={`w-6 h-6 ${getComplianceColor(analytics.complianceRate)}`} />
            </div>
          </div>
        </div>

        {/* Streak Days */}
        <div className={`p-6 rounded-xl backdrop-blur-sm border ${
          darkMode ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/20'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-3xl font-light mb-2 ${getStreakColor(analytics.streakDays)}`}>
                {analytics.streakDays}
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Day Streak
              </p>
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {analytics.streakDays >= 30 ? 'Excellent!' : analytics.streakDays >= 7 ? 'Great job!' : 'Keep going!'}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${getStreakBgColor(analytics.streakDays)}`}>
              <Award className={`w-6 h-6 ${getStreakColor(analytics.streakDays)}`} />
            </div>
          </div>
        </div>

        {/* Total Doses Taken */}
        <div className={`p-6 rounded-xl backdrop-blur-sm border ${
          darkMode ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/20'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-3xl font-light mb-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {analytics.totalDosesTaken}
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Doses Completed
              </p>
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {analytics.totalDosesMissed} missed
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-500/10">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Average Effectiveness */}
        <div className={`p-6 rounded-xl backdrop-blur-sm border ${
          darkMode ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/20'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-3xl font-light mb-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {analytics.averageEffectiveness || 'N/A'}
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Avg Effectiveness
              </p>
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {analytics.averageEffectiveness ? 'out of 5.0' : 'No ratings yet'}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-500/10">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Compliance Trend */}
        <div className={`p-6 rounded-xl backdrop-blur-sm border ${
          darkMode ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/20'
        }`}>
          <div className="flex items-center space-x-3 mb-6">
            <TrendingUp className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <h3 className={`text-xl font-semibold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              30-Day Daily Trend
            </h3>
          </div>

          <div className="space-y-4">
            {/* Chart */}
            <div className="h-64 flex items-end justify-between space-x-1">
              {analytics.medicationTrends.slice(-30).map((trend, index) => {
                const maxTotal = Math.max(...analytics.medicationTrends.map(t => t.total), 1);
                const height = trend.total > 0 ? Math.max((trend.total / maxTotal) * 100, 5) : 5;
                const takenHeight = trend.total > 0 ? (trend.taken / trend.total) * height : 0;
                const missedHeight = height - takenHeight;
                const compliance = trend.total > 0 ? Math.round((trend.taken / trend.total) * 100) : 0;
                
                return (
                  <div key={index} className="flex-1 flex flex-col justify-end group relative">
                    {/* Tooltip */}
                    <div className={`absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity z-10 ${
                      darkMode ? 'bg-gray-800 text-white' : 'bg-gray-900 text-white'
                    }`}>
                      <div className="text-center">
                        <div>{new Date(trend.date).toLocaleDateString()}</div>
                        <div>{compliance}% compliance</div>
                        <div>{trend.taken}/{trend.total} doses</div>
                      </div>
                    </div>
                    
                    {/* Taken doses (green) */}
                    <div 
                      className="w-full bg-green-500 rounded-t transition-all duration-300 hover:bg-green-400"
                      style={{ height: `${takenHeight}%`, minHeight: takenHeight > 0 ? '2px' : '0px' }}
                      title={`${trend.taken} taken`}
                    />
                    
                    {/* Missed doses (red) */}
                    <div 
                      className={`w-full transition-all duration-300 ${
                        takenHeight === 0 ? 'rounded-t' : ''
                      } ${trend.missed > 0 ? 'bg-red-500 hover:bg-red-400' : 'bg-gray-300'}`}
                      style={{ height: `${missedHeight}%`, minHeight: missedHeight > 0 ? '2px' : '0px' }}
                      title={`${trend.missed} missed`}
                    />
                    
                    {/* Date label */}
                    <div className={`text-xs text-center mt-2 transform -rotate-45 origin-top ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {new Date(trend.date).getDate()}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Taken
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Missed
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Compliance Overview */}
        <div className={`p-6 rounded-xl backdrop-blur-sm border ${
          darkMode ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/20'
        }`}>
          <div className="flex items-center space-x-3 mb-6">
            <Calendar className={`w-6 h-6 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            <h3 className={`text-xl font-semibold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Weekly Compliance
            </h3>
          </div>

          <div className="space-y-4">
            {weeklyData.slice(0, 4).map((week, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Week {week.week}
                  </span>
                  <span className={`text-sm font-bold ${getComplianceColor(week.compliance)}`}>
                    {week.compliance}%
                  </span>
                </div>
                
                <div className={`w-full h-3 rounded-full ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      week.compliance >= 90 ? 'bg-green-500' :
                      week.compliance >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${week.compliance}%` }}
                  />
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                    {new Date(week.startDate).toLocaleDateString()} - {new Date(week.endDate).toLocaleDateString()}
                  </span>
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                    {week.taken}/{week.total} doses
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Side Effects Analysis */}
      {analytics.commonSideEffects.length > 0 && (
        <div className={`p-6 rounded-xl backdrop-blur-sm border ${
          darkMode ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/20'
        }`}>
          <div className="flex items-center space-x-3 mb-6">
            <AlertTriangle className={`w-6 h-6 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
            <h3 className={`text-xl font-semibold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Most Common Side Effects
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {analytics.commonSideEffects.map((effect, index) => (
              <div
                key={index}
                className={`px-4 py-3 rounded-lg border ${
                  darkMode 
                    ? 'bg-red-500/10 border-red-400/30 text-red-300' 
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-medium">{effect}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insights & Recommendations */}
      <div className={`p-6 rounded-xl backdrop-blur-sm border ${
        darkMode ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/20'
      }`}>
        <div className="flex items-center space-x-3 mb-6">
          <Activity className={`w-6 h-6 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
          <h3 className={`text-xl font-semibold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Insights & Recommendations
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Positive Insights */}
          {analytics.complianceRate >= 95 && (
            <div className={`p-4 rounded-lg ${
              darkMode ? 'bg-green-500/20 border border-green-400/30' : 'bg-green-100 border border-green-200'
            }`}>
              <div className="flex items-start space-x-3">
                <CheckCircle className={`w-5 h-5 mt-0.5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                <div>
                  <p className={`font-medium ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
                    Excellent Compliance!
                  </p>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                    You're maintaining a {analytics.complianceRate}% adherence rate. Keep up the great work!
                  </p>
                </div>
              </div>
            </div>
          )}

          {analytics.streakDays >= 14 && (
            <div className={`p-4 rounded-lg ${
              darkMode ? 'bg-blue-500/20 border border-blue-400/30' : 'bg-blue-100 border border-blue-200'
            }`}>
              <div className="flex items-start space-x-3">
                <Award className={`w-5 h-5 mt-0.5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <div>
                  <p className={`font-medium ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                    Amazing Streak!
                  </p>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    You've been consistent for {analytics.streakDays} days. You're building excellent habits!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Areas for Improvement */}
          {analytics.complianceRate < 70 && (
            <div className={`p-4 rounded-lg ${
              darkMode ? 'bg-red-500/20 border border-red-400/30' : 'bg-red-100 border border-red-200'
            }`}>
              <div className="flex items-start space-x-3">
                <XCircle className={`w-5 h-5 mt-0.5 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                <div>
                  <p className={`font-medium ${darkMode ? 'text-red-300' : 'text-red-700'}`}>
                    Compliance Needs Attention
                  </p>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                    Your compliance rate is {analytics.complianceRate}%. Consider setting more reminders or speaking with your doctor.
                  </p>
                </div>
              </div>
            </div>
          )}

          {analytics.averageEffectiveness && analytics.averageEffectiveness < 3 && (
            <div className={`p-4 rounded-lg ${
              darkMode ? 'bg-yellow-500/20 border border-yellow-400/30' : 'bg-yellow-100 border border-yellow-200'
            }`}>
              <div className="flex items-start space-x-3">
                <Star className={`w-5 h-5 mt-0.5 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                <div>
                  <p className={`font-medium ${darkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
                    Low Effectiveness Ratings
                  </p>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                    Your average medication effectiveness is {analytics.averageEffectiveness}/5. Consider discussing with your doctor about adjusting dosages.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* General Tips */}
          <div className={`p-4 rounded-lg ${
            darkMode ? 'bg-purple-500/20 border border-purple-400/30' : 'bg-purple-100 border border-purple-200'
          }`}>
            <div className="flex items-start space-x-3">
              <Clock className={`w-5 h-5 mt-0.5 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              <div>
                <p className={`font-medium ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                  Consistency Tip
                </p>
                <p className={`text-sm mt-1 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                  Taking medications at the same time each day helps build routine and improves adherence.
                </p>
              </div>
            </div>
          </div>

          {analytics.commonSideEffects.length > 0 && (
            <div className={`p-4 rounded-lg ${
              darkMode ? 'bg-orange-500/20 border border-orange-400/30' : 'bg-orange-100 border border-orange-200'
            }`}>
              <div className="flex items-start space-x-3">
                <AlertTriangle className={`w-5 h-5 mt-0.5 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                <div>
                  <p className={`font-medium ${darkMode ? 'text-orange-300' : 'text-orange-700'}`}>
                    Monitor Side Effects
                  </p>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                    You've reported {analytics.commonSideEffects.length} different side effects. Keep tracking and discuss with your doctor.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary Statistics */}
      <div className={`p-6 rounded-xl backdrop-blur-sm border ${
        darkMode ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/20'
      }`}>
        <h3 className={`text-xl font-semibold mb-4 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Summary Statistics
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className={`text-2xl font-light mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {Math.round((analytics.totalDosesTaken / Math.max(analytics.totalDosesTaken + analytics.totalDosesMissed, 1)) * 100)}%
            </p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Success Rate
            </p>
          </div>
          
          <div className="text-center">
            <p className={`text-2xl font-light mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {analytics.medicationTrends.length}
            </p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Days Tracked
            </p>
          </div>
          
          <div className="text-center">
            <p className={`text-2xl font-light mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {Math.round(analytics.totalDosesTaken / Math.max(analytics.medicationTrends.length, 1) * 10) / 10}
            </p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Avg Daily Doses
            </p>
          </div>
          
          <div className="text-center">
            <p className={`text-2xl font-light mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {analytics.commonSideEffects.length}
            </p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Side Effects
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}