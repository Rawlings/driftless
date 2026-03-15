import { useMemo } from 'react'
import {
  getGroupedPropertyDefinitions,
  type PropertyDefinition,
} from './'

export function useGroupedPropertyRegistry(
  search: string
) : Array<[string, PropertyDefinition[]]> {
  return useMemo<Array<[string, PropertyDefinition[]]>>(
    () => getGroupedPropertyDefinitions(search),
    [search]
  )
}
