<template>
  <button @click="addClass">{{ btn }}模式</button>
  <div class="codemirror-demo">
    <MarkdownEditor v-model="value" :helper="{ theme: false, hotkey: false }" @hotKey="hotKeyHandler" @change="changeHandler" />
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
    const value = ref(`## Markdown是什么？

Markdown是一种轻量级标记语言，它以纯文本形式(易读、易写、易更改)编写文档，并最终以HTML格式发布。
Markdown也可以理解为将以MARKDOWN语法编写的语言转换成HTML内容的工具。

## 谁创造了它？

它由 \`Aaron Swartz\` 和 \`John Gruber\` 共同设计，Aaron Swartz就是那位于去年（2013年1月11日）自杀,有着开挂一般人生经历的程序员。维基百科对他的介绍是：软件工程师、作家、政治组织者、互联网活动家、维基百科人。

他有着足以让你跪拜的人生经历：

- 14岁参与RSS 1.0规格标准的制订。
- 2004年入读斯坦福，之后退学。
- 2005年创建Infogami，之后与Reddit合并成为其合伙人。
- 2010年创立求进会（Demand Progress），积极参与禁止网络盗版法案（SOPA）活动，最终该提案被撤回。
- 2011年7月19日，因被控从MIT和JSTOR下载480万篇学术论文并以免费形式上传于网络被捕。
- 2013年1月自杀身亡。`)
  const btn = ref('白天')
  return {
    value,
    btn,
    hotKeyHandler (val: MDHotKeyValueType<string | null>) {
      const { type } = val
      if(type === 'Ctrl-s') {
        console.log(1000)
      }
    },
    changeHandler (val: string) {
      console.log(value)
    },
    addClass () {
      const attr = 'theme'
      const body = document.querySelector('body')
      if (body) {
        const theme = body.getAttribute(attr)
        if (theme) {
          body.removeAttribute(attr)
          btn.value = '白天'
        } else {
          body.setAttribute(attr, 'dark')
          btn.value = '黑夜'
        }
      }
    }
  }

  },
})
</script>
<style lang="scss">
.codemirror-demo {
  --editor-bg: #f5f5f5;
  --editor-bg-dark: #000000;
  border: 1px #dddddd solid;
  height: 600px;
}
</style>
