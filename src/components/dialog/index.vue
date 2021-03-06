<template>
  <div class="editor-dialog" :style="style" v-if="modelValue">
    <div class="content" :style="contentStyle" :id="id">
      <div class="title">
        <span>{{ header.title }}</span>
        <button @click="$emit('update:modelValue', !modelValue)" class="btn-close">
          <IconRemove />
        </button>
      </div>
      <div class="main" :style="{ height: height }">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, onUpdated, ref, nextTick, CSSProperties, PropType } from 'vue'
import IconRemove from './icon/remove.svg?component'

interface Props {
  modelValue: boolean;
  header: {
    title: string
  };
  contentMaxWidth: CSSProperties['max-width'];
  fullScreen: boolean;
  fixed: boolean;
  zIndex: CSSProperties['z-index'];
}

export default defineComponent({
  components: {
    IconRemove
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    header: {
      type: Object as PropType<Props['header']>,
      default: () => {
        return { title: '' }
      }
    },
    contentMaxWidth: {
      type: String as PropType<Props['contentMaxWidth']>,
      default: '320px'
    },
    fullScreen: {
      type: Boolean,
      default: false
    },
    fixed: {
      type: Boolean,
      default: false
    },
    zIndex: {
      type: Number as PropType<Props['zIndex']>,
      default: 3
    }
  },
  setup (props, ctx) {
    const id = `editor-dialog-content-${new Date().getTime()}`
    const style = {
      position: 'absolute' as CSSProperties['position'],
      zIndex: props.zIndex
    }
    const contentStyle = {
      width: props.fullScreen ? '100%' : '90%',
      maxWidth: props.fullScreen ? '100%' : props.contentMaxWidth,
      maxHeight: props.fullScreen ? '100%' : '90%'
    }
    if (props.fixed) {
      style.position = 'fixed'
    }

    const keyupHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        ctx.emit('update:modelValue', false)
      }
    }
    const height = ref('auto')
    const getHeight = () => {
      const h = document.querySelector(`#${id}`)?.clientHeight
      if (h) {
        height.value = `${h - 40}px`
      }
    }
    onUpdated(() => {
      getHeight()
    })
    onMounted(() => {
      document.addEventListener('keyup', keyupHandler)
      nextTick(() => {
        getHeight()
      })
    })
    return {
      id,
      style,
      contentStyle,
      height
    }
  }
})
</script>
<style lang="scss" scoped>
.editor-dialog {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 3;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-dialog-bg);
  .content {
    width: 90%;
    max-width: 320px;
    max-height: 90%;
    background-color: var(--color-bg);
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.18);
    .title {
      width: 100%;
      height: 40px;
      border-bottom: 1px var(--color-border) solid;
      display: flex;
      align-items: center;
      padding: 0 16px;
      box-sizing: border-box;
      font-size: 14px;
      color: var(--color-text);
      > span {
        flex: 1;
      }
      .btn-close {
        width: 16px;
        height: 16px;
        padding: 0;
        margin: 0;
        border: 0;
        cursor: pointer;
        background: none;
        transition: all 300ms ease;
        color: #999;
        &:hover {
          color: #444;
        }
        svg {
          width: 50%;
          height: 50%;
        }
      }
    }
    .main {
      overflow: auto;
    }
  }
}
</style>
<style lang="scss">
.editor-dialog-form {
  padding: 16px;
  font-size: 12px;
  .form-item {
    display: flex;
    align-items: center;
    padding: 4px 0;
    &-submit {
      justify-content: right;
      padding-left: 40px;
    }
  }
  label {
    width: 24px;
    white-space: nowrap;
    padding-right: 16px;
    color: var(--color-text);
  }
  input[type=file] {
    display: none;
  }
  input[type=text], input[type=number] {
    width: 100%;
    height: 32px;
    padding: 0 8px;
    transition: all 300ms ease;
    color: var(--input-text-color);
    background-color: var(--input-text-bg);
    border-radius: var(--border-radius);
    border: 0;
    flex: 1;
    box-sizing: border-box;
    outline: none;
    &:hover, &:focus {
      background-color: var(--input-text-hover-bg);
    }
  }
  button {
    height: 24px;
    border: 0;
    cursor: pointer;
    height: 32px;
    padding: 0 16px;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 300ms ease;
    border-radius: var(--border-radius);
    background-color: var(--input-text-bg);
    color: var(--input-text-color);
    &:hover, &:focus {
      background-color: var(--input-text-hover-bg);
    }
    &.upload-btn {
      margin-left: 8px;
    }
    &.submit-btn {
      width: 100%;
      background-color: #23ad5c;
      color: #ffffff;
    }
    svg {
      width: 12px;
      height: 12px;
      margin-right: 4px;
    }
  }
}
</style>
