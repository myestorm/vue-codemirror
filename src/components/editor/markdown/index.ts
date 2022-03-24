import { Extension } from '@codemirror/state'

import { LanguageDescription, LanguageSupport } from '@codemirror/language'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { jsxLanguage } from '@codemirror/lang-javascript'
import { jsonLanguage } from '@codemirror/lang-json'
import { htmlLanguage } from '@codemirror/lang-html'
import { cssLanguage } from '@codemirror/lang-css'

import BaseEditor, { BaseOptionsType, ThemeType, EventType } from '../core/editor'

export const MarkdownThemeType = ThemeType
export const MarkdownEventType = EventType

class MarkdownEditor extends BaseEditor {
  constructor (options?: BaseOptionsType) {
    super(options)
  }

  init (exp: string) {
    const extensions: Extension[] = []
    const javascript = new LanguageSupport(jsxLanguage)
    const css = new LanguageSupport(cssLanguage)
    const json = new LanguageSupport(jsonLanguage)
    const html = new LanguageSupport(htmlLanguage, [css, javascript])
    extensions.push(markdown({
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
    this.create(exp, extensions)
  }
}

export default MarkdownEditor
