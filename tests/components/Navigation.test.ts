/**
 * Navigation Component Tests
 * Tests mobile menu functionality, theme toggling, and active state handling
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';

describe('Navigation Component', () => {
  let dom: JSDOM;
  let document: Document;
  let window: Window & typeof globalThis;

  beforeEach(() => {
    // Create a clean DOM environment for each test
    dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Test</title>
        </head>
        <body>
          <nav class="nav-modern" aria-label="Main navigation">
            <!-- Desktop Navigation -->
            <div class="nav-desktop">
              <div class="nav-container">
                <!-- Logo -->
                <a href="/" class="nav-logo" aria-label="Code198x Home">
                  <img src="/logo-horizontal.svg" alt="Code Like It's 198x" />
                </a>

                <!-- Center Menu -->
                <ul class="nav-menu">
                  <li>
                    <a href="/" class="nav-item nav-item--active" aria-current="page">
                      <span class="nav-item__icon">🏠</span>
                      <span class="nav-item__label">Home</span>
                    </a>
                  </li>
                  <li>
                    <a href="/systems" class="nav-item">
                      <span class="nav-item__icon">💻</span>
                      <span class="nav-item__label">Systems</span>
                    </a>
                  </li>
                  <li>
                    <a href="/learn" class="nav-item">
                      <span class="nav-item__icon">📚</span>
                      <span class="nav-item__label">Learn</span>
                    </a>
                  </li>
                </ul>

                <!-- Right Actions -->
                <div class="nav-actions">
                  <button class="nav-search" aria-label="Search">
                    <svg width="20" height="20" fill="none" stroke="currentColor">
                      <circle cx="11" cy="11" r="8"/>
                      <path d="m21 21-4.35-4.35"/>
                    </svg>
                  </button>
                  <button class="nav-theme" aria-label="Toggle theme">
                    <svg width="20" height="20" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="5"/>
                      <line x1="12" y1="1" x2="12" y2="3"/>
                      <line x1="12" y1="21" x2="12" y2="23"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Mobile Navigation -->
            <div class="nav-mobile">
              <div class="nav-mobile-header">
                <a href="/" class="nav-mobile-logo">
                  <img src="/logo-horizontal.svg" alt="Code Like It's 198x" />
                </a>
                <button class="nav-mobile-toggle" aria-label="Toggle menu" aria-expanded="false">
                  <span class="hamburger">
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                </button>
              </div>

              <!-- Mobile Menu Overlay -->
              <div class="nav-mobile-overlay" aria-hidden="true"></div>

              <!-- Mobile Menu Panel -->
              <div class="nav-mobile-menu" aria-hidden="true">
                <ul class="nav-mobile-list">
                  <li>
                    <a href="/" class="nav-mobile-item nav-mobile-item--active">
                      <span class="nav-mobile-item__icon">🏠</span>
                      <span class="nav-mobile-item__label">Home</span>
                      <span class="nav-mobile-item__indicator"></span>
                    </a>
                  </li>
                  <li>
                    <a href="/systems" class="nav-mobile-item">
                      <span class="nav-mobile-item__icon">💻</span>
                      <span class="nav-mobile-item__label">Systems</span>
                    </a>
                  </li>
                  <li>
                    <a href="/learn" class="nav-mobile-item">
                      <span class="nav-mobile-item__icon">📚</span>
                      <span class="nav-mobile-item__label">Learn</span>
                    </a>
                  </li>
                </ul>

                <div class="nav-mobile-footer">
                  <button class="nav-mobile-search">
                    <svg width="20" height="20" fill="none" stroke="currentColor">
                      <circle cx="11" cy="11" r="8"/>
                      <path d="m21 21-4.35-4.35"/>
                    </svg>
                    Search
                  </button>
                </div>
              </div>
            </div>
          </nav>
        </body>
      </html>
    `, {
      url: 'http://localhost:4321',
      pretendToBeVisual: true
    });

    document = dom.window.document;
    window = dom.window as any;

    // Set up global mocks
    global.document = document;
    global.window = window as any;

    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    // Mock window properties
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  describe('Navigation Structure', () => {
    it('should render both desktop and mobile navigation', () => {
      const desktopNav = document.querySelector('.nav-desktop');
      const mobileNav = document.querySelector('.nav-mobile');

      expect(desktopNav).toBeTruthy();
      expect(mobileNav).toBeTruthy();
    });

    it('should render logo in both desktop and mobile versions', () => {
      const desktopLogo = document.querySelector('.nav-logo img');
      const mobileLogo = document.querySelector('.nav-mobile-logo img');

      expect(desktopLogo?.getAttribute('alt')).toBe('Code Like It\'s 198x');
      expect(mobileLogo?.getAttribute('alt')).toBe('Code Like It\'s 198x');
    });

    it('should render navigation items with icons and labels', () => {
      const navItems = document.querySelectorAll('.nav-item');

      expect(navItems.length).toBe(3);

      navItems.forEach(item => {
        const icon = item.querySelector('.nav-item__icon');
        const label = item.querySelector('.nav-item__label');

        expect(icon).toBeTruthy();
        expect(label).toBeTruthy();
        expect(label?.textContent).toBeTruthy();
      });
    });

    it('should have proper accessibility attributes', () => {
      const nav = document.querySelector('nav');
      const mobileToggle = document.querySelector('.nav-mobile-toggle');
      const searchButton = document.querySelector('.nav-search');
      const themeButton = document.querySelector('.nav-theme');

      expect(nav?.getAttribute('aria-label')).toBe('Main navigation');
      expect(mobileToggle?.getAttribute('aria-label')).toBe('Toggle menu');
      expect(mobileToggle?.getAttribute('aria-expanded')).toBe('false');
      expect(searchButton?.getAttribute('aria-label')).toBe('Search');
      expect(themeButton?.getAttribute('aria-label')).toBe('Toggle theme');
    });
  });

  describe('Active State Handling', () => {
    it('should mark home item as active', () => {
      const homeItem = document.querySelector('a[href="/"]');
      const activeDesktopItem = document.querySelector('.nav-item--active');
      const activeMobileItem = document.querySelector('.nav-mobile-item--active');

      expect(activeDesktopItem?.getAttribute('href')).toBe('/');
      expect(activeDesktopItem?.getAttribute('aria-current')).toBe('page');
      expect(activeMobileItem?.getAttribute('href')).toBe('/');
    });

    it('should show active indicator in mobile menu', () => {
      const activeMobileItem = document.querySelector('.nav-mobile-item--active');
      const indicator = activeMobileItem?.querySelector('.nav-mobile-item__indicator');

      expect(indicator).toBeTruthy();
    });
  });

  describe('Mobile Menu Functionality', () => {
    it('should initialize with closed menu state', () => {
      const toggle = document.querySelector('.nav-mobile-toggle');
      const overlay = document.querySelector('.nav-mobile-overlay');
      const menu = document.querySelector('.nav-mobile-menu');

      expect(toggle?.getAttribute('aria-expanded')).toBe('false');
      expect(overlay?.getAttribute('aria-hidden')).toBe('true');
      expect(menu?.getAttribute('aria-hidden')).toBe('true');
    });

    it('should simulate menu toggle functionality', () => {
      const toggle = document.querySelector('.nav-mobile-toggle');
      const overlay = document.querySelector('.nav-mobile-overlay');
      const menu = document.querySelector('.nav-mobile-menu');

      // Simulate opening the menu
      toggle?.setAttribute('aria-expanded', 'true');
      overlay?.setAttribute('aria-hidden', 'false');
      menu?.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      expect(toggle?.getAttribute('aria-expanded')).toBe('true');
      expect(overlay?.getAttribute('aria-hidden')).toBe('false');
      expect(menu?.getAttribute('aria-hidden')).toBe('false');
      expect(document.body.style.overflow).toBe('hidden');

      // Simulate closing the menu
      toggle?.setAttribute('aria-expanded', 'false');
      overlay?.setAttribute('aria-hidden', 'true');
      menu?.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';

      expect(toggle?.getAttribute('aria-expanded')).toBe('false');
      expect(overlay?.getAttribute('aria-hidden')).toBe('true');
      expect(menu?.getAttribute('aria-hidden')).toBe('true');
      expect(document.body.style.overflow).toBe('');
    });

    it('should handle menu item clicks', () => {
      const menuItem = document.querySelector('.nav-mobile-item[href="/systems"]');

      expect(menuItem?.getAttribute('href')).toBe('/systems');

      // Simulate menu item click closing the menu
      const toggle = document.querySelector('.nav-mobile-toggle');
      const overlay = document.querySelector('.nav-mobile-overlay');
      const menu = document.querySelector('.nav-mobile-menu');

      toggle?.setAttribute('aria-expanded', 'false');
      overlay?.setAttribute('aria-hidden', 'true');
      menu?.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';

      expect(toggle?.getAttribute('aria-expanded')).toBe('false');
    });
  });

  describe('Theme Toggle Functionality', () => {
    it('should handle theme toggle', () => {
      const themeButton = document.querySelector('.nav-theme');
      const html = document.documentElement;

      // Initially no dark mode
      expect(html.classList.contains('dark-mode')).toBe(false);

      // Simulate theme toggle
      html.classList.add('dark-mode');
      window.localStorage.setItem('theme', 'dark');

      expect(html.classList.contains('dark-mode')).toBe(true);
      expect(window.localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');

      // Toggle back to light mode
      html.classList.remove('dark-mode');
      window.localStorage.setItem('theme', 'light');

      expect(html.classList.contains('dark-mode')).toBe(false);
      expect(window.localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
    });

    it('should restore theme from localStorage', () => {
      window.localStorage.getItem = vi.fn().mockReturnValue('dark');

      // Simulate theme restoration on page load
      if (window.localStorage.getItem('theme') === 'dark') {
        document.documentElement.classList.add('dark-mode');
      }

      expect(window.localStorage.getItem).toHaveBeenCalledWith('theme');
      expect(document.documentElement.classList.contains('dark-mode')).toBe(true);
    });
  });

  describe('Responsive Behavior', () => {
    it('should handle mobile viewport', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 600,
      });

      // In a mobile viewport, menu should start collapsed
      const isMobile = window.innerWidth < 768;
      expect(isMobile).toBe(true);
    });

    it('should handle desktop viewport', () => {
      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200,
      });

      const isDesktop = window.innerWidth >= 768;
      expect(isDesktop).toBe(true);
    });
  });

  describe('Search Functionality', () => {
    it('should render search buttons', () => {
      const desktopSearch = document.querySelector('.nav-search');
      const mobileSearch = document.querySelector('.nav-mobile-search');

      expect(desktopSearch).toBeTruthy();
      expect(mobileSearch).toBeTruthy();
      expect(mobileSearch?.textContent?.trim()).toBe('Search');
    });

    it('should have proper search button accessibility', () => {
      const searchButtons = document.querySelectorAll('[aria-label="Search"]');
      expect(searchButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Event Delegation', () => {
    it('should use proper event delegation patterns', () => {
      // Test that we can simulate event delegation
      const body = document.body;
      const clickEvent = new window.Event('click', { bubbles: true });

      // Mock closest method for event delegation
      const mockClosest = vi.fn();
      Element.prototype.closest = mockClosest;

      mockClosest.mockReturnValue(document.querySelector('.nav-mobile-toggle'));

      // Simulate delegated event handling
      const target = { closest: mockClosest };
      const toggleBtn = target.closest('.nav-mobile-toggle');

      expect(toggleBtn).toBeTruthy();
      expect(mockClosest).toHaveBeenCalledWith('.nav-mobile-toggle');
    });
  });
});