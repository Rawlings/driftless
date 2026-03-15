export type { Point, SnapGuide, CreatingShapeState, CreatingTextState } from './canvasTypes'

export {
  createSnapGuideLookup,
  computeSnapFromLookup,
  computeSnap,
  type SnapRect,
  type SnapResult,
  type SnapGuideLookup,
} from './snapEngine'