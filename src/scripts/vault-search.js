// Shared Vault Search Module
// This module provides centralized search functionality for all Vault pages

export class VaultSearch {
  constructor(options = {}) {
    this.data = options.data || [];
    this.container = options.container || document.getElementById('results-grid');
    this.filters = {
      search: '',
      category: 'all',
      type: 'all',
      tag: '',
      year: 'all',
      status: 'all',
      ...options.initialFilters
    };

    this.onFilter = options.onFilter || (() => {});
    this.getEntryIcon = options.getEntryIcon || this.defaultGetEntryIcon;
    this.getCategoryName = options.getCategoryName || this.defaultGetCategoryName;

    this.filteredData = [...this.data];
  }

  // Default icon provider
  defaultGetEntryIcon(category, type) {
    const icons = {
      hardware: {
        computer: '🖥️',
        chip: '💾',
        peripheral: '🖱️',
        console: '🎮',
        default: '🔧'
      },
      people: {
        executive: '💼',
        engineer: '👷',
        designer: '🎨',
        default: '👤'
      },
      companies: {
        manufacturer: '🏭',
        publisher: '📚',
        default: '🏢'
      },
      games: '🎮',
      demos: '🎬',
      emulators: '🔄',
      groups: '👥',
      techniques: '⚡',
      applications: '💼',
      developmentTools: '🔧',
      utilities: '🛠️',
      drivers: '⚙️',
      plugins: '🧩',
      operatingSystems: '🖥️',
      programmingLanguages: '📝',
      publications: '📖',
      events: '🎪',
      formats: '💾',
      culture: '🌟',
      default: '📁'
    };

    const catIcons = icons[category] || icons.default;
    if (typeof catIcons === 'string') return catIcons;
    return catIcons[type] || catIcons.default || '📁';
  }

  // Default category name formatter
  defaultGetCategoryName(category) {
    const names = {
      hardware: 'Hardware',
      people: 'People',
      companies: 'Companies',
      games: 'Games',
      demos: 'Demos',
      emulators: 'Emulators',
      groups: 'Groups',
      techniques: 'Techniques',
      applications: 'Applications',
      developmentTools: 'Development Tools',
      utilities: 'Utilities',
      drivers: 'Drivers',
      plugins: 'Plugins',
      operatingSystems: 'Operating Systems',
      programmingLanguages: 'Programming Languages',
      publications: 'Publications',
      events: 'Events',
      formats: 'Formats',
      culture: 'Culture'
    };
    return names[category] || category;
  }

  // Apply all filters
  applyFilters(updateUrl = true) {
    this.filteredData = this.data.filter(entry => {
      // Search filter
      if (this.filters.search) {
        const searchQuery = this.filters.search.toLowerCase();
        const matchesSearch =
          (entry.n || entry.name || '').toLowerCase().includes(searchQuery) ||
          (entry.d || entry.description || '').toLowerCase().includes(searchQuery) ||
          (entry.g || entry.tags || []).some(tag => tag.toLowerCase().includes(searchQuery)) ||
          (entry.s || entry.slug || '').toLowerCase().includes(searchQuery);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (this.filters.category !== 'all') {
        const entryCategory = entry.c || entry.category;
        if (entryCategory !== this.filters.category) return false;
      }

      // Type filter
      if (this.filters.type !== 'all') {
        const entryType = entry.t || entry.type;
        if (entryType !== this.filters.type) return false;
      }

      // Tag filter
      if (this.filters.tag) {
        const entryTags = entry.g || entry.tags || [];
        if (!entryTags.some(tag => tag.toLowerCase() === this.filters.tag.toLowerCase())) {
          return false;
        }
      }

      // Year filter
      if (this.filters.year !== 'all') {
        const entryYear = entry.y || entry.year;
        if (this.filters.year === 'unknown' && entryYear) return false;
        if (this.filters.year !== 'unknown') {
          const decade = Math.floor(entryYear / 10) * 10;
          if (decade !== parseInt(this.filters.year)) return false;
        }
      }

      // Status filter
      if (this.filters.status !== 'all') {
        const entryStatus = entry.st || entry.status || 'available';
        if (entryStatus !== this.filters.status) return false;
      }

      return true;
    });

    // Sort by year, then name
    this.filteredData.sort((a, b) => {
      const yearA = a.y || a.year || 9999;
      const yearB = b.y || b.year || 9999;
      if (yearA !== yearB) return yearA - yearB;

      const nameA = a.n || a.name || '';
      const nameB = b.n || b.name || '';
      return nameA.localeCompare(nameB);
    });

    // Update URL if requested
    if (updateUrl) {
      this.updateUrl();
    }

    // Render results
    this.render();

    // Call callback
    this.onFilter(this.filteredData, this.filters);
  }

  // Update URL without page refresh
  updateUrl() {
    const params = new URLSearchParams();

    if (this.filters.search) params.set('q', this.filters.search);
    if (this.filters.category !== 'all') params.set('category', this.filters.category);
    if (this.filters.type !== 'all') params.set('type', this.filters.type);
    if (this.filters.tag) params.set('tag', this.filters.tag);
    if (this.filters.year !== 'all') params.set('year', this.filters.year);
    if (this.filters.status !== 'all') params.set('status', this.filters.status);

    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;

    window.history.replaceState({}, '', newUrl);
  }

  // Load filters from URL
  loadFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has('q')) this.filters.search = urlParams.get('q');
    if (urlParams.has('category')) this.filters.category = urlParams.get('category');
    if (urlParams.has('type')) this.filters.type = urlParams.get('type');
    if (urlParams.has('tag')) this.filters.tag = urlParams.get('tag');
    if (urlParams.has('year')) this.filters.year = urlParams.get('year');
    if (urlParams.has('status')) this.filters.status = urlParams.get('status');

