<template>
  <div class="totonoo-markdown-editor" ref="editRootElement" :id="prefix + id">
    <div :id="contentId" class="content"></div>
    <aside class="toolbar">
      <div v-for="(items, key) in toolbars" :class="[key]" :key="key">
        <div class="toolbar-item" v-for="item in items" :key="item.type">
          <button @click="toolbarItemClickHandler(item)" :title="item.title">
            <component :is="item.icon" class="svg" />
          </button>
        </div>
      </div>
      <div class="bottom"></div>
    </aside>
    <editor-dialog v-model="tableVisible" :fixed="true" :header="{ title: '插入表格' }">
      <editor-table @done="tableDone" />
    </editor-dialog>

    <editor-dialog v-model="mediaVisible" :fixed="true" :header="{ title: '插入资源' }">
      <editor-upload @done="mediaDone" />
    </editor-dialog>

    <editor-dialog v-model="previewVisible" :fixed="true" :fullScreen="true" :header="{ title: '预览' }">
      <editor-preview v-model="preview" @done="previewDone" />
    </editor-dialog>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, nextTick, ref, shallowRef, watch, computed } from 'vue'
import MarkdownEditor, { MarkdownThemeType, MarkdownEventType } from './index'
import { ToolbarsType, ToolbarItemType, ToolbarItemTypes } from './toolbar'
import EditorDialog from '../../dialog/index.vue'
import EditorTable from './widget/table.vue'
import EditorUpload from './widget/upload.vue'
import EditorPreview from './widget/preview.vue'

export default defineComponent({
  name: 'TotonooMarkdownEditor',
  components: {
    EditorDialog,
    EditorTable,
    EditorUpload,
    EditorPreview
  },
  props: {
    modelValue: {
      type: String,
      default: ''
    }
  },
  setup (props, ctx) {
    const editor = new MarkdownEditor({
      theme: {
        def: MarkdownThemeType.LIGHT
      }
    })
    const editRootElement = ref()
    const prefix = 'totonoo-markdown-'
    const id = editor.uuid()
    const contentId = `${prefix}${id}-editor`

    // 表格
    const tableVisible = ref(false)
    const setTableVisible = (val: boolean) => {
      tableVisible.value = val
    }
    const tableDone = (cols: number, rows: number) => {
      tableVisible.value = false
      editor.insertTable(cols, rows)
    }

    // 媒体
    const mediaVisible = ref(false)
    const setMediaVisible = (val: boolean) => {
      mediaVisible.value = val
    }
    const mediaDone = (url: string, desc: string) => {
      mediaVisible.value = false
      editor.insertMedia(url, desc)
    }

    // 预览
    const previewVisible = ref(false)
    const preview = computed(() => props.modelValue)
    const setPreviewVisible = (val: boolean) => {
      previewVisible.value = val
    }
    const previewDone = (url: string, desc: string) => {
      previewVisible.value = false
      editor.insertMedia(url, desc)
    }

    const toolbars = shallowRef<ToolbarsType>()
    const beforeInitToolbars = (_toolbars: ToolbarsType): ToolbarsType => {
      _toolbars.center.map(item => {
        switch (item.type) {
          case ToolbarItemTypes.table: {
            item.action = () => {
              setTableVisible(true)
            }
            break
          }
          case ToolbarItemTypes.media: {
            item.action = () => {
              setMediaVisible(true)
            }
            break
          }
          case ToolbarItemTypes.preview: {
            item.action = () => {
              setPreviewVisible(true)
            }
            break
          }
          default: {
            break
          }
        }
        return item
      })
      return _toolbars
    }

    const initEditor = () => {
      editor.init(`#${contentId}`, {
        beforeInitToolbars
      })
      toolbars.value = editor.getToolbars()

      editor.setEvent(MarkdownEventType.THEMECHANGE, () => {
        console.log(222)
      })
    }

    onMounted(() => {
      nextTick(() => {
        initEditor()
      })
    })

    return {
      prefix,
      id,
      contentId,
      tableVisible,
      tableDone,
      mediaVisible,
      mediaDone,
      preview,
      previewVisible,
      previewDone,
      editRootElement,
      toolbars,
      toolbarItemClickHandler (item: ToolbarItemType) {
        if (typeof item.action === 'function') {
          item.action()
        }
        ctx.emit('toolbarItemClick', item, editor)
      }
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
      .svg {
        width: 18px;
        height: 18px;
      }
    }
  }
}
</style>
