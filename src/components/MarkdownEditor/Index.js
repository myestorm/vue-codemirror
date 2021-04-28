import CodeMirror from 'codemirror'
import MarkdownIt from 'markdown-it'

import TaskLists from './MarkdownIt/TaskLists.js'
import { html5Media } from './MarkdownIt/Media.js'

// theme css
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/darcula.css'
// mode
import 'codemirror/mode/gfm/gfm.js'
// keymap
import 'codemirror/keymap/sublime'
// addons
import 'codemirror/addon/display/placeholder.js'
import 'codemirror/addon/edit/closebrackets.js'
import 'codemirror/addon/edit/closetag.js'
import 'codemirror/addon/edit/continuelist.js'
import 'codemirror/addon/edit/matchbrackets.js'
import 'codemirror/addon/edit/matchtags.js'
import 'codemirror/addon/edit/trailingspace.js'
import 'codemirror/addon/search/jump-to-line.js'
import 'codemirror/addon/search/match-highlighter.js'
import 'codemirror/addon/search/search.js'
import 'codemirror/addon/search/searchcursor.js'
import 'codemirror/addon/selection/active-line.js'
import 'codemirror/addon/selection/mark-selection.js'

let tmpChange = null
let tmpEditorScroll = null
let tmpPreviewScroll = null

const markdownItConfig = {
  html: true,
  xhtmlOut: false,
  breaks: false, 
  langPrefix: 'language-',
  linkify: false,  
  typographer: false,
  quotes: '“”‘’'
}

let markdownIt = new MarkdownIt(markdownItConfig)
markdownIt = markdownIt.use(TaskLists).use(html5Media)

