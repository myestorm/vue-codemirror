import { CSSProperties } from 'vue'
import * as ToolbarTypes  from './toolbar'
import * as EditorTypes from '../core/editor'

export import ThemeType = EditorTypes.ThemeType
export type EventType = EditorTypes.EventType
export type BaseOptionsType = EditorTypes.BaseOptionsType
export type ToolbarsType = ToolbarTypes.ToolbarsType
export type ToolbarItemType = ToolbarTypes.ToolbarItemType
export type ToolbarItemTypes = ToolbarTypes.ToolbarItemTypes

export interface TotonooMarkdownEditorProps {
  modelValue: string,
  dialog: {
    fullScreen: boolean,
    fixed: boolean,
    zIndex: CSSProperties['z-index']
  },
  theme: {
    def: ThemeType,
    observer: string,
    observerAttr: string
  },
  editor: {
    lineWrapping: boolean,
    lineNumbers: boolean,
    allowMultipleSelections: boolean
  },
  beforeInitToolbars: (toolbars: ToolbarsType) => ToolbarsType,
  upload: {
    uploadUrl: string,
    headers: HeadersInit,
    uploadSuccess: (result: any) => string,
    uploadFail: (error: any) => void
  }
}
