import { saveState, loadState } from './storage.js';

export function initSettings(settings) {
  const toggleButton = document.getElementById('settings-toggle');
  const closeButton = document.getElementById('close-settings');
  const panel = document.getElementById('settings-panel');
  
  toggleButton.addEventListener('click', () => {
    panel.classList.add('visible');
  });

  closeButton.addEventListener('click', () => {
    panel.classList.remove('visible');
  });
  
  // Close settings when clicking outside
  document.addEventListener('click', (e) => {
    if (panel.classList.contains('visible') &&
        !panel.contains(e.target) &&
        e.target !== toggleButton) {
      panel.classList.remove('visible');
    }
  });
  
  initAccentPicker(settings.accent);
  initWidgetToggles(settings.visibleWidgets);
  initDataControls();
}

// ... rest of the settings.js code remains the same ...
