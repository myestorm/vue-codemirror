<template>
  <div class="sa-markdown-editor">
    <div class="sa-markdown-editor-toolbar">
      <slot name="toolbar"></slot>
    </div>
    <div class="sa-markdown-editor-main">
      <div class="sa-markdown-editor-textarea">
        <slot name="editor"></slot>
      </div>
      <div v-show="!previewHide" class="sa-markdown-editor-preview">
        <slot name="preview"></slot>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    previewHide: {
      type: Boolean,
      default: true
    }
  }
})
</script>
<style lang="scss">
$--sa-editor-prefix: sa-markdown-editor;
$--sa-editor-height: 600px;
$--sa-border: 1px solid #dddddd;
$--sa-toolbar-height: 60px;
.#{$--sa-editor-prefix} {
  width: 100%;
  height: $--sa-editor-height;
  border: $--sa-border;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .#{$--sa-editor-prefix}-main {
    flex: 1;
    box-sizing: border-box;
    display: flex;
    align-content: space-between;
  }
  .#{$--sa-editor-prefix}-toolbar {
    flex: 0 0 $--sa-toolbar-height;
    border-bottom: $--sa-border;
    box-sizing: border-box;
    overflow: hidden;
    .toolbar-ul {
      height: 100%;
      display: flex;
      align-content: center;
      list-style: none;
      padding: 0 8px;
      margin: 0;
      li {
        list-style: none;
        padding: 0 8px;
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        &.fill {
          flex: 1;
        }
        &.line {
          width: 1px;
          overflow: hidden;
          background-color: rgba(0,0,0, 0.06);
          display: block;
          padding: 0;
          margin: 0 8px;
        }
        button {
          width: 32px;
          height: 32px;
          border: 0;
          cursor: pointer;
          background: none;
          box-shadow: 0 0 2px 0 rgba(0,0,0, 0.16);
          transition: all 320ms ease;
          &:active, &:hover {
            background-color: rgba(0,0,0, 0.05);
          }
          > i {
            font-size: 20px;
          }
        }
      }
    }
  }
  .#{$--sa-editor-prefix}-textarea {
    flex: 1;
    box-sizing: border-box;
    // height: calc(#{$--sa-editor-height} - #{$--sa-toolbar-height} - 2px);
    position: relative;
    .CodeMirror {
      width: 100%;
      height: 100%;
      position: absolute;
      font-size: 16px;
      font-family: -apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei","Helvetica Neue",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
    }
  }
  .#{$--sa-editor-prefix}-preview {
    flex: 0 0 50%;
    height: 100%;
    border-left: $--sa-border;
    box-sizing: border-box;
    position: relative;
    > iframe {
      width: 100%;
      height: 100%;
      overflow: auto;
      position: absolute;
      border: 0;
    }
  }
}
.#{$--sa-editor-prefix}-fullscreen {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  border-width: 0;
}
</style>
