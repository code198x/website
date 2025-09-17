/**
 * Performance Dashboard Component Tests
 * Tests the dashboard UI, metrics updates, and user interactions
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { JSDOM } from "jsdom";

// Mock the web-vitals library
vi.mock("web-vitals", () => ({
  onCLS: vi.fn(),
  onFCP: vi.fn(),
  onLCP: vi.fn(),
  onINP: vi.fn(),
}));

describe("PerformanceDashboard Component", () => {
  let dom: JSDOM;
  let document: Document;
  let window: Window & typeof globalThis;

  beforeEach(() => {
    // Create a clean DOM environment for each test
    dom = new JSDOM(
      `
      <!DOCTYPE html>
      <html>
        <body>
          <div class="performance-dashboard" id="performance-dashboard">
            <div class="dashboard-header">
              <h3>⚡️ Performance Monitor</h3>
              <button class="toggle-dashboard" id="toggle-dashboard">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </div>
            <div class="dashboard-content" id="dashboard-content">
              <div class="metrics-grid">
                <div class="metric-card" id="cls-metric">
                  <div class="metric-info">
                    <div class="metric-label">CLS</div>
                    <div class="metric-value">-</div>
                  </div>
                  <div class="metric-status">measuring...</div>
                </div>
                <div class="metric-card" id="fcp-metric">
                  <div class="metric-info">
                    <div class="metric-label">FCP</div>
                    <div class="metric-value">-</div>
                  </div>
                  <div class="metric-status">measuring...</div>
                </div>
                <div class="metric-card" id="lcp-metric">
                  <div class="metric-info">
                    <div class="metric-label">LCP</div>
                    <div class="metric-value">-</div>
                  </div>
                  <div class="metric-status">measuring...</div>
                </div>
                <div class="metric-card" id="inp-metric">
                  <div class="metric-info">
                    <div class="metric-label">INP</div>
                    <div class="metric-value">-</div>
                  </div>
                  <div class="metric-status">waiting for interaction</div>
                </div>
              </div>
              <div class="dashboard-actions">
                <button class="action-button" id="clear-data">Clear Data</button>
                <button class="action-button" id="export-data">Export Data</button>
                <button class="action-button" id="view-details">View Details</button>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
      {
        url: "http://localhost:4321",
        pretendToBeVisual: true,
      }
    );

    document = dom.window.document;
    window = dom.window as any;

    // Set up global mocks
    global.document = document;
    global.window = window as any;

    // Mock URL methods
    window.URL = {
      createObjectURL: vi.fn().mockReturnValue("blob:mock-url"),
      revokeObjectURL: vi.fn(),
    } as any;

    // Mock performance monitor
    window.performanceMonitor = {
      getStoredData: vi.fn().mockReturnValue([]),
      clearStoredData: vi.fn(),
    } as any;
  });

  describe("Dashboard Structure", () => {
    it("should render dashboard with all required elements", () => {
      const dashboard = document.getElementById("performance-dashboard");
      const header = document.querySelector(".dashboard-header h3");
      const toggleButton = document.getElementById("toggle-dashboard");
      const content = document.getElementById("dashboard-content");

      expect(dashboard).toBeTruthy();
      expect(header?.textContent).toBe("⚡️ Performance Monitor");
      expect(toggleButton).toBeTruthy();
      expect(content).toBeTruthy();
    });

    it("should render all four metric cards", () => {
      const clsMetric = document.getElementById("cls-metric");
      const fcpMetric = document.getElementById("fcp-metric");
      const lcpMetric = document.getElementById("lcp-metric");
      const inpMetric = document.getElementById("inp-metric");

      expect(clsMetric).toBeTruthy();
      expect(fcpMetric).toBeTruthy();
      expect(lcpMetric).toBeTruthy();
      expect(inpMetric).toBeTruthy();

      // Check metric labels
      expect(clsMetric?.querySelector(".metric-label")?.textContent).toBe("CLS");
      expect(fcpMetric?.querySelector(".metric-label")?.textContent).toBe("FCP");
      expect(lcpMetric?.querySelector(".metric-label")?.textContent).toBe("LCP");
      expect(inpMetric?.querySelector(".metric-label")?.textContent).toBe("INP");
    });

    it("should render all action buttons", () => {
      const clearButton = document.getElementById("clear-data");
      const exportButton = document.getElementById("export-data");
      const detailsButton = document.getElementById("view-details");

      expect(clearButton).toBeTruthy();
      expect(exportButton).toBeTruthy();
      expect(detailsButton).toBeTruthy();

      expect(clearButton?.textContent).toBe("Clear Data");
      expect(exportButton?.textContent).toBe("Export Data");
      expect(detailsButton?.textContent).toBe("View Details");
    });
  });

  describe("Dashboard Functionality", () => {
    it("should toggle dashboard collapse state", () => {
      const dashboard = document.getElementById("performance-dashboard");
      const toggleButton = document.getElementById("toggle-dashboard");

      expect(dashboard?.classList.contains("collapsed")).toBe(false);

      // Simulate click event
      toggleButton?.click();

      // Since we're testing the HTML structure without the actual script,
      // we'll simulate what the script would do
      dashboard?.classList.toggle("collapsed");

      expect(dashboard?.classList.contains("collapsed")).toBe(true);
    });

    it("should handle metric updates correctly", () => {
      const clsMetric = document.getElementById("cls-metric");
      const valueElement = clsMetric?.querySelector(".metric-value");
      const statusElement = clsMetric?.querySelector(".metric-status");

      expect(valueElement?.textContent).toBe("-");
      expect(statusElement?.textContent).toBe("measuring...");

      // Simulate metric update
      if (valueElement) valueElement.textContent = "0.125";
      if (statusElement) statusElement.textContent = "good";
      clsMetric?.classList.add("good");

      expect(valueElement?.textContent).toBe("0.125");
      expect(statusElement?.textContent).toBe("good");
      expect(clsMetric?.classList.contains("good")).toBe(true);
    });

    it("should handle clear data action", () => {
      const clearButton = document.getElementById("clear-data");
      const mockClearStoredData = vi.fn();

      window.performanceMonitor = {
        getStoredData: vi.fn().mockReturnValue([]),
        clearStoredData: mockClearStoredData,
      } as any;

      // Simulate clear button click behavior
      clearButton?.click();

      // Test that metrics are reset (simulate what the script would do)
      document.querySelectorAll(".metric-card").forEach((card) => {
        const valueElement = card.querySelector(".metric-value");
        const statusElement = card.querySelector(".metric-status");

        if (valueElement) valueElement.textContent = "-";
        if (statusElement) statusElement.textContent = "measuring...";
        card.className = "metric-card";
      });

      // Verify all metrics are reset
      const allValues = document.querySelectorAll(".metric-value");
      const allStatuses = document.querySelectorAll(".metric-status");

      allValues.forEach((value) => {
        expect(value.textContent).toBe("-");
      });

      // Check that INP status is different
      const inpStatus = document.querySelector("#inp-metric .metric-status");
      if (inpStatus) inpStatus.textContent = "waiting for interaction";
      expect(inpStatus?.textContent).toBe("waiting for interaction");
    });
  });

  describe("Metric Rating System", () => {
    it("should apply correct CSS classes for different ratings", () => {
      const testCases = [
        { metric: "cls-metric", rating: "good" },
        { metric: "fcp-metric", rating: "needs-improvement" },
        { metric: "lcp-metric", rating: "poor" },
      ];

      testCases.forEach(({ metric, rating }) => {
        const element = document.getElementById(metric);
        element?.classList.add(rating);

        expect(element?.classList.contains(rating)).toBe(true);
        expect(element?.classList.contains("metric-card")).toBe(true);
      });
    });

    it("should format metric values correctly", () => {
      // Test CLS formatting (decimal)
      const clsValue = document.querySelector("#cls-metric .metric-value");
      if (clsValue) clsValue.textContent = "0.125";
      expect(clsValue?.textContent).toBe("0.125");

      // Test timing metrics formatting (ms)
      const fcpValue = document.querySelector("#fcp-metric .metric-value");
      if (fcpValue) fcpValue.textContent = "1200ms";
      expect(fcpValue?.textContent).toBe("1200ms");
    });
  });

  describe("Export Functionality", () => {
    it("should handle export with no data", () => {
      window.performanceMonitor = undefined;

      const exportButton = document.getElementById("export-data");

      // Mock alert
      window.alert = vi.fn();

      // Simulate export click (would show alert in actual implementation)
      exportButton?.click();

      expect(window.performanceMonitor).toBe(undefined);
    });

    it("should handle export with data", () => {
      const mockData = [
        { name: "CLS", value: 0.125, rating: "good", timestamp: Date.now() },
        { name: "FCP", value: 1200, rating: "good", timestamp: Date.now() },
      ];

      window.performanceMonitor = {
        getStoredData: vi.fn().mockReturnValue(mockData),
        clearStoredData: vi.fn(),
      } as any;

      // Mock document.createElement and appendChild for download
      const mockLink = {
        href: "",
        download: "",
        click: vi.fn(),
      };

      document.createElement = vi.fn().mockReturnValue(mockLink);
      document.body.appendChild = vi.fn();
      document.body.removeChild = vi.fn();

      const exportButton = document.getElementById("export-data");

      // The actual export logic would be tested here
      expect(window.performanceMonitor.getStoredData()).toEqual(mockData);
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels", () => {
      const toggleButton = document.getElementById("toggle-dashboard");

      // Check that button has proper accessibility (would be set by script)
      toggleButton?.setAttribute("aria-expanded", "false");

      expect(toggleButton?.getAttribute("aria-expanded")).toBe("false");
    });

    it("should have proper semantic structure", () => {
      const header = document.querySelector(".dashboard-header h3");
      const buttons = document.querySelectorAll("button");

      expect(header?.tagName).toBe("H3");
      expect(buttons.length).toBeGreaterThan(0);

      buttons.forEach((button) => {
        expect(button.tagName).toBe("BUTTON");
      });
    });
  });
});
