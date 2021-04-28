<template>
  <ul class="toolbar-ul">
    <template v-for="(item, index) in toolbar">
      <li v-if="item == '-'" :key="'line'+ index" class="line"></li>
      <li v-else-if="item == '->'" :key="'fill'+ index" class="fill"></li>
      <li v-else :key="index">
        <button :title="item.title" @click="fire(item.name)">
          <i :class="item.icon"></i>
        </button>
      </li>
    </template>
  </ul>
</template>
<script>
import { defineComponent } from 'vue'
import toolbar from './Toolbar'
export default defineComponent({
  props: {
    toolbar: {
      type: Array,
      default: () => toolbar
    }
  },
  emits: ['toolbarEvents'],
  setup (props, ctx) {
    const fire = (type) => {
      ctx.emit('toolbarEvents', type)
    }
    return {
      fire
    }
  }
})
</script>
