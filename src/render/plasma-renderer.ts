import { PLASMA_VERTEX, PLASMA_FRAGMENT } from './plasma-shaders.js';

export interface PlasmaRenderer {
  readonly canvas: HTMLCanvasElement;
  render(time: number, tintR: number, tintG: number, tintB: number, phase: number): void;
}

function compileShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('Failed to create shader');
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader) ?? 'unknown error';
    gl.deleteShader(shader);
    throw new Error(`Shader compile: ${log}`);
  }
  return shader;
}

function linkProgram(gl: WebGL2RenderingContext, vs: WebGLShader, fs: WebGLShader): WebGLProgram {
  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(prog) ?? 'unknown error';
    throw new Error(`Link: ${log}`);
  }
  return prog;
}

function createQuad(gl: WebGL2RenderingContext, program: WebGLProgram): WebGLVertexArrayObject {
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(program, 'aPosition');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  gl.bindVertexArray(null);
  return vao;
}

/** the largest colour-field texture: the field is copied into the canvas once per triangle layer every frame,
    in an app that keeps the screen on all day, so its size is a battery and heat budget */
export const MAX_PLASMA_TEXTURE = 1536;
/** the field is a soft, low-frequency glow: drawn at 2 device pixels per point it is indistinguishable from 3 */
export const MAX_PLASMA_DENSITY = 2;

/** the texture edge that covers the triangle's bounds at the screen's pixel density (never below `min`) */
export function plasmaTextureSize(boundsW: number, boundsH: number, dpr: number, min: number): number {
  const wanted = Math.ceil(Math.max(boundsW, boundsH) * Math.min(dpr, MAX_PLASMA_DENSITY));
  return Math.min(MAX_PLASMA_TEXTURE, Math.max(min, wanted));
}

let instance: PlasmaRenderer | null = null;
let resize: ((size: number) => void) | null = null;

export function getPlasmaRenderer(size: number): PlasmaRenderer | null {
  if (instance) {
    if (instance.canvas.width !== size) resize?.(size);
    return instance;
  }

  if (typeof document === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const gl = canvas.getContext('webgl2', { alpha: false, antialias: false, preserveDrawingBuffer: true });
  if (!gl) return null;

  const vs = compileShader(gl, gl.VERTEX_SHADER, PLASMA_VERTEX);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, PLASMA_FRAGMENT);
  const prog = linkProgram(gl, vs, fs);
  const vao = createQuad(gl, prog);

  gl.useProgram(prog);
  gl.viewport(0, 0, size, size);

  const uTime = gl.getUniformLocation(prog, 'uTime');
  const uPhase = gl.getUniformLocation(prog, 'uPhase');
  const uRes = gl.getUniformLocation(prog, 'uResolution');
  const uTint = gl.getUniformLocation(prog, 'uTint');

  gl.uniform2f(uRes, size, size);
  resize = (next: number): void => {
    canvas.width = next;
    canvas.height = next;
    gl.viewport(0, 0, next, next);
    gl.uniform2f(uRes, next, next);
  };

  instance = {
    canvas,
    render(time: number, tintR: number, tintG: number, tintB: number, phase: number): void {
      gl.uniform1f(uTime, time);
      gl.uniform1f(uPhase, phase);
      gl.uniform3f(uTint, tintR, tintG, tintB);
      gl.bindVertexArray(vao);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
  };

  return instance;
}
