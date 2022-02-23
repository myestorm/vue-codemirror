<template>
  <div class="editor-dialog-form">
    <div class="form-item">
      <label for="toolbar-media-url">地址</label>
      <input type="text" v-model="url" id="toolbar-media-url">
      <div class="upload-btn">
        <input type="file" name="file" ref="fileField" id="toolbar-media-file" @change="upload">
        <button type="button" class="upload-btn" @click="triggerClick">
          <IconUpload />
          本地上传
        </button>
      </div>
    </div>
    <div class="form-item">
      <label for="toolbar-media-desc">描述</label>
      <input type="text" v-model="desc" id="toolbar-media-desc">
    </div>
    <div class="form-item form-item-submit">
      <button type="button" class="submit-btn" @click="handler">确定</button>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import IconUpload from '../theme/icon/upload.svg?component'

export default defineComponent({
  components: {
    IconUpload
  },
  props: {
    uploadUrl: {
      type: String,
      default: '/file/upload'
    },
    uploadSuccess: {
      type: Function,
      default: () => {
        return (result: any): string => {
          return result.data.domain + result.data.filepath
        }
      }
    },
    uploadFail: {
      type: Function,
      default: () => {
        return (error: any): void => {
          console.error(error)
        }
      }
    }
  },
  setup (props, ctx) {
    const url = ref('')
    const desc = ref('')
    const fileId = 'toolbar-media-file'
    return {
      url,
      desc,
      triggerClick () {
        const fileField: HTMLInputElement | null = document.querySelector('input#'+ fileId)
        if (fileField){
          fileField.click()
        }
      },
      upload () {
        const formData = new FormData()
        const fileField: HTMLInputElement | null = document.querySelector('input#'+ fileId)
        if (fileField && fileField.files && fileField.files[0]) {
          formData.append('file', fileField.files[0])
          fetch(props.uploadUrl, {
            method: 'post',
            body: formData
          })
          .then(response => response.json())
          .then(result => {
            url.value = props.uploadSuccess()(result)
          })
          .catch(error => {
            props.uploadFail()(error)
          })
          .then(() => {
            fileField.value = ''
          })
        }
      },
      handler () {
        ctx.emit('done', url.value, desc.value)
      }
    }
  }
})
</script>
