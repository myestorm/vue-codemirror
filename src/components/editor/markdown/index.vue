<template>
  <div class="totonoo-markdown-editor" :class="[isFullscreen ? 'editor-fullscreen' : '', isMobile ? 'has-toolbar' : '']" ref="rootBox">
    <div :id="id" class="content"></div>
    <editor-dialog v-model="uploadVisible" title="媒体资源">
      <editor-upload @done="uploadDone"></editor-upload>
    </editor-dialog>
    <editor-dialog v-model="tableVisible" title="插入表格">
      <editor-table @done="tableDone"></editor-table>
    </editor-dialog>
    <editor-dialog v-model="previewVisible" title="预览" width="760px">
      <editor-preview :root="rootBox" v-model="modelValue"></editor-preview>
    </editor-dialog>
    <editor-helper v-model="myTheme" :helper="helper" @themeChange="themeChange"></editor-helper>
    <editor-toolbar @toolbarClick="toolbarClickHandler" v-show="isMobile"></editor-toolbar>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, nextTick, ref, watch } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { EditorView } from '@codemirror/view'

import EditorDialog from '../core/dialog.vue'
import EditorUpload from '../core/upload.vue'
import EditorTable from '../core/table.vue'
import EditorPreview from '../core/preview.vue'
import EditorHelper from '../core/helper.vue'
import EditorToolbar, { ToolbarItemType, ToolbarClickTypes } from './editor-toolbar.vue'

import MarkdownEditor, { HotKeyTypes } from './index'

const defConfig = {
  theme: 'light',
  themeAttr: 'theme'
}

export interface MDHotKeyValueType<T> {
  type: HotKeyTypes,
  value: T,
  view: EditorView
}

export interface MDToolbarClickValueType {
  type: ToolbarClickTypes,
  value: string,
  view: MarkdownEditor
}

