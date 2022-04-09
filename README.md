# vue-codemirror

codemirror vue组件，支持TS，使用的是codemirror 6。支持明暗模式。

> 未经测试，不建议使用于生产环境。个人测试作品。

## 准备开始

### 安装

首先需要安装 `npm`

```bash
npm install @totonoo/vue-codemirror --save
```

### 基础使用

```vue
<template>
  <div class="codemirror-demo">
    <MarkdownEditor
      v-model="value"
      @blur="changeHandler"
      @focus="changeHandler"
      @selectionChange="consoleHandler"
      @themeChange="consoleHandler"
      @change="changeHandler" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'

import '@totonoo/vue-codemirror/dist/style.css'
import { MarkdownEditor } from '@totonoo/vue-codemirror'

export default defineComponent({
  components: {
    MarkdownEditor
  },
  setup () {
    const value = ref(`## 标题
    文章以名为 Markdown 的轻量级标记语言编写，这种方式易于阅读且易于学习。
    `)
    const changeHandler = (val: string, editor: typeof MarkdownEditor) => {
      console.log(val === value.value)
    }
    const consoleHandler = (val: string, editor: typeof MarkdownEditor) => {
      console.log(val)
    }
    return {
      value,
      changeHandler,
      consoleHandler
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
```

## MarkdownEditor 详细使用说明

### Events

- ready (editor: typeof MarkdownEditor) => {}
- change (value: string, editor: typeof MarkdownEditor) => {}
- focus (value: string, editor: typeof MarkdownEditor) => {}
- blur (value: string, editor: typeof MarkdownEditor) => {}
- selectionChange (value: Line, editor: typeof MarkdownEditor) => {}
- toolbarItemAction (item: ToolbarItemType, type: string, editor: typeof MarkdownEditor) => {} 边栏点击或快捷键通知

### 快捷键

查看帮助文档，编辑器获得焦点，按 `Alt + h` 即可查看。


### 基础配置

```typescript

const dialog = {
  fullScreen: false,
  fixed: false,
  zIndex: 3
}
const theme = {
  def: 'light', // light or dark
  observer: 'body',
  observerAttr: 'theme'
}

const editorConfig = {
  lineWrapping: true, // 较长文本是否自动换行
  lineNumbers: true, // 是否显示行号
  allowMultipleSelections: true // 是否允许多行选择
}

const uploadConfig = {
  uploadUrl: '/api/upload',
  headers: {
    token: 'test token'
  },
  uploadSuccess: (result: any): string => {
    return result.data.domain + result.data.filepath
  },
  uploadFail: (error: any): void => {
    console.log('console', error)
  }
}

// <MarkdownEditor v-model="value" :dialog="dialog" :theme="theme" :editor="editorConfig" :upload="uploadConfig" />
```

### 常见问题

#### 本地查看效果

```sh
git clone https://github.com/myestorm/vue-codemirror.git
npm install
npm run dev
```

http://localhost:3000/

#### 如何修改背景颜色？

在编辑器的任意一个父级节点注入即可。

```css
.codemirror-demo {
  --editor-bg: #f5f5f5;
  --editor-bg-dark: #000000;
}
```

#### 在边栏上我能做什么

```vue
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

import '@totonoo/vue-codemirror/dist/style.css'
import { MarkdownEditor } from '@totonoo/vue-codemirror'
import IconUpload from '../components/editor/theme/markdown/upload.svg?component'

export default defineComponent({
  components: {
    MarkdownEditor
  },
  setup () {
    const value = ref('')
    const TopCustom: MarkdownMDToolbarItemType = {
      type: 'top_custom',
      title: '自定义',
      icon: IconUpload,
      shortcutKey: 'Alt-x',
      action: () => {
        console.log('in')
      }
    }
    const beforeInitToolbars = (toolbars: MarkdownMDToolbarsType) => {
      toolbars.top.push(TopCustom)
      return toolbars
    }
    const toolbarItemAction = (item: MarkdownMDToolbarItemType, type: string, editor: typeof MarkdownEditor) => {
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
```
