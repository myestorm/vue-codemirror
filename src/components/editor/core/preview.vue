<template>
  <div class="editor-preview" ref="previewBox" :style="{
    height: height + 'px'
  }">
    <div class="editor-preview-content markdown-body" v-html="html"></div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, nextTick, computed } from 'vue'
import md2html from '../markdown/parser/md2html'
import '../theme/preview.scss'

export default defineComponent({
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    root: {
      type: Element,
      default: null
    }
  },
  setup (props, ctx) {
    const height = ref<number>(300)
    const previewBox = ref<Element>()
    const setHeight = () => {
      if (props.root) {
        const h = props.root.clientHeight
        const _th = previewBox?.value?.parentElement?.querySelector('.title')?.clientHeight
        let th = 40
        if (_th) {
          th = _th
        }
        height.value = h - th - 32
      }
    }
    const parser = (md: string): string => {
      let html = md2html(md)
      // 替换code的sourcemap
      html = html.replace(/<pre><code data-source-start="(\d+)" data-source-end="(\d+)" data-source-level="(\d+)"/g, '<pre data-source-start="$1" data-source-end="$2" data-source-level="$3"><code')
      return html
    }
    const html = computed(() => {
      return parser(props.modelValue)
    })

    onMounted(() => {
      nextTick(() => {
        setHeight()
      })
    })
    return {
      previewBox,
      height,
      html
    }
  }
})
</script>
<style lang="scss" scoped>
.editor-preview {
  overflow: auto;
  &-content {
    padding: 8px 16px;
  }
}
</style>
