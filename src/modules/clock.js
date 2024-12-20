export function initClock() {
  const clockElement = document.getElementById('clock');
  
  function updateClock() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString();
    const dateStr = now.toLocaleDateString();
    clockElement.textContent = `${timeStr} - ${dateStr}`;
  }
  
  updateClock();
  setInterval(updateClock, 1000);
}