export default defineComponent({
  name: 'MarkdownEditor',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    config: {
      type: Object,
      default: null
    },
    helper: {
      type: Object,
      default: null
    }
  },
  components: {
    EditorDialog,
    EditorUpload,
    EditorTable,
    EditorPreview,
    EditorHelper,
    EditorToolbar
  },
  emits: ['ready', 'update:modelValue', 'change', 'focus', 'blur', 'selectionChange', 'hotKey', 'toolbarClick'],
  setup (props, ctx) {
    const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent)
    const prefix = 'totonoo-markdown-editor-'
    const id = uuidv4()
    const rootBox = ref()

    const config = Object.assign({}, defConfig, props.config)
    
    let editor: MarkdownEditor

    // 上传
    const uploadVisible = ref(false)
    const uploadDone = (url: string, desc: string) => {
      uploadVisible.value = false
      editor.insertMedia(url, desc)
    }

    // 表格
    const tableVisible = ref(false)
    const tableDone = (cols: number, rows: number) => {
      tableVisible.value = false
      editor.insertTable(cols, rows)
    }

    // 预览
    const previewVisible = ref(false)
    const previewDone = (cols: number, rows: number) => {
      previewVisible.value = false
      editor.insertTable(cols, rows)
    }

    // 全屏
    const isFullscreen = ref(false)

    // 皮肤
    const myTheme = ref(config.theme)

    const getTheme = () => {
      const attr = config.themeAttr
      const body = document.querySelector('body')
      return body ? (body.getAttribute(attr) || config.theme) : 'light'
    }
    myTheme.value = getTheme()

    const addThemeClass = (className: string | null) => {
      const attr = config.themeAttr
      const body = document.querySelector('body')
      if (body) {
        const theme = body.getAttribute(attr)
        if (theme !== className) {
          if (theme) {
            body.removeAttribute(attr)
          } else {
            body.setAttribute(attr, 'dark')
          }
        }
      }
    }

    const themeChange = (theme: string) => {
      const _theme = theme === 'dark' ? editor.themeDark : editor.themeLight
      const _parent = editor.box.parentElement
      editor.view.dispatch({
        effects: editor.theme.reconfigure(_theme)
      })
      if (_parent) {
        if (theme === 'dark') {
          _parent.classList.add('dark')
        } else {
          _parent.classList.remove('dark')
        }
      }
      addThemeClass(theme === 'dark' ? 'dark' : null)
      if (theme !== myTheme.value) {
        myTheme.value = theme
      }
    }

    // 监听body属性变化，同步皮肤模式
    const body = document.querySelector('body')
    const observer = new MutationObserver((mutationsList, observer) => {
      for(let mutation of mutationsList) {
        if (mutation.type === 'attributes') {
          const target = mutation.target as HTMLElement
          const val = target.getAttribute(config.themeAttr) || ''
          themeChange(val)
        }
      }
    })
    if (body) {
      observer.observe(body, { subtree: false, childList: false, attributes: true })
    }

    // 监听value变化，同步编辑器
    watch(() => props.modelValue, (val) => {
      if (editor && editor.getValue() !== val) {
        editor.setValue(val)
      }
    })

    const toolbarClickHandler = (data: ToolbarItemType) => {
      const { type } = data
      switch (type) {
        case ToolbarClickTypes.head : {
          editor.toolbarHead()
          break
        }
        case ToolbarClickTypes.bold : {
          editor.toolbarBold()
          break
        }
        case ToolbarClickTypes.strikethrough : {
          editor.toolbarStrikethrough()
          break
        }
        case ToolbarClickTypes.italic : {
          editor.toolbarItalic()
          break
        }
        case ToolbarClickTypes.tasklist : {
          editor.toolbarTasklist()
          break
        }
        case ToolbarClickTypes.orderlist : {
          editor.toolbarOrderlist()
          break
        }
        case ToolbarClickTypes.unorderlist : {
          editor.toolbarUnorderlist()
          break
        }
        case ToolbarClickTypes.link : {
          editor.toolbarLink()
          break
        }
        case ToolbarClickTypes.table : {
          tableVisible.value = true
          break
        }
        case ToolbarClickTypes.blockcode : {
          editor.toolbarBlockcode()
          break
        }
        case ToolbarClickTypes.inlinecode : {
          editor.toolbarInlinecode()
          break
        }
        case ToolbarClickTypes.quote : {
          editor.toolbarQuote()
          break
        }
        case ToolbarClickTypes.media : {
          uploadVisible.value = true
          break
        }
        case ToolbarClickTypes.preview : {
          previewVisible.value = true
          break
        }
        default: {
          break
        }
      }
      
      ctx.emit('toolbarClick', {
        type,
        value: editor.getValue(),
        editor
      })
    }

    onMounted(() => {
      nextTick(() => {
        // 初始化
        editor = new MarkdownEditor(`#${prefix + id}`, {
          initValue: props.modelValue,
          config: {
            theme: myTheme.value
          }
        })

        // 事件
        editor.events.change = (update, value) => {
          ctx.emit('update:modelValue', value)
          ctx.emit('change', value, update)
        }
        editor.events.blur = (update, value) => {
          ctx.emit('blur', value, update)
        }
        editor.events.focus = (update, value) => {
          ctx.emit('focus', value, update)
        }
        editor.events.selectionChange = (update, line) => {
          ctx.emit('selectionChange', line, update)
        }

        // 快捷键
        editor.hotKey = <T>(type: HotKeyTypes, value: T, view: EditorView): void => {
          switch (type) {
            case HotKeyTypes.ctrlAltM: { // 插入媒体
              uploadVisible.value = true
              break
            }
            case HotKeyTypes.ctrlAltT: { // 插入表格
              tableVisible.value = true
              break
            }
            case HotKeyTypes.ctrlAltP: { // 预览
              previewVisible.value = true
              break
            }
            case HotKeyTypes.F11: { // 全屏
              isFullscreen.value = !isFullscreen.value
              break
            }
            default: {
              break
            }
          }
          ctx.emit('hotKey', {
            type,
            value,
            view
          })
        }

        ctx.emit('ready', editor)
      })
    })
    return {
      id: prefix + id,
      isMobile,
      rootBox,
      uploadVisible,
      uploadDone,
      tableVisible,
      tableDone,
      previewVisible,
      previewDone,
      isFullscreen,
      myTheme,
      themeChange,
      toolbarClickHandler
    }
  },
})
</script>
<style lang="scss" scoped>
.totonoo-markdown-editor {
  --color-bg: var(--editor-bg, '#ffffff');
  --color-text: #666666;
  --color-text-1: #999999;
  --color-border: #eee;
  --color-dialog-bg: rgba(255, 255, 255, 0.6);
  --border-radius: 2px;
  --color-shadow: 0 0 2px 0 rgba(0,0,0,0.16);

  --input-text-color: rgba(0, 0, 0, 0.9);
  --input-text-bg: rgba(0, 0, 0, 0.06);
  --input-text-hover-bg: rgba(0,0,0, 0.1);

  --scroll-bar-color: #888888;
  --scroll-track-color: #dddddd;
  &.dark {
    --color-bg: var(--editor-bg-dark, '#2a2a2b');
    --color-text: #d4d4d4;
    --color-text-1: #999999;
    --color-border: rgb(19, 19, 19);
    --color-dialog-bg: rgba(0, 0, 0, 0.6);
    --color-shadow: 0 0 2px 0 rgba(255,255,255,0.16);

    --input-text-color: rgba(255, 255, 255, 0.9);
    --input-text-bg: rgba(255, 255, 255, 0.08);
    --input-text-hover-bg: rgba(255, 255, 255, 0.16);

    --scroll-bar-color: #444444;
    --scroll-track-color: #000000;
  }

  width: 100%;
  height: 100%;
  position: relative;

  &.has-toolbar {
    padding-right: 32px;
    box-sizing: border-box;
  }

  ::-webkit-scrollbar {
    width: 8px;
    height: 1px;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 8px;
    background-color: var(--scroll-bar-color);
  }
  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 4px rgba(0,0,0,0.2);
    background: var(--scroll-track-color);
  }

  &.editor-fullscreen {
    position: fixed;
    left: 0;
    top: 0;
  }
  .content {
    height: 100%;
    overflow: auto;
    > .cm-editor {
      height: 100%;
    }
  }
}
</style>
