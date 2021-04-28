<template>
  <div class="page">
    <markdown-editor />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import MarkdownEditor from '@/components/MarkdownEditor.vue'

export default defineComponent({
  name: 'App',
  components: {
    MarkdownEditor
  },
  setup () {
    return {
    }
  }
})
</script>

<style lang="scss">
html, body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
html {
  font-size: 14px;
}

#app {
  // font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
