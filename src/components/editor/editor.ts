import { Line } from '@codemirror/text'
import { EditorView, ViewUpdate } from '@codemirror/view'
import { EditorState, Extension, Compartment } from '@codemirror/state'

import prettier from 'prettier/standalone'

import { Dark } from './theme/dark'
import { Light } from './theme/light'

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
