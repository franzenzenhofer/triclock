import type { EdgeMapping } from './edge-mapping.js';
import type { GlowPass } from './glow-pass.js';
import type { GradientStop } from './gradient-stop.js';
import type { TipConfig } from './tip-config.js';
import type { TriangleLayerDef } from './triangle-layer.js';

export interface ColorsConfig {
  readonly background: string;
  readonly overlay: string;
  readonly frame: string;
  readonly hours: string;
  readonly minutes: string;
  readonly seconds: string;
  readonly inactive: string;
  readonly text: string;
}

export interface GeometryConfig {
  readonly sizeRatio: number;
  readonly botY: number;
  readonly halfBase: number;
}

export interface FrameLinesConfig {
  readonly width: number;
  readonly alpha: number;
}

export type TimeSource = 'hours' | 'minutes' | 'seconds';

export interface HslConfig {
  readonly hueSource: TimeSource;
  readonly satSource: TimeSource;
  readonly litSource: TimeSource;
  readonly satBase: number;
  readonly satRange: number;
  readonly litBase: number;
  readonly litAmplitude: number;
  readonly brightSat: number;
  readonly brightLitBoost: number;
  readonly brightLitMax: number;
}

export interface ScalesConfig {
  readonly majorTickRatio: number;
  readonly minorTickRatio: number;
  readonly majorWidth: number;
  readonly minorWidth: number;
  readonly activeAlpha: number;
  readonly inactiveAlpha: number;
  readonly labelOffsetPx: number;
  readonly labelSizeRatio: number;
  readonly labelActiveAlpha: number;
  readonly labelInactiveAlpha: number;
  readonly labelSizeMin: number;
  readonly labelFontFamily: string;
  readonly tickNormalOffset: number;
  readonly hoursDivisions: number;
  readonly minutesDivisions: number;
  readonly secondsDivisions: number;
  readonly hoursMajorEvery: number;
  readonly minutesMajorEvery: number;
  readonly secondsMajorEvery: number;
}

export interface EdgeGradientPass {
  readonly width: number;
  readonly alpha: number;
  readonly stops: readonly GradientStop[];
}

export interface EdgeProgressConfig {
  readonly passes: readonly EdgeGradientPass[];
  readonly coreWidth: number;
  readonly coreAlpha: number;
  readonly coreTailLength: number;
}

export interface PlasmaConfig {
  readonly enabled: boolean;
  readonly alpha: number;
  readonly speed: number;
  readonly textureSize: number;
  readonly blendMode: GlobalCompositeOperation;
}

export interface TrianglesConfig {
  readonly sectorLayers: readonly TriangleLayerDef[];
  readonly crossLayers: readonly TriangleLayerDef[];
  readonly wedgeLayers: readonly TriangleLayerDef[];
  readonly primaryLayer: TriangleLayerDef;
  readonly glowPasses: readonly GlowPass[];
  readonly shadowBlur: number;
  readonly shadowAlpha: number;
  readonly compositeOp: GlobalCompositeOperation;
  readonly hueStep: number;
  readonly lighterHueOffset: number;
  readonly lighterLitBoost: number;
  readonly darkerHueOffset: number;
  readonly darkerLitReduction: number;
  readonly gradientRadiusRatio: number;
  readonly lightGradientAlpha: number;
  readonly darkGradientAlpha: number;
  readonly borderLineWidth: number;
  readonly shadowLineWidth: number;
  readonly plasma: PlasmaConfig;
}

export interface TipsConfig {
  readonly hours: TipConfig;
  readonly minutes: TipConfig;
  readonly seconds: TipConfig;
  readonly vertexRadius: number;
  readonly vertexAlpha: number;
  readonly innerRadiusRatio: number;
  readonly innerAlpha: number;
  readonly innerColor: string;
  readonly gradientStops: readonly GradientStop[];
}

export interface EdgeLabelsConfig {
  readonly visible: boolean;
  readonly alpha: number;
  readonly offsetRatio: number;
  readonly fontSizeRatio: number;
  readonly fontSizeMin: number;
  readonly fontWeight: number;
  readonly fontFamily: string;
}

export interface DigitalTimeConfig {
  readonly xOffsetRatio: number;
  readonly yOffsetRatio: number;
  readonly fontSizeRatio: number;
  readonly fontSizeMin: number;
  readonly fontFamily: string;
  readonly fontWeight: number;
  readonly alpha: number;
  readonly visible: boolean;
  readonly showSeconds: boolean;
  readonly color: string;
  readonly shadowBlur: number;
  readonly shadowColor: string;
}

export interface BackgroundConfig {
  readonly overlayRadiusRatio: number;
}

export interface TrichronoConfig {
  readonly colors: ColorsConfig;
  readonly geometry: GeometryConfig;
  readonly frameLines: FrameLinesConfig;
  readonly hsl: HslConfig;
  readonly scales: ScalesConfig;
  readonly edgeProgress: EdgeProgressConfig;
  readonly triangles: TrianglesConfig;
  readonly tips: TipsConfig;
  readonly edgeLabels: EdgeLabelsConfig;
  readonly digitalTime: DigitalTimeConfig;
  readonly background: BackgroundConfig;
  readonly edgeMapping: EdgeMapping;
}
