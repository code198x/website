/** Match progress-bar.bas: clamp the fill count, then choose one PAPER colour. */
export function progressBarCells(value: number): string[] {
  const filled = Math.max(0, Math.min(28, Math.floor(value * 28 / 100)));
  const colour = filled < 10 ? '#d70000' : filled < 19 ? '#d7d700' : '#00d700';
  return Array.from({ length: 28 }, (_, i) => i < filled ? colour : '#000000');
}
