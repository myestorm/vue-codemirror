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
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, nextTick, ref, watch } from 'vue'
import MarkdownEditor, { MarkdownThemeType } from './index'
import createToolbar, { ToolbarsType, ToolbarItemType } from './toolbar'

export default defineComponent({
  name: 'TotonooMarkdownEditor',

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

    const toolbars = ref<ToolbarsType>()

    onMounted(() => {
      nextTick(() => {
        editor.init(`#${contentId}`)
        toolbars.value = createToolbar(editor)
      })
    })

    return {
      prefix,
      id,
      contentId,
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
  --color-text-1: #999999;
  &.dark {
    --color-bg: var(--editor-bg-dark, '#2a2a2b');
    --color-shadow: 0 0 2px 0 rgba(255,255,255,0.16) inset;
    --color-text-1: #999999;
  }
  width: 100%;
  height: 100%;
  display: flex;
  align-items: stretch;
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
