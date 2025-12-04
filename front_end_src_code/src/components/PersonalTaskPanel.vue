<!-- components/PersonalTaskPanel.vue -->
<template>
  <div class="personal-task-panel">
    <!-- 个人任务头部 -->
    <div class="panel-header">
      <div class="header-left">
        <h2>个人任务</h2>
        <p class="sub-title">任务ID: {{ taskId }}</p>
      </div>
      <div class="header-right">
        <el-button type="primary" @click="handleCreateTask">
          <el-icon><Plus /></el-icon>创建任务
        </el-button>
      </div>
    </div>

    <!-- 任务状态统计 -->
    <div class="task-stats">
      <el-row :gutter="20">
       
        <el-col :span="6">
          <div class="stat-card" @click="filterTasks('pending')">
            <div class="stat-title">待完成</div>
            <div class="stat-value">{{ stats.pending }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card" @click="filterTasks('progress')">
            <div class="stat-title">进行中</div>
            <div class="stat-value">{{ stats.progress }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card" @click="filterTasks('completed')">
            <div class="stat-title">已完成</div>
            <div class="stat-value">{{ stats.completed }}</div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 任务筛选 -->
    <div class="task-filter">
      <el-input
        v-model="searchText"
        placeholder="搜索任务..."
        clearable
        style="width: 300px"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      
      <div class="filter-right">
        <el-select v-model="filterStatus" placeholder="状态筛选" clearable>
          <el-option label="全部" value="" />
          <el-option label="待完成" value="pending" />
          <el-option label="进行中" value="progress" />
          <el-option label="已完成" value="completed" />
        </el-select>
        
        <el-select v-model="filterPriority" placeholder="优先级筛选" clearable>
          <el-option label="全部" value="" />
          <el-option label="高优先级" value="high" />
          <el-option label="中优先级" value="medium" />
          <el-option label="低优先级" value="low" />
        </el-select>
      </div>
    </div>

    <!-- 任务列表 -->
    <div class="task-list">
      <div v-if="loading" class="loading">
        <el-skeleton :rows="5" animated />
      </div>
      
      <div v-else-if="filteredTasks.length === 0" class="empty">
        <el-empty description="暂无任务" />
      </div>
      
      <div v-else class="task-items">
        <div
          v-for="task in filteredTasks"
          :key="task.id"
          class="task-item"
          :class="{
            'task-high': task.priority === 'high',
            'task-medium': task.priority === 'medium',
            'task-low': task.priority === 'low',
            'task-completed': task.status === 'completed'
          }"
        >
          <div class="task-item-header">
            <div class="task-left">
              <el-checkbox
                v-model="task.completed"
                @change="toggleTaskStatus(task)"
              />
              <div class="task-title">
                <h4>{{ task.title }}</h4>
                <div class="task-tags">
                  <el-tag
                    size="small"
                    :type="getStatusTagType(task.status)"
                  >
                    {{ getStatusText(task.status) }}
                  </el-tag>
                  <el-tag
                    v-if="task.priority === 'high'"
                    type="danger"
                    size="small"
                  >
                    高优先级
                  </el-tag>
                  <el-tag
                    v-if="task.priority === 'medium'"
                    type="warning"
                    size="small"
                  >
                    中优先级
                  </el-tag>
                  <el-tag
                    v-if="task.estimatedTime"
                    type="info"
                    size="small"
                  >
                    预估 {{ task.estimatedTime }}h
                  </el-tag>
                </div>
              </div>
            </div>
            
            <div class="task-right">
              <el-button
                type="primary"
                text
                @click="editTask(task)"
              >
                编辑
              </el-button>
              <el-button
                type="danger"
                text
                @click="deleteTask(task)"
              >
                删除
              </el-button>
            </div>
          </div>
          
          <div class="task-item-content">
            <p class="task-description">{{ task.description }}</p>
            
            <div class="task-meta">
              <div class="meta-item">
                <el-icon><Calendar /></el-icon>
                <span>截止：{{ formatDate(task.deadline) }}</span>
              </div>
              <div class="meta-item">
                <el-icon><User /></el-icon>
                <span>负责人：{{ task.assignee || '未分配' }}</span>
              </div>
              <div class="meta-item">
                <el-icon><Timer /></el-icon>
                <span>用时：{{ task.timeSpent || 0 }}h</span>
              </div>
              <div class="meta-item">
                <el-icon><Star /></el-icon>
                <span>难度：{{ task.difficulty }}/5</span>
              </div>
            </div>
            
            <div class="task-progress">
              <el-progress
                :percentage="calculateProgress(task)"
                :show-text="false"
                :color="getProgressColor(task)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 创建/编辑任务对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEditing ? '编辑任务' : '创建任务'"
      width="500px"
    >
      <el-form
        ref="taskFormRef"
        :model="taskForm"
        :rules="formRules"
        label-width="80px"
      >
        <el-form-item label="任务标题" prop="title">
          <el-input
            v-model="taskForm.title"
            placeholder="请输入任务标题"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="任务描述" prop="description">
          <el-input
            v-model="taskForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入任务描述"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="截止时间" prop="deadline">
          <el-date-picker
            v-model="taskForm.deadline"
            type="date"
            placeholder="选择截止日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        
        <el-form-item label="优先级" prop="priority">
          <el-radio-group v-model="taskForm.priority">
            <el-radio label="high">高</el-radio>
            <el-radio label="medium">中</el-radio>
            <el-radio label="low">低</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="预估时间" prop="estimatedTime">
          <el-input-number
            v-model="taskForm.estimatedTime"
            :min="1"
            :max="100"
            controls-position="right"
          >
            <template #append>小时</template>
          </el-input-number>
        </el-form-item>
        
        <el-form-item label="难度等级" prop="difficulty">
          <el-rate
            v-model="taskForm.difficulty"
            :max="5"
            show-score
            score-template="{value} 星"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitTask">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { defineProps } from 'vue'
import { 
  Plus, Search, Calendar, User, Timer, Star,
  Check, Close, Clock, View, Edit, Delete
} from '@element-plus/icons-vue'

const props = defineProps({
  taskId: {
    type: String,
    required: true
  }
})

// 响应式数据
const loading = ref(false)
const searchText = ref('')
const filterStatus = ref('')
const filterPriority = ref('')
const dialogVisible = ref(false)
const isEditing = ref(false)

// 统计信息
const stats = ref({
  total: 8,
  pending: 3,
  progress: 4,
  completed: 1
})

// 任务列表数据
const tasks = ref([
  {
    id: 1,
    title: '完成个人任务界面开发',
    description: '开发个人任务管理界面，包括增删改查功能',
    status: 'progress',
    priority: 'high',
    deadline: '2024-01-20',
    assignee: '张三',
    estimatedTime: 8,
    timeSpent: 4,
    difficulty: 4,
    completed: false,
    progress: 50
  },
  {
    id: 2,
    title: '编写API接口文档',
    description: '为个人任务模块编写详细的API接口文档',
    status: 'pending',
    priority: 'medium',
    deadline: '2024-01-25',
    assignee: '李四',
    estimatedTime: 5,
    timeSpent: 0,
    difficulty: 3,
    completed: false,
    progress: 0
  },
  {
    id: 3,
    title: '测试个人任务功能',
    description: '对个人任务模块进行功能测试',
    status: 'completed',
    priority: 'low',
    deadline: '2024-01-18',
    assignee: '王五',
    estimatedTime: 3,
    timeSpent: 3,
    difficulty: 2,
    completed: true,
    progress: 100
  },
  {
    id: 4,
    title: '优化任务筛选功能',
    description: '根据用户反馈优化任务筛选和搜索功能',
    status: 'progress',
    priority: 'medium',
    deadline: '2024-01-22',
    assignee: '赵六',
    estimatedTime: 6,
    timeSpent: 2,
    difficulty: 3,
    completed: false,
    progress: 33
  },
  {
    id: 5,
    title: '设计任务统计报表',
    description: '设计个人任务完成情况的统计报表',
    status: 'pending',
    priority: 'high',
    deadline: '2024-01-30',
    assignee: '钱七',
    estimatedTime: 10,
    timeSpent: 0,
    difficulty: 4,
    completed: false,
    progress: 0
  }
])

// 表单数据
const taskForm = ref({
  id: '',
  title: '',
  description: '',
  deadline: '',
  priority: 'medium',
  estimatedTime: 2,
  difficulty: 3
})

// 表单验证规则
const formRules = {
  title: [
    { required: true, message: '请输入任务标题', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入任务描述', trigger: 'blur' }
  ],
  deadline: [
    { required: true, message: '请选择截止日期', trigger: 'change' }
  ]
}

// 计算属性：过滤任务
const filteredTasks = computed(() => {
  return tasks.value.filter(task => {
    // 搜索文本过滤
    if (searchText.value && 
        !task.title.toLowerCase().includes(searchText.value.toLowerCase()) &&
        !task.description.toLowerCase().includes(searchText.value.toLowerCase())) {
      return false
    }
    
    // 状态过滤
    if (filterStatus.value && task.status !== filterStatus.value) {
      return false
    }
    
    // 优先级过滤
    if (filterPriority.value && task.priority !== filterPriority.value) {
      return false
    }
    
    return true
  })
})

// 方法
const getStatusTagType = (status) => {
  const map = {
    pending: 'info',
    progress: 'warning',
    completed: 'success'
  }
  return map[status] || 'info'
}

const getStatusText = (status) => {
  const map = {
    pending: '待完成',
    progress: '进行中',
    completed: '已完成'
  }
  return map[status] || '未知'
}

const formatDate = (dateStr) => {
  if (!dateStr) return '未设置'
  return dateStr
}

const calculateProgress = (task) => {
  if (task.status === 'completed') return 100
  if (task.estimatedTime && task.timeSpent) {
    return Math.min(Math.round((task.timeSpent / task.estimatedTime) * 100), 100)
  }
  return task.progress || 0
}

const getProgressColor = (task) => {
  const progress = calculateProgress(task)
  if (progress < 30) return '#e6a23c'
  if (progress < 70) return '#409eff'
  return '#67c23a'
}

// 事件处理
const filterTasks = (status) => {
  filterStatus.value = status
}

const handleCreateTask = () => {
  isEditing.value = false
  taskForm.value = {
    id: '',
    title: '',
    description: '',
    deadline: '',
    priority: 'medium',
    estimatedTime: 2,
    difficulty: 3
  }
  dialogVisible.value = true
}

const editTask = (task) => {
  isEditing.value = true
  taskForm.value = {
    ...task,
    deadline: task.deadline || ''
  }
  dialogVisible.value = true
}

const deleteTask = (task) => {
  // 在实际项目中这里应该调用删除API
  const index = tasks.value.findIndex(t => t.id === task.id)
  if (index !== -1) {
    tasks.value.splice(index, 1)
    updateStats()
  }
}

const toggleTaskStatus = (task) => {
  // 在实际项目中这里应该调用更新API
  task.status = task.completed ? 'completed' : 'progress'
  updateStats()
}

const submitTask = () => {
  // 表单验证
  // 在实际项目中这里应该调用API
  
  if (isEditing.value) {
    // 更新任务
    const index = tasks.value.findIndex(t => t.id === taskForm.value.id)
    if (index !== -1) {
      tasks.value[index] = {
        ...tasks.value[index],
        ...taskForm.value
      }
    }
  } else {
    // 添加新任务
    const newTask = {
      ...taskForm.value,
      id: Date.now().toString(),
      status: 'pending',
      assignee: '当前用户',
      timeSpent: 0,
      completed: false,
      progress: 0
    }
    tasks.value.unshift(newTask)
  }
  
  dialogVisible.value = false
  updateStats()
}

const updateStats = () => {
  stats.value = {
    total: tasks.value.length,
    pending: tasks.value.filter(t => t.status === 'pending').length,
    progress: tasks.value.filter(t => t.status === 'progress').length,
    completed: tasks.value.filter(t => t.status === 'completed').length
  }
}

// 生命周期
onMounted(() => {
  console.log('PersonalTaskPanel 加载，任务ID:', props.taskId)
  updateStats()
})
</script>

<style scoped>
.personal-task-panel {
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  min-height: 500px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e4e7ed;
}

.header-left h2 {
  margin: 0 0 4px 0;
  color: #303133;
  font-size: 20px;
}

.sub-title {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.task-stats {
  margin-bottom: 24px;
}

.stat-card {
  background: #f5f7fa;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.stat-card:hover {
  background: #e4e7ed;
  transform: translateY(-2px);
}

.stat-title {
  color: #606266;
  font-size: 14px;
  margin-bottom: 8px;
}

.stat-value {
  color: #303133;
  font-size: 24px;
  font-weight: bold;
}

.task-filter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 16px;
}

.filter-right {
  display: flex;
  gap: 12px;
}

.task-list {
  margin-top: 20px;
}

.loading {
  padding: 40px 0;
}

.empty {
  padding: 60px 0;
}

.task-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.task-item {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s ease;
}

.task-item:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.task-high {
  border-left: 4px solid #f56c6c;
}

.task-medium {
  border-left: 4px solid #e6a23c;
}

.task-low {
  border-left: 4px solid #909399;
}

.task-completed {
  opacity: 0.8;
  background: #f8f9fa;
}

.task-completed .task-title h4 {
  text-decoration: line-through;
  color: #909399;
}

.task-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.task-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.task-title {
  flex: 1;
}

.task-title h4 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 16px;
}

.task-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.task-item-content {
  margin-left: 28px;
}

.task-description {
  margin: 0 0 16px 0;
  color: #606266;
  line-height: 1.6;
}

.task-meta {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #909399;
  font-size: 14px;
}

.meta-item .el-icon {
  font-size: 16px;
}

.task-progress {
  height: 6px;
  border-radius: 3px;
  overflow: hidden;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .personal-task-panel {
    padding: 16px;
  }
  
  .panel-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .task-filter {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-right {
    width: 100%;
  }
  
  .task-meta {
    gap: 12px;
  }
  
  .task-left {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .task-item-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .task-right {
    align-self: flex-end;
  }
}
</style>