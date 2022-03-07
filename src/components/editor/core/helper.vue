<template>
  <div class="editor-helper" v-if="showBox()">
    <slot name="top"></slot>
    <ul>
      <li v-if="xHelper.theme">
        <button @click="changeTheme('light')" v-if="modelValue == 'dark'"><IconMoon /></button>
        <button @click="changeTheme('dark')" v-else><IconSun /></button>
      </li>
      <li class="hotkey-box" v-if="xHelper.hotkey">
        <button><IconKeyboard /></button>
        <div class="hotkey">
          <table>
            <thead>
              <tr>
                <th>快捷键</th>
                <th>说明</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(val, key) in list" :key="key">
                <td>{{ key.replace(/\-/g, ' + ') }}</td>
                <td>{{ val }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </li>
    </ul>
    <slot name="bottom"></slot>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

import IconMoon from '../theme/icon/moon.svg?component'
import IconSun from '../theme/icon/sun.svg?component'
import IconKeyboard from '../theme/icon/keyboard.svg?component'

const defHelper = {
  theme: true,
  hotkey: true
}

export default defineComponent({
  components: {
    IconMoon,
    IconSun,
    IconKeyboard
  },
  props: {
    modelValue: {
      type: String,
      default: 'light'
    },
    helper: {
      type: Object,
      default: () => {
        return {
          ...defHelper
        }
      }
    }
  },
  setup (props, ctx) {
    const helper = Object.assign({}, defHelper, props.helper)
    const list = {
      'Ctrl-s': '保存',
      'Ctrl-b': '美化、格式化',
      'Ctrl-1': '一级标题',
      'Ctrl-2': '二级标题',
      'Ctrl-3': '三级标题',
      'Ctrl-4': '四级标题',
      'Ctrl-5': '五级标题',
      'Ctrl-6': '六级标题',
      'Ctrl-Alt-t': '插入表格',
      'Ctrl-Alt-m': '插入媒体',
      'Ctrl-Alt-p': '预览',
      'Ctrl-Alt-b': '加粗',
      'Ctrl-Alt-i': '斜体',
      'Ctrl-Alt-l': '删除线',
      'Ctrl-Alt-h': '分割线',
      'Ctrl-Alt-q': '引用',
      'Shift-Alt-o': '有序列表',
      'Shift-Alt-u': '无序列表',
      'Shift-Alt-t': 'TODO列表',
      'Shift-Alt-i': '内联代码',
      'Shift-Alt-b': '块级代码',
      'Shift-Alt-l': '链接',
    }
    return {
      list,
      xHelper: helper,
      showBox () {
        return helper.theme || helper.hotkey
      },
      changeTheme (theme: string) {
        ctx.emit('update:modelValue', theme)
        ctx.emit('themeChange', theme)
      }
    }
  }
})
</script>
<style lang="scss" scoped>
.editor-helper {
  position: absolute;
  right: 0;
  bottom: 0;
  padding: 16px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  ul, li {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  button {
    width: 36px;
    height: 36px;
    border-radius: 100%;
    border: 0;
    margin: 4px 0;
    cursor: pointer;
    color: var(--color-text-1);
    background-color: var(--input-text-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 300ms ease;
    &:hover, &:focus {
      background-color: var(--input-text-hover-bg);
    }
    svg {
      width: 80%;
      height: 80%;
    }
  }
  .hotkey-box {
    position: relative;
    .hotkey {
      width: 700%;
      height: 300px;
      overflow: auto;
      position: absolute;
      right: 0;
      bottom: 100%;
      background-color: var(--color-bg);
      box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.18);
      display: none;
      table {
        width: 100%;
        border-collapse: collapse;
        td, th {
          border: 1px var(--color-border) solid;
          padding: 4px 8px;
          font-size: 12px;
          color: var(--color-text);
        }
        > thead th {
          &:first-child {
            width: 50%;
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
    button {
      &:focus + .hotkey {
        display: block;
      }
    }
  }
}
</style>
