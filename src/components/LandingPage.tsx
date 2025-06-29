import React from 'react';
import { Heart, Shield, Clock, Users, ArrowRight, CheckCircle, Star, Activity } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  darkMode: boolean;
}

export default function LandingPage({ onGetStarted, darkMode }: LandingPageProps) {
  return (
    <div className={`min-h-screen ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <p className={`text-sm font-medium tracking-wide uppercase ${
                  darkMode ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  MEDICAL CARE SIMPLIFIED
                </p>
                <h1 className={`text-5xl lg:text-6xl font-light leading-tight ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Your health,
                  <br />
                  <span className="font-normal">simplified.</span>
                </h1>
              </div>
              
              <p className={`text-xl leading-relaxed max-w-lg ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Professional medication management designed for clarity, 
                safety, and peace of mind.
              </p>
              
              <button
                onClick={onGetStarted}
                className={`inline-flex items-center px-8 py-4 rounded-lg font-medium text-lg transition-all duration-200 ${
                  darkMode 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                <Activity className="w-5 h-5 mr-2" />
                Start Managing
              </button>
            </div>
            
            <div className="relative">
              <div className={`relative rounded-2xl overflow-hidden ${
                darkMode ? 'bg-gray-800 shadow-2xl' : 'bg-white shadow-2xl'
              }`}>
                <img 
                  src="https://images.pexels.com/photos/3786126/pexels-photo-3786126.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  alt="Professional medication management"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                
                {/* Clean floating badges */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg text-sm font-medium text-gray-700 shadow-sm">
                  Reliable
                </div>
                <div className="absolute left-4 top-1/2 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg text-sm font-medium text-gray-700 shadow-sm">
                  Safe
                </div>
                <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg text-sm font-medium text-gray-700 shadow-sm">
                  Simple
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className={`py-20 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className={`text-sm font-medium tracking-wide uppercase mb-4 ${
              darkMode ? 'text-blue-400' : 'text-blue-600'
            }`}>
              TRUSTED MEDICAL MANAGEMENT
            </p>
            <h2 className={`text-4xl font-light ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Everything you need for medication safety
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className={`p-8 rounded-2xl ${
              darkMode ? 'bg-gray-700 shadow-xl' : 'bg-gray-50 shadow-lg'
            }`}>
              <div className={`w-12 h-12 rounded-xl ${
                darkMode ? 'bg-blue-600' : 'bg-blue-100'
              } flex items-center justify-center mb-6`}>
                <Clock className={`w-6 h-6 ${
                  darkMode ? 'text-white' : 'text-blue-600'
                }`} />
              </div>
              <h3 className={`text-xl font-medium mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Smart Scheduling
              </h3>
              <p className={`text-base leading-relaxed ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Intelligent reminders that adapt to your routine, ensuring you never miss a dose.
              </p>
            </div>
            
            <div className={`p-8 rounded-2xl ${
              darkMode ? 'bg-gray-700 shadow-xl' : 'bg-gray-50 shadow-lg'
            }`}>
              <div className={`w-12 h-12 rounded-xl ${
                darkMode ? 'bg-green-600' : 'bg-green-100'
              } flex items-center justify-center mb-6`}>
                <Shield className={`w-6 h-6 ${
                  darkMode ? 'text-white' : 'text-green-600'
                }`} />
              </div>
              <h3 className={`text-xl font-medium mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Safety First
              </h3>
              <p className={`text-base leading-relaxed ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Priority-based alerts and comprehensive tracking for complete medication safety.
              </p>
            </div>
            
            <div className={`p-8 rounded-2xl ${
              darkMode ? 'bg-gray-700 shadow-xl' : 'bg-gray-50 shadow-lg'
            }`}>
              <div className={`w-12 h-12 rounded-xl ${
                darkMode ? 'bg-purple-600' : 'bg-purple-100'
              } flex items-center justify-center mb-6`}>
                <Users className={`w-6 h-6 ${
                  darkMode ? 'text-white' : 'text-purple-600'
                }`} />
              </div>
              <h3 className={`text-xl font-medium mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Family Care
              </h3>
              <p className={`text-base leading-relaxed ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Manage medications for multiple family members with dedicated profiles.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className={`py-20 ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
              <p className={`text-5xl font-light ${
                darkMode ? 'text-blue-400' : 'text-blue-600'
              }`}>
                99%
              </p>
              <p className={`text-lg ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Medication adherence rate<br />with our system
              </p>
            </div>
            
            <div className="space-y-4">
              <p className={`text-5xl font-light ${
                darkMode ? 'text-green-400' : 'text-green-600'
              }`}>
                24/7
              </p>
              <p className={`text-lg ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Continuous monitoring<br />and support
              </p>
            </div>
            
            <div className="space-y-4">
              <p className={`text-5xl font-light ${
                darkMode ? 'text-purple-400' : 'text-purple-600'
              }`}>
                Safe
              </p>
              <p className={`text-lg ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                HIPAA compliant<br />data protection
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className={`py-20 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className={`text-4xl font-light mb-6 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Ready to simplify your medication management?
          </h2>
          <p className={`text-xl mb-8 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Join thousands who trust us with their health
          </p>
          <button
            onClick={onGetStarted}
            className={`inline-flex items-center px-8 py-4 rounded-lg font-medium text-lg transition-all duration-200 ${
              darkMode 
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl' 
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            <Heart className="w-5 h-5 mr-2" />
            Get Started Today
          </button>
        </div>
      </div>
    </div>
  );
}