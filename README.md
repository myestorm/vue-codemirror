# vue-codemirror

codemirror vue组件，支持TS，使用的是codemirror 6。支持明暗模式。

## 准备开始

### 安装

首先需要安装 `npm`

```bash
npm install vue-codemirror --save
```

### 基础使用

```vue
<template>
  <div class="codemirror-demo">
    <MarkdownEditor @change="change" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

import '@totonoo/vue-codemirror/dist/style.css'
import { MarkdownEditor } from '@totonoo/vue-codemirror'

export default defineComponent({
  components: {
    MarkdownEditor
  },
  setup () {
    return {
      change (val: string) {
        console.log(val)
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
```

## MarkdownEditor 详细使用说明

### Events

- ready (editor: MarkdownEditor) => {}
- change (value: string, update: ViewUpdate) => {}
- focus (value: string, update: ViewUpdate) => {}
- blur (value: string, update: ViewUpdate) => {}
- selectionChange (value: Line, update: ViewUpdate) => {}
- hotKey (value: MDHotKeyValueType) => {}

```typescript
interface MDHotKeyValueType<T> {
  type: HotKeyTypes,
  value: T,
  view: EditorView
}
```

### 快捷键 (HotKeyTypes)

| 组合键    | 说明    |
| --- | --- |
|  Ctrl-s   |  保存   |
|  Ctrl-b   |  美化、格式化   |
|  Ctrl-1   |  一级标题   |
|  Ctrl-2   |  二级标题   |
|  Ctrl-3   |  三级标题   |
|  Ctrl-4   |  四级标题   |
|  Ctrl-5   |  五级标题   |
|  Ctrl-6   |  六级标题   |
|  Ctrl-Alt-t   |  插入表格   |
|  Ctrl-Alt-m   |  插入媒体   |
|  Ctrl-Alt-p   |  预览   |
|  Ctrl-Alt-b   |  加粗   |
|  Ctrl-Alt-i   |  斜体   |
|  Ctrl-Alt-l   |  删除线   |
|  Ctrl-Alt-h   |  分割线   |
|  Ctrl-Alt-q   |  引用   |
|  Shift-Alt-o   |  有序列表   |
|  Shift-Alt-u   |  无序列表   |
|  Shift-Alt-t   |  TODO列表   |
|  Shift-Alt-i   |  内联代码   |
|  Shift-Alt-b   |  块级代码   |
|  Shift-Alt-l   |  链接   |
