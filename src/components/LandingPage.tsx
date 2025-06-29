import React, { useState } from 'react';
import { ArrowRight, Shield, Clock, Users, Activity, Menu, X, Star, CheckCircle, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LandingPageProps {
  onGetStarted: () => void;
  darkMode: boolean;
}

export default function LandingPage({ onGetStarted, darkMode }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className={`min-h-screen ${
      darkMode ? 'bg-gray-900' : 'bg-white'
    }`}>
      {/* Header Navigation */}
      <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md ${
        darkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80 border-gray-200'
      } border-b`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-blue-500/10">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <span className={`text-xl font-medium ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                MedTracker
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className={`text-base font-medium transition-colors ${
                darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>
                Features
              </a>
              <a href="#about" className={`text-base font-medium transition-colors ${
                darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>
                About
              </a>
              <a href="#security" className={`text-base font-medium transition-colors ${
                darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>
                Security
              </a>
              <button
                onClick={onGetStarted}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-all duration-200 hover:scale-105"
              >
                Get Started
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`md:hidden border-t ${
                darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'
              }`}
            >
              <div className="px-6 py-4 space-y-4">
                <a href="#features" className={`block text-lg font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Features
                </a>
                <a href="#about" className={`block text-lg font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  About
                </a>
                <a href="#security" className={`block text-lg font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Security
                </a>
                <button
                  onClick={onGetStarted}
                  className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-colors"
                >
                  Get Started
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 ${
            darkMode ? 'bg-blue-500' : 'bg-blue-200'
          } blur-3xl`} />
          <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-10 ${
            darkMode ? 'bg-purple-500' : 'bg-purple-200'
          } blur-3xl`} />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 py-24 lg:py-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-10"
          >
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${
                darkMode ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30' : 'bg-blue-100 text-blue-700 border border-blue-200'
              }`}
            >
              <Star className="w-4 h-4" />
              <span>Trusted by thousands of families</span>
            </motion.div>

            {/* Main Headline */}
            <div className="space-y-8">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={`text-6xl lg:text-8xl font-extralight leading-tight ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                Never miss
                <br />
                <span className="font-light bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                  a dose
                </span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className={`text-2xl lg:text-3xl font-light max-w-3xl mx-auto leading-relaxed ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                Simple, intelligent medication management for you and your family. 
                Stay healthy, stay on track.
              </motion.p>
            </div>
            
            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
            >
              <button
                onClick={onGetStarted}
                className="group inline-flex items-center space-x-3 px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold text-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              
              <button className={`inline-flex items-center space-x-3 px-10 py-5 rounded-full font-semibold text-xl transition-all duration-300 hover:scale-105 ${
                darkMode 
                  ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200'
              }`}>
                <span>Watch Demo</span>
              </button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-8 pt-12"
            >
              {[
                { icon: Shield, text: 'HIPAA Compliant' },
                { icon: CheckCircle, text: '99% Uptime' },
                { icon: Zap, text: 'Instant Sync' }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <item.icon className={`w-5 h-5 ${
                    darkMode ? 'text-green-400' : 'text-green-600'
                  }`} />
                  <span className={`text-lg font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {item.text}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className={`py-24 ${
        darkMode ? 'bg-gray-800/50' : 'bg-gray-50/50'
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className={`text-5xl lg:text-6xl font-light mb-6 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Everything you need
            </h2>
            <p className={`text-2xl font-light max-w-3xl mx-auto ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Designed for simplicity, built for reliability. 
              Your health deserves the best care.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-10 lg:gap-12">
            {[
              {
                icon: Clock,
                title: 'Smart Reminders',
                description: 'Never miss a dose with intelligent notifications that adapt to your routine and lifestyle preferences'
              },
              {
                icon: Shield,
                title: 'Safe & Secure',
                description: 'Your health data is protected with enterprise-grade security, encryption, and complete privacy'
              },
              {
                icon: Users,
                title: 'Family Care',
                description: 'Manage medications for your entire family from one simple, intuitive dashboard interface'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`text-center p-10 rounded-3xl ${
                  darkMode ? 'bg-white/5' : 'bg-white/60'
                } backdrop-blur-sm border ${
                  darkMode ? 'border-white/10' : 'border-gray-200/20'
                } hover:scale-105 transition-all duration-300 hover:shadow-2xl`}
              >
                <div className={`w-20 h-20 mx-auto mb-8 rounded-3xl flex items-center justify-center ${
                  darkMode ? 'bg-blue-500/20' : 'bg-blue-100'
                }`}>
                  <feature.icon className={`w-10 h-10 ${
                    darkMode ? 'text-blue-400' : 'text-blue-600'
                  }`} />
                </div>
                <h3 className={`text-2xl font-semibold mb-6 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {feature.title}
                </h3>
                <p className={`text-lg font-light leading-relaxed ${
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
      <div id="about" className={`py-24 ${
        darkMode ? 'bg-gray-900' : 'bg-white'
      }`}>
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-5xl lg:text-6xl font-light mb-6 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Trusted by families
            </h2>
            <p className={`text-2xl font-light ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Join thousands who rely on MedTracker every day
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12 text-center">
            {[
              { number: '99%', label: 'Medication Adherence Rate', sublabel: 'Industry leading compliance' },
              { number: '24/7', label: 'Continuous Monitoring', sublabel: 'Always watching over you' },
              { number: '100%', label: 'Data Security', sublabel: 'HIPAA compliant protection' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <p className={`text-7xl lg:text-8xl font-extralight ${
                  darkMode ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  {stat.number}
                </p>
                <div>
                  <p className={`text-2xl font-semibold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {stat.label}
                  </p>
                  <p className={`text-lg font-light mt-2 ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {stat.sublabel}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div id="security" className={`py-24 ${
        darkMode ? 'bg-gray-800/50' : 'bg-gray-50/50'
      }`}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <h2 className={`text-5xl lg:text-6xl font-light ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Ready to get started?
            </h2>
            <p className={`text-2xl font-light max-w-2xl mx-auto ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Join thousands who trust MedTracker with their health. 
              Start your journey to better medication management today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onGetStarted}
                className="group inline-flex items-center space-x-3 px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold text-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <span>Start Free Today</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              
              <p className={`text-lg ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                No credit card required
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className={`py-12 border-t ${
        darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'
      }`}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="p-2 rounded-xl bg-blue-500/10">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <span className={`text-xl font-medium ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                MedTracker
              </span>
            </div>
            
            <div className="flex items-center space-x-8">
              <a href="#" className={`text-lg font-medium transition-colors ${
                darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>
                Privacy
              </a>
              <a href="#" className={`text-lg font-medium transition-colors ${
                darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>
                Terms
              </a>
              <a href="#" className={`text-lg font-medium transition-colors ${
                darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>
                Support
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200/20 text-center">
            <p className={`text-lg font-light ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              © 2025 MedTracker. Designed for your health and peace of mind.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}