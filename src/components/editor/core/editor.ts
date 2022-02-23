import { Line } from '@codemirror/text'
import { EditorView, ViewUpdate, KeyBinding } from '@codemirror/view'
import { EditorState, Extension, Compartment, EditorSelection, Transaction } from '@codemirror/state'
import { historyKeymap } from '@codemirror/history'
import { foldKeymap } from '@codemirror/fold'
import { defaultKeymap, indentWithTab } from '@codemirror/commands'
import { closeBracketsKeymap } from '@codemirror/closebrackets'
import { completionKeymap } from '@codemirror/autocomplete'
import { searchKeymap } from '@codemirror/search'
import { commentKeymap } from '@codemirror/comment'
import { lintKeymap } from '@codemirror/lint'

import prettier from 'prettier/standalone'

import { Dark } from '../theme/dark'
import { Light } from '../theme/light'
import extensions, { EditorConfigType } from '../extensions/index'

class BaseEditor {
  box!: Element
  state!: EditorState
  view!: EditorView
  theme = new Compartment()
  isDark = true
  themeDark = Dark
  themeLight = Light
  extensions: Extension[] = []
  events = {
    focus: (update: ViewUpdate, value: string) :void => {},
    blur: (update: ViewUpdate, value: string) :void => {},
    change: (update: ViewUpdate, value: string) :void => {},
    selectionChange: (update: ViewUpdate, line: Line) :void => {}
  }
  hotKeyMaps: KeyBinding[] = []

  prettier = prettier

  constructor (options?: EditorConfigType) {
    const defaultOptions: EditorConfigType = {
      lineWrapping: true,
      lineNumbers: true,
      allowMultipleSelections: true,
      theme: 'light'
    }
    const opts = Object.assign({}, defaultOptions, options)
    this.extensions = extensions(opts)

    // 默认白天黑夜模式
    if (opts.theme === 'dark') {
      this.extensions.push(this.theme.of(this.themeDark))
      this.isDark = true
    } else {
      this.extensions.push(this.theme.of(this.themeLight))
      this.isDark = false
    }

    // 快捷键
    this.hotKeyMaps = [
      indentWithTab,
      ...closeBracketsKeymap,
      ...defaultKeymap,
      ...searchKeymap,
      ...historyKeymap,
      ...foldKeymap,
      ...commentKeymap,
      ...completionKeymap,
      ...lintKeymap,
    ]

    // 事件
    const updateListener = EditorView.updateListener.of((update) => {
      const value = update.state.doc.toString()
      if (update.docChanged) {
        this.events.change(update, value)
      }
      if (update.selectionSet) { // 选区变化
        this.selectionSet(update)
      }
  
      if (update.focusChanged) { // 焦点变化
        this.focusChanged(update, value)
      }
    })

    this.extensions.push(updateListener)
  }
  
  $$ (exp: string): Element | null {
    return document.querySelector(exp)
  }

  focusChanged (update: ViewUpdate, value: string) {
    if(!update.view.hasFocus) {
      this.events.blur(update, value)
    } else {
      this.events.focus(update, value)
    }
  }

  selectionSet (update: ViewUpdate) {
    const range = update.state.selection.ranges[0]
    const line = update.state.doc.lineAt(range.from)
    this.events.selectionChange(update, line)
  }

  getValue (): string {
    const value = this.view.state.doc.toString()
    return value || ''
  }

  setValue (val: string = '') {
    const { view } = this
    const state = view.state
    const transaction = state.update({
      changes: {
        from: 0,
        to: state.doc.length,
        insert: val
      }
    })
    view.dispatch(transaction)
  }

  /**
   * 设置光标位置，以当前光标为基准，设置便宜量
   * @param offsetFrom number 开始点偏移量
   * @param offsetTo number 结束点偏移量
   */
   setCursor (offsetFrom: number, offsetTo: number) {
    const { view } = this
    if (view) {
      const state = view.state
      const tr: Transaction = state.update(
        state.changeByRange(range => {
          return {
            range: EditorSelection.range(range.from + offsetFrom, range.to + offsetTo)
          }
        })
      )
      view.dispatch(tr)
      view.focus()
    }
  }

  regExpcharacterEscape (str: string) {
    str = str.replace(/\{/gmi, '\\{')
    str = str.replace(/\}/gmi, '\\}')
    str = str.replace(/\(/gmi, '\\(')
    str = str.replace(/\)/gmi, '\\)')
    str = str.replace(/\//gmi, '\\/')
    str = str.replace(/\$/gmi, '\\$')
    str = str.replace(/\#/gmi, '\\#')
    str = str.replace(/\&/gmi, '\\&')
    str = str.replace(/\*/gmi, '\\*')
    str = str.replace(/\./gmi, '\\.')
    return str
  }
}

export default BaseEditor
