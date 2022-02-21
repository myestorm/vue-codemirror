<template>
  <div class="codemirror-demo">
    <MarkdownEditor />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

import MarkdownEditor from './components/editor/markdown/index.vue'

export default defineComponent({
  components: {
    MarkdownEditor
  },
  setup () {
    
  },
})
</script>
<style lang="scss">
.codemirror-demo {
  border: 1px #dddddd solid;
  height: 600px;
}
</style>
