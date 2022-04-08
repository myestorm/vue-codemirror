<template>
  <div class="codemirror-demo">
    <MarkdownEditor
      v-model="value"
      :upload="uploadConfig"
      @change="changeHandler" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'

import MarkdownEditor, { TotonooMarkdownEditorProps } from '../components/editor/markdown/index.vue'
// import '../../dist/style.css'
// import { MarkdownEditor } from '../../dist/vue-codemirror.es.js'

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
