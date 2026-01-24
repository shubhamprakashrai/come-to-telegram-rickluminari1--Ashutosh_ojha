import React, { useState, useEffect } from 'react';
import { Palette, Check } from 'lucide-react';

interface Theme {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  file: string;
}

const themes: Theme[] = [
  {
    id: 'original',
    name: 'Original Amber',
    description: 'Classic amber and slate theme',
    colors: {
      primary: '#0f172a',
      secondary: '#1e293b',
      accent: '#f59e0b'
    },
    file: ''
  },
  {
    id: 'blue-corporate',
    name: 'Blue Corporate',
    description: 'Modern blue with subtle animations',
    colors: {
      primary: '#0f172a',
      secondary: '#1e293b',
      accent: '#2563eb'
    },
    file: '/src/themes/blue-corporate.css'
  },
  {
    id: 'gold-elegant',
    name: 'Gold Elegant',
    description: 'Luxurious gold with sophisticated animations',
    colors: {
      primary: '#0c0a09',
      secondary: '#1c1917',
      accent: '#d4af37'
    },
    file: '/src/themes/gold-elegant.css'
  },
  {
    id: 'emerald-modern',
    name: 'Emerald Modern',
    description: 'Vibrant green with dynamic animations',
    colors: {
      primary: '#064e3b',
      secondary: '#065f46',
      accent: '#10b981'
    },
    file: '/src/themes/emerald-modern.css'
  },
  {
    id: 'purple-minimal',
    name: 'Purple Minimal',
    description: 'Clean purple with smooth micro-animations',
    colors: {
      primary: '#1e1b4b',
      secondary: '#312e81',
      accent: '#8b5cf6'
    },
    file: '/src/themes/purple-minimal.css'
  },
  {
    id: 'sunset-warm',
    name: 'Sunset Warm',
    description: 'Cozy sunset colors with fluid motion',
    colors: {
      primary: '#1c1917',
      secondary: '#292524',
      accent: '#f97316'
    },
    file: '/src/themes/sunset-warm.css'
  }
];

const ThemeManager: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<string>('original');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && themes.find(t => t.id === savedTheme)) {
      applyTheme(savedTheme);
      setCurrentTheme(savedTheme);
    }
  }, []);

  const applyTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (!theme) return;

    // Remove all existing theme classes from body
    document.body.className = document.body.className
      .split(' ')
      .filter(cls => !cls.startsWith('theme-'))
      .join(' ');

    // Apply new theme class
    if (themeId !== 'original') {
      document.body.classList.add(`theme-${themeId}`);
    }

    // Save to localStorage
    localStorage.setItem('theme', themeId);
    setCurrentTheme(themeId);
  };

  const handleThemeChange = (themeId: string) => {
    applyTheme(themeId);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Theme Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-slate-900 hover:bg-slate-800 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        title="Change Theme"
      >
        <Palette className="w-6 h-6" />
      </button>

      {/* Theme Selector Panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 min-w-[320px] animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Choose Theme</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleThemeChange(theme.id)}
                className={`relative p-3 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                  currentTheme === theme.id
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {/* Color Preview */}
                <div className="flex space-x-1 mb-2">
                  <div
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: theme.colors.primary }}
                  ></div>
                  <div
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: theme.colors.secondary }}
                  ></div>
                  <div
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: theme.colors.accent }}
                  ></div>
                </div>

                <div className="text-left">
                  <div className="font-medium text-slate-900 text-sm">{theme.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{theme.description}</div>
                </div>

                {currentTheme === theme.id && (
                  <div className="absolute top-2 right-2 bg-amber-500 text-white rounded-full p-1">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Themes include custom animations and color schemes
            </p>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default ThemeManager;