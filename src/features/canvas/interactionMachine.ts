import { assign, createMachine, type SnapshotFrom } from 'xstate'
import { isShapeTool, isTextTool, type EditorToolId } from '../../core/tools'

interface CanvasPoint {
  x: number
  y: number
}

type ResizeHandle = 'top' | 'right' | 'bottom' | 'left' | 'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft'

export type CanvasInteractionTransient =
  | { type: 'none' }
  | { type: 'pan'; source: 'tool' | 'middle-mouse' }
  | { type: 'shape-create'; shapeTool: 'square' | 'circle' | 'line'; origin: CanvasPoint }
  | { type: 'text-create'; origin: CanvasPoint }
  | { type: 'drag'; elementId: string }
  | { type: 'resize'; elementId: string; handle: ResizeHandle }
  | { type: 'text-edit'; elementId: string }

export interface CanvasInteractionContext {
  transient: CanvasInteractionTransient
}

export type CanvasInteractionEvent =
  | { type: 'PAN_START'; source: 'tool' | 'middle-mouse' }
  | { type: 'PAN_END' }
  | { type: 'SHAPE_CREATION_START'; shapeTool: 'square' | 'circle' | 'line'; origin: CanvasPoint }
  | { type: 'SHAPE_CREATION_END' }
  | { type: 'TEXT_CREATION_START'; origin: CanvasPoint }
  | { type: 'TEXT_CREATION_END' }
  | { type: 'DRAG_START'; elementId: string }
  | { type: 'DRAG_END' }
  | { type: 'RESIZE_START'; elementId: string; handle: ResizeHandle }
  | { type: 'RESIZE_END' }
  | { type: 'TEXT_EDIT_START'; elementId: string }
  | { type: 'TEXT_EDIT_END' }
  | { type: 'CANCEL' }

const emptyTransient: CanvasInteractionTransient = { type: 'none' }

export const canvasInteractionMachine = createMachine({
  types: {} as {
    context: CanvasInteractionContext
    events: CanvasInteractionEvent
  },
  id: 'canvasInteraction',
  context: {
    transient: emptyTransient,
  },
  initial: 'idle',
  on: {
    CANCEL: {
      target: '.idle',
      actions: assign({ transient: () => emptyTransient }),
    },
  },
  states: {
    idle: {
      on: {
        PAN_START: {
          target: 'panning',
          actions: assign({
            transient: ({ event }) => ({ type: 'pan', source: event.source })
          }),
        },
        SHAPE_CREATION_START: {
          target: 'shapeCreating',
          actions: assign({
            transient: ({ event }) => ({ type: 'shape-create', shapeTool: event.shapeTool, origin: event.origin })
          }),
        },
        TEXT_CREATION_START: {
          target: 'textCreating',
          actions: assign({
            transient: ({ event }) => ({ type: 'text-create', origin: event.origin })
          }),
        },
        DRAG_START: {
          target: 'dragging',
          actions: assign({
            transient: ({ event }) => ({ type: 'drag', elementId: event.elementId })
          }),
        },
        RESIZE_START: {
          target: 'resizing',
          actions: assign({
            transient: ({ event }) => ({ type: 'resize', elementId: event.elementId, handle: event.handle })
          }),
        },
        TEXT_EDIT_START: {
          target: 'textEditing',
          actions: assign({
            transient: ({ event }) => ({ type: 'text-edit', elementId: event.elementId })
          }),
        },
      },
    },
    panning: {
      on: {
        PAN_END: {
          target: 'idle',
          actions: assign({ transient: () => emptyTransient }),
        },
      },
    },
    shapeCreating: {
      on: {
        SHAPE_CREATION_END: {
          target: 'idle',
          actions: assign({ transient: () => emptyTransient }),
        },
      },
    },
    textCreating: {
      on: {
        TEXT_CREATION_END: {
          target: 'idle',
          actions: assign({ transient: () => emptyTransient }),
        },
      },
    },
    dragging: {
      on: {
        DRAG_END: {
          target: 'idle',
          actions: assign({ transient: () => emptyTransient }),
        },
      },
    },
    resizing: {
      on: {
        RESIZE_END: {
          target: 'idle',
          actions: assign({ transient: () => emptyTransient }),
        },
      },
    },
    textEditing: {
      on: {
        TEXT_EDIT_END: {
          target: 'idle',
          actions: assign({ transient: () => emptyTransient }),
        },
      },
    },
  },
})

