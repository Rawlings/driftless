import type { Element } from './types'

interface ToolbarProps {
  onAddElement: (type: Element['type']) => void
}

export function Toolbar({ onAddElement }: ToolbarProps) {
  return (
    <div className="w-48 p-4 border-r border-gray-300">
      <h3 className="text-lg font-bold">Toolbar</h3>
      <button
        className="block w-full mb-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => onAddElement('square')}
      >
        Add Square
      </button>
      <button
        className="block w-full mb-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => onAddElement('circle')}
      >
        Add Circle
      </button>
      <button
        className="block w-full mb-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => onAddElement('line')}
      >
        Add Line
      </button>
    </div>
  )
}