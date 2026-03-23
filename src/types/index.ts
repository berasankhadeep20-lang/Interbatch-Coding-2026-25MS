export type AppId = 'terminal' | 'home' | 'about' | 'team' | 'stack' | 'contact' | 'neofetch'

export interface WindowState {
  id: string
  appId: AppId
  title: string
  isMinimized: boolean
  isFocused: boolean
  position: { x: number; y: number }
  size: { width: number; height: number }
  zIndex: number
}

export interface TeamMember {
  name: string
  role: string
  github?: string
  fun_fact: string
  ascii: string
}

export interface TechItem {
  name: string
  version?: string
  description: string
  category: 'frontend' | 'tooling' | 'library' | 'language'
}

export interface CommandResult {
  output: string
  action?: {
    type: 'open_window'
    appId: AppId
    title: string
  } | {
    type: 'clear'
  } | {
    type: 'easter_egg'
    effect: string
  }
}

export type CommandHandler = (args: string[]) => CommandResult
