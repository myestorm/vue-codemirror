import { Extension, EditorState, EditorSelection, Transaction, SelectionRange } from '@codemirror/state'
import { EditorView, KeyBinding, keymap } from '@codemirror/view'

import { LanguageDescription, LanguageSupport } from '@codemirror/language'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { jsxLanguage, tsxLanguage } from '@codemirror/lang-javascript'
import { jsonLanguage } from '@codemirror/lang-json'
import { htmlLanguage } from '@codemirror/lang-html'
import { cssLanguage } from '@codemirror/lang-css'

import BaseEditor, { BaseOptionsType } from '../core/editor'
import createToolbar, { ToolbarsType, ToolbarItemType } from './toolbar'

export interface InitOptionsType {
  beforeInitToolbars: (toolbars: ToolbarsType) => ToolbarsType
}

class MarkdownEditor extends BaseEditor {
  toolbars!: ToolbarsType
  hotKeyMaps: KeyBinding[] = []

  constructor (options?: BaseOptionsType) {
    super(options)
  }

  init (exp: string, options?: InitOptionsType): void {
    const extensions: Extension[] = []
    const javascript = new LanguageSupport(jsxLanguage)
    const typescript = new LanguageSupport(tsxLanguage)
    const css = new LanguageSupport(cssLanguage)
    const json = new LanguageSupport(jsonLanguage)
    const html = new LanguageSupport(htmlLanguage, [css, javascript])
    extensions.push(markdown({
      base: markdownLanguage,
      codeLanguages: [
        LanguageDescription.of({
          name: 'javascript',
          alias: ['js', 'jsx', 'ts', 'tsx'],
          async load() {
            return javascript
          },
        }),
        LanguageDescription.of({
          name: 'typescript',
          alias: ['ts', 'tsx'],
          async load() {
            return typescript
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

    this.createToolbars(options?.beforeInitToolbars)
    extensions.push(keymap.of(this.hotKeyMaps))

    this.create(exp, extensions)
  }

  registerShortcutKey (): void {
    const arr: ToolbarItemType[] = this.toolbars.top.concat(this.toolbars.center, this.toolbars.bottom)
    arr.map(item => {
      if (item.shortcutKey) {
        const hotKey = {
          key: item.shortcutKey,
          mac: item.shortcutKey.replace(/Ctrl/gmi, 'Cmd'),
          preventDefault: true,
          run: (view: EditorView) => {
            if (typeof item.action === 'function') {
              item.action()
            }
            if (typeof item.end === 'function') {
              item.end(item, 'keyboard')
            }
            return false
          }
        }
        this.hotKeyMaps.push(hotKey)
      }
      return item
    })
  }

  createToolbars (beforeInitToolbars?: InitOptionsType['beforeInitToolbars']): void {
    let _toolbars = createToolbar(this)
    if (typeof beforeInitToolbars === 'function') {
      _toolbars = beforeInitToolbars(_toolbars)
    }
    this.toolbars = _toolbars
    this.registerShortcutKey()
  }

  getToolbars (): ToolbarsType {
    return this.toolbars
  }

  setToolbars (val: ToolbarsType) {
    this.toolbars = val
  }

  // ????????????
  // ??????
  headAction () {
    const view = this.view
    const state = view.state
    const tr: Transaction = state.update(
      state.changeByRange(range => {
        const line = state.doc.lineAt(range.from)
        const text = state.sliceDoc(line.from, line.to)
        const regex = /^#+(\s)+/
        const arr = text.match(regex)
        let _text = arr ? (arr[0] || '') : ''
        _text = _text.trim()
        let len = _text.length
        if (len === 6) {
          len = 1
        } else {
          len ++
        }
        _text = text.replace(regex, '')
        let insertion = ''
        for(let i = 0; i < len; i++) {
          insertion += '#'
        }
        insertion += ' '
        _text = insertion + _text
        const from = line.from
        const to = line.to
        return {
          changes: {
            from,
            to,
            insert: _text // ????????????
          },
          range: EditorSelection.range(from + _text.length, from + _text.length) // ????????????
        }
      })
    )
    view.dispatch(tr) // ??????????????????
    view.focus() // ?????????????????????
  }

  // ??????
  boldAction () {
    this.toggleAroundSelection('**', '**')
  }

  // ?????????
  strikethroughAction () {
    this.toggleAroundSelection('~~', '~~')
  }

  // ??????
  italicAction () {
    this.toggleAroundSelection('*', '*')
  }

  // ????????????
  tasklistAction () {
    this.insertStartPerLine('- [ ] ')
  }

  // ????????????
  orderlistAction () {
    this.insertStartPerLine('{num}. ')
  }

  // ????????????
  unorderlistAction () {
    this.insertStartPerLine('- ')
  }

  // ??????
  linkAction () {
    this.insertLink()
  }

  // ?????????
  blockcodeAction () {
    this.insertLineAfterCursor('```\n```')
    this.setCursor(-4, -4)
  }

  // ????????????
  inlinecodeAction () {
    this.toggleAroundSelection('`', '`')
  }

  // ??????
  quoteAction () {
    this.insertStartPerLine('> ')
  }

  /**
   * ?????????????????????
   * @param insertion string
   */
  insertLineStart (insertion: string) {
    const view = this.view
    const state = view.state
    const tr: Transaction = state.update(
      state.changeByRange(range => {
        // ?????????????????????????????????
        const line = state.doc.lineAt(range.from)
        // ??????????????????
        const text = state.sliceDoc(line.from, line.to)
        return {
          changes: {
            from: line.from,
            to: line.to,
            insert: `${insertion}${text}` // ????????????
          },
          range: EditorSelection.range(line.from + insertion.length, line.to + insertion.length) // ????????????
        }
      })
    )
    view.dispatch(tr) // ??????????????????
    view.focus() // ?????????????????????
  }

  /**
   * ?????????????????????
   * @param insertion string
   */
  removeLineStart (insertion: string) {
    const { view } = this
    if (view) {
      const state = view.state
      const tr: Transaction = state.update(
        state.changeByRange(range => {
          const line = state.doc.lineAt(range.from)
          let text = state.sliceDoc(line.from, line.to)
          text = text.replace(new RegExp(`^${this.regExpcharacterEscape(insertion)}`), '') 
          return {
            changes: {
              from: line.from,
              to: line.to,
              insert: text
            },
            range: EditorSelection.range(line.from, line.to - insertion.length)
          }
        })
      )
      view.dispatch(tr)
      view.focus()
    }
  }

  /**
   * ???????????????????????????????????????????????????
   * @param insertion string
   */
  toggleInsertLineStart (insertion: string) {
    const { view } = this
    if (view) {
      const state = view.state
      state.selection.ranges.map(range => {
        const line = state.doc.lineAt(range.from)
        const selectionText = state.sliceDoc(line.from, line.to)
        const hasInsertion = new RegExp(`^${this.regExpcharacterEscape(insertion)}`).test(selectionText)
        if (hasInsertion) {
          this.removeLineStart(insertion)
        } else {
          this.insertLineStart(insertion)
        }
      })
    }
  }

  /**
   * ????????????????????????
   * @param startInsertion string
   * @param endInsertion string
   */
  insertAroundSelection (startInsertion: string, endInsertion: string) {
    const { view } = this
    if (view) {
      const state = view.state
      const tr: Transaction = state.update(
        state.changeByRange(range => {
          const text = state.sliceDoc(range.from, range.to)
          return {
            changes: {
              from: range.from,
              to: range.to,
              insert: `${startInsertion}${text}${endInsertion}`
            },
            range: EditorSelection.range(range.from + startInsertion.length, range.to + startInsertion.length)
          }
        })
      )
      view.dispatch(tr)
      view.focus()
    }
  }

  /**
   * ????????????????????????
   * @param startInsertion string
   * @param endInsertion string
   */
  removeAroundSelection (startInsertion: string, endInsertion: string) {
    const { view } = this
    if (view) {
      const state = view.state
      const tr: Transaction = state.update(
        state.changeByRange(range => {
          const from = range.from - startInsertion.length
          const to = range.to + endInsertion.length
          let text = state.sliceDoc(from, to)
          text = text.replace(new RegExp(`^${this.regExpcharacterEscape(startInsertion)}`), '')
          text = text.replace(new RegExp(`${this.regExpcharacterEscape(endInsertion)}$`), '')
          return {
            changes: {
              from: from,
              to: to,
              insert: text
            },
            range: EditorSelection.range(from, to - startInsertion.length - endInsertion.length)
          }
        })
      )
      view.dispatch(tr)
      view.focus()
    }
  }

  /**
   * ???????????????????????????????????????????????????
   * @param startInsertion string
   * @param endInsertion string
   */
  toggleAroundSelection (startInsertion: string, endInsertion: string) {
    const { view } = this
    if (view) {
      const state = view.state
      state.selection.ranges.map(range => {
        const selectionText = state.sliceDoc(range.from - startInsertion.length, range.to + endInsertion.length)
        const hasStartInsertion = new RegExp(`^${this.regExpcharacterEscape(startInsertion)}`).test(selectionText)
        const hasEndInsertion = new RegExp(`${this.regExpcharacterEscape(endInsertion)}$`).test(selectionText)
      
        if (hasStartInsertion && hasEndInsertion) {
          this.removeAroundSelection(startInsertion, endInsertion)
        } else {
          this.insertAroundSelection(startInsertion, endInsertion)
        }
      })
    }
  }

  /**
   * ?????????????????????????????????????????????
   * @param beforeInsertion string
   * @param afterInsertion string
   */
  insertAroundLine (beforeInsertion: string, afterInsertion: string) {
    const { view } = this
    if (view) {
      const state = view.state
      const tr: Transaction = state.update(
        state.changeByRange(range => {
          const text = state.sliceDoc(range.from, range.to)
          const from = range.from + beforeInsertion.length + 2
          const to = from
          return {
            changes: {
              from: range.from,
              to: range.to,
              insert: `\n\n${beforeInsertion}${text ? '\n' : ''}${text}\n${afterInsertion}\n\n`
            },
            range: EditorSelection.range(from , to)
          }
        })
      )
      view.dispatch(tr)
      view.focus()
    }
  }

  /**
   * ????????????????????????
   * @param insertion string
   */
  insertLineAfterCursor (insertion: string) {
    const { view } = this
    if (view) {
      const state = view.state
      const tr: Transaction = state.update(
        state.changeByRange(range => {
          const _insertion = `\n${insertion}\n`
          const to = range.to
          return {
            changes: {
              from: to,
              to: to,
              insert: _insertion
            },
            range: EditorSelection.range(to + _insertion.length - 1, to + _insertion.length - 1)
          }
        })
      )
      view.dispatch(tr)
      view.focus()
    }
  }

  /**
   * ????????????????????????
   * @param insertion string
   */
  insertStartPerLine (insertion: string) {
    const { view } = this
    if (view) {
      const state = view.state
      const tr: Transaction = state.update(
        state.changeByRange(range => {
          const text = state.sliceDoc(range.from, range.to)
          const textLines = text.split('\n')
          let offset = 0
          textLines.forEach((textLine, index) => {
            const _insertion = insertion.replace(/\{num\}/g, (index + 1).toString())
            offset += _insertion.length
            textLines[index] = _insertion + textLine
          })
          const newText = textLines.join('\n')
          return {
            changes: {
              from: range.from,
              to: range.to,
              insert: newText
            },
            range: EditorSelection.range(range.from, range.to + offset)
          }
        })
      )
      view.dispatch(tr)
      view.focus()
    }
  }

  /**
   * ??????????????????
   * @param url string ????????????
   * @param desc string ??????
   */
  insertMedia (url: string, desc: string = '') {
    const { view } = this
    const state = view.state
    const tr: Transaction = state.update(
      state.changeByRange((range: SelectionRange) => {
        const insertion = `![${desc}](${url})`
        return {
          changes: {
            from: range.from,
            to: range.to,
            insert: insertion
          },
          range: EditorSelection.range(range.to + insertion.length, range.to + insertion.length)
        }
      })
    )
    view.dispatch(tr)
    view.focus()
  }

  /**
   * ????????????
   * @param cols number ???
   * @param rows number ???
   */
  insertTable (cols: number, rows: number) {
    let text = ''
    for (let row = 0; row < rows; row++) {
      let cText = '|'
      let dText = row === 0 ? '|' : ''
      for (let col = 0; col < cols; col++) {
        cText += '     |'
        if (row === 0) {
          dText += ' --- |'
        }
      }
      text += (cText + '\n')
      if (row === 0) {
        text += (dText + '\n')
      }
    }
    this.insertLineAfterCursor(text)
  }

  /**
   * ????????????
   * @param url string ????????????
   * @param title string ????????????
   */
   insertLink (url: string = '', title: string = '??????') {
    const { view } = this
    const state = view.state
    const tr: Transaction = state.update(
      state.changeByRange((range: SelectionRange) => {
        let text = state.sliceDoc(range.from, range.to)
        text = text || title

        const _url = url || 'https://'

        const insertion = `[${text}](${_url} "${text}")`
        const from = range.from + text.length + 3
        const to = from + _url.length
        // const offset = range.from + text.length + _url.length + 1
        return {changes: {
            from: range.from,
            to: range.to,
            insert: insertion
          },
          range: EditorSelection.range(from, to)
        }
      })
    )
    view.dispatch(tr)
    view.focus()
  }

}

export default MarkdownEditor