export type CanvasInteractionSnapshot = SnapshotFrom<typeof canvasInteractionMachine>

export function resolveCanvasCursorClass(
  interactionState: CanvasInteractionSnapshot,
  activeTool: EditorToolId,
  idleCursorClass: string
): string {
  const transient = interactionState.context.transient

  if (transient.type === 'pan') return 'cursor-grabbing'
  if (transient.type === 'drag') return 'cursor-move'
  if (transient.type === 'resize') return 'cursor-se-resize'
  if (transient.type === 'text-edit') return 'cursor-text'
  if (transient.type === 'shape-create') return 'cursor-crosshair'
  if (transient.type === 'text-create') return 'cursor-text'
  if (isShapeTool(activeTool)) return 'cursor-crosshair'
  return idleCursorClass
}

function shouldClearCanvasSelection(activeTool: EditorToolId): boolean {
  return activeTool === 'move'
}

export function canPanFromPointer(activeTool: EditorToolId, mouseButtons: number): boolean {
  const isMiddleMousePan = (mouseButtons & 4) === 4
  return activeTool === 'hand' || isMiddleMousePan
}

export function resolveCanvasIdleCursorClass(activeTool: EditorToolId): string {
  if (activeTool === 'hand') return 'cursor-grab'
  return 'cursor-default'
}

export function resolveElementCursorClass(activeTool: EditorToolId): string {
  if (activeTool === 'move') return 'cursor-move'
  return 'cursor-default'
}

export function canSelectElementFromPointer(activeTool: EditorToolId, isTextElement: boolean): boolean {
  return activeTool === 'move' || (activeTool === 'text' && isTextElement)
}

export function canDragElement(activeTool: EditorToolId, isEditingText: boolean): boolean {
  return activeTool === 'move' && !isEditingText
}

export function canResizeElement(activeTool: EditorToolId, isEditingText: boolean): boolean {
  return activeTool === 'move' && !isEditingText
}

export function canShowElementSelectionChrome(activeTool: EditorToolId): boolean {
  return activeTool === 'move'
}

type CanvasBackgroundResolution =
  | {
      type: 'start-shape'
      shapeTool: 'square' | 'circle' | 'line'
      interactionEvent: {
        type: 'SHAPE_CREATION_START'
        shapeTool: 'square' | 'circle' | 'line'
        origin: CanvasPoint
      }
    }
  | {
      type: 'start-text'
      interactionEvent: {
        type: 'TEXT_CREATION_START'
        origin: CanvasPoint
      }
    }
  | { type: 'clear-selection' }
  | { type: 'none' }

type CanvasPointerDownAction =
  | { type: 'start-middle-pan' }
  | { type: 'resolve-background-action' }
  | { type: 'ignore' }

export function resolveCanvasPointerDownAction(button: number, isElementTarget: boolean): CanvasPointerDownAction {
  if (button === 1) {
    return { type: 'start-middle-pan' }
  }

  if (button !== 0 || isElementTarget) {
    return { type: 'ignore' }
  }

  return { type: 'resolve-background-action' }
}

export function resolveCanvasBackgroundResolution(
  interactionState: CanvasInteractionSnapshot,
  activeTool: EditorToolId,
  origin: CanvasPoint
): CanvasBackgroundResolution {
  if (isShapeTool(activeTool)) {
    const event: CanvasInteractionEvent = {
      type: 'SHAPE_CREATION_START',
      shapeTool: activeTool,
      origin,
    }

    if (interactionState.can(event)) {
      return {
        type: 'start-shape',
        shapeTool: activeTool,
        interactionEvent: event,
      }
    }
  }

  if (isTextTool(activeTool)) {
    const event: CanvasInteractionEvent = {
      type: 'TEXT_CREATION_START',
      origin,
    }

    if (interactionState.can(event)) {
      return {
        type: 'start-text',
        interactionEvent: event,
      }
    }
  }

  if (shouldClearCanvasSelection(activeTool)) {
    return {
      type: 'clear-selection',
    }
  }

  return { type: 'none' }
}