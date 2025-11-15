const themes = {
  light: {
    name: 'Light',
    textColor: '#1e293b',
    bgColor: '#ffffff',
    accentColor: '#2563eb',
    font: 'system'
  },
  dark: {
    name: 'Dark',
    textColor: '#f1f5f9',
    bgColor: '#0f172a',
    accentColor: '#60a5fa',
    font: 'system'
  },
  ocean: {
    name: 'Ocean',
    textColor: '#0c4a6e',
    bgColor: '#e0f2fe',
    accentColor: '#0369a1',
    font: 'system'
  },
  forest: {
    name: 'Forest',
    textColor: '#14532d',
    bgColor: '#f0fdf4',
    accentColor: '#16a34a',
    font: 'system'
  },
  sunset: {
    name: 'Sunset',
    textColor: '#431407',
    bgColor: '#fff7ed',
    accentColor: '#ea580c',
    font: 'system'
  }
};

const fonts = {
  system: 'system-ui, -apple-system, sans-serif',
  serif: 'Georgia, "Times New Roman", serif',
  mono: '"Courier New", monospace'
};

function getCurrentTheme() {
  const saved = localStorage.getItem('customTheme');
  if (saved) {
    return JSON.parse(saved);
  }
  const themeName = localStorage.getItem('theme') || 'light';
  return themes[themeName] || themes.light;
}

function applyTheme(theme) {
  // Portfolio pages variables
  document.documentElement.style.setProperty('--text-color', theme.textColor);
  document.documentElement.style.setProperty('--background-color', theme.bgColor);
  document.documentElement.style.setProperty('--primary-color', theme.accentColor);
  document.documentElement.style.setProperty('--font-family-primary', fonts[theme.font]);
  
  // Calculate derived colors based on background
  const bgColor = theme.bgColor;
  const isLightBg = parseInt(bgColor.slice(1), 16) > 0x7fffff;
  
  // Background fallback (slightly different shade for cards/sections)
  const fallbackBg = isLightBg 
    ? adjustColorBrightness(bgColor, -0.03) 
    : adjustColorBrightness(bgColor, 0.15);
  document.documentElement.style.setProperty('--background-color-fallback', fallbackBg);
  
  // Border color (between background and text color)
  const borderColor = isLightBg 
    ? adjustColorBrightness(bgColor, -0.1) 
    : adjustColorBrightness(bgColor, 0.25);
  document.documentElement.style.setProperty('--border-color', borderColor);
  
  // Text color fallback (slightly muted version)
  const textFallback = isLightBg
    ? adjustColorBrightness(theme.textColor, 0.15)
    : adjustColorBrightness(theme.textColor, -0.1);
  document.documentElement.style.setProperty('--text-color-fallback', textFallback);
  
  // Secondary color (muted version of accent)
  const secondaryColor = isLightBg ? '#64748b' : '#94a3b8';
  document.documentElement.style.setProperty('--secondary-color', secondaryColor);
  
  // Accent color fallback
  const accentFallback = adjustColorBrightness(theme.accentColor, isLightBg ? -0.1 : 0.1);
  document.documentElement.style.setProperty('--accent-color', theme.accentColor);
  document.documentElement.style.setProperty('--primary-color-fallback', accentFallback);
  
  // Form pages variables (form-no-js.html and form-with-js.html)
  document.documentElement.style.setProperty('--bg-color', bgColor);
  document.documentElement.style.setProperty('--container-bg', fallbackBg);
  document.documentElement.style.setProperty('--focus-color', theme.accentColor);
}

function adjustColorBrightness(hex, percent) {
  const num = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + Math.round(255 * percent)));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + Math.round(255 * percent)));
  const b = Math.max(0, Math.min(255, (num & 0x0000FF) + Math.round(255 * percent)));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

const currentTheme = getCurrentTheme();
applyTheme(currentTheme);

document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const themeModal = document.getElementById('theme-modal');
  const closeModal = document.getElementById('close-theme-modal');
  
  if (!themeToggle || !themeModal) return;

  themeToggle.addEventListener('click', () => {
    themeModal.style.display = 'flex';
    loadThemeSettings();
  });

  if (closeModal) {
    closeModal.addEventListener('click', () => {
      themeModal.style.display = 'none';
    });
  }

  themeModal.addEventListener('click', (e) => {
    if (e.target === themeModal) {
      themeModal.style.display = 'none';
    }
  });

  setupThemePicker();
});

function setupThemePicker() {
  const presetButtons = document.querySelectorAll('.preset-theme');
  const textColorPicker = document.getElementById('text-color');
  const bgColorPicker = document.getElementById('bg-color');
  const accentColorPicker = document.getElementById('accent-color');
  const fontPicker = document.getElementById('font-picker');
  const applyBtn = document.getElementById('apply-theme');
  const resetBtn = document.getElementById('reset-theme');

  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const themeName = btn.dataset.theme;
      const theme = themes[themeName];
      applyTheme(theme);
      localStorage.setItem('theme', themeName);
      localStorage.removeItem('customTheme');
      document.getElementById('theme-modal').style.display = 'none';
    });
  });

  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      const customTheme = {
        name: 'Custom',
        textColor: getColorValue(textColorPicker.value),
        bgColor: getColorValue(bgColorPicker.value),
        accentColor: getColorValue(accentColorPicker.value),
        font: fontPicker.value
      };
      
      applyTheme(customTheme);
      localStorage.setItem('customTheme', JSON.stringify(customTheme));
      localStorage.removeItem('theme');
      document.getElementById('theme-modal').style.display = 'none';
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      const lightTheme = themes.light;
      applyTheme(lightTheme);
      localStorage.setItem('theme', 'light');
      localStorage.removeItem('customTheme');
      loadThemeSettings();
    });
  }
}

function loadThemeSettings() {
  const theme = getCurrentTheme();
  const textColorPicker = document.getElementById('text-color');
  const bgColorPicker = document.getElementById('bg-color');
  const accentColorPicker = document.getElementById('accent-color');
  const fontPicker = document.getElementById('font-picker');

  if (textColorPicker) textColorPicker.value = getColorName(theme.textColor);
  if (bgColorPicker) bgColorPicker.value = getColorName(theme.bgColor);
  if (accentColorPicker) accentColorPicker.value = getColorName(theme.accentColor);
  if (fontPicker) fontPicker.value = theme.font;
}

const colorMap = {
  'very-dark': '#0f172a',
  'dark': '#1e293b',
  'medium-dark': '#334155',
  'medium': '#64748b',
  'medium-light': '#94a3b8',
  'light': '#e2e8f0',
  'very-light': '#f1f5f9',
  'white': '#ffffff',
  'blue': '#2563eb',
  'light-blue': '#60a5fa',
  'sky': '#0369a1',
  'light-sky': '#e0f2fe',
  'green': '#16a34a',
  'light-green': '#f0fdf4',
  'forest': '#14532d',
  'orange': '#ea580c',
  'light-orange': '#fff7ed',
  'amber': '#431407'
};

function getColorValue(name) {
  return colorMap[name] || name;
}

function getColorName(hex) {
  for (let [name, value] of Object.entries(colorMap)) {
    if (value.toLowerCase() === hex.toLowerCase()) {
      return name;
    }
  }
  return 'medium';
}

