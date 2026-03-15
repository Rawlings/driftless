import type { APIOptions } from 'primereact/api'
import 'primereact/resources/themes/lara-light-teal/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'

export const primeReactConfig: Partial<APIOptions> = {
  ripple: true,
  inputStyle: 'outlined',
  unstyled: false
}
