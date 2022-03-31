import { v4 as uuidv4 } from 'uuid'

import { EditorState, Extension, Compartment, EditorSelection, Transaction } from '@codemirror/state'
import { Line } from '@codemirror/text'
import { EditorView } from '@codemirror/view'
import prettier from 'prettier/standalone'

import { Dark } from '../theme/dark'
import { Light } from '../theme/light'
import getCommExtensions, { EditorConfigType } from './extensions'

export enum ThemeType {
  DARK = 'dark',
  LIGHT = 'light'
}

export enum EventType {
  FOCUS = 'focus',
  BLUR = 'blur',
  CHANGE = 'change',
  SELECTCHANGE = 'selectionChange',
  THEMECHANGE = 'themeChange'
}

export type EventFunctionType = (value: string | Line, editor: BaseEditor) => void

export interface BaseOptionsType {
  initValue?: string,
  editorConfig?: EditorConfigType,
  theme?: {
    def?: ThemeType,
    observer?: string | false,
    observerAttr?: string
  }
}

const defaultOptions: BaseOptionsType = {
  initValue: '',
  editorConfig: {
    lineWrapping: true,
    lineNumbers: true,
    allowMultipleSelections: true
  },
  theme: {
    def: ThemeType.LIGHT,
    observer: 'body',
    observerAttr: 'theme'
  }
}

class BaseEditor {
  parent!: Element
  state!: EditorState
  view!: EditorView
  extensions: Extension[] = []
  themeStatus = new Compartment()
  theme: ThemeType = ThemeType.LIGHT

  prettier = prettier

  options!: BaseOptionsType

  events: {
    [K in EventType[number]]: EventFunctionType
  } = {}

  constructor (options?: BaseOptionsType) {
    const opts = Object.assign({}, defaultOptions, options || {})
    this.options = opts
  }

  create (parentExp: string, extensions: Extension[] = []) {
    const editor = this
    const parent = this.$$(parentExp)
    if (parent) {
      this.parent = parent

      const opts = this.options

      // 获取通用插件
      const commExtensions = getCommExtensions(opts?.editorConfig || {})
      extensions = extensions.concat(commExtensions)

      // 事件
      const updateListener = EditorView.updateListener.of((update) => {
        const value = update.state.doc.toString()
        if (update.docChanged) {
          if (typeof this.events[EventType.CHANGE] === 'function') {
            this.events[EventType.CHANGE](value, editor)
          }
        }
        if (update.selectionSet) { // 选区变化
          if (this.events[EventType.SELECTCHANGE]) {
            const range = update.state.selection.ranges[0]
            const line = update.state.doc.lineAt(range.from)
            this.events[EventType.SELECTCHANGE](line, editor)
          }
        }
    
        if (update.focusChanged) { // 焦点变化
          if(!update.view.hasFocus) {
            if (this.events[EventType.BLUR]) {
              this.events[EventType.BLUR](value, editor)
            }
          } else {
            if (this.events[EventType.FOCUS]) {
              this.events[EventType.FOCUS](value, editor)
            }
          }
        }
      })

      extensions.push(updateListener)

      // 加入明暗切换
      const themeDef = opts?.theme?.def || ThemeType.LIGHT
      if (themeDef === ThemeType.DARK) {
        extensions.push(this.themeStatus.of(Dark))
        this.theme = ThemeType.DARK
      } else {
        extensions.push(this.themeStatus.of(Light))
        this.theme = ThemeType.LIGHT
      }

      // 监听属性变化同步明暗状态
      if (opts.theme?.observer !== false) {
        const _epx = opts.theme?.observer || ''
        const _attr = opts.theme?.observerAttr || ''
        if (_epx && _attr) {
          const body = this.$$(_epx)
          if (body) {
            const observer = new MutationObserver((mutationsList, observer) => {
              for(let mutation of mutationsList) {
                if (mutation.type === 'attributes') {
                  const target = mutation.target as HTMLElement
                  const val = target.getAttribute(_attr) || ''
                  this.changThemeHandler(val === ThemeType.DARK ? ThemeType.DARK : ThemeType.LIGHT)
                }
              }
            })
            observer.observe(body, { subtree: false, childList: false, attributes: true })
          }
        }
        
      }

      this.state = EditorState.create({
        doc: this.options.initValue,
        extensions: extensions
      })
      this.view = new EditorView({
        state: this.state,
        parent
      })
    }    
  }

  changThemeHandler (theme: ThemeType) {
    const _theme = theme === ThemeType.DARK ? Dark : Light
    this.view.dispatch({
      effects: this.themeStatus.reconfigure(_theme)
    })

    const _parent = this.parent.parentElement
    if (_parent) {
      if (theme === ThemeType.DARK) {
        _parent.classList.add(ThemeType.DARK)
      } else {
        _parent.classList.remove(ThemeType.DARK)
      }
    }

    this.theme = theme

    if (this.events[EventType.THEMECHANGE]) {
      const editor = this
      this.events[EventType.THEMECHANGE](this.theme, editor)
    }
  }

  getValue (): string {
    const value = this.view.state.doc.toString()
    return value || ''
  }

  setValue (val: string = '') {
    const view = this.view
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

  setEvent (type: EventType, handler: EventFunctionType) {
    this.events[type] = handler
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

  $$ (exp: string): Element | null {
    return document.querySelector(exp)
  }

  uuid (): string {
    const id = uuidv4()
    return id
  }
}

export default BaseEditor
