<template>
  <div class="codemirror-demo">
    <MarkdownEditor
      v-model="value"
      :editor="editorConfig"
      @blur="changeHandler"
      @focus="changeHandler"
      @selectionChange="consoleHandler"
      @themeChange="consoleHandler"
      @change="changeHandler" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'

import MarkdownEditor from '../components/editor/markdown/index.vue'
// import '../../dist/style.css'
// import { MarkdownEditor } from '../../dist/vue-codemirror.es.js'

export default defineComponent({
  components: {
    MarkdownEditor
  },
  setup () {
    const value = ref(`## 如何使用 Markdown 编写技术文档

文章以名为 Markdown 的轻量级标记语言编写，这种方式易于阅读且易于学习。

当我们在 GitHub 中存储内容时，该内容可以使用名为 GitHub Flavored Markdown (GFM) 的 Markdown 版本，该版本提供了额外的功能，可满足常见的格式需求。此外，还通过几种方式扩展了 Markdown，以支持某些与帮助相关的功能，如备注、提示和嵌入式视频。

## Markdown 基础知识

### 标题

要创建标题，请在行首使用井号 (#)：

\`\`\`markdown
# This is level 1 (article title)

## This is level 2

### This is level 3

#### This is level 4

##### This is level 5
\`\`\`

### 基本文本

Markdown 中的段落不需要特殊语法。

要将文本格式设置为 **粗体**，请用两个星号将文本括起来。要将文本格式设置为 *斜体*，请用一个星号将文本括起来：

> Markdown是一种轻量级标记语言，创始人为約翰·格魯伯。它允许人们使用易读易写的  
> 纯文本格式编写文档，然后转换成有效的XHTML（或者HTML）文档。

### 编号列表和项目符号列表

1. This is step 1.
2. This is the next step.
3. This is yet another step, the third.

- This is item 1
- This is item 2
- This is item 3

- [ ] This is task list item 1
- [x] This is task list item 2
- [ ] This is task list item 3

### 表格

| num | name     |
| --- | -------- |
| 1   | zhangsan |
| 2   | lisi     |
`)
    const changeHandler = (val: string, editor: typeof MarkdownEditor) => {
      console.log(val === value.value)
    }
    const consoleHandler = (val: string, editor: typeof MarkdownEditor) => {
      console.log(val)
    }
    const editorConfig = {
      lineWrapping: true,
      lineNumbers: true,
      allowMultipleSelections: true
    }
    return {
      value,
      editorConfig,
      changeHandler,
      consoleHandler
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