class MarkdownEditor {
  init (id) {
    const container = document.getElementById(id)
    if (!container) {
      console.log(`${id} can't be found`)
      return
    }
    this.id = id
    this.container = container
    this.toolbarDom = container.querySelector('.sa-markdown-editor-toolbar ul')
    this.textarea = container.querySelector('.sa-markdown-editor-textarea textarea')
    this.iframe = container.querySelector('.sa-markdown-editor-preview iframe')
    this.editor = CodeMirror.fromTextArea(this.textarea, {
      mode: 'gfm',
      theme: 'darcula',
      lineNumbers: true,
      lineWrapping: true,
      keyMap: 'sublime',
      matchBrackets: true,
      // autoCloseBrackets: true,
      matchTags: { bothTags: true },
      showTrailingSpace: true,
      autoCloseTags: true,
      styleActiveLine: true,
      styleSelectedText: true,
      extraKeys: {
        Enter: 'newlineAndIndentContinueMarkdownList',
        F11: () => {
          this.fullscreen()
        },
        Esc: () => {
          if (this.getFullscreenState()) {
            this.fullscreen()
          }
        },
        'Shift-Enter': (editor) => {
          const doc = editor.getDoc()
          const cursor = doc.getCursor()
          const text = doc.getLine(cursor.line)
          const matchs = text.match(/^[->*0-9.\s+[\]xX!]+\s/)
          
          let chars = ''
          let len = matchs ? matchs[0].length : 0
          if (len > 0) {
            for(let i = 0; i < len; i++) {
              chars += ' '
            }
          }
          doc.replaceRange(`\n${chars}`, { line: cursor.line, ch: cursor.ch })
        }
      }
    })
    this.doc = this.editor.getDoc()
    this.previewState = false
    this.fullscreenState = false
    this.fullscreenStyleOverflow = ''
    return this.editor
  }
  // preview
  getPreviewState () {
    return this.previewState
  }
  previewChangeHandler () {
    const content = this.editor.getValue()
    this.updatePreview(content)
  }
  openPreview () {
    this.previewState = true
    tmpChange = this.previewChangeHandler.bind(this)
    this.editor.on('change', tmpChange)
    this.previewChangeHandler()
    this.scrollViewSync()
  }
  closePreview () {
    const iframe = this.iframe
    const doc = iframe.contentDocument || iframe.contentWindow.document
    this.previewState = false
    this.editor.off('change', tmpChange)
    this.editor.off('scroll', tmpEditorScroll)
    doc.removeEventListener('scroll', tmpPreviewScroll)
  }
  scrollViewSync () {
    const editor = this.editor
    const iframe = this.iframe
    const doc = iframe.contentDocument || iframe.contentWindow.document
    let isEditorScroll = false 
    let isPreviewScroll = false 
    // editor -> preview
    tmpEditorScroll = (cm) => {
      if (isPreviewScroll) {
        isPreviewScroll = false
        return false
      }
      isEditorScroll = true
      const preview = doc.body
      const height = cm.getScrollInfo().height - cm.getScrollInfo().clientHeight
      const ratio = parseFloat(cm.getScrollInfo().top) / height
      const move = (preview.scrollHeight - preview.clientHeight) * ratio
      preview.scrollTop = move
    }
    editor.on('scroll', tmpEditorScroll)
    // preview -> editor
    setTimeout(() => {
      tmpPreviewScroll = () => {
        if (isEditorScroll) {
          isEditorScroll = false
          return false
        }
        isPreviewScroll = true
        const preview = doc.body
        const height = preview.scrollHeight - preview.clientHeight
        const ratio = parseFloat(preview.scrollTop) / height
        const move = (editor.getScrollInfo().height - editor.getScrollInfo().clientHeight) * ratio
        editor.scrollTo(0, move)
      }
      doc.addEventListener('scroll', tmpPreviewScroll)
    }, 300)
  }
  markdownToHtml (md) {
    const body = markdownIt.render(md)
    return body
  }
  updatePreview (content) {
    const html = this.markdownToHtml(content)
    const iframe = this.iframe
    const doc =  iframe.contentDocument ||  iframe.contentWindow.document
    doc.open()
    doc.write(html)
    doc.close()
  }
  preview () {
    return new Promise(resolve => {
      const previewState = this.previewState
      if (previewState) {
        this.closePreview()
      } else {
        this.openPreview()
      }
      resolve(this.getPreviewState())
    })
  }
  // fullscreen
  getFullscreenState () {
    return this.fullscreenState
  }
  fullscreen () {
    const state = this.fullscreenState
    const className = 'sa-markdown-editor-fullscreen'
    if (state) {
      this.container.classList.remove(className)
      document.body.style.overflow = this.fullscreenStyleOverflow
    } else {
      this.container.classList.add(className)
      this.fullscreenStyleOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    }
    this.fullscreenState = !state
  }
  // header
  header () {
    const editor = this.editor
    const doc = this.doc
    const cursor = doc.getCursor()
    const text = editor.getLine(cursor.line)
    let currHeadingLevel = text.search(/[^#]/)
    currHeadingLevel = currHeadingLevel < 0 ? 0 : currHeadingLevel
    let lineText = text.replace(/^#+/, '')
    let len = currHeadingLevel + 1
    let startCh = len + 1
    if (currHeadingLevel >= 6) {
      len = 0
      startCh = 0
      lineText = lineText.trim()
    } else {
      lineText = ' ' + lineText.trim()
    }
    for (let i=0; i<len; i++) {
      lineText = '#' + lineText
    }
    doc.replaceRange(lineText, { line: cursor.line, ch: 0 }, { line: cursor.line })
    doc.setSelection(
      { line: cursor.line, ch: startCh },
      { line: cursor.line, ch: lineText.length }
    )
    editor.focus()
  }
  // bold
  bold () {
    this.toggleAround('**', '**')
  }
  // italic
  italic () {
    this.toggleAround('*', '*')
  }
  // Unordered Lists
  unorderedList () {
    const editor = this.editor
    const doc = this.doc
    const startPoint = doc.getCursor('start')
      const endPoint = doc.getCursor('end')
    const startChar = '- '
    for (let i = startPoint.line; i <= endPoint.line; i++) {
      let text = doc.getLine(i)
      text = text.replace(new RegExp(`^${startChar}`), '')
      doc.replaceRange(`${startChar}${text}`, { line: i, ch: 0 }, { line: i })
    }
    doc.setCursor({line: endPoint.line, ch: endPoint.ch + startChar.length })
    editor.focus()
  }
  // ordered Lists
  orderedList () {
    const editor = this.editor
    const doc = this.doc
    const startPoint = doc.getCursor('start')
      const endPoint = doc.getCursor('end')
    let startChar = ''
    for (let i = startPoint.line; i <= endPoint.line; i++) {
      let text = doc.getLine(i)
      startChar = `${i - startPoint.line + 1}. `
      text = text.replace(new RegExp(`^${startChar}`), '')
      doc.replaceRange(`${startChar}${text}`, { line: i, ch: 0 }, { line: i })
    }
    doc.setCursor({line: endPoint.line, ch: endPoint.ch + startChar.length })
    editor.focus()
  }
  // task Lists
  taskList () {
    const editor = this.editor
    const doc = this.doc
    const startPoint = doc.getCursor('start')
      const endPoint = doc.getCursor('end')
    const startChar = '- [ ] '
    for (let i = startPoint.line; i <= endPoint.line; i++) {
      let text = doc.getLine(i)
      text = text.replace(new RegExp(`^${startChar}`), '')
      doc.replaceRange(`${startChar}${text}`, { line: i, ch: 0 }, { line: i })
    }
    doc.setCursor({line: endPoint.line, ch: endPoint.ch + startChar.length })
    editor.focus()
  }
  // link
  link () {
    this.insertAround('[', '](http://)')
  }
  // media
  media () {
    this.insertAround('![', '](http://)')
  }
  // codeBlock
  codeBlock () {
    const editor = this.editor
    const doc = this.doc
    const cursor = doc.getCursor()
    doc.replaceRange('\n```\n```\n', { line: cursor.line, ch: 0 }, { line: cursor.line })
    doc.setCursor({line: cursor.line + 1, ch: 3 })
    editor.focus()
  }
  // table
  table () {
    const editor = this.editor
    const doc = this.doc
    const cursor = doc.getCursor()
    const chars = `
|   |   |   |
|---|---|---|
|   |   |   |
|   |   |   |
    `
    doc.replaceRange(chars, { line: cursor.line, ch: 0 }, { line: cursor.line })
    doc.setCursor({line: cursor.line + 1, ch: 2 })
    editor.focus()
  }
  
  // quote
  quote () {
    const editor = this.editor
    const doc = this.doc
    const startPoint = doc.getCursor('start')
      const endPoint = doc.getCursor('end')
    const startChar = '> '
    const endChar = '  '
    for (let i = startPoint.line; i <= endPoint.line; i++) {
      let text = doc.getLine(i)
      text = text.replace(new RegExp(`^${startChar}`), '')
      text = text.replace(new RegExp(`${endChar}$`), '')
      doc.replaceRange(`${startChar}${text}${endChar}`, { line: i, ch: 0 }, { line: i })
    }
    doc.setCursor({line: endPoint.line, ch: endPoint.ch + startChar.length })
    editor.focus()
  }
  // selection
  insert (insertion) {
    const doc = this.doc
    const cursor = doc.getCursor()
    doc.replaceRange(insertion, { line: cursor.line, ch: cursor.ch + insertion.length })
  }
  toggleAround (start, end) {
    const doc = this.doc
    const startPoint = doc.getCursor('start')
      const endPoint = doc.getCursor('end')
    const startText = doc.getRange(
      { line: startPoint.line, ch: startPoint.ch - start.length },
      { line: startPoint.line, ch: startPoint.ch }
    )
    const endText = doc.getRange(
      { line: endPoint.line, ch: endPoint.ch },
      { line: endPoint.line, ch: endPoint.ch + end.length }
    )
    if (start === startText && end === endText) {
      this.removeAround(start, end)
    } else {
      this.insertAround(start, end)
    }
  }
  removeAround (start, end) {
    const editor = this.editor
    const doc = this.doc
    const startPoint = doc.getCursor('start')
      const endPoint = doc.getCursor('end')
    const text = doc.getSelection()
    doc.replaceRange(text, { line: startPoint.line, ch: startPoint.ch - start.length }, { line: endPoint.line, ch: endPoint.ch + end.length })
    doc.setSelection(
      { line: startPoint.line, ch: startPoint.ch - start.length },
      { line: endPoint.line, ch: endPoint.ch - start.length }
    )
    editor.focus()
  }
  insertAround (start, end) {
    const editor = this.editor
    const doc = this.doc
    const startPoint = doc.getCursor('start')
      const endPoint = doc.getCursor('end')
    const text = doc.getSelection()
    doc.replaceSelection(start + text + end)
    doc.setSelection(
      { line: startPoint.line, ch: startPoint.ch + start.length },
      { line: endPoint.line, ch: endPoint.ch + start.length }
    )
    editor.focus()
  }
  insertBefore (insertion) {
    const doc = this.doc
    const startPoint = doc.getCursor('start')
      const endPoint = doc.getCursor('end')
    for (let i = startPoint.line; i <= endPoint.line; i++) {
      let text = doc.getLine(i)
      if (text.length > 0) {
        doc.replaceRange(`${insertion}${text}`, { line: i, ch: 0 }, { line: i })
      }
    }
  }
  insertAfter (insertion) {
    const doc = this.doc
    const startPoint = doc.getCursor('start')
      const endPoint = doc.getCursor('end')
    for (let i = startPoint.line; i <= endPoint.line; i++) {
      let text = doc.getLine(i)
      if (text.length > 0) {
        doc.replaceRange(`${text}${insertion}`, { line: i, ch: text.length }, { line: i })
      }
    }
  }
}
export default MarkdownEditor
