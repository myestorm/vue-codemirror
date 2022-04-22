import _MarkdownEditor from './components/editor/markdown/index.vue'
import _md2html from './components/editor/markdown/parser/md2html'
import * as MarkdownEditorTypes from './components/editor/markdown/types'

export const MarkdownEditor = _MarkdownEditor
export const utils = {
  md2html: _md2html
}

export type MarkdownEditorProps = MarkdownEditorTypes.TotonooMarkdownEditorProps
export type ThemeType = MarkdownEditorTypes.ThemeType
export type EventType = MarkdownEditorTypes.EventType
export type BaseOptionsType = MarkdownEditorTypes.BaseOptionsType
export type ToolbarsType = MarkdownEditorTypes.ToolbarsType
export type ToolbarItemTypes = MarkdownEditorTypes.ToolbarItemTypes
export type ToolbarItemType = MarkdownEditorTypes.ToolbarItemType