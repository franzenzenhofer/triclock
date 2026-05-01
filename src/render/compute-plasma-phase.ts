// Plasma phase must be C0-continuous in real time. Earlier code derived phase
// from `(base.h + layer.hueOffset + hueStep * i) % 360 / 60`, which jumped by
// ~6 every time any of those modulos rolled over (e.g. at second 45 for the
// wedge layer). The shader's `t = uTime + uPhase` then teleported the noise
// field, producing the visible "shading shock". Keeping phase as a constant
// per (layer, trio) keeps each triangle's plasma visually distinct while the
// shader's existing `uTime` channel provides the time-evolving motion.
export function computePlasmaPhase(
  layerHueOffset: number,
  hueStep: number,
  trioIndex: number,
): number {
  return (layerHueOffset + hueStep * trioIndex) / 60;
}
