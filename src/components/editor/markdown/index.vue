<template>
  <div :id="id" class="content"></div>
  <button @click="light">白天模式</button>
  <button @click="dark">黑夜模式</button>
</template>
<script lang="ts">
import { defineComponent, onMounted, nextTick } from 'vue'
import { v4 as uuidv4 } from 'uuid'

import MarkdownEditor from './index'

export default defineComponent({
  name: 'MarkdownEditor',
  emits: ['ready', 'update:value', 'change', 'focus', 'blur', 'editorSave', 'format', 'infoClick'],
  setup (props, ctx) {
    const prefix = 'totonoo-markdown-editor-'
    const id = uuidv4()
    
    let editor: MarkdownEditor

    onMounted(() => {
      nextTick(() => {
        editor = new MarkdownEditor(`#${prefix + id}`, {
          initValue: `
## 自定义主题

Element 默认提供一套主题，CSS 命名采用 BEM 的风格，方便使用者覆盖样式。我们提供了四种方法，可以进行不同程度的样式自定义。

## 主题编辑器

使用在线主题编辑器，可以修改定制 Element 所有全局和组件的 Design Tokens，并可
以方便地实时预览样式改变后的视觉。同时它还可以基于新的定制样式生成完整的样式文件包，供
直接下载使用（关于如何使用下载的主题包，请参考本节「引入自定义主题」部分）。

也可以使用主题编辑器 Chrome 插件，在任何使用 Element 开发的网站上配置并实时预览主题。
`
        })
        editor.events.focus = (update) => {
          console.log(update)
        }
        editor.events.save = (update, value) => {
          console.log(value)
        }
      })
    })

    return {
      id: prefix + id,
      dark () {
        editor.view.dispatch({
          effects: editor.theme.reconfigure(editor.themeDark)
        })
      },
      light () {
        editor.view.dispatch({
          effects: editor.theme.reconfigure(editor.themeLight)
        })
      }
    }
  },
})
</script>
<style lang="scss" scoped>
.content {
  height: 100%;
  overflow: auto;
  > .cm-editor {
    height: 100%;
  }
}
</style>
