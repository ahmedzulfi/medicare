import React from 'react';
import { ArrowRight, Shield, Clock, Users, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

interface LandingPageProps {
  onGetStarted: () => void;
  darkMode: boolean;
}

export default function LandingPage({ onGetStarted, darkMode }: LandingPageProps) {
  return (
    <div className={`min-h-screen ${
      darkMode ? 'bg-gray-900' : 'bg-white'
    }`}>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 py-20 lg:py-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-8"
          >
            {/* Logo */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center justify-center space-x-3 mb-12"
            >
              <div className="p-3 rounded-2xl bg-blue-500/10 backdrop-blur-sm">
                <Activity className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className={`text-2xl font-light ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                MedTracker
              </h1>
            </motion.div>

            {/* Main Headline */}
            <div className="space-y-6">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={`text-5xl lg:text-7xl font-extralight leading-tight ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                Never miss
                <br />
                <span className="font-light bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  a dose
                </span>
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className={`text-xl lg:text-2xl font-light max-w-2xl mx-auto leading-relaxed ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                Simple, intelligent medication management for you and your family
              </motion.p>
            </div>
            
            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-8"
            >
              <button
                onClick={onGetStarted}
                className="group inline-flex items-center space-x-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className={`py-20 ${
        darkMode ? 'bg-gray-800/50' : 'bg-gray-50/50'
      }`}>
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className={`text-3xl lg:text-4xl font-light mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Everything you need
            </h3>
            <p className={`text-lg font-light ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Designed for simplicity, built for reliability
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                icon: Clock,
                title: 'Smart Reminders',
                description: 'Never miss a dose with intelligent notifications that adapt to your routine'
              },
              {
                icon: Shield,
                title: 'Safe & Secure',
                description: 'Your health data is protected with enterprise-grade security and privacy'
              },
              {
                icon: Users,
                title: 'Family Care',
                description: 'Manage medications for your entire family from one simple dashboard'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`text-center p-8 rounded-2xl ${
                  darkMode ? 'bg-white/5' : 'bg-white/60'
                } backdrop-blur-sm border ${
                  darkMode ? 'border-white/10' : 'border-gray-200/20'
                } hover:scale-105 transition-transform duration-300`}
              >
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center ${
                  darkMode ? 'bg-blue-500/20' : 'bg-blue-100'
                }`}>
                  <feature.icon className={`w-8 h-8 ${
                    darkMode ? 'text-blue-400' : 'text-blue-600'
                  }`} />
                </div>
                <h4 className={`text-xl font-medium mb-4 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {feature.title}
                </h4>
                <p className={`font-light leading-relaxed ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className={`py-20 ${
        darkMode ? 'bg-gray-900' : 'bg-white'
      }`}>
        <div className="max-w-4xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-12 text-center"
          >
            {[
              { number: '99%', label: 'Adherence Rate' },
              { number: '24/7', label: 'Monitoring' },
              { number: '100%', label: 'Secure' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="space-y-2"
              >
                <p className={`text-5xl lg:text-6xl font-extralight ${
                  darkMode ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  {stat.number}
                </p>
                <p className={`text-lg font-light ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Final CTA */}
      <div className={`py-20 ${
        darkMode ? 'bg-gray-800/50' : 'bg-gray-50/50'
      }`}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h3 className={`text-4xl lg:text-5xl font-light ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Ready to get started?
            </h3>
            <p className={`text-xl font-light ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Join thousands who trust MedTracker with their health
            </p>
            <button
              onClick={onGetStarted}
              className="group inline-flex items-center space-x-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <span>Start Free Today</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className={`py-8 border-t ${
        darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'
      }`}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className={`text-sm font-light ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            © 2025 MedTracker. Designed for your health and peace of mind.
          </p>
        </div>
      </footer>
    </div>
  );
}