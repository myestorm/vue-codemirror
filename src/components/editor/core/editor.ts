import { Line } from '@codemirror/text'
import { EditorView, ViewUpdate } from '@codemirror/view'
import { EditorState, Extension, Compartment } from '@codemirror/state'

import prettier from 'prettier/standalone'

import { Dark } from '../theme/dark'
import { Light } from '../theme/light'
import extensions, { EditorConfigType } from '../extensions/index'

class BaseEditor {
  box!: Element
  state!: EditorState
  view!: EditorView
  theme = new Compartment()
  themeDark = Dark
  themeLight = Light
  extensions: Extension[] = []
  events = {
    focus: (update: ViewUpdate, value: string) :void => {},
    blur: (update: ViewUpdate, value: string) :void => {},
    change: (update: ViewUpdate, value: string) :void => {},
    save: (update: EditorView, value: string) :void => {},
    beautify: (update: EditorView) :void => {},
    selectionChange: (update: ViewUpdate, line: Line) :void => {},
  }

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
    } else {
      this.extensions.push(this.theme.of(this.themeLight))
    }

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
    return value
  }

  setValue (val: string = '') {
    const state = EditorState.create({
      doc: val,
      extensions: this.extensions
    })
    this.view.setState(state)
    this.state = state
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
