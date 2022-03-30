import { Extension, EditorState, EditorSelection, Transaction, SelectionRange } from '@codemirror/state'
import { EditorView, KeyBinding, keymap } from '@codemirror/view'

import { LanguageDescription, LanguageSupport } from '@codemirror/language'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { jsxLanguage } from '@codemirror/lang-javascript'
import { jsonLanguage } from '@codemirror/lang-json'
import { htmlLanguage } from '@codemirror/lang-html'
import { cssLanguage } from '@codemirror/lang-css'

import BaseEditor, { BaseOptionsType, ThemeType, EventType } from '../core/editor'
import createToolbar, { ToolbarsType, ToolbarItemType } from './toolbar'

export const MarkdownThemeType = ThemeType
export const MarkdownEventType = EventType

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

  // 通用操作
  // 标题
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
            insert: _text // 替换字符
          },
          range: EditorSelection.range(from + _text.length, from + _text.length) // 重置选区
        }
      })
    )
    view.dispatch(tr) // 更新界面数据
    view.focus() // 编辑器获得焦点
  }

  // 加粗
  boldAction () {
    this.toggleAroundSelection('**', '**')
  }

  // 删除线
  strikethroughAction () {
    this.toggleAroundSelection('~~', '~~')
  }

  // 斜体
  italicAction () {
    this.toggleAroundSelection('*', '*')
  }

  // 任务列表
  tasklistAction () {
    this.insertStartPerLine('- [ ] ')
  }

  // 有序列表
  orderlistAction () {
    this.insertStartPerLine('{num}. ')
  }

  // 无序列表
  unorderlistAction () {
    this.insertStartPerLine('- ')
  }

  // 链接
  linkAction () {
    this.insertLink()
  }

  // 代码块
  blockcodeAction () {
    this.insertLineAfterCursor('```\n```')
    this.setCursor(-4, -4)
  }

  // 行内代码
  inlinecodeAction () {
    this.toggleAroundSelection('`', '`')
  }

  // 引用
  quoteAction () {
    this.insertStartPerLine('> ')
  }

  /**
   * 在行首插入字符
   * @param insertion string
   */
  insertLineStart (insertion: string) {
    const view = this.view
    const state = view.state
    const tr: Transaction = state.update(
      state.changeByRange(range => {
        // 获取光标所在的行的信息
        const line = state.doc.lineAt(range.from)
        // 获取行的内容
        const text = state.sliceDoc(line.from, line.to)
        return {
          changes: {
            from: line.from,
            to: line.to,
            insert: `${insertion}${text}` // 替换字符
          },
          range: EditorSelection.range(line.from + insertion.length, line.to + insertion.length) // 重置选区
        }
      })
    )
    view.dispatch(tr) // 更新界面数据
    view.focus() // 编辑器获得焦点
  }

  /**
   * 删除行首的字符
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
   * 两种状态切换，有则删除，没有则添加
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
   * 选区两端插入标签
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
   * 选区两端删除标签
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
   * 两种状态切换，有则删除，没有则添加
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
   * 在首尾插入两行，典型应用代码块
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
   * 在光标后插入一行
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
   * 选中的每行前插入
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
   * 插入媒体文件
   * @param url string 媒体地址
   * @param desc string 描述
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
   * 插入表格
   * @param cols number 列
   * @param rows number 行
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
   * 插入链接
   * @param url string 链接地址
   * @param title string 链接描述
   */
   insertLink (url: string = '', title: string = '标题') {
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
