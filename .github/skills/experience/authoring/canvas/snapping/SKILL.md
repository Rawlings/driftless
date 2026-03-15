---
name: snapping
description: Define element snap behavior during move and resize interactions — edge alignment, center alignment, guide indicators, and hierarchy awareness.
user-invocable: true
metadata:
  taxonomy: experience/authoring/canvas/snapping
---

## Objectives

- Make precise alignment effortless through automatic snap-to-edge and snap-to-center.
- Provide clear visual feedback during interaction so the user understands what will align.
- Respect element hierarchy — only snap to elements in the same scope (same parent or root-level siblings).

## Snap Types

- **Edge-to-edge**: left, right, top, bottom of dragged element snaps to matching edges of other elements.
- **Center alignment**: centerX or centerY of dragged element snaps to horizontal/vertical center of other elements.
- **Silent snap**: only one snap candidate per axis is active at a time — the closest one within threshold.

## Snap Threshold

- Default threshold: 6px (canvas world coordinates, not screen pixels).
- Only the nearest snap candidate within the threshold triggers.
- Both axes are evaluated independently.

## Guide Lines

- A vertical guide line is drawn when an X-axis snap is active (element edge or center aligns).
- A horizontal guide line is drawn when a Y-axis snap is active.
- Guide lines span the full visible canvas area and sit above element content.
- Guide lines are **blue** (matching the selection ring color) at 60% opacity.
- Guide lines appear only during active drag or resize interaction.
- Guide lines disappear immediately when the pointer is released.

## Drag Behavior

- Snap is computed on every `onDrag` pointer-move event.
- Guide lines update live during drag to show what will snap on release.
- The committed position on pointer release (`onDragStop`) applies the snapped coordinates.
- The element itself freely follows the pointer during drag (no sticky anchor). Only the commit is snapped.

## Resize Behavior

- On resize commit (`onResizeStop`), the resulting bounding box edges and center are tested against all candidates.
- The nearest snap in each axis is applied to the final size/position.

## Hierarchy Rules

- Snapping only happens between elements sharing the same parent (or both at root level).
- An element never snaps to its own children or to itself.
- Locked and hidden elements are excluded from snap candidates.

## Implementation Contract

- Snap computation lives in a pure utility module (`snapEngine.ts`).
- `SnapGuide[]` is stored in editor context — components read it; only ElementRenderer writes it.
- `ElementRenderer` computes snap using the `computeSnap` function on drag/resize events.
- `Canvas` renders guide line elements from `snapGuides` context value, inside the viewport transform container.
- `setSnapGuides([])` is always called on drag/resize end to clear guides.

## Acceptance Criteria

- Dragging an element near another element's edge snaps to it precisely.
- Center-to-center alignment is detectable and snaps.
- Guide lines appear at the exact snap coordinate when active.
- Guides clear immediately on release — no residual lines.
- Locked and hidden elements are not snap targets.
- Elements do not snap to themselves or their children.
