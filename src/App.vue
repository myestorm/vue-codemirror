<template>
  <div class="codemirror-demo">
    <MarkdownEditor v-model="value" :helper="{ theme: true }" @hotKey="hotKeyHandler" @change="changeHandler" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'

import MarkdownEditor, { MDHotKeyValueType } from './components/editor/markdown/index.vue'

export default defineComponent({
  components: {
    MarkdownEditor
  },
  setup () {
    const value = ref(`## 自定义主题

Element 默认提供一套主题，CSS 命名采用 BEM 的风格，方便使用者覆盖样式。我们提供了四种方法，可以进行不同程度的样式自定义。

## 主题编辑器

使用在线主题编辑器，可以修改定制 Element 所有全局和组件的 Design Tokens，并可
以方便地实时预览样式改变后的视觉。同时它还可以基于新的定制样式生成完整的样式文件包，供
直接下载使用（关于如何使用下载的主题包，请参考本节「引入自定义主题」部分）。

也可以使用主题编辑器 Chrome 插件，在任何使用 Element 开发的网站上配置并实时预览主题。`)
  return {
    value,
    hotKeyHandler (val: MDHotKeyValueType<string | null>) {
      const { type } = val
      if(type === 'Ctrl-s') {
        console.log(1000)
      }
    },
    changeHandler (val: string) {
      console.log(value)
    }
  }

  },
})
</script>
<style lang="scss">
.codemirror-demo {
  border: 1px #dddddd solid;
  height: 600px;
}
</style>
