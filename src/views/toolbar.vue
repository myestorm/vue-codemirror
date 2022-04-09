<template>
  <div class="codemirror-demo">
    <MarkdownEditor
      v-model="value"
      @toolbarItemAction="toolbarItemAction"
      :beforeInitToolbars="beforeInitToolbars" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'

import MarkdownEditor from '../components/editor/markdown/index.vue'
import { ToolbarsType, ToolbarItemType } from '../components/editor/markdown/types'
import IconUpload from '../components/editor/theme/markdown/upload.svg?component'

export default defineComponent({
  components: {
    MarkdownEditor
  },
  setup () {
    const value = ref('')
    const TopCustom: ToolbarItemType = {
      type: 'top_custom',
      title: '自定义',
      icon: IconUpload,
      shortcutKey: 'Alt-x',
      action: () => {
        console.log('in')
      }
    }
    const beforeInitToolbars = (toolbars: ToolbarsType) => {
      toolbars.top.push(TopCustom)
      return toolbars
    }
    const toolbarItemAction = (item: ToolbarItemType, type: string, editor: typeof MarkdownEditor) => {
      console.log(item.type, type) // type: click[点击], keyboard[键盘]
      editor.setValue('test demo')
    }
    return {
      value,
      beforeInitToolbars,
      toolbarItemAction
    }

  },
})
</script>
<style lang="scss" scoped>
.codemirror-demo {
  --editor-bg-light: #f5f5f5;
  --editor-bg-dark: #000000;
  border: 1px #dddddd solid;
  box-sizing: border-box;
  width: 375px;
  height: 667px;
  margin: 0 auto;
}
</style>