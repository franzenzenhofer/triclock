import type { TriangleVertices } from '../types/index.js';

export interface PlasmaBounds {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface PlasmaDrawContext {
  readonly time: number;
  readonly bounds: PlasmaBounds;
}

export function computePlasmaTime(nowMs: number, speed: number): number {
  return (nowMs / 1000) * speed;
}

export function computePlasmaBounds(verts: TriangleVertices): PlasmaBounds {
  const minX = Math.min(verts.A.x, verts.B.x, verts.C.x);
  const maxX = Math.max(verts.A.x, verts.B.x, verts.C.x);
  const minY = Math.min(verts.A.y, verts.B.y, verts.C.y);
  const maxY = Math.max(verts.A.y, verts.B.y, verts.C.y);
  const width = maxX - minX;
  const height = maxY - minY;
  const side = Math.max(width, height);
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  return {
    x: centerX - side / 2,
    y: centerY - side / 2,
    width: side,
    height: side,
  };
}

export function createPlasmaDrawContext(
  verts: TriangleVertices,
  nowMs: number,
  speed: number,
): PlasmaDrawContext {
  return {
    time: computePlasmaTime(nowMs, speed),
    bounds: computePlasmaBounds(verts),
  };
}
