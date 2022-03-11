import BaseEditor from '../core/editor'

import { EditorView, keymap } from '@codemirror/view'
import { EditorState, EditorSelection, Transaction, SelectionRange } from '@codemirror/state'

import { LanguageDescription, LanguageSupport } from '@codemirror/language'
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

export enum HotKeyTypes {
  ctrlS = 'Ctrl-s', // 保存
  ctrlB = 'Ctrl-b', // 美化、格式化
  ctrl1 = 'Ctrl-1', // 一级标题
  ctrl2 = 'Ctrl-2', // 二级标题
  ctrl3 = 'Ctrl-3', // 三级标题
  ctrl4 = 'Ctrl-4', // 四级标题
  ctrl5 = 'Ctrl-5', // 五级标题
  ctrl6 = 'Ctrl-6', // 六级标题
  ctrlAltT = 'Ctrl-Alt-t', // 插入表格
  ctrlAltM = 'Ctrl-Alt-m', // 插入媒体
  ctrlAltP = 'Ctrl-Alt-p', // 预览
  ctrlAltB = 'Ctrl-Alt-b', // 加粗
  ctrlAltI = 'Ctrl-Alt-i', // 斜体
  ctrlAltL = 'Ctrl-Alt-l', // 删除线
  ctrlAltH = 'Ctrl-Alt-h', // 分割线
  ctrlAltQ = 'Ctrl-Alt-q', // 引用
  shiftAltO = 'Shift-Alt-o', // 有序列表
  shiftAltU = 'Shift-Alt-u', // 无序列表
  shiftAltT = 'Shift-Alt-t', // 待做列表
  shiftAltI = 'Shift-Alt-i', // 内联代码
  shiftAltB = 'Shift-Alt-b', // 块级代码
  shiftAltL = 'Shift-Alt-l', // 链接
  F11 = 'F11', // 全屏
}

const defaultOptions: MarkdownEditorOptionsType = {
  initValue: ''
}

class MarkdownEditor extends BaseEditor {
  options = defaultOptions
  hotKey = <T>(type: HotKeyTypes, value: T, view: EditorView): void => {}

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

    // ctrl + s
    const ctrlSHandler = {
      key: HotKeyTypes.ctrlS,
      mac: 'Cmd-s',
      preventDefault: true,
      run: (view: EditorView) => {
        const value = view.state.doc.toString()
        this.hotKey(HotKeyTypes.ctrlS, value, view)
        return false
      }
    }
    this.hotKeyMaps.push(ctrlSHandler)

    // ctrl + b
    const ctrlBHandler = {
      key: HotKeyTypes.ctrlB,
      mac: 'Cmd-b',
      preventDefault: true,
      run: (view: EditorView) => {
        const value = view.state.doc.toString()
        const _value = this.prettier.format(value, prettierConfig)
        this.setValue(_value)
        this.hotKey(HotKeyTypes.ctrlB, {
          old: value,
          value: _value
        }, view)
        return false
      }
    }
    this.hotKeyMaps.push(ctrlBHandler)

    // 1-6标题
    const ctrl1Handler = {
      key: HotKeyTypes.ctrl1,
      mac: 'Cmd-1',
      preventDefault: true,
      run: (view: EditorView) => {
        this.toggleInsertLineStart('# ')
        this.hotKey(HotKeyTypes.ctrl1, null, view)
        return false
      }
    }
    this.hotKeyMaps.push(ctrl1Handler)
    const ctrl2Handler = {
      key: HotKeyTypes.ctrl2,
      mac: 'Cmd-2',
      preventDefault: true,
      run: (view: EditorView) => {
        this.toggleInsertLineStart('## ')
        this.hotKey(HotKeyTypes.ctrl2, null, view)
        return false
      }
    }
    this.hotKeyMaps.push(ctrl2Handler)
    const ctrl3Handler = {
      key: HotKeyTypes.ctrl3,
      mac: 'Cmd-3',
      preventDefault: true,
      run: (view: EditorView) => {
        this.toggleInsertLineStart('### ')
        this.hotKey(HotKeyTypes.ctrl3, null, view)
        return false
      }
    }
    this.hotKeyMaps.push(ctrl3Handler)
    const ctrl4Handler = {
      key: HotKeyTypes.ctrl4,
      mac: 'Cmd-4',
      preventDefault: true,
      run: (view: EditorView) => {
        this.toggleInsertLineStart('##### ')
        this.hotKey(HotKeyTypes.ctrl4, null, view)
        return false
      }
    }
    this.hotKeyMaps.push(ctrl4Handler)
    const ctrl5Handler = {
      key: HotKeyTypes.ctrl5,
      mac: 'Cmd-5',
      preventDefault: true,
      run: (view: EditorView) => {
        this.toggleInsertLineStart('##### ')
        this.hotKey(HotKeyTypes.ctrl5, null, view)
        return false
      }
    }
    this.hotKeyMaps.push(ctrl5Handler)
    const ctrl6Handler = {
      key: HotKeyTypes.ctrl6,
      mac: 'Cmd-6',
      preventDefault: true,
      run: (view: EditorView) => {
        this.toggleInsertLineStart('###### ')
        this.hotKey(HotKeyTypes.ctrl6, null, view)
        return false
      }
    }
    this.hotKeyMaps.push(ctrl6Handler)

