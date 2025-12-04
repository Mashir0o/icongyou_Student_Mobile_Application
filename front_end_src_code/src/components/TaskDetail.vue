<template>
  <div class="task-detail">
    <el-container>
      <el-header class="page-header">
        <el-page-header @back="router.back()">
          <template #content>
            <span class="text-large font-600 mr-3"> {{ task.title }} </span>
          </template>
        </el-page-header>
      </el-header>

      <el-main>
        <!-- 任务基本信息 -->
        <el-card class="task-info-card">
          <template #header>
            <div class="card-header">
              <span>任务信息</span>
            </div>
          </template>
          <el-descriptions
            :column="2"
            border
          >
            <el-descriptions-item label="任务描述">
              {{ task.description }}
            </el-descriptions-item>
            <el-descriptions-item label="截止时间">
              <el-text type="danger">{{ task.deadline }}</el-text>
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">
              {{ task.createTime }}
            </el-descriptions-item>
            <el-descriptions-item label="任务状态">
              <el-tag :type="task.status === '进行中' ? 'warning' : 'success'">
                {{ task.status }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="参与人数">
              {{ task.participants }}人
            </el-descriptions-item>
            <el-descriptions-item label="任务难度">
              <el-rate
                v-model="task.difficulty"
                disabled
              />
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- 标签页 -->
        <el-tabs
          v-model="activeTab"
          type="border-card"
          class="detail-tabs"
        >
          <el-tab-pane
            label="团队任务"
            name="team"
          >
            <TeamTaskPanel :task-id="taskId" />
          </el-tab-pane>

          <el-tab-pane
            label="个人任务"
            name="personal"
          >
            <PersonalTaskPanel :task-id="taskId" />
          </el-tab-pane>

          <el-tab-pane
            label="优秀作业"
            name="excellent"
          >
            <ExcellentWorkPanel :task-id="taskId" />
          </el-tab-pane>

          <el-tab-pane
            label="AI问答"
            name="ai"
          >
            <AiChatPanel :task-id="taskId" />
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import TeamTaskPanel from "../components/TeamTaskPanel.vue";
import PersonalTaskPanel from "../components/PersonalTaskPanel.vue";
import ExcellentWorkPanel from "../components/ExcellentWorkPanel.vue";
import AiChatPanel from "../components/AiChatPanel.vue";
import { loadDetailTask } from "../api/task.js";

const route = useRoute();
const router = useRouter();
const taskId = ref(route.params.id);

const activeTab = ref("team");
const task = ref({
  id: taskId.value,
  title: "",
  description: "",
  type: "",
  deadline: "",
  createTime: "",
  status: "",
  participants: 0,
  difficulty: 3,
});

// 加载任务详情
const loadTaskDetail = async (id) => {
  try {
    if (!id) {
      console.error('任务ID为空');
      return;
    }
  
    const response = await loadDetailTask(id);
    
    
    // 确保数据正确合并，不要覆盖整个对象
    if (response) {
      console.log("API返回数据:", response);
      // 只更新必要的字段，保持原有结构
      task.value = response.detailTask;
      console.log("task数据:", task);
    }
  } catch (error) {
    console.error("加载任务详情失败:", error);
    // 可以显示错误信息给用户
  }
};

// 监听路由参数变化
watch(() => route.params.id, (newId) => {
  console.log("路由ID变化:", newId);
  if (newId) {
    taskId.value = newId;
    loadTaskDetail(newId);
  }
}, { immediate: true });

// 初始化加载
onMounted(() => {
  console.log("组件挂载，当前ID:", taskId.value);
  if (taskId.value) {
    loadTaskDetail(taskId.value);
  }
});

/* // 调试：打印响应式变量变化
watch(task, (newValue) => {
  console.log("task数据更新:", newValue);
}, { deep: true }); */



/*
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import TeamTaskPanel from "../components/TeamTaskPanel.vue";
import PersonalTaskPanel from "../components/PersonalTaskPanel.vue";
import ExcellentWorkPanel from "../components/ExcellentWorkPanel.vue";
import AiChatPanel from "../components/AiChatPanel.vue";
import { loadDetailTask } from "../api/index.js";
import mitt from "mitt";

// 使用统一的 mitt 实例
const emitter = mitt();
const route = useRoute();
const router = useRouter();
const taskId = ref(route.params.id); // 改为 ref

const activeTab = ref("team");
const task = ref({
  id: taskId.value,
  title: "Vue3组件开发",
  description:
    "使用Vue3开发一个可复用的业务组件，要求具有良好的类型提示和完整的单元测试。组件应该支持多种配置选项，并且易于扩展。",
  type: "团队",
  deadline: "2023-12-15",
  createTime: "2023-12-01",
  status: "进行中",
  participants: 24,
  difficulty: 4,
});

// 事件处理函数
const handleLoadTask = (id) => {
  taskId.value = id;
  loadDTask();
};

const loadDTask = async () => {
  try {
    if (!taskId.value) {
      console.error('任务ID为空');
      return;
    }
    const response = await loadDetailTask(taskId.value);
    console.log( response);
    task.value = response;
  } catch (error) {
    console.error("加载任务详情失败:", error);
  }
};

onMounted(() => {
  // 注册事件监听
  emitter.on("loadDTask", handleLoadTask);
  // 初始加载数据
  loadDTask();
});

onUnmounted(() => {
  // 取消事件监听
  emitter.off("loadDTask", handleLoadTask);
}); */
</script>

<style scoped>
.task-detail {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.page-header {
  background: white;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
}

.task-info-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
}

.detail-tabs {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.detail-tabs .el-tabs__content) {
  padding: 20px;
  background-color: white;
}
</style>
