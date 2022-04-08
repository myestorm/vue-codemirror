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
import { defineComponent, ref, PropType } from 'vue'
import IconUpload from '../../theme/markdown/upload.svg?component'

export interface TotonooMarkdownEditorUploadProps {
  uploadUrl: string,
  headers: HeadersInit,
  uploadSuccess: (result: any) => string,
  uploadFail: (error: any) => void
}

export default defineComponent({
  components: {
    IconUpload
  },
  props: {
    uploadUrl: {
      type: String as PropType<TotonooMarkdownEditorUploadProps['uploadUrl']>,
      default: '/file/upload'
    },
    headers: {
      type: Object as PropType<TotonooMarkdownEditorUploadProps['headers']>,
      default: undefined
    },
    uploadSuccess: {
      type: Function as PropType<TotonooMarkdownEditorUploadProps['uploadSuccess']>,
      default: (result: any): string => {
        return result.data.domain + result.data.filepath
      }
    },
    uploadFail: {
      type: Function as PropType<TotonooMarkdownEditorUploadProps['uploadFail']>,
      default: (error: any): void => {
        console.error(8888, error)
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
          const headers = props.headers
          fetch(props.uploadUrl, {
            headers,
            method: 'post',
            body: formData
          })
          .then(response => {
            if (response.ok) {
              return response.json()
            } else {
              throw new Error(`status: ${response.status}, ${response.statusText}`)
            }
          })
          .then(result => {
            url.value = props.uploadSuccess(result)
          })
          .catch(error => {
            props.uploadFail(error)
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
