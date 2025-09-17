/**
 * Performance Utilities Tests
 * Tests helper functions for performance monitoring and Web Vitals
 */

import { describe, it, expect } from "vitest";

// Mock performance helper functions that would exist in the codebase
const formatMetricValue = (name: string, value: number): string => {
  if (name === "CLS") {
    return value.toFixed(3);
  }
  return `${Math.round(value)}ms`;
};

const getMetricRating = (name: string, value: number): "good" | "needs-improvement" | "poor" => {
  const thresholds = {
    CLS: { good: 0.1, needsImprovement: 0.25 },
    FCP: { good: 1800, needsImprovement: 3000 },
    LCP: { good: 2500, needsImprovement: 4000 },
    INP: { good: 200, needsImprovement: 500 },
  };

  const threshold = thresholds[name as keyof typeof thresholds];
  if (!threshold) return "good";

  if (value <= threshold.good) return "good";
  if (value <= threshold.needsImprovement) return "needs-improvement";
  return "poor";
};

const calculatePerformanceScore = (metrics: Array<{ name: string; value: number }>): number => {
  if (metrics.length === 0) return 0;

  const scores = metrics.map((metric) => {
    const rating = getMetricRating(metric.name, metric.value);
    switch (rating) {
      case "good":
        return 100;
      case "needs-improvement":
        return 60;
      case "poor":
        return 30;
      default:
        return 0;
    }
  });

  return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
};

const isValidMetricName = (name: string): boolean => {
  const validNames = ["CLS", "FCP", "LCP", "INP"];
  return validNames.includes(name);
};

const sanitizeMetricData = (
  data: any
): { name: string; value: number; timestamp: number } | null => {
  if (!data || typeof data !== "object") return null;
  if (!isValidMetricName(data.name)) return null;
  if (typeof data.value !== "number" || isNaN(data.value) || data.value < 0) return null;

  return {
    name: data.name,
    value: data.value,
    timestamp: data.timestamp || Date.now(),
  };
};

