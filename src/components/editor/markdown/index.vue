<template>
  <div class="totonoo-markdown-editor" :class="[isFullscreen ? 'editor-fullscreen' : '']" ref="editRootElement" :id="prefix + id">
    <div :id="contentId" class="content"></div>
    <aside class="toolbar">
      <div v-for="(items, key) in toolbars" :class="[key]" :key="key">
        <template v-for="item in items.slice(0, toolbarFoldNumber)" :key="item.type">
          <div class="toolbar-item">
            <button @click="toolbarItemClickHandler(item)" :title="item.title">
              <component :is="item.icon" class="svg" />
            </button>
          </div>
        </template>
        
        <div class="more" v-if="items.length > toolbarFoldNumber">
          <button class="more-btn" @click="toolbarFolds[key] = !toolbarFolds[key]"><IconMore class="svg" /></button>
          <div class="more-items" :class="[toolbarFolds[key] ? 'show' : '']">
            <template v-for="item in items.slice(toolbarFoldNumber)" :key="item.type">
              <div class="toolbar-item">
                <button @click="toolbarItemClickHandler(item)" :title="item.title">
                  <component :is="item.icon" class="svg" />
                </button>
              </div>
            </template>
          </div>
        </div>
      </div>
    </aside>
    <editor-dialog v-model="tableVisible" :fixed="dialogConfig.fixed" :fullScreen="dialogConfig.fullScreen" :zIndex="dialogConfig.zIndex" :header="{ title: '插入表格' }">
      <editor-table @done="tableDone" />
    </editor-dialog>

    <editor-dialog v-model="mediaVisible" :fixed="dialogConfig.fixed" :fullScreen="dialogConfig.fullScreen" :zIndex="dialogConfig.zIndex" :header="{ title: '插入资源' }">
      <editor-upload @done="mediaDone" />
    </editor-dialog>

    <editor-dialog v-model="previewVisible" :fixed="dialogConfig.fixed" :fullScreen="true" :zIndex="dialogConfig.zIndex" :header="{ title: '预览' }">
      <editor-preview v-model="preview" />
    </editor-dialog>

    <editor-dialog v-model="helperVisible" :fixed="dialogConfig.fixed" contentMaxWidth="50%" :zIndex="dialogConfig.zIndex" :fullScreen="dialogConfig.fullScreen" :header="{ title: '帮助文档' }">
      <editor-helper v-model="hotKeys" />
    </editor-dialog>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, nextTick, ref, shallowRef, reactive, watch, computed } from 'vue'
import IconMore from '../theme/markdown/more.svg?component'
import MarkdownEditor, { MarkdownThemeType, MarkdownEventType } from './index'
import { ToolbarsType, ToolbarItemType, ToolbarItemTypes } from './toolbar'
import EditorDialog from '../../dialog/index.vue'
import EditorTable from './widget/table.vue'
import EditorUpload from './widget/upload.vue'
import EditorPreview from './widget/preview.vue'
import EditorHelper from './widget/helper.vue'

