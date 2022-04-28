import { EditorState, Compartment, Extension } from '@codemirror/state'
import { EditorView, highlightSpecialChars, drawSelection, highlightActiveLine, keymap } from '@codemirror/view'
import { lineNumbers, highlightActiveLineGutter } from '@codemirror/gutter'
import { foldGutter } from '@codemirror/fold'
import { history } from '@codemirror/history'
import { defaultHighlightStyle } from '@codemirror/highlight'
import { bracketMatching } from '@codemirror/matchbrackets'
import { closeBrackets } from '@codemirror/closebrackets'
import { autocompletion } from '@codemirror/autocomplete'
import { highlightSelectionMatches } from '@codemirror/search'
import { rectangularSelection } from '@codemirror/rectangular-selection'
import { indentWithTab } from "@codemirror/commands"

import { indentOnInput } from '@codemirror/language'

const lineWrappingComp = new Compartment() // 较长文本是否换行
const _lineNumbers = lineNumbers() // 显示行号

export interface EditorConfigType {
  lineWrapping?: Boolean,
  lineNumbers?: Boolean,
  allowMultipleSelections?: Boolean
}

export default function (options: EditorConfigType): Extension[] {
  const extensions: Extension[] = []
  if (options.lineWrapping) {
    extensions.push(lineWrappingComp.of(EditorView.lineWrapping))
  }
  if (options.lineNumbers) {
    extensions.push(_lineNumbers)
  }

  extensions.push(drawSelection())
  if (options.allowMultipleSelections) {
    extensions.push(EditorState.allowMultipleSelections.of(true))
  }

  extensions.push(indentOnInput())
  extensions.push(highlightActiveLineGutter())
  extensions.push(highlightSpecialChars())
  extensions.push(history())

  extensions.push(defaultHighlightStyle.fallback)
  extensions.push(bracketMatching())
  extensions.push(closeBrackets())
  extensions.push(autocompletion())
  extensions.push(rectangularSelection())
  extensions.push(highlightActiveLine())
  extensions.push(highlightSelectionMatches())

  // tab
  extensions.push(keymap.of([indentWithTab]))

  // 自定义折叠代码块 
  extensions.push(foldGutter({
    markerDOM (open) {
      const className = open ? 'editor-unfold' : 'editor-fold'
      const span = document.createElement('span')
      span.classList.add(className)
      return span
    }
  }))
  return extensions
}
