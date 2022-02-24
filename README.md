# vue-codemirror

codemirror vue组件

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