export default defineComponent({
  name: 'TotonooMarkdownEditor',
  components: {
    IconMore,
    EditorDialog,
    EditorTable,
    EditorUpload,
    EditorPreview,
    EditorHelper
  },
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    dialog: {
      type: Object,
      default: () => {}
    }
  },
  setup (props, ctx) {
    // 处理配置
    const dialogDefConfig = {
      fullScreen: false,
      fixed: false,
      zIndex: 3
    }
    const dialogConfig = Object.assign(dialogDefConfig, props.dialog)

    const editor = new MarkdownEditor({
      initValue: props.modelValue,
      theme: {
        def: MarkdownThemeType.LIGHT
      }
    })
    const editRootElement = ref()
    const prefix = 'totonoo-markdown-'
    const id = editor.uuid()
    const contentId = `${prefix}${id}-editor`

    const toolbarEmit = (item: ToolbarItemType, type: string): void => {
      ctx.emit('toolbarItemAction', item, type, editor)
    }

    // 表格
    const tableVisible = ref(false)
    let tableItem:ToolbarItemType
    const setTableVisible = (val: boolean, item: ToolbarItemType) => {
      tableItem = item
      tableVisible.value = val
    }
    const tableDone = (cols: number, rows: number) => {
      tableVisible.value = false
      editor.insertTable(cols, rows)
      toolbarEmit(tableItem, 'dialogDone')
    }

    // 媒体
    const mediaVisible = ref(false)
    let mediaItem:ToolbarItemType
    const setMediaVisible = (val: boolean, item: ToolbarItemType) => {
      mediaItem = item
      mediaVisible.value = val
    }
    const mediaDone = (url: string, desc: string) => {
      mediaVisible.value = false
      editor.insertMedia(url, desc)
      toolbarEmit(mediaItem, 'dialogDone')
    }

    // 预览
    const previewVisible = ref(false)
    const preview = computed(() => props.modelValue)
    const setPreviewVisible = (val: boolean) => {
      previewVisible.value = val
    }

    // 帮助
    const helperVisible = ref(false)
    const hotKeys = ref()
    const getHotKeys = (_toolbars: ToolbarsType): void => {
      const arr: ToolbarItemType[] = _toolbars.top.concat(_toolbars.center, _toolbars.bottom)
      const res = arr.map(item => {
        const shortcutKey = item.shortcutKey || ''
        const macShortcutKey = shortcutKey?.replace(/Ctrl/gmi, 'Cmd') || ''
        return {
          type: item.type,
          title: item.title,
          win: shortcutKey,
          mac: macShortcutKey
        }
      })
      hotKeys.value = res
    }
    const setHelperVisible = (val: boolean) => {
      helperVisible.value = val
    }

    // 全屏
    const isFullscreen = ref(false)
    const setFullscreen = () => {
      isFullscreen.value = !editRootElement.value.classList.contains('editor-fullscreen')
    }

    const toolbars = shallowRef<ToolbarsType>()
    const toolbarFolds = reactive({
      top: false,
      center: false,
      bottom: false
    })
    const toolbarFoldNumber = ref(16)
    const countFoldNumber = (): number => {
      const h = 32
      const _toolbars = editor.getToolbars()
      const res = Math.floor(editRootElement.value.clientHeight / h) - (_toolbars.top.length + _toolbars.bottom.length) - 1
      toolbarFoldNumber.value = res
      return res
    }

    const beforeInitToolbars = (_toolbars: ToolbarsType): ToolbarsType => {
      _toolbars.center.map(item => {
        switch (item.type) {
          case ToolbarItemTypes.table: {
            item.action = () => {
              setTableVisible(true, item)
            }
            break
          }
          case ToolbarItemTypes.media: {
            item.action = () => {
              setMediaVisible(true, item)
            }
            break
          }
          case ToolbarItemTypes.preview: {
            item.action = () => {
              setPreviewVisible(true)
            }
            break
          }
          case ToolbarItemTypes.fullscreen: {
            item.action = () => {
              setFullscreen()
            }
            break
          }
          default: {
            break
          }
        }
        item.end = toolbarEmit
        return item
      })
      _toolbars.top.map(item => {
        item.end = toolbarEmit
        return item
      })
      _toolbars.bottom.map(item => {
        switch (item.type) {
          case ToolbarItemTypes.helper: {
            item.action = () => {
              setHelperVisible(true)
            }
            break
          }
          default: {
            break
          }
        }
        item.end = toolbarEmit
        return item
      })
      return _toolbars
    }

    const initEditor = () => {
      editor.init(`#${contentId}`, {
        beforeInitToolbars
      })
      toolbars.value = editor.getToolbars()

      editor.setEvent(MarkdownEventType.CHANGE, (v, e) => {
        ctx.emit('update:modelValue', v)
        ctx.emit(MarkdownEventType.CHANGE, v, e)
      })

      editor.setEvent(MarkdownEventType.BLUR, (v, e) => {
        ctx.emit(MarkdownEventType.BLUR, v, e)
      })

      editor.setEvent(MarkdownEventType.FOCUS, (v, e) => {
        ctx.emit(MarkdownEventType.FOCUS, v, e)
      })

      editor.setEvent(MarkdownEventType.SELECTCHANGE, (v, e) => {
        ctx.emit(MarkdownEventType.SELECTCHANGE, v, e)
      })

      editor.setEvent(MarkdownEventType.THEMECHANGE, (v, e) => {
        ctx.emit(MarkdownEventType.THEMECHANGE, editor.themeStatus, e)
      })

      ctx.emit('ready', editor)
    }

    const toolbarItemClickHandler = (item: ToolbarItemType) => {
      if (typeof item.action === 'function') {
        item.action()
      }
      if (typeof item.end === 'function') {
        item.end(item, 'click')
      }
    }

    onMounted(() => {
      nextTick(() => {
        initEditor()
        countFoldNumber()
        getHotKeys(editor.getToolbars())
        // 监听元素高度的变化
        const observer = new MutationObserver((mutationsList, observer) => {
          for(let mutation of mutationsList) {
            if (mutation.type === 'attributes') {
              countFoldNumber()
            }
          }
        })
        observer.observe(editRootElement.value, { subtree: false, childList: false, attributes: true })
      })
    })

    watch(() => props.modelValue, (val) => {
      if (editor && editor.getValue() !== val) {
        editor.setValue(val)
      }
    })

    return {
      dialogConfig,
      prefix,
      id,
      contentId,
      tableVisible,
      tableDone,
      mediaVisible,
      mediaDone,
      preview,
      previewVisible,
      helperVisible,
      hotKeys,
      isFullscreen,
      editRootElement,
      toolbars,
      toolbarItemClickHandler,
      toolbarFolds,
      toolbarFoldNumber
    }
  }
})
</script>
<style lang="scss" scoped>
.totonoo-markdown-editor {
  --color-bg: var(--editor-bg-light, '#ffffff');
  --color-shadow: 0 0 2px 0 rgba(0,0,0,0.16) inset;
  --color-text: #666666;
  --color-text-1: #999999;
  --color-dialog-bg: rgba(255, 255, 255, 0.6);
  --color-border: #eee;
  --border-radius: 2px;
  --input-text-color: rgba(0, 0, 0, 0.9);
  --input-text-bg: rgba(0, 0, 0, 0.06);
  --input-text-hover-bg: rgba(0,0,0, 0.1);
  --scroll-bar-color: #888888;
  --scroll-track-color: #dddddd;
  &.dark {
    --color-bg: var(--editor-bg-dark, '#2a2a2b');
    --color-shadow: 0 0 2px 0 rgba(255,255,255,0.16) inset;
    --color-text: #d4d4d4;
    --color-text-1: #999999;
    --color-dialog-bg: rgba(0, 0, 0, 0.6);
    --color-border: rgb(19, 19, 19);
    --border-radius: 2px;
    --input-text-color: rgba(255, 255, 255, 0.9);
    --input-text-bg: rgba(255, 255, 255, 0.08);
    --input-text-hover-bg: rgba(255, 255, 255, 0.16);
    --scroll-bar-color: #444444;
    --scroll-track-color: #000000;
  }
  width: 100%;
  height: 100%;
  display: flex;
  align-items: stretch;
  position: relative;
  // transition: all 300ms ease;
  > .content {
    flex: 1;
    height: 100%;
  }
  > .toolbar {
    width: 44px;
    background-color: var(--color-bg);
    box-shadow: var(--color-shadow);
    display: flex;
    flex-direction: column;
    .top, .bottom {
      padding: 4px 0;
    }
    .center {
      flex: 1;
    }
    .toolbar-item {
      text-align: center;
      > button {
        width: 32px;
        height: 32px;
        margin: 0;
        padding: 0;
        border: 0;
        cursor: pointer;
        background: none;
        color: var(--color-text-1);
      }
    }
    .svg {
      width: 18px;
      height: 18px;
    }
    .more {
      position: relative;
      text-align: center;
      .more-btn {
        width: 32px;
        height: 32px;
        margin: 0;
        padding: 0;
        border: 0;
        cursor: pointer;
        background: none;
        color: var(--color-text-1);
      }
    }
    .more-items {
      position: absolute;
      top: 0;
      right: 100%;
      display: none;
      &.show {
        display: flex;
      }
    }
  }
  &.editor-fullscreen {
    width: 100vw;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
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
}
</style>