describe("Performance Helper Functions", () => {
  describe("formatMetricValue", () => {
    it("should format CLS values with 3 decimal places", () => {
      expect(formatMetricValue("CLS", 0.12345)).toBe("0.123");
      expect(formatMetricValue("CLS", 0.1)).toBe("0.100");
      expect(formatMetricValue("CLS", 0)).toBe("0.000");
    });

    it("should format timing metrics with ms suffix", () => {
      expect(formatMetricValue("FCP", 1234.56)).toBe("1235ms");
      expect(formatMetricValue("LCP", 2500.8)).toBe("2501ms");
      expect(formatMetricValue("INP", 150.2)).toBe("150ms");
    });

    it("should round timing values to nearest integer", () => {
      expect(formatMetricValue("FCP", 1234.4)).toBe("1234ms");
      expect(formatMetricValue("FCP", 1234.6)).toBe("1235ms");
    });
  });

  describe("getMetricRating", () => {
    describe("CLS ratings", () => {
      it("should rate CLS values correctly", () => {
        expect(getMetricRating("CLS", 0.05)).toBe("good");
        expect(getMetricRating("CLS", 0.1)).toBe("good");
        expect(getMetricRating("CLS", 0.15)).toBe("needs-improvement");
        expect(getMetricRating("CLS", 0.25)).toBe("needs-improvement");
        expect(getMetricRating("CLS", 0.3)).toBe("poor");
      });
    });

    describe("FCP ratings", () => {
      it("should rate FCP values correctly", () => {
        expect(getMetricRating("FCP", 1200)).toBe("good");
        expect(getMetricRating("FCP", 1800)).toBe("good");
        expect(getMetricRating("FCP", 2400)).toBe("needs-improvement");
        expect(getMetricRating("FCP", 3000)).toBe("needs-improvement");
        expect(getMetricRating("FCP", 3500)).toBe("poor");
      });
    });

    describe("LCP ratings", () => {
      it("should rate LCP values correctly", () => {
        expect(getMetricRating("LCP", 2000)).toBe("good");
        expect(getMetricRating("LCP", 2500)).toBe("good");
        expect(getMetricRating("LCP", 3200)).toBe("needs-improvement");
        expect(getMetricRating("LCP", 4000)).toBe("needs-improvement");
        expect(getMetricRating("LCP", 5000)).toBe("poor");
      });
    });

    describe("INP ratings", () => {
      it("should rate INP values correctly", () => {
        expect(getMetricRating("INP", 150)).toBe("good");
        expect(getMetricRating("INP", 200)).toBe("good");
        expect(getMetricRating("INP", 350)).toBe("needs-improvement");
        expect(getMetricRating("INP", 500)).toBe("needs-improvement");
        expect(getMetricRating("INP", 600)).toBe("poor");
      });
    });

    it("should default to good for unknown metrics", () => {
      expect(getMetricRating("UNKNOWN", 1000)).toBe("good");
    });
  });

  describe("calculatePerformanceScore", () => {
    it("should return 0 for empty metrics array", () => {
      expect(calculatePerformanceScore([])).toBe(0);
    });

    it("should calculate score for single metric", () => {
      expect(calculatePerformanceScore([{ name: "CLS", value: 0.05 }])).toBe(100);
      expect(calculatePerformanceScore([{ name: "CLS", value: 0.15 }])).toBe(60);
      expect(calculatePerformanceScore([{ name: "CLS", value: 0.3 }])).toBe(30);
    });

    it("should calculate average score for multiple metrics", () => {
      const metrics = [
        { name: "CLS", value: 0.05 }, // good = 100
        { name: "FCP", value: 1200 }, // good = 100
        { name: "LCP", value: 3200 }, // needs-improvement = 60
        { name: "INP", value: 600 }, // poor = 30
      ];

      const expectedScore = Math.round((100 + 100 + 60 + 30) / 4);
      expect(calculatePerformanceScore(metrics)).toBe(expectedScore);
    });

    it("should handle mixed performance ratings", () => {
      const mixedMetrics = [
        { name: "CLS", value: 0.25 }, // needs-improvement = 60
        { name: "FCP", value: 3500 }, // poor = 30
      ];

      expect(calculatePerformanceScore(mixedMetrics)).toBe(45);
    });
  });

  describe("isValidMetricName", () => {
    it("should validate known metric names", () => {
      expect(isValidMetricName("CLS")).toBe(true);
      expect(isValidMetricName("FCP")).toBe(true);
      expect(isValidMetricName("LCP")).toBe(true);
      expect(isValidMetricName("INP")).toBe(true);
    });

    it("should reject invalid metric names", () => {
      expect(isValidMetricName("FID")).toBe(false); // Deprecated
      expect(isValidMetricName("UNKNOWN")).toBe(false);
      expect(isValidMetricName("")).toBe(false);
      expect(isValidMetricName("cls")).toBe(false); // Case sensitive
    });
  });

  describe("sanitizeMetricData", () => {
    it("should sanitize valid metric data", () => {
      const validData = {
        name: "CLS",
        value: 0.123,
        timestamp: 1234567890,
      };

      const result = sanitizeMetricData(validData);
      expect(result).toEqual(validData);
    });

    it("should add timestamp if missing", () => {
      const dataWithoutTimestamp = {
        name: "FCP",
        value: 1200,
      };

      const result = sanitizeMetricData(dataWithoutTimestamp);
      expect(result?.name).toBe("FCP");
      expect(result?.value).toBe(1200);
      expect(typeof result?.timestamp).toBe("number");
      expect(result?.timestamp).toBeGreaterThan(0);
    });

    it("should reject invalid data types", () => {
      expect(sanitizeMetricData(null)).toBe(null);
      expect(sanitizeMetricData(undefined)).toBe(null);
      expect(sanitizeMetricData("string")).toBe(null);
      expect(sanitizeMetricData(123)).toBe(null);
      expect(sanitizeMetricData([])).toBe(null);
    });

    it("should reject invalid metric names", () => {
      const invalidName = {
        name: "INVALID",
        value: 100,
      };

      expect(sanitizeMetricData(invalidName)).toBe(null);
    });

    it("should reject invalid metric values", () => {
      const testCases = [
        { name: "CLS", value: "not-a-number" },
        { name: "CLS", value: NaN },
        { name: "CLS", value: -1 },
        { name: "CLS", value: null },
        { name: "CLS", value: undefined },
      ];

      testCases.forEach((testCase) => {
        expect(sanitizeMetricData(testCase)).toBe(null);
      });
    });

    it("should handle edge cases", () => {
      // Zero is a valid value
      const zeroValue = { name: "CLS", value: 0 };
      expect(sanitizeMetricData(zeroValue)).not.toBe(null);

      // Missing name
      const missingName = { value: 100 };
      expect(sanitizeMetricData(missingName)).toBe(null);

      // Missing value
      const missingValue = { name: "CLS" };
      expect(sanitizeMetricData(missingValue)).toBe(null);
    });
  });

  describe("Integration Tests", () => {
    it("should work together for complete metric processing", () => {
      const rawData = {
        name: "CLS",
        value: 0.123,
        timestamp: Date.now(),
      };

      // Sanitize the data
      const sanitized = sanitizeMetricData(rawData);
      expect(sanitized).not.toBe(null);

      if (sanitized) {
        // Format the value
        const formatted = formatMetricValue(sanitized.name, sanitized.value);
        expect(formatted).toBe("0.123");

        // Get the rating
        const rating = getMetricRating(sanitized.name, sanitized.value);
        expect(rating).toBe("needs-improvement");

        // Calculate score
        const score = calculatePerformanceScore([sanitized]);
        expect(score).toBe(60);
      }
    });

    it("should handle batch processing of metrics", () => {
      const rawMetrics = [
        { name: "CLS", value: 0.05 },
        { name: "FCP", value: 1500 },
        { name: "LCP", value: 2200 },
        { name: "INP", value: 180 },
      ];

      // Sanitize all metrics
      const sanitizedMetrics = rawMetrics.map(sanitizeMetricData).filter(Boolean) as Array<{
        name: string;
        value: number;
        timestamp: number;
      }>;

      expect(sanitizedMetrics.length).toBe(4);

      // All should be rated as good
      sanitizedMetrics.forEach((metric) => {
        const rating = getMetricRating(metric.name, metric.value);
        expect(rating).toBe("good");
      });

      // Overall score should be 100
      const overallScore = calculatePerformanceScore(sanitizedMetrics);
      expect(overallScore).toBe(100);
    });
  });
});