    // ctrl + alt + m 插入媒体
    const ctrlAltMHandler = {
      key: HotKeyTypes.ctrlAltM,
      mac: 'Cmd-Alt-m',
      preventDefault: true,
      run: (view: EditorView) => {
        this.hotKey(HotKeyTypes.ctrlAltM, null, view)
        return false
      }
    }
    this.hotKeyMaps.push(ctrlAltMHandler)

    // ctrl + alt + t 插入表格
    const ctrlAltTHandler = {
      key: HotKeyTypes.ctrlAltT,
      mac: 'Cmd-Alt-t',
      preventDefault: true,
      run: (view: EditorView) => {
        this.hotKey(HotKeyTypes.ctrlAltT, null, view)
        return false
      }
    }
    this.hotKeyMaps.push(ctrlAltTHandler)

    // ctrl + alt + p 预览html
    const ctrlAltPHandler = {
      key: HotKeyTypes.ctrlAltP,
      mac: 'Cmd-Alt-p',
      preventDefault: true,
      run: (view: EditorView) => {
        this.hotKey(HotKeyTypes.ctrlAltP, null, view)
        return false
      }
    }
    this.hotKeyMaps.push(ctrlAltPHandler)

    // ctrl + alt + b 加粗
    const ctrlAltBHandler = {
      key: HotKeyTypes.ctrlAltB,
      mac: 'Cmd-Alt-b',
      preventDefault: true,
      run: (view: EditorView) => {
        this.toggleAroundSelection('**', '**')
        this.hotKey(HotKeyTypes.ctrlAltB, null, view)
        return false
      }
    }
    this.hotKeyMaps.push(ctrlAltBHandler)

    // ctrl + alt + i 斜体
    const ctrlAltIHandler = {
      key: HotKeyTypes.ctrlAltI,
      mac: 'Cmd-Alt-i',
      preventDefault: true,
      run: (view: EditorView) => {
        this.toggleAroundSelection('*', '*')
        this.hotKey(HotKeyTypes.ctrlAltI, null, view)
        return false
      }
    }
    this.hotKeyMaps.push(ctrlAltIHandler)

    // ctrl + alt + l 删除线
    const ctrlAltLHandler = {
      key: HotKeyTypes.ctrlAltL,
      mac: 'Cmd-Alt-l',
      preventDefault: true,
      run: (view: EditorView) => {
        this.toggleAroundSelection('~~', '~~')
        this.hotKey(HotKeyTypes.ctrlAltL, null, view)
        return false
      }
    }
    this.hotKeyMaps.push(ctrlAltLHandler)

    // ctrl + alt + h 分割线
    const ctrlAltHHandler = {
      key: HotKeyTypes.ctrlAltH,
      mac: 'Cmd-Alt-h',
      preventDefault: true,
      run: (view: EditorView) => {
        this.insertLineAfterCursor('\n---\n')
        this.hotKey(HotKeyTypes.ctrlAltH, null, view)
        return false
      }
    }
    this.hotKeyMaps.push(ctrlAltHHandler)

    // ctrl + alt + q 引用
    const ctrlAltQHandler = {
      key: HotKeyTypes.ctrlAltQ,
      mac: 'Cmd-Alt-q',
      preventDefault: true,
      run: (view: EditorView) => {
        this.insertStartPerLine('> ')
        this.hotKey(HotKeyTypes.ctrlAltQ, null, view)
        return false
      }
    }
    this.hotKeyMaps.push(ctrlAltQHandler)

