<template>
  <iframe @load="loaded"></iframe>
</template>
<script>
import { defineComponent } from 'vue'
import markdownCss from './Markdown.css'
export default defineComponent({
  setup () {
    return {
      loaded (event) {
        const iframe = event.target
        const doc = iframe.contentDocument || iframe.contentWindow.document
        const styleNode = document.createElement('style')
        styleNode.appendChild(document.createTextNode(markdownCss))  
        doc.head.appendChild(styleNode)
        doc.body.classList.add('markdown-body')
      }
    }
  }
})
</script>
