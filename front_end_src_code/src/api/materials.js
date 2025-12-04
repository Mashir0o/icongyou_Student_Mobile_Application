import { getMockMaterialsByCourse } from '@/mocks/materials'

export function fetchCourseMaterials (courseId) {
  const list = getMockMaterialsByCourse(courseId)
  return Promise.resolve(list)
}

export default { fetchCourseMaterials }
