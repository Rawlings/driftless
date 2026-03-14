import { useState } from 'react'

interface Element {
  id: string
  type: 'line' | 'circle' | 'square'
  x: number
  y: number
  width: number
  height: number
  styles: {
    color: string
    borderWidth: number
    shadow: string
  }
}

function Editor() {
  const [elements, setElements] = useState<Element[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const addElement = (type: Element['type']) => {
    const newElement: Element = {
      id: Date.now().toString(),
      type,
      x: 100,
      y: 100,
      width: 100,
      height: type === 'line' ? 2 : 100,
      styles: {
        color: '#000',
        borderWidth: 1,
        shadow: 'none'
      }
    }
    setElements([...elements, newElement])
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '200px', padding: '10px', borderRight: '1px solid #ccc' }}>
        <h3>Toolbar</h3>
        <button onClick={() => addElement('square')}>Add Square</button>
        <button onClick={() => addElement('circle')}>Add Circle</button>
        <button onClick={() => addElement('line')}>Add Line</button>
      </div>
      <div style={{ flex: 1, position: 'relative', background: '#f0f0f0' }}>
        {elements.map(el => (
          <div
            key={el.id}
            style={{
              position: 'absolute',
              left: el.x,
              top: el.y,
              width: el.width,
              height: el.height,
              backgroundColor: el.styles.color,
              border: `${el.styles.borderWidth}px solid black`,
              boxShadow: el.styles.shadow,
              borderRadius: el.type === 'circle' ? '50%' : '0'
            }}
          />
        ))}
      </div>
      <div style={{ width: '200px', padding: '10px', borderLeft: '1px solid #ccc' }}>
        <h3>Properties</h3>
        {selectedId ? <p>Selected: {selectedId}</p> : <p>No selection</p>}
      </div>
    </div>
  )
}

export default Editor