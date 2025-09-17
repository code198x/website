/**
 * Image optimization utilities for responsive loading and performance
 */

/**
 * Generate srcset string for responsive images
 */
export function generateSrcset(
  baseUrl: string,
  widths: number[] = [320, 640, 960, 1280, 1920],
  format?: string
): string {
  return widths
    .map((w) => {
      const params = new URLSearchParams();
      params.set("w", w.toString());
      if (format) params.set("fm", format);
      return `${baseUrl}?${params} ${w}w`;
    })
    .join(", ");
}

/**
 * Generate sizes attribute based on common breakpoints
 */
export function generateSizes(config?: {
  mobile?: string;
  tablet?: string;
  desktop?: string;
  default?: string;
}): string {
  const {
    mobile = "100vw",
    tablet = "50vw",
    desktop = "33vw",
    default: defaultSize = "100vw",
  } = config || {};

  return `(max-width: 640px) ${mobile}, (max-width: 1024px) ${tablet}, (max-width: 1536px) ${desktop}, ${defaultSize}`;
}

/**
 * Calculate optimal widths for srcset based on viewport and DPR
 */
export function calculateOptimalWidths(
  baseWidth: number,
  densities: number[] = [1, 1.5, 2, 3]
): number[] {
  return densities
    .map((density) => Math.round(baseWidth * density))
    .filter((width, index, self) => self.indexOf(width) === index) // Remove duplicates
    .sort((a, b) => a - b);
}

/**
 * Generate blur placeholder data URL
 */
export function generateBlurPlaceholder(
  width: number,
  height: number,
  color: string = "#e2e8f0"
): string {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}'%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='discrete' tableValues='1 1'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' fill='${encodeURIComponent(color)}' filter='url(%23b)'/%3E%3C/svg%3E`;
}

/**
 * Generate LQIP (Low Quality Image Placeholder) as base64
 */
export async function generateLQIP(
  imagePath: string,
  width: number = 40,
  quality: number = 20
): Promise<string | null> {
  try {
    // This would typically use a server-side image processing library
    // For now, return a simple SVG placeholder
    return generateBlurPlaceholder(width, Math.round(width * 0.75));
  } catch (error) {
    console.error("Failed to generate LQIP:", error);
    return null;
  }
}

/**
 * Image format detection based on browser support
 */
export function getOptimalFormat(): "avif" | "webp" | "jpeg" {
  if (typeof window === "undefined") return "jpeg";

  // Check AVIF support
  const avifSupport =
    document.createElement("canvas").toDataURL("image/avif").indexOf("image/avif") > -1;

  if (avifSupport) return "avif";

  // Check WebP support
  const webpSupport =
    document.createElement("canvas").toDataURL("image/webp").indexOf("image/webp") > -1;

  if (webpSupport) return "webp";

  return "jpeg";
}

/**
 * Preload critical images
 */
export function preloadImage(src: string, srcset?: string, sizes?: string, type?: string): void {
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "image";
  link.href = src;

  if (srcset) link.setAttribute("imagesrcset", srcset);
  if (sizes) link.setAttribute("imagesizes", sizes);
  if (type) link.setAttribute("type", type);

  document.head.appendChild(link);
}

/**
 * Configure image based on network conditions
 */
export function getNetworkAwareImageConfig(): {
  quality: number;
  format: string;
  loading: "lazy" | "eager";
} {
  if (typeof navigator === "undefined") {
    return { quality: 75, format: "auto", loading: "lazy" };
  }

  const connection =
    (navigator as any).connection ||
    (navigator as any).mozConnection ||
    (navigator as any).webkitConnection;

  if (!connection) {
    return { quality: 75, format: "auto", loading: "lazy" };
  }

  const effectiveType = connection.effectiveType;
  const saveData = connection.saveData;

  // Adjust quality based on network
  if (saveData || effectiveType === "slow-2g" || effectiveType === "2g") {
    return { quality: 40, format: "webp", loading: "lazy" };
  }

  if (effectiveType === "3g") {
    return { quality: 60, format: "webp", loading: "lazy" };
  }

  // High-speed connection
  return { quality: 85, format: getOptimalFormat(), loading: "lazy" };
}

/**
 * Calculate aspect ratio from dimensions
 */
export function calculateAspectRatio(width: number, height: number): string {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);
  return `${width / divisor}/${height / divisor}`;
}

/**
 * Image loading priority based on viewport position
 */
export function getLoadingPriority(element: HTMLElement): "high" | "low" | "auto" {
  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight;

  // Above the fold - high priority
  if (rect.top < viewportHeight && rect.bottom > 0) {
    return "high";
  }

  // Just below the fold - auto priority
  if (rect.top < viewportHeight * 2) {
    return "auto";
  }

  // Far below the fold - low priority
  return "low";
}

/**
 * Debounced image loader for scroll events
 */
export class ImageLoadScheduler {
  private queue: Set<HTMLImageElement> = new Set();
  private isProcessing = false;
  private observer: IntersectionObserver | null = null;

  constructor() {
    this.initObserver();
  }

  private initObserver(): void {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            this.loadImage(img);
            this.observer?.unobserve(img);
          }
        });
      },
      {
        rootMargin: "100px 0px", // Start loading 100px before entering viewport
        threshold: 0.01,
      }
    );
  }

  public observe(img: HTMLImageElement): void {
    if (this.observer) {
      this.observer.observe(img);
    } else {
      // Fallback for browsers without IntersectionObserver
      this.queue.add(img);
      this.processQueue();
    }
  }

  private async loadImage(img: HTMLImageElement): Promise<void> {
    const src = img.dataset.src || img.src;
    if (!src) return;

    try {
      // Preload image
      await new Promise((resolve, reject) => {
        const tempImg = new Image();
        tempImg.onload = resolve;
        tempImg.onerror = reject;
        tempImg.src = src;
      });

      // Apply to actual element
      if (img.dataset.src) {
        img.src = img.dataset.src;
        delete img.dataset.src;
      }
      img.classList.add("loaded");
    } catch (error) {
      console.error("Failed to load image:", src, error);
      img.classList.add("error");
    }
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.size === 0) return;

    this.isProcessing = true;
    const batch = Array.from(this.queue).slice(0, 3); // Process 3 at a time

    await Promise.all(batch.map((img) => this.loadImage(img)));

    batch.forEach((img) => this.queue.delete(img));
    this.isProcessing = false;

    // Continue processing if more items
    if (this.queue.size > 0) {
      requestAnimationFrame(() => this.processQueue());
    }
  }

  public destroy(): void {
    this.observer?.disconnect();
    this.queue.clear();
  }
}

// Export singleton instance
export const imageLoader = typeof window !== "undefined" ? new ImageLoadScheduler() : null;
