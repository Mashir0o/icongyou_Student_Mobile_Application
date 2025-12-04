import request from "../utils/request.js";

export const LoadTaskList = () =>{
  return request.get("/task/loadTaskList")
}

export const loadDataView = () =>{
   return request.get("/task/loadDataView")
}

export const loadHeatData = () =>{
  return request.get("/task/loadHeatData")
}

export const newTask = (data) =>{
  return request.post("/task/newTask",data)
}

export const loadDetailTask = (taskId) =>{
  return request.get("/task/loadDetailTask",
    {params: {id: taskId}}
  )
}

export const loadTeamMembers = (taskId) =>{
  return request.get("/task/loadTeamMembers",
    {params: {id: taskId}}
  )
}

export const loadTeamProcess = (taskId) =>{
  return request.get("/task/loadTeamProcess",
    {params: {id: taskId}}
  )
}
