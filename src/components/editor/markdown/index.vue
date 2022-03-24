<template>
  <div class="totonoo-markdown-editor" ref="editRootElement" :id="prefix + id">
    <div :id="contentId" class="content"></div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, nextTick, ref, watch } from 'vue'
import MarkdownEditor, { MarkdownThemeType } from './index'

export default defineComponent({
  name: 'TotonooMarkdownEditor',
  setup (props, ctx) {
    const editor = new MarkdownEditor({
      theme: {
        def: MarkdownThemeType.DARK
      }
    })
    const editRootElement = ref()
    const prefix = 'totonoo-markdown-'
    const id = editor.uuid()
    const contentId = `${prefix}${id}-editor`

    onMounted(() => {
      nextTick(() => {
        editor.init(`#${contentId}`)
      })
    })

    return {
      prefix,
      id,
      contentId,
      editRootElement
    }
  }
})
</script>