    // shift + alt + 0 有序列表
    const shiftAltOHandler = {
      key: HotKeyTypes.shiftAltO,
      mac: HotKeyTypes.shiftAltO,
      preventDefault: true,
      run: (view: EditorView) => {
        this.insertStartPerLine('{num}. ')
        this.hotKey(HotKeyTypes.shiftAltO, null, view)
        return false
      }
    }
    this.hotKeyMaps.push(shiftAltOHandler)

    // shift + alt + u 无序列表
    const shiftAltUHandler = {
      key: HotKeyTypes.shiftAltU,
      mac: HotKeyTypes.shiftAltU,
      preventDefault: true,
      run: (view: EditorView) => {
        this.insertStartPerLine('- ')
        this.hotKey(HotKeyTypes.shiftAltU, null, view)
        return false
      }
    }
    this.hotKeyMaps.push(shiftAltUHandler)

    // shift + alt + t todo列表
    const shiftAltTHandler = {
      key: HotKeyTypes.shiftAltT,
      mac: HotKeyTypes.shiftAltT,
      preventDefault: true,
      run: (view: EditorView) => {
        this.insertStartPerLine('- [ ] ')
        this.hotKey(HotKeyTypes.shiftAltT, null, view)
        return false
      }
    }
    this.hotKeyMaps.push(shiftAltTHandler)

    // shift + alt + i 内联代码
    const shiftAltIHandler = {
      key: HotKeyTypes.shiftAltI,
      mac: HotKeyTypes.shiftAltI,
      preventDefault: true,
      run: (view: EditorView) => {
        this.toggleAroundSelection('`', '`')
        this.hotKey(HotKeyTypes.shiftAltI, null, view)
        return false
      }
    }
    this.hotKeyMaps.push(shiftAltIHandler)

    // shift + alt + B 块级代码
    const shiftAltBHandler = {
      key: HotKeyTypes.shiftAltB,
      mac: HotKeyTypes.shiftAltB,
      preventDefault: true,
      run: (view: EditorView) => {
        this.insertLineAfterCursor('```\n```')
        this.setCursor(-4, -4)
        this.hotKey(HotKeyTypes.shiftAltB, null, view)
        return false
      }
    }
    this.hotKeyMaps.push(shiftAltBHandler)

    // shift + alt + l 链接
    const shiftAltLHandler = {
      key: HotKeyTypes.shiftAltL,
      mac: HotKeyTypes.shiftAltL,
      preventDefault: true,
      run: (view: EditorView) => {
        this.insertLink()
        this.hotKey(HotKeyTypes.shiftAltL, null, view)
        return false
      }
    }
    this.hotKeyMaps.push(shiftAltLHandler)

    // f11 全屏
    const f11Handler = {
      key: HotKeyTypes.F11,
      mac: HotKeyTypes.F11,
      preventDefault: true,
      run: (view: EditorView) => {
        this.hotKey(HotKeyTypes.F11, null, view)
        return false
      }
    }
    this.hotKeyMaps.push(f11Handler)

    const hotKeyMaps = [...this.hotKeyMaps]
    this.extensions.push(keymap.of(hotKeyMaps))

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

  // toolbar events

  // 标题
  toolbarHead () {
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
  toolbarBold () {
    this.toggleAroundSelection('**', '**')
  }

  // 删除线
  toolbarStrikethrough () {
    this.toggleAroundSelection('~~', '~~')
  }

  // 斜体
  toolbarItalic () {
    this.toggleAroundSelection('*', '*')
  }

  // 任务列表
  toolbarTasklist () {
    this.insertStartPerLine('- [ ] ')
  }

  // 有序列表
  toolbarOrderlist () {
    this.insertStartPerLine('{num}. ')
  }

  // 无序列表
  toolbarUnorderlist () {
    this.insertStartPerLine('- ')
  }

  // 链接
  toolbarLink () {
    this.insertLink()
  }

  // 代码块
  toolbarBlockcode () {
    this.insertLineAfterCursor('```\n```')
    this.setCursor(-4, -4)
  }

  // 行内代码
  toolbarInlinecode () {
    this.toggleAroundSelection('`', '`')
  }

  // 引用
  toolbarQuote () {
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
