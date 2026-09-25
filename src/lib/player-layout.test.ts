import { describe, expect, it } from 'vitest';
import { panelMode, stripLayout } from './player-layout';

describe('stripLayout', () => {
  it('puts captures up to 416px beside the text', () => {
    expect(stripLayout(352)).toBe('beside');
    expect(stripLayout(416)).toBe('beside');
  });
  it('puts wider captures above the text', () => {
    expect(stripLayout(417)).toBe('above');
    expect(stripLayout(768)).toBe('above');
  });
});

describe('panelMode', () => {
  const gap = 40;
  it('goes fullscreen below 768px', () => {
    expect(panelMode({ viewportWidth: 767, containerWidth: 735, panelWidth: 352, gap })).toBe('fullscreen');
  });
  it('docks when at least 600px of prose remains', () => {
    // 1440 viewport, 32px gutters: 1376 - 416 - 40 = 920
    expect(panelMode({ viewportWidth: 1440, containerWidth: 1376, panelWidth: 416, gap })).toBe('docked');
  });
  it('overlays when docking would squeeze the prose', () => {
    // Amiga at 1440: 1376 - 768 - 40 = 568
    expect(panelMode({ viewportWidth: 1440, containerWidth: 1376, panelWidth: 768, gap })).toBe('overlay');
  });
  it('docks an Amiga on a wide screen', () => {
    expect(panelMode({ viewportWidth: 1600, containerWidth: 1440, panelWidth: 768, gap })).toBe('docked');
  });
});
