import BaseEditor from './editor'

import { EditorView, highlightSpecialChars, drawSelection, highlightActiveLine, keymap, ViewUpdate, KeyBinding } from '@codemirror/view'
import { EditorState, EditorSelection, Extension, Transaction, Compartment } from '@codemirror/state'
import { history, historyKeymap } from '@codemirror/history'
import { foldGutter, foldKeymap } from '@codemirror/fold'
import { indentOnInput, LanguageDescription, LanguageSupport } from '@codemirror/language'
import { lineNumbers, highlightActiveLineGutter } from '@codemirror/gutter'
import { defaultKeymap, indentWithTab } from '@codemirror/commands'
import { bracketMatching } from '@codemirror/matchbrackets'
import { closeBrackets, closeBracketsKeymap } from '@codemirror/closebrackets'
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search'
import { autocompletion, completionKeymap } from '@codemirror/autocomplete'
import { commentKeymap } from '@codemirror/comment'
import { rectangularSelection } from '@codemirror/rectangular-selection'
import { defaultHighlightStyle } from '@codemirror/highlight'
import { lintKeymap } from '@codemirror/lint'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { jsxLanguage } from '@codemirror/lang-javascript'
import { jsonLanguage } from '@codemirror/lang-json'
import { htmlLanguage } from '@codemirror/lang-html'
import { cssLanguage } from '@codemirror/lang-css'

import parserMarkdown from 'prettier/parser-markdown'

const prettierConfig = {
  parser: 'markdown',
  plugins: [parserMarkdown]
}

export interface MarkdownEditorOptionsType {
  initValue: string,
  theme: string
}

const defaultOptions: MarkdownEditorOptionsType = {
  initValue: '',
  theme: 'light'
}

class MarkdownEditor extends BaseEditor {
  options = defaultOptions

  constructor (id: string, options?: MarkdownEditorOptionsType) {
    super()

    const box = this.$$(id)
    if (!box) {
      return
    }

    if (options) {
      this.options = Object.assign({}, this.options, options)
    }

    this.box = box

    // 编辑器扩展
    const lineWrappingComp = new Compartment() // 较长文本是否换行
    this.extensions.push(lineWrappingComp.of(EditorView.lineWrapping))

    // 自定义快捷键
    const saveKeyMap: KeyBinding[] = [
      {
        key: 'Ctrl-s',
        mac: 'Cmd-s',
        preventDefault: true,
        run: (view: EditorView) => {
          const value = view.state.doc.toString()
          this.events.save(view, value)
          return false
        }
      },
      {
        key: 'Ctrl-b',
        mac: 'Cmd-b',
        preventDefault: true,
        run: (view: EditorView) => {
          this.events.beautify(view)
          return false
        }
      }
    ]
    this.extensions.push(keymap.of([  // 快捷键
      indentWithTab,
      ...closeBracketsKeymap,
      ...defaultKeymap,
      ...searchKeymap,
      ...historyKeymap,
      ...foldKeymap,
      ...commentKeymap,
      ...completionKeymap,
      ...lintKeymap,
      ...saveKeyMap
    ]))

    // 显示行号
    this.extensions.push(lineNumbers())

    // 支持markdown
    const javascript = new LanguageSupport(jsxLanguage)
    const css = new LanguageSupport(cssLanguage)
    const json = new LanguageSupport(jsonLanguage)
    const html = new LanguageSupport(htmlLanguage, [css, javascript])
    this.extensions.push(markdown({
      base: markdownLanguage,
      codeLanguages: [
        LanguageDescription.of({
          name: 'javascript',
          alias: ['js', 'jsx'],
          async load() {
            return javascript
          },
        }),
        LanguageDescription.of({
          name: 'json',
          async load() {
            return json
          },
        }),
        LanguageDescription.of({
          name: 'html',
          alias: ['htm'],
          async load() {
            return html
          },
        }),
        LanguageDescription.of({
          name: 'css',
          async load() {
            return css
          },
        }),
      ]
    }))

    this.extensions.push(highlightActiveLineGutter())
    this.extensions.push(highlightSpecialChars())
    this.extensions.push(history())
    
    // 自定义折叠代码块 
    this.extensions.push(foldGutter({
      // markerDOM (open) {
      //   const className = open ? 'editor-unfold' : 'editor-fold'
      //   const span = document.createElement('span')
      //   span.classList.add(className)
      //   return span
      // }
    }))

    this.extensions.push(drawSelection())
    // 允许多行选择
    this.extensions.push(EditorState.allowMultipleSelections.of(true))
    this.extensions.push(indentOnInput())
    this.extensions.push(defaultHighlightStyle.fallback)
    this.extensions.push(bracketMatching())
    this.extensions.push(closeBrackets())
    this.extensions.push(autocompletion())
    this.extensions.push(rectangularSelection())
    this.extensions.push(highlightActiveLine())
    this.extensions.push(highlightSelectionMatches())

    this.extensions.push(this.theme.of(this.themeLight))

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

    this.extensions.push(updateListener )

    this.state = EditorState.create({
      doc: this.options.initValue,
      extensions: this.extensions
    })

    this.view = new EditorView({
      state: this.state,
      parent: this.box
    })
  }

  beautify () {
    const value = this.getValue()
    const _value = this.prettier.format(value, prettierConfig)
    this.setValue(_value)
    return {
      old: value,
      value: _value
    }
  }
}

export default MarkdownEditor
