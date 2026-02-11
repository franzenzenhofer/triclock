export const PLASMA_VERTEX = `#version 300 es
precision highp float;
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

export const PLASMA_FRAGMENT = `#version 300 es
precision highp float;
uniform float uTime;
uniform float uPhase;
uniform vec2 uResolution;
uniform vec3 uTint;
out vec4 fragColor;

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float aspect = uResolution.x / uResolution.y;
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0) * 8.0;
  float t = uTime + uPhase;

  vec2 q = vec2(
    sin(p.x * 0.4 + p.y * 0.3 + t * 0.4),
    cos(p.x * 0.3 - p.y * 0.4 + t * 0.3)
  );
  vec2 w = p + q * 2.0;

  float v = sin(w.x * 1.2 + t * 0.6)
          + cos(w.y - t * 0.5)
          + sin((w.x + w.y) * 0.7 + t * 0.8)
          + sin(length(w) * 1.5 - t)
          + cos(length(w - vec2(sin(t * 0.2) * 3.0, cos(t * 0.3) * 3.0)) * 1.2);

  float nv = sin(v * 0.15);

  vec3 col = 0.55 + 0.45 * cos(
    6.2832 * (nv * 0.4 + 0.5)
    + vec3(0.0, 2.1, 4.2)
    + t * vec3(0.05, 0.07, 0.09)
  );
  col *= 0.5 + 0.7 * smoothstep(-0.8, 0.8, nv);
  col += col * max(0.0, nv - 0.3) * 0.3;
  col = mix(col, uTint, 0.45);

  fragColor = vec4(col, 1.0);
}
`;
