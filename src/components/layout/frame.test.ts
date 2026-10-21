import { describe, expect, it } from 'vitest';
import { refuseCaptures } from './frame';

describe('refuseCaptures', () => {
  it('lets an illustration through', () => {
    expect(() => refuseCaptures('<img class="h-figure-img" src="/images/photo.webp" alt="">')).not.toThrow();
  });

  it.each(['native-capture', 'figure-capture', 'native-image'])('refuses content marked %s', marker => {
    expect(() => refuseCaptures(`<div class="figure ${marker}"><img src="/x.png" alt=""></div>`)).toThrow(/cannot hold a capture/);
  });

  it('ignores the words outside a class attribute', () => {
    expect(() => refuseCaptures('<p>A native-image is decoded at build time.</p>')).not.toThrow();
  });
});
