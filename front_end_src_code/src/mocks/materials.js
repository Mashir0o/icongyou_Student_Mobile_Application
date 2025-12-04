// Mock course material catalog; supports offline development and unit tests.
export const mockCourseMaterials = [
  {
    id: 5001,
    course_id: 1,
    name: '课程导学与教案 (PDF)',
    description: '包含课程整体安排与评分标准',
    file_type: 'pdf',
    size: '1.8MB',
    url: 'https://example.com/materials/course-1/intro.pdf',
    updated_at: '2025-02-28T08:25:00Z'
  },
  {
    id: 5002,
    course_id: 1,
    name: '第 1 章：JavaScript 基础 (Slides)',
    description: '课堂演示稿，可离线阅读',
    file_type: 'pptx',
    size: '3.2MB',
    url: 'https://example.com/materials/course-1/chapter-1.pptx',
    updated_at: '2025-03-02T10:10:00Z'
  },
  {
    id: 5003,
    course_id: 1,
    name: '配套代码示例 (ZIP)',
    description: '课堂示例代码压缩包',
    file_type: 'zip',
    size: '820KB',
    url: 'https://example.com/materials/course-1/code.zip',
    updated_at: '2025-03-05T14:40:00Z'
  },
  {
    id: 6001,
    course_id: 2,
    name: '高数同步练习题',
    description: '结合课堂内容的练习题及答案',
    file_type: 'pdf',
    size: '2.6MB',
    url: 'https://example.com/materials/course-2/exercises.pdf',
    updated_at: '2025-02-22T07:55:00Z'
  },
  {
    id: 6002,
    course_id: 2,
    name: '课堂讲义扫描件',
    description: '黑板推导与课堂示例的扫描版',
    file_type: 'pdf',
    size: '4.1MB',
    url: 'https://example.com/materials/course-2/notes.pdf',
    updated_at: '2025-03-01T09:18:00Z'
  },
  {
    id: 7001,
    course_id: 3,
    name: '小程序项目需求文档',
    description: '项目背景、功能模块与验收指标',
    file_type: 'docx',
    size: '540KB',
    url: 'https://example.com/materials/course-3/project-spec.docx',
    updated_at: '2024-09-12T13:00:00Z'
  },
  {
    id: 7002,
    course_id: 3,
    name: 'UI 设计稿 (Figma 链接)',
    description: 'Figma 在线设计稿，包含组件样式',
    file_type: 'link',
    size: 'N/A',
    url: 'https://www.figma.com/file/mock-course-3-ui',
    updated_at: '2024-09-18T09:45:00Z'
  },
  {
    id: 8001,
    course_id: 4,
    name: '力学核心公式手册',
    description: '常用公式与例题整理',
    file_type: 'pdf',
    size: '1.1MB',
    url: 'https://example.com/materials/course-4/formulas.pdf',
    updated_at: '2025-03-08T11:30:00Z'
  }
]

export function getMockMaterialsByCourse (courseId) {
  if (courseId === undefined || courseId === null) return []
  return mockCourseMaterials.filter(item => String(item.course_id) === String(courseId))
}
