<template>
  <div class="codemirror-demo">
    <MarkdownEditor
      v-model="value"
      :theme="theme"
      :upload="uploadConfig"
      @change="changeHandler" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'

import MarkdownEditor from '../components/editor/markdown/index.vue'
import { TotonooMarkdownEditorProps, ThemeType } from '../components/editor/markdown/types'

export default defineComponent({
  components: {
    MarkdownEditor
  },
  setup () {
    const value = ref('Markdown 中的段落不需要特殊语法。')
    const changeHandler = (val: string, editor: typeof MarkdownEditor) => {
      console.log(val === value.value)
    }
    const uploadSuccess: TotonooMarkdownEditorProps['upload']['uploadSuccess'] = (result: any): string => {
      return result.data.domain + result.data.filepath
    }
    const uploadFail: TotonooMarkdownEditorProps['upload']['uploadFail'] = (error: any): void => {
      console.log('console', error)
    }
    const theme = {
      def: ThemeType.DARK,
      observer: 'body',
      observerAttr: 'theme'
    }
    const uploadConfig = {
      uploadUrl: '/api/upload',
      headers: {
        token: 'test token'
      },
      uploadSuccess,
      uploadFail
    }
    return {
      value,
      uploadConfig,
      theme,
      changeHandler
    }

  },
})
</script>
<style lang="scss">
.codemirror-demo {
  --editor-bg-light: #f5f5f5;
  --editor-bg-dark: #000000;
  border: 1px #dddddd solid;
  box-sizing: border-box;
  height: calc(100vh - 40px);
}
</style>
