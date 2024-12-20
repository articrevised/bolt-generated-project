const STORAGE_KEY = 'homepage_state';

const defaultState = {
  bookmarks: {
    categories: []
  },
  notes: '',
  settings: {
    accent: 'blue',
    visibleWidgets: ['bookmarks', 'notes', 'clock']
  }
};

export function loadState() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : defaultState;
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
