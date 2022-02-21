import BaseEditor from '../core/editor'

import { EditorView, keymap, KeyBinding } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { historyKeymap } from '@codemirror/history'
import { foldKeymap } from '@codemirror/fold'
import { LanguageDescription, LanguageSupport } from '@codemirror/language'
import { defaultKeymap, indentWithTab } from '@codemirror/commands'
import { closeBracketsKeymap } from '@codemirror/closebrackets'
import { completionKeymap } from '@codemirror/autocomplete'
import { searchKeymap } from '@codemirror/search'

import { commentKeymap } from '@codemirror/comment'


import { lintKeymap } from '@codemirror/lint'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { jsxLanguage } from '@codemirror/lang-javascript'
import { jsonLanguage } from '@codemirror/lang-json'
import { htmlLanguage } from '@codemirror/lang-html'
import { cssLanguage } from '@codemirror/lang-css'

import parserMarkdown from 'prettier/parser-markdown'

import { EditorConfigType } from '../extensions/index'

const prettierConfig = {
  parser: 'markdown',
  plugins: [parserMarkdown]
}

export interface MarkdownEditorOptionsType {
  initValue?: string,
  config?: EditorConfigType
}

const defaultOptions: MarkdownEditorOptionsType = {
  initValue: ''
}

class MarkdownEditor extends BaseEditor {
  options = defaultOptions

  constructor (id: string, options?: MarkdownEditorOptionsType) {
    super(options?.config)

    const box = this.$$(id)
    if (!box) {
      return
    }

    if (options) {
      this.options = Object.assign({}, this.options, options)
    }

    this.box = box

    // 快捷键

    // ctrl + s 保存
    const ctrlSHandler = {
      key: 'Ctrl-s',
      mac: 'Cmd-s',
      preventDefault: true,
      run: (view: EditorView) => {
        const value = view.state.doc.toString()
        this.events.save(view, value)
        return false
      }
    }

    // ctrl + b 格式化
    this.events.beautify = this.beautify.bind(this) // 格式化
    const ctrlBHandler = {
      key: 'Ctrl-b',
      mac: 'Cmd-b',
      preventDefault: true,
      run: (view: EditorView) => {
        this.events.beautify(view)
        return false
      }
    }

    const saveKeyMap: KeyBinding[] = [
      ctrlSHandler,
      ctrlBHandler
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
