import Sortable from 'sortablejs';
import { saveState, loadState } from './storage.js';

export function initBookmarks(bookmarksData) {
  const container = document.getElementById('bookmark-categories');
  
  function getFaviconUrl(url) {
    try {
      const urlObj = new URL(url);
      return `https://icon.horse/icon/${urlObj.hostname}`;
    } catch {
      return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iI2NkZDZmNCI+PHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiByeD0iMiIgZmlsbD0iY3VycmVudENvbG9yIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjwvc3ZnPg==';
    }
  }

  function renderEmptyState() {
    return `
      <div class="empty-state">
        <p>No bookmarks yet</p>
        <button class="add-category-btn">Add Category</button>
      </div>
    `;
  }

  function renderBookmarks() {
    if (!bookmarksData.categories.length) {
      container.innerHTML = renderEmptyState();
      initEmptyStateActions();
      return;
    }

    container.innerHTML = bookmarksData.categories
      .map(category => `
        <div class="bookmark-category" data-category="${category.name}">
          <div class="category-header">
            <h3>${category.name}</h3>
            <button class="add-bookmark" data-category="${category.name}">+</button>
          </div>
          <div class="bookmark-list">
            ${category.items.length === 0 
              ? '<div class="empty-category">No bookmarks in this category</div>'
              : category.items.map(item => `
                  <div class="bookmark-item" data-url="${item.url}">
                    <img class="favicon" src="${getFaviconUrl(item.url)}" alt="" 
                         onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iI2NkZDZmNCI+PHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiByeD0iMiIgZmlsbD0iY3VycmVudENvbG9yIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjwvc3ZnPg=='">
                    <span>${item.title}</span>
                    <div class="bookmark-actions">
                      <button class="edit-bookmark">✏️</button>
                      <button class="delete-bookmark">🗑️</button>
                    </div>
                  </div>
                `).join('')}
          </div>
        </div>
      `).join('');
    
    initDragAndDrop();
    initBookmarkActions();
  }

  function initEmptyStateActions() {
    const addCategoryBtn = container.querySelector('.add-category-btn');
    if (addCategoryBtn) {
      addCategoryBtn.addEventListener('click', addNewCategory);
    }
  }

  function addNewCategory() {
    const categoryName = prompt('Enter category name:');
    if (!categoryName) return;

    bookmarksData.categories.push({
      name: categoryName,
      items: []
    });

    updateBookmarksData();
    renderBookmarks();
  }
  
  function initDragAndDrop() {
    document.querySelectorAll('.bookmark-list').forEach(list => {
      new Sortable(list, {
        group: 'bookmarks',
        animation: 150,
        onEnd: () => {
          updateBookmarksData();
        }
      });
    });
  }

  function initBookmarkActions() {
    // Add new bookmark
    document.querySelectorAll('.add-bookmark').forEach(btn => {
      btn.addEventListener('click', () => {
        const category = btn.dataset.category;
        addNewBookmark(category);
      });
    });

    // Edit bookmark
    document.querySelectorAll('.edit-bookmark').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const bookmarkItem = btn.closest('.bookmark-item');
        editBookmark(bookmarkItem);
      });
    });

    // Delete bookmark
    document.querySelectorAll('.delete-bookmark').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const bookmarkItem = btn.closest('.bookmark-item');
        deleteBookmark(bookmarkItem);
      });
    });

    // Open bookmark
    document.querySelectorAll('.bookmark-item').forEach(item => {
      item.addEventListener('click', () => {
        window.open(item.dataset.url, '_blank');
      });
    });
  }

  function addNewBookmark(categoryName) {
    const title = prompt('Enter bookmark title:');
    if (!title) return;

    const url = prompt('Enter bookmark URL:');
    if (!url) return;

    const category = bookmarksData.categories.find(c => c.name === categoryName);
    if (category) {
      category.items.push({ title, url });
      updateBookmarksData();
      renderBookmarks();
    }
  }

  function editBookmark(bookmarkItem) {
    const oldTitle = bookmarkItem.querySelector('span').textContent;
    const oldUrl = bookmarkItem.dataset.url;

    const newTitle = prompt('Edit bookmark title:', oldTitle);
    if (!newTitle) return;

    const newUrl = prompt('Edit bookmark URL:', oldUrl);
    if (!newUrl) return;

    const categoryEl = bookmarkItem.closest('.bookmark-category');
    const categoryName = categoryEl.dataset.category;
    const category = bookmarksData.categories.find(c => c.name === categoryName);
    
    if (category) {
      const bookmark = category.items.find(item => 
        item.title === oldTitle && item.url === oldUrl
      );
      if (bookmark) {
        bookmark.title = newTitle;
        bookmark.url = newUrl;
        updateBookmarksData();
        renderBookmarks();
      }
    }
  }

  function deleteBookmark(bookmarkItem) {
    if (!confirm('Are you sure you want to delete this bookmark?')) return;

    const categoryEl = bookmarkItem.closest('.bookmark-category');
    const categoryName = categoryEl.dataset.category;
    const category = bookmarksData.categories.find(c => c.name === categoryName);
    
    if (category) {
      const title = bookmarkItem.querySelector('span').textContent;
      const url = bookmarkItem.dataset.url;
      category.items = category.items.filter(item => 
        !(item.title === title && item.url === url)
      );
      updateBookmarksData();
      renderBookmarks();
    }
  }
  
  function updateBookmarksData() {
    const state = loadState();
    state.bookmarks = bookmarksData;
    saveState(state);
  }
  
  renderBookmarks();
}
