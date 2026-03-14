export const uiTokens = {
  motion: {
    control: 'transition-all duration-150 ease-out',
    panel: 'transition-shadow duration-200 ease-out'
  },
  shell: {
    panel: 'rounded-2xl border border-slate-200 bg-white shadow-xl',
    toolbar: 'rounded-2xl border border-slate-200 bg-white/95 px-3 py-2 shadow-lg backdrop-blur'
  },
  text: {
    heading: 'text-base font-semibold text-slate-800',
    bodyMuted: 'text-sm text-slate-500'
  },
  focus: {
    ring: 'focus-visible:ring-2 focus-visible:ring-blue-400/70 focus-visible:ring-offset-1',
    ringSoft: 'focus-visible:border-blue-400 focus-visible:ring-2 focus-visible:ring-blue-400/30'
  },
  control: {
    iconButton: 'inline-flex cursor-pointer items-center justify-center rounded-md border border-slate-200 text-slate-700 outline-none',
    iconButtonToolbar: 'inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 outline-none',
    iconButtonHover: 'hover:border-blue-300 hover:bg-slate-50 hover:text-blue-700',
    iconButtonActive: 'active:translate-y-px active:shadow-[inset_0_1px_0_rgba(255,255,255,0.82),inset_0_0_0_1px_rgba(0,0,0,0.2),0_1px_2px_rgba(0,0,0,0.45)]',
    toolbarSelected: 'border-blue-400 bg-blue-50 text-blue-700 ring-1 ring-blue-300/60',
    toolbarIdle: 'hover:-translate-y-0.5',
    chip: 'cursor-pointer rounded-md px-3 py-1.5 text-xs font-medium outline-none',
    chipIdle: 'text-slate-600 hover:text-slate-800',
    chipSelected: 'bg-white text-slate-900 shadow-sm'
  },
  input: {
    base: 'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400',
    hover: 'hover:border-slate-300',
    select: 'cursor-pointer pr-8',
    color: 'h-10 cursor-pointer px-1 py-1'
  },
  accordion: {
    details: 'overflow-hidden rounded-lg border border-slate-200',
    summary: 'list-none cursor-pointer bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 outline-none [&::-webkit-details-marker]:hidden',
    summaryHover: 'hover:bg-slate-200 hover:text-slate-800',
    summaryFocus: 'focus-visible:ring-2 focus-visible:ring-blue-400/40 focus-visible:ring-inset',
    chevron: 'h-4 w-4 text-slate-500 transition-transform duration-150 ease-out group-open:rotate-180'
  }
}

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}
