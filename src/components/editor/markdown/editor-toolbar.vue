<template>
  <div class="totonoo-markdown-editor-toolbar">
    <div class="top"></div>
    <div class="center">
      <ul class="list">
        <li v-for="(item, key) in events" :key="key">
          <button @click="btnClickHandler(item)">
            <component :is="item.icon" :style="{
              width: item.width || '16px',
              height: item.height || '16px'
            }" />
          </button>
          <span class="tips" v-if="item.title"> {{ item.title }} </span>
        </li>
        <!-- <li>
          <button>
            <IconMore :style="{
              width: '18px',
              height: '18px'
            }" />
          </button>
        </li> -->
      </ul>
    </div>
    <div class="bottom">
      <ul class="list">
        <li>
          <button>
            <IconSave :style="{
              width: '16px',
              height: '16px'
            }" />
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

import IconHead from '../theme/icon/head.svg?component'
import IconTable from '../theme/icon/table.svg?component'
import IconMedia from '../theme/icon/media.svg?component'
import IconBold from '../theme/icon/bold.svg?component'
import IconStrikethrough from '../theme/icon/strikethrough.svg?component'
import IconItalic from '../theme/icon/italic.svg?component'
import IconTasklist from '../theme/icon/tasklist.svg?component'
import IconOrderlist from '../theme/icon/orderlist.svg?component'
import IconUnorderlist from '../theme/icon/unorderlist.svg?component'
import IconLink from '../theme/icon/link.svg?component'
import IconPreview from '../theme/icon/preview.svg?component'
import IconBlockcode from '../theme/icon/blockcode.svg?component'
import IconInlinecode from '../theme/icon/inlinecode.svg?component'
import IconQuote from '../theme/icon/quote.svg?component'
import IconSave from '../theme/icon/save.svg?component'
import IconMore from '../theme/icon/more.svg?component'

const defHelper = {
  theme: true,
  hotkey: true
}

export enum ToolbarClickTypes {
  head = 'Head',
  table = 'Table',
  media = 'Media',
  bold = 'Bold',
  strikethrough = 'Strikethrough',
  italic = 'Italic',
  tasklist = 'Tasklist',
  orderlist = 'Orderlist',
  unorderlist = 'Unorderlist',
  link = 'Link',
  preview = 'Preview',
  blockcode = 'Blockcode',
  inlinecode = 'Inlinecode',
  quote = 'Quote'
}

export interface ToolbarItemType {
  type: ToolbarClickTypes, 
  title: string, 
  icon: string,
  width?: string,
  height?: string,
}

export default defineComponent({
  components: {
    IconHead,
    IconTable,
    IconMedia,
    IconBold,
    IconStrikethrough,
    IconItalic,
    IconTasklist,
    IconOrderlist,
    IconUnorderlist,
    IconLink,
    IconPreview,
    IconBlockcode,
    IconInlinecode,
    IconQuote,
    IconSave,
    IconMore
  },
  setup (props, ctx) {
    const events: ToolbarItemType[] = [{
      type: ToolbarClickTypes.head,
      title: '标题',
      icon: 'IconHead',
      width: '18px',
      height: '18px'
    }, {
      type: ToolbarClickTypes.bold,
      title: '加粗',
      icon: 'IconBold'
    }, {
      type: ToolbarClickTypes.strikethrough,
      title: '删除线',
      icon: 'IconStrikethrough'
    }, {
      type: ToolbarClickTypes.italic,
      title: '斜体',
      icon: 'IconItalic'
    }, {
      type: ToolbarClickTypes.tasklist,
      title: '任务列表',
      icon: 'IconTasklist'
    }, {
      type: ToolbarClickTypes.orderlist,
      title: '有序列表',
      icon: 'IconOrderlist'
    }, {
      type: ToolbarClickTypes.unorderlist,
      title: '无序列表',
      icon: 'IconUnorderlist'
    }, {
      type: ToolbarClickTypes.link,
      title: '链接',
      icon: 'IconLink'
    }, {
      type: ToolbarClickTypes.table,
      title: '表格',
      icon: 'IconTable',
      width: '16px',
      height: '16px'
    }, {
      type: ToolbarClickTypes.blockcode,
      title: '代码块',
      icon: 'IconBlockcode'
    }, {
      type: ToolbarClickTypes.inlinecode,
      title: '行内代码',
      icon: 'IconInlinecode'
    }, {
      type: ToolbarClickTypes.quote,
      title: '引用',
      icon: 'IconQuote'
    }, {
      type: ToolbarClickTypes.media,
      title: '媒体',
      icon: 'IconMedia'
    }, {
      type: ToolbarClickTypes.preview,
      title: '预览',
      icon: 'IconPreview'
    }]
    return {
      events,
      btnClickHandler (data: ToolbarItemType) {
        ctx.emit('toolbarClick', data)
      }
    }
  }
})
</script>
<style lang="scss" scoped>
.totonoo-markdown-editor-toolbar {
  width: 32px;
  height: 100%;
  background-color: var(--color-bg);
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  box-shadow: var(--color-shadow);
  ul, li {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .center {
    flex: 1;
  }
  .list {
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
    margin: 0 auto;
    padding: 0;
    &:hover, &:focus {
      color: var(--color-text);
      background-color: var(--input-text-hover-bg);
    }
  }
}
</style>
