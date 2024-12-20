import { initClock } from './modules/clock.js';
import { initBookmarks } from './modules/bookmarks.js';
import { initNotes } from './modules/notes.js';
import { initSettings } from './modules/settings.js';
import { initSearch } from './modules/search.js';
import { loadState, saveState } from './modules/storage.js';

document.addEventListener('DOMContentLoaded', () => {
  const state = loadState();
  
  initClock();
  initBookmarks(state.bookmarks);
  initNotes(state.notes);
  initSettings(state.settings);
  initSearch();
});
