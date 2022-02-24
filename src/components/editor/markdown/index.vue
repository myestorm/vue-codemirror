<template>
  <div class="totonoo-markdown-editor" :class="[isFullscreen ? 'editor-fullscreen' : '']" ref="rootBox">
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
    <editor-helper v-model="theme" :helper="helper" @themeChange="themeChange"></editor-helper>
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

import MarkdownEditor, { HotKeyTypes } from './index'

export interface MDHotKeyValueType<T> {
  type: HotKeyTypes,
  value: T,
  view: EditorView
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
      default: () => {
        return {}
      }
    },
    helper: {
      type: Object,
      default: () => {
        return {
          theme: true
        }
      }
    }
  },
  components: {
    EditorDialog,
    EditorUpload,
    EditorTable,
    EditorPreview,
    EditorHelper
  },
  emits: ['ready', 'update:modelValue', 'change', 'focus', 'blur', 'selectionChange', 'hotKey'],
  setup (props, ctx) {
    const prefix = 'totonoo-markdown-editor-'
    const id = uuidv4()
    const rootBox = ref()
    
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
    const theme = ref(props.config?.theme || 'light')

    // 监听value变化，同步编辑器
    watch(() => props.modelValue, (val) => {
      if (editor && editor.getValue() !== val) {
        editor.setValue(val)
      }
    })

    onMounted(() => {
      nextTick(() => {
        // 初始化
        editor = new MarkdownEditor(`#${prefix + id}`, {
          initValue: props.modelValue
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
      })
    })
    return {
      id: prefix + id,
      rootBox,
      uploadVisible,
      uploadDone,
      tableVisible,
      tableDone,
      previewVisible,
      previewDone,
      isFullscreen,
      theme,
      themeChange (theme: string) {
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
      }
    }
  },
})
</script>
<style lang="scss" scoped>
.totonoo-markdown-editor {
  --color-bg: #ffffff;
  --color-text: #666666;
  --color-text-1: #999999;
  --color-border: #eee;
  --color-dialog-bg: rgba(255, 255, 255, 0.6);
  --border-radius: 2px;

  --input-text-color: rgba(0, 0, 0, 0.9);
  --input-text-bg: rgba(0, 0, 0, 0.06);
  --input-text-hover-bg: rgba(0,0,0, 0.1);

  --scroll-bar-color: #888888;
  --scroll-track-color: #dddddd;
  &.dark {
    --color-bg: #2a2a2b;
    --color-text: #d4d4d4;
    --color-text-1: #999999;
    --color-border: rgb(19, 19, 19);
    --color-dialog-bg: rgba(0, 0, 0, 0.6);

    --input-text-color: rgba(255, 255, 255, 0.9);
    --input-text-bg: rgba(255, 255, 255, 0.08);
    --input-text-hover-bg: rgba(255, 255, 255, 0.16);

    --scroll-bar-color: #444444;
    --scroll-track-color: #000000;
  }

  width: 100%;
  height: 100%;
  position: relative;

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
