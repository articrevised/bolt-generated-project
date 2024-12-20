import { saveState, loadState } from './storage.js';

export function initNotes(initialNotes) {
  const textarea = document.querySelector('#notes textarea');
  textarea.value = initialNotes;
  
  textarea.addEventListener('input', () => {
    const state = loadState();
    state.notes = textarea.value;
    saveState(state);
  });
}
