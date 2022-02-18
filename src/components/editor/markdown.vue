<template>
  <div :id="id" class="content"></div>
  <button @click="light">白天模式</button>
  <button @click="dark">黑夜模式</button>
</template>
<script lang="ts">
import { defineComponent, onMounted, nextTick } from 'vue'
import { v4 as uuidv4 } from 'uuid'

import MarkdownEditor from './markdown'

export default defineComponent({
  name: 'MarkdownEditor',
  emits: ['ready', 'update:value', 'change', 'focus', 'blur', 'editorSave', 'format', 'infoClick'],
  setup (props, ctx) {
    const prefix = 'totonoo-markdown-editor-'
    const id = uuidv4()
    
    let editor: MarkdownEditor

    onMounted(() => {
      nextTick(() => {
        editor = new MarkdownEditor(`#${prefix + id}`)
        editor.events.focus = (update) => {
          console.log(update)
        }
        editor.events.save = (update, value) => {
          console.log(value)
        }
      })
    })

    return {
      id: prefix + id,
      dark () {
        editor.view.dispatch({
          effects: editor.theme.reconfigure(editor.themeDark)
        })
      },
      light () {
        editor.view.dispatch({
          effects: editor.theme.reconfigure(editor.themeLight)
        })
      }
    }
  },
})
</script>
<style lang="scss" scoped>
.content {
  height: 100%;
  overflow: auto;
  > .cm-editor {
    height: 100%;
  }
}
</style>
