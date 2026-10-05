import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  loadHashConfig,
  loadHashMode,
  loadHashParams,
} from '../../src/config/hash.js';

function setHash(hash: string): void {
  vi.stubGlobal('window', {
    location: {
      hash,
      pathname: '/',
      origin: 'https://triclock.franzai.com',
      protocol: 'https:',
    },
    history: { replaceState: () => {} },
  });
}

describe('hash parsing', () => {
  beforeEach(() => {
    setHash('');
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('parses #?time=HH:MM:SS as a time override', () => {
    setHash('#?time=12:34:56');
    const params = loadHashParams();
    expect(params.time).toEqual({ hours: 12, minutes: 34, seconds: 56, ms: 0 });
    expect(loadHashMode()).toBeNull();
    expect(loadHashConfig()).toBeNull();
  });

  it('parses mode + time: #prism?time=09:08:07', () => {
    setHash('#prism?time=09:08:07');
    expect(loadHashMode()).toBe('prism');
    const params = loadHashParams();
    expect(params.time).toEqual({ hours: 9, minutes: 8, seconds: 7, ms: 0 });
  });

  it('parses bare display mode (#flux)', () => {
    setHash('#flux');
    expect(loadHashMode()).toBe('flux');
    expect(loadHashParams().time).toBeNull();
  });

  it('treats invalid time strings as no override', () => {
    setHash('#?time=99:99:99');
    expect(loadHashParams().time).toBeNull();
  });

  it('returns no params when hash is empty', () => {
    setHash('');
    expect(loadHashMode()).toBeNull();
    expect(loadHashConfig()).toBeNull();
    expect(loadHashParams().time).toBeNull();
  });

  it('honors plasma=off flag', () => {
    setHash('#?plasma=off');
    expect(loadHashParams().plasma).toBe(false);
  });

  it('plasma defaults to true when unspecified', () => {
    setHash('#?time=01:02:03');
    expect(loadHashParams().plasma).toBe(true);
  });

  it('combines plasma=off with time on either side of &', () => {
    setHash('#?plasma=off&time=11:22:33');
    const params = loadHashParams();
    expect(params.plasma).toBe(false);
    expect(params.time).toEqual({ hours: 11, minutes: 22, seconds: 33, ms: 0 });
  });
});

describe('older and wrapped hashes', () => {
  afterEach(() => { vi.unstubAllGlobals(); });

  it('still reads the older #mode&time= form', () => {
    setHash('#flux&time=10:09:30');
    expect(loadHashMode()).toBe('flux');
    expect(loadHashParams().time).toEqual({ hours: 10, minutes: 9, seconds: 30, ms: 0 });
  });

  it('reads a share link behind the iOS screenshot prefix', () => {
    setHash('#ios-maker-shot=prism?time=14:25:45');
    expect(loadHashMode()).toBe('prism');
    expect(loadHashParams().time).toEqual({ hours: 14, minutes: 25, seconds: 45, ms: 0 });
  });
});
