import { describe, expect, it } from 'vitest';
import { SampleRing } from './audio-ring';

/** A rate small enough to count by hand: 100 frames cap, 32 cushion. */
const RATE = 400;

/** Interleaved stereo where left is n and right is -n, so order is visible. */
const frames = (from: number, count: number) =>
  Float32Array.from({ length: count * 2 }, (_, i) => (i % 2 === 0 ? 1 : -1) * (from + (i >> 1)));

const pull = (ring: SampleRing, count: number) => {
  const left = new Float32Array(count);
  const right = new Float32Array(count);
  ring.pull([left, right]);
  return { left: Array.from(left), right: Array.from(right) };
};

describe('SampleRing', () => {
  it('holds a quarter of a second and cushions 80 ms', () => {
    const ring = new SampleRing(RATE);
    expect(ring.capacity).toBe(200);
    expect(ring.cushion).toBe(64);
  });

  it('stays silent until the cushion has built up', () => {
    const ring = new SampleRing(RATE);
    ring.push(frames(1, 31));
    expect(pull(ring, 4).left).toEqual([0, 0, 0, 0]);
    expect(ring.length).toBe(62);
    ring.push(frames(32, 1));
    expect(pull(ring, 3)).toEqual({ left: [1, 2, 3], right: [-1, -2, -3] });
  });

  it('drops the oldest samples rather than growing the delay', () => {
    const ring = new SampleRing(RATE);
    ring.push(frames(1, 80));
    ring.push(frames(81, 40));
    expect(ring.length).toBe(ring.capacity);
    expect(ring.dropped).toBe(40);
    // Frames 1 to 20 went; playback resumes at the oldest survivor.
    expect(pull(ring, 2).left).toEqual([21, 22]);
  });

  it('keeps only the newest part of a burst larger than the queue', () => {
    const ring = new SampleRing(RATE);
    ring.push(frames(1, 250));
    expect(ring.length).toBe(200);
    expect(pull(ring, 1)).toEqual({ left: [151], right: [-151] });
  });

  it('wraps around the end of the buffer in order', () => {
    const ring = new SampleRing(RATE);
    ring.push(frames(1, 90));
    pull(ring, 80);
    ring.push(frames(91, 60));
    expect(pull(ring, 70).left).toEqual(Array.from({ length: 70 }, (_, i) => 81 + i));
  });

  it('plays silence after running dry and waits for the cushion again', () => {
    const ring = new SampleRing(RATE);
    ring.push(frames(1, 40));
    const block = pull(ring, 45);
    expect(block.left.slice(38)).toEqual([39, 40, 0, 0, 0, 0, 0]);
    expect(ring.playing).toBe(false);
    ring.push(frames(41, 10));
    expect(pull(ring, 2).left).toEqual([0, 0]);
  });

  it('ignores a trailing half frame so channels never swap', () => {
    const ring = new SampleRing(RATE);
    ring.push(Float32Array.of(...frames(1, 40), 99));
    expect(ring.length).toBe(80);
    expect(pull(ring, 1)).toEqual({ left: [1], right: [-1] });
  });

  it('forgets everything on clear', () => {
    const ring = new SampleRing(RATE);
    ring.push(frames(1, 40));
    ring.clear();
    expect(ring.length).toBe(0);
    expect(pull(ring, 2).left).toEqual([0, 0]);
  });
});
