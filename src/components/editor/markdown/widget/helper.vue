<template>
  <div class="editor-helper">
    <h2>快捷键</h2>
    <table>
      <thead>
        <tr>
          <th>WIN</th>
          <th>MAC</th>
          <th>说明</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(item, index) in modelValue" :key="index">
        <tr v-if="item.win">
          <td>{{ item.win }}</td>
          <td>{{ item.mac }}</td>
          <td>{{ item.title }} / {{ item.type }}</td>
        </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'

interface Props {
  modelValue: {
    type: string,
    title: string,
    win: string,
    mac: string
  }[];
}

export default defineComponent({
  props: {
    modelValue: {
      type: Array as PropType<Props['modelValue']>,
      default: () => []
    }
  },
  setup () {
    return {
    }
  }
})
</script>
<style lang="scss" scoped>
.editor-helper {
  padding: 0 16px;
  h2 {
    font-size: 16px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    td, th {
      border: 1px var(--color-border) solid;
      padding: 4px 8px;
      font-size: 12px;
      color: var(--color-text);
      text-align: left;
    }
    > thead th {
      &:first-child, &:nth-child(2) {
        width: 35%;
      }
    }
    tr {
      &:nth-child(odd) {
        td {
          background-color: var(--input-text-bg);
        }
      }
    }
  }
}
</style>
