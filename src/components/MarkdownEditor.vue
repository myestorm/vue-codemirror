<template>
  <layout :id="id" :preview-hide="previewHide">
    <template #toolbar>
      <toolbar @toolbarEvents="toolbarHandler" />
    </template>
    <template #editor>
      <editor />
    </template>
    <template #preview>
      <preview />
    </template>
  </layout>
</template>
<script>
import { defineComponent, onMounted, ref } from 'vue'
import Layout from './MarkdownEditor/Layout.vue'
import Toolbar from './MarkdownEditor/Toolbar.vue'
import Editor from './MarkdownEditor/Editor.vue'
import Preview from './MarkdownEditor/Preview.vue'
import MarkdownEditor from './MarkdownEditor/Index'
import './MarkdownEditor/Fonts/iconfont.css'
export default defineComponent({
  components: {
    Layout,
    Toolbar,
    Editor,
    Preview
  },
  emits: ['ready'],
  setup (props, ctx) {
    const id = `markdown-editor-${new Date().getTime()}-${Math.round(Math.random() * (999 - 100) + 100)}`
    const editor = new MarkdownEditor()
    const previewHide = ref(true)
    onMounted(() => {
      editor.init(id)
      ctx.emit('ready', editor)
    })
    const toolbarHandler = (type) => {
      const handler = editor[type].bind(editor)
      if (handler && typeof handler === 'function') {
        if (type === 'preview') {
          handler().then(res => {
            previewHide.value = !res
          })
        } else {
          handler()
        }
      }
    }
    return {
      id,
      previewHide,
      toolbarHandler
    }
  }
})
</script>
