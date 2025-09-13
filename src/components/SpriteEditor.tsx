import { useState, useCallback } from "react";

interface Props {
  platform: "c64" | "nes" | "atari800" | "spectrum";
  width?: number;
  height?: number;
  multicolor?: boolean;
  onDataChange?: (data: number[]) => void;
}

export default function SpriteEditor({
  platform,
  width = 8,
  height = 8,
  multicolor = false,
  onDataChange,
}: Props) {
  // Initialize sprite data
  const initGrid = () =>
    Array(height)
      .fill(0)
      .map(() => Array(width).fill(0));
  const [pixels, setPixels] = useState<number[][]>(initGrid);
  const [currentColor, setCurrentColor] = useState(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [scale, setScale] = useState(2);

  // Platform-specific colors
  const colors = {
    c64: [
      "#000000",
      "#FFFFFF",
      "#880000",
      "#AAFFEE",
      "#CC44CC",
      "#00CC55",
      "#0000AA",
      "#EEEE77",
      "#DD8855",
      "#664400",
      "#FF7777",
      "#333333",
      "#777777",
      "#AAFF66",
      "#0088FF",
      "#BBBBBB",
    ],
    nes: ["#000000", "#FCFCFC", "#F8B800", "#F87858", "#AC7C00", "#00A800", "#00B800", "#503000"],
    atari800: [
      "#000000",
      "#FFFFFF",
      "#FFB810",
      "#FF6821",
      "#FF3121",
      "#CD1F39",
      "#942B52",
      "#5A316B",
    ],
    spectrum: [
      "#000000",
      "#0000FF",
      "#FF0000",
      "#FF00FF",
      "#00FF00",
      "#00FFFF",
      "#FFFF00",
      "#FFFFFF",
    ],
  };

  const platformColors = colors[platform] || colors.c64;

  // Toggle pixel
  const togglePixel = useCallback(
    (row: number, col: number) => {
      const newPixels = [...pixels];
      newPixels[row][col] = currentColor;
      setPixels(newPixels);

      // Generate and emit data
      const data = generateSpriteData(newPixels);
      onDataChange?.(data);
    },
    [pixels, currentColor, onDataChange]
  );

  // Generate sprite data based on platform
  const generateSpriteData = (grid: number[][]): number[] => {
    const data: number[] = [];

    if (platform === "c64") {
      // C64 sprites: 24x21 pixels, 3 bytes per row
      for (let row = 0; row < grid.length; row++) {
        let byte1 = 0,
          byte2 = 0,
          byte3 = 0;

        for (let col = 0; col < Math.min(8, grid[row].length); col++) {
          if (grid[row][col]) byte1 |= 1 << (7 - col);
        }
        for (let col = 8; col < Math.min(16, grid[row].length); col++) {
          if (grid[row][col]) byte2 |= 1 << (15 - col);
        }
        for (let col = 16; col < Math.min(24, grid[row].length); col++) {
          if (grid[row][col]) byte3 |= 1 << (23 - col);
        }

        data.push(byte1, byte2, byte3);
      }
    } else {
      // Simple 8x8 for other platforms
      for (let row = 0; row < grid.length; row++) {
        let byte = 0;
        for (let col = 0; col < Math.min(8, grid[row].length); col++) {
          if (grid[row][col]) byte |= 1 << (7 - col);
        }
        data.push(byte);
      }
    }

    return data;
  };

  // Clear sprite
  const clearSprite = () => {
    setPixels(initGrid());
    onDataChange?.([]);
  };

  // Fill sprite
  const fillSprite = () => {
    const filled = Array(height)
      .fill(0)
      .map(() => Array(width).fill(currentColor));
    setPixels(filled);
    onDataChange?.(generateSpriteData(filled));
  };

  // Invert sprite
  const invertSprite = () => {
    const inverted = pixels.map((row) => row.map((pixel) => (pixel === 0 ? currentColor : 0)));
    setPixels(inverted);
    onDataChange?.(generateSpriteData(inverted));
  };

  // Generate export formats
  const getExportData = () => {
    const data = generateSpriteData(pixels);

    const formats = {
      hex: data.map((b) => "$" + b.toString(16).toUpperCase().padStart(2, "0")).join(", "),
      decimal: data.join(", "),
      binary: data.map((b) => "%" + b.toString(2).padStart(8, "0")).join(", "),
      basic: "DATA " + data.join(", "),
      assembly:
        ".byte " + data.map((b) => "$" + b.toString(16).toUpperCase().padStart(2, "0")).join(", "),
    };

    return formats;
  };

  const exportData = getExportData();

  return (
    <div className="sprite-editor bg-slate-900 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white text-lg font-bold">Sprite Editor</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setShowGrid(!showGrid)}
            className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs hover:bg-slate-600"
          >
            Grid {showGrid ? "ON" : "OFF"}
          </button>
          <select
            value={scale}
            onChange={(e) => setScale(Number(e.target.value))}
            className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs"
          >
            <option value="1">1x</option>
            <option value="2">2x</option>
            <option value="3">3x</option>
            <option value="4">4x</option>
          </select>
        </div>
      </div>

      {/* Color Palette */}
      <div className="color-palette mb-4">
        <div className="text-slate-400 text-xs mb-2">Colors</div>
        <div className="flex flex-wrap gap-1">
          {platformColors.slice(0, multicolor ? 4 : 2).map((color, i) => (
            <button
              key={i}
              onClick={() => setCurrentColor(i)}
              className={`w-8 h-8 rounded border-2 ${
                currentColor === i ? "border-white" : "border-slate-600"
              }`}
              style={{ backgroundColor: color }}
              title={`Color ${i}`}
            />
          ))}
        </div>
      </div>

      {/* Drawing Grid */}
      <div className="drawing-area mb-4">
        <div
          className="inline-block bg-slate-800 p-2 rounded"
          onMouseLeave={() => setIsDrawing(false)}
        >
          {pixels.map((row, y) => (
            <div key={y} className="flex">
              {row.map((pixel, x) => (
                <div
                  key={`${x}-${y}`}
                  className={`pixel ${showGrid ? "border border-slate-700" : ""}`}
                  style={{
                    width: 16 * scale + "px",
                    height: 16 * scale + "px",
                    backgroundColor: platformColors[pixel],
                    cursor: "crosshair",
                  }}
                  onMouseDown={() => {
                    setIsDrawing(true);
                    togglePixel(y, x);
                  }}
                  onMouseEnter={() => {
                    if (isDrawing) togglePixel(y, x);
                  }}
                  onMouseUp={() => setIsDrawing(false)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Tools */}
      <div className="tools flex gap-2 mb-4">
        <button
          onClick={clearSprite}
          className="px-3 py-1 bg-red-700 text-white rounded text-sm hover:bg-red-600"
        >
          Clear
        </button>
        <button
          onClick={fillSprite}
          className="px-3 py-1 bg-green-700 text-white rounded text-sm hover:bg-green-600"
        >
          Fill
        </button>
        <button
          onClick={invertSprite}
          className="px-3 py-1 bg-blue-700 text-white rounded text-sm hover:bg-blue-600"
        >
          Invert
        </button>
      </div>

      {/* Data Output */}
      <div className="data-output space-y-2">
        <div className="text-slate-400 text-xs">Sprite Data</div>

        <div className="bg-slate-800 p-2 rounded">
          <div className="text-xs text-slate-500 mb-1">Hex:</div>
          <code className="text-xs text-green-400 font-mono break-all">{exportData.hex}</code>
        </div>

        <div className="bg-slate-800 p-2 rounded">
          <div className="text-xs text-slate-500 mb-1">BASIC:</div>
          <code className="text-xs text-blue-400 font-mono">{exportData.basic}</code>
        </div>

        <div className="bg-slate-800 p-2 rounded">
          <div className="text-xs text-slate-500 mb-1">Assembly:</div>
          <code className="text-xs text-yellow-400 font-mono">{exportData.assembly}</code>
        </div>
      </div>
    </div>
  );
}
