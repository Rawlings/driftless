import { useState } from 'react'
import { AutoComplete } from 'primereact/autocomplete'

interface Props {
  value: string
  suggestions: Array<{ value: string; kind: 'keyword' | 'function'; description?: string; mdnUrl?: string }>
  onChange: (v: string) => void
}

export function SuggestInput({ value, suggestions, onChange }: Props) {
  const [filtered, setFiltered] = useState<Props['suggestions']>([])
  return (
    <AutoComplete
      value={value}
      field="value"
      suggestions={filtered}
      completeMethod={(e) => {
        const q = e.query.toLowerCase()
        setFiltered(q ? suggestions.filter((s) => s.value.toLowerCase().includes(q)) : suggestions)
      }}
      onChange={(e) => onChange(typeof e.value === 'string' ? e.value : String(e.value?.value ?? ''))}
      itemTemplate={(item) => (
        <div className="flex flex-col">
          <span>{item.value}</span>
          {item.description ? <span className="text-xs">{item.description}</span> : null}
        </div>
      )}
      forceSelection={false}
      dropdown
      className="mt-1 w-full"
      inputClassName="w-full"
    />
  )
}
