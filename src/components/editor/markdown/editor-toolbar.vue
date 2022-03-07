<template>
  <div class="totonoo-markdown-editor-toolbar">
    <div class="top"></div>
    <ul class="center">
      <li v-for="(item, key) in events" :key="key">
        <button @click="$emit('btnClick', item)">
          <component :is="item.icon" />
        </button>
        <span class="tips" v-if="item.title"> {{ item.title }} </span>
      </li>
    </ul>
    <div class="bottom"></div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

import IconHead from '../theme/icon/head.svg?component'
import IconTable from '../theme/icon/table.svg?component'

const defHelper = {
  theme: true,
  hotkey: true
}

export enum ToolbarClickTypes {
  head = 'Head',
  table = 'Table'
}

export interface ToolbarItemType {
  type: ToolbarClickTypes, 
  title: string, 
  icon: string
}

export default defineComponent({
  components: {
    IconHead,
    IconTable
  },
  setup (props, ctx) {
    const events = [{
      type: ToolbarClickTypes.head,
      title: '标题',
      icon: 'IconHead'
    }, {
      type: ToolbarClickTypes.table,
      title: '表格',
      icon: 'IconTable'
    }]
    return {
      events
    }
  }
})
</script>
<style lang="scss" scoped>
.totonoo-markdown-editor-toolbar {
  width: 40px;
  height: 100%;
  background-color: var(--color-bg);
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  ul, li {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .center {
    flex: 1;
    li {
      position: relative;
      .tips {
        position: absolute;
        right: 50%;
        top: 50%;
        margin-top: -16px;
        background-color: var(--input-text-hover-bg);
        color: var(--color-text);
        font-size: 12px;
        line-height: 32px;
        white-space: nowrap;
        padding: 0 6px;
        border-radius: 4px;
        transform: scale(0);
        transition: all 300ms ease;
        &::after {
          width: 0;
          height: 0;
          content: "";
          display: block;
          border: 6px solid transparent;
          border-left-color: var(--input-text-hover-bg);
          position: absolute;
          left: 100%;
          top: 50%;
          margin-top: -6px;
        }
      }
      button:hover + .tips {
        right: 110%;
        top: 50%;
        transform: scale(1);
      }
    }
  }
  button {
    width: 32px;
    height: 32px;
    border-radius: 4px;
    border: 0;
    cursor: pointer;
    color: var(--color-text-1);
    background: none;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 300ms ease;
    margin: 4px auto;
    &:hover, &:focus {
      color: var(--color-text);
      background-color: var(--input-text-hover-bg);
    }
    svg {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
