<template>
  <div class="editor-preview" ref="previewBox">
    <div class="editor-preview-content markdown-body" :class="[dark ? 'dark' : '']" v-html="html"></div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, nextTick, computed } from 'vue'
import md2html from '../parser/md2html'
import './preview.scss'

export default defineComponent({
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    dark: {
      type: Boolean,
      default: false
    }
  },
  setup (props, ctx) {
    const previewBox = ref<Element>()
    const parser = (md: string): string => {
      let html = md2html(md)
      // 替换code的sourcemap
      html = html.replace(/<pre><code data-source-start="(\d+)" data-source-end="(\d+)" data-source-level="(\d+)"/g, '<pre data-source-start="$1" data-source-end="$2" data-source-level="$3"><code')
      return html
    }
    const html = computed(() => {
      return parser(props.modelValue)
    })
    return {
      previewBox,
      html
    }
  }
})
</script>
<style lang="scss" scoped>
.editor-preview {
  &-content {
    padding: 8px 16px;
  }
}
</style>
