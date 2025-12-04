<template>
  <div class="course-materials">
    <div class="materials-header">
      <h3>资料</h3>
      <div class="meta">共 {{ materials.length }} 条</div>
    </div>

    <div v-if="loading" class="loading">加载中…</div>

    <div v-else>
      <div v-if="materials.length === 0" class="empty-list">暂无资料</div>
      <ul class="materials-list">
        <li v-for="m in materials" :key="m.id" class="material-item" @click="openMaterial(m)">
          <div class="icon">📄</div>
          <div class="info">
            <div class="name">{{ m.name }}</div>
            <div class="sub">ID: {{ m.id }} · course_id: {{ m.course_id }}</div>
          </div>
          <div class="action">打开</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { fetchCourseMaterials } from '@/api/materials'

export default {
  name: 'CourseMaterials',
  props: {
    courseId: { type: [String, Number], required: false }
  },
  setup (props) {
    const route = useRoute()
    const courseId = props.courseId || route.params.id
    const materials = ref([])
    const loading = ref(false)

    const load = async () => {
      if (!courseId) return
      loading.value = true
      try {
        const list = await fetchCourseMaterials(courseId)
        materials.value = Array.isArray(list) ? list : []
      } catch (e) {
        console.warn('fetchCourseMaterials failed', e)
      } finally {
        loading.value = false
      }
    }

    const openMaterial = (m) => {
      if (!m || !m.url) return
      window.open(m.url, '_blank')
    }

    onMounted(() => { load() })
    return { materials, loading, openMaterial }
  }
}
</script>

<style scoped>
.course-materials { padding:12px }
.materials-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px }
.materials-header h3 { margin:0 }
.materials-list { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:8px }
.material-item { display:flex; align-items:center; gap:12px; padding:12px; border-radius:8px; background:#fff; box-shadow:0 2px 8px rgba(0,0,0,0.03); cursor:pointer }
.material-item .icon { font-size:22px }
.material-item .info { flex:1 }
.material-item .name { font-weight:600 }
.material-item .sub { font-size:12px; color:#6b7280 }
.material-item .action { color:#1677ff; font-weight:600 }
.empty-list { color:#9ca3af; padding:18px; text-align:center }
.loading { color:#6b7280; padding:12px }
</style>
