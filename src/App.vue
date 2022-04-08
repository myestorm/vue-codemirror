<template>
  <div class="app">
    <div class="top-nav">
      <ul>
        <li><router-link to="/">基础使用</router-link></li>
        <li><router-link to="/toolbar">边栏扩展</router-link></li>
        <li><router-link to="/upload">上传</router-link></li>
      </ul>
    </div>
    <div class="main">
      <router-view :key="key"></router-view>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, watch, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export default defineComponent({
  setup () {
    const router = useRouter()
    const route = useRoute()
    const key = ref('/')

    const linkTo = (to: string) => {
      router.push(to)
    }

    watch(() => route.fullPath, (value) => {
      key.value = value
    })
    return {
      key,
      linkTo
    }
  }
})
</script>
<style lang="scss">
html, body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
.app {
  width: 100%;
  height: 100%;
  .top-nav {
    ul, li {
      margin: 0;
      padding: 0;
      list-style: none;
    }
    > ul {
      display: flex;
      > li {
        padding: 8px 16px;
      }
    }
    a {
      color: #666;
      text-decoration: none;
      transition: color 300ms ease;
      &.router-link-active, &:hover {
        color: yellowgreen;
      }
    }
  }
}
</style>
