import { ref } from 'vue'
export type Theme = 'light' | 'dark'
const theme=ref<Theme>('light')
let initialized=false
function applyTheme(value:Theme){theme.value=value;document.documentElement.dataset.theme=value;document.documentElement.style.colorScheme=value;localStorage.setItem('sgm-theme',value)}
export function initializeTheme():Theme{
  if(initialized)return theme.value
  const saved=localStorage.getItem('sgm-theme'),systemDark=window.matchMedia('(prefers-color-scheme: dark)').matches
  const initial:Theme=saved==='dark'||saved==='light'?saved:systemDark?'dark':'light'
  applyTheme(initial);initialized=true;return initial
}
export function useTheme(){if(!initialized)initializeTheme();function toggleTheme(){applyTheme(theme.value==='light'?'dark':'light')}return{theme,toggleTheme}}
