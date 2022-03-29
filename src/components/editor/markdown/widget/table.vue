<template>
  <div class="editor-dialog-form">
    <div class="form-item">
      <label for="toolbar-col">列数</label>
      <input type="number" v-model="cols" id="toolbar-col">
    </div>
    <div class="form-item">
      <label for="toolbar-row">行数</label>
      <input type="number" v-model="rows" id="toolbar-row">
    </div>
    <div class="form-item form-item-submit">
      <button type="button" class="submit-btn" @click="handler">确定</button>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup (props, ctx) {
    const cols = ref<number>(1)
    const rows = ref<number>(1)
    return {
      cols,
      rows,
      handler () {
        ctx.emit('done', cols.value, rows.value)
      }
    }
  }
})
</script>