    // Also check old parameter names for backwards compatibility
    if (urlParams.has('search')) this.filters.search = urlParams.get('search');
  }

  // Render results
  render() {
    if (!this.container) return;

    if (this.filteredData.length === 0) {
      this.container.innerHTML = `
        <div class="no-results">
          <h3>No results found</h3>
          <p>Try adjusting your filters or search terms</p>
        </div>
      `;
      return;
    }

    this.container.innerHTML = this.filteredData.map(entry =>
      this.renderEntry(entry)
    ).join('');
  }

  // Render a single entry
  renderEntry(entry) {
    const name = entry.n || entry.name;
    const description = entry.d || entry.description;
    const category = entry.c || entry.category;
    const type = entry.t || entry.type;
    const tags = entry.g || entry.tags || [];
    const year = entry.y || entry.year;
    const slug = entry.s || entry.slug;
    const status = entry.st || entry.status || 'available';

    const icon = this.getEntryIcon(category, type);
    const categoryName = this.getCategoryName(category);

    const href = status === 'available'
      ? `/vault/${category}/${slug}`
      : '#';

    const statusBadge = status !== 'available'
      ? `<div class="entry-status entry-status--${status}">
           ${status === 'coming' ? 'Coming Soon' : 'Draft'}
         </div>`
      : '';

    const tagHtml = tags.slice(0, 5).map(tag =>
      `<span class="entry-tag">${tag}</span>`
    ).join('');

    const moreTags = tags.length > 5
      ? `<span class="entry-tag">+${tags.length - 5}</span>`
      : '';

    return `
      <div class="result-card">
        <a href="${href}" class="entry-card entry-card--${status}">
          <div class="entry-header">
            <span class="entry-icon">${icon}</span>
            <div class="entry-info">
              <h4 class="entry-name">${name}</h4>
              <p class="entry-description">${description}</p>
            </div>
          </div>

          <div class="entry-meta">
            <span class="entry-category">${categoryName}</span>
            ${year ? `<span class="entry-year">${year}</span>` : ''}
            ${type && type !== 'unknown' ? `<span class="entry-type">${type}</span>` : ''}
          </div>

          ${tags.length > 0 ? `
            <div class="entry-tags">
              ${tagHtml}
              ${moreTags}
            </div>
          ` : ''}

          ${statusBadge}
        </a>
      </div>
    `;
  }

  // Set a filter value
  setFilter(key, value) {
    this.filters[key] = value;
    this.applyFilters();
  }

  // Clear all filters
  clearFilters() {
    this.filters = {
      search: '',
      category: 'all',
      type: 'all',
      tag: '',
      year: 'all',
      status: 'all'
    };
    this.applyFilters();
  }

  // Get unique values for a field
  getUniqueValues(field) {
    const values = new Set();
    this.data.forEach(entry => {
      const value = entry[field] || entry[field.charAt(0)]; // Try both long and short names
      if (value) {
        if (Array.isArray(value)) {
          value.forEach(v => values.add(v));
        } else {
          values.add(value);
        }
      }
    });
    return Array.from(values).sort();
  }

  // Get tag counts
  getTagCounts() {
    const counts = {};
    this.data.forEach(entry => {
      const tags = entry.g || entry.tags || [];
      tags.forEach(tag => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return counts;
  }

  // Initialize with DOM elements
  initializeWithDOM(config = {}) {
    // Set up search input
    const searchInput = document.getElementById(config.searchInputId || 'search-input');
    if (searchInput) {
      searchInput.value = this.filters.search;
      searchInput.addEventListener('input', (e) => {
        this.setFilter('search', e.target.value);
      });
    }

    // Set up category filter
    const categoryFilter = document.getElementById(config.categoryFilterId || 'category-filter');
    if (categoryFilter) {
      categoryFilter.value = this.filters.category;
      categoryFilter.addEventListener('change', (e) => {
        this.setFilter('category', e.target.value);
      });
    }

    // Set up type filter
    const typeFilter = document.getElementById(config.typeFilterId || 'type-filter');
    if (typeFilter) {
      typeFilter.value = this.filters.type;
      typeFilter.addEventListener('change', (e) => {
        this.setFilter('type', e.target.value);
      });
    }

    // Set up tag filter
    const tagFilter = document.getElementById(config.tagFilterId || 'tag-filter');
    if (tagFilter) {
      tagFilter.value = this.filters.tag;
      tagFilter.addEventListener('input', (e) => {
        this.setFilter('tag', e.target.value);
      });
    }

    // Set up clear button
    const clearButton = document.getElementById(config.clearButtonId || 'clear-filters');
    if (clearButton) {
      clearButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.clearFilters();
        // Reset form inputs
        if (searchInput) searchInput.value = '';
        if (categoryFilter) categoryFilter.value = 'all';
        if (typeFilter) typeFilter.value = 'all';
        if (tagFilter) tagFilter.value = '';
      });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Focus search on '/'
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }

      // Clear search on Escape
      if (e.key === 'Escape' && searchInput && searchInput.value) {
        searchInput.value = '';
        this.setFilter('search', '');
      }
    });

    // Load initial filters from URL
    this.loadFromUrl();

    // Apply initial filters
    this.applyFilters(false);
  }
}

// Export for use in other scripts
window.VaultSearch = VaultSearch;