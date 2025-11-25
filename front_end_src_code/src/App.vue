<template>
  <div id="app">
    <!-- 渲染路由视图 -->
    <router-view />
  </div>
</template>

<script>
import { onMounted } from 'vue'
import router from './router'

export default {
  name: 'App',
  setup () {
    onMounted(() => {
      // 启动后直接跳转到登录页（如果当前不是登录页）
      try {
        const current = router.currentRoute && router.currentRoute.value && router.currentRoute.value.path
        if (current !== '/login') {
          router.replace('/login')
        }
      } catch (e) {
        console.warn('Redirect to login failed', e)
      }
    })

    return {}
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
