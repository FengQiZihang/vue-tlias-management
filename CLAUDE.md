# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于Vue 3 + Vite构建的tlias智能学习辅助系统前端项目，与后端Spring Boot应用配合使用。项目采用Element Plus UI组件库，提供了完整的用户界面和交互功能。

## 项目结构

```
vue-tlias-management/
├── src/
│   ├── api/          # API接口模块
│   │   ├── login.js  # 登录接口
│   │   ├── dept.js   # 部门管理接口
│   │   ├── emp.js    # 员工管理接口
│   │   ├── clazz.js  # 班级管理接口
│   │   ├── stu.js    # 学员管理接口
│   │   ├── report.js # 数据统计接口
│   │   └── log.js    # 日志接口
│   ├── assets/       # 静态资源
│   ├── components/   # 公共组件
│   ├── router/       # 路由配置
│   │   └── index.js  # 路由定义
│   ├── utils/        # 工具函数
│   │   └── request.js # axios请求封装
│   ├── views/        # 页面组件
│   │   ├── index/    # 首页
│   │   ├── login/    # 登录页
│   │   ├── layout/   # 布局组件
│   │   ├── dept/     # 部门管理
│   │   ├── emp/      # 员工管理
│   │   ├── clazz/    # 班级管理
│   │   ├── stu/      # 学员管理
│   │   ├── report/   # 数据统计
│   │   └── log/      # 日志管理
│   ├── App.vue       # 根组件
│   └── main.js       # 应用入口
├── public/           # 公共静态文件
├── dist/             # 构建输出目录
├── package.json      # 项目配置
├── vite.config.js    # Vite配置
└── README.md         # 项目说明
```

## 技术栈

- **前端框架**: Vue 3.2.38 (Composition API)
- **构建工具**: Vite 3.0.9
- **UI组件库**: Element Plus 2.4.4
- **路由**: Vue Router 4.1.5
- **HTTP客户端**: Axios 1.7.2
- **图表库**: ECharts 5.6.0
- **图标库**: @element-plus/icons-vue 2.3.1
- **代码规范**: ESLint + Prettier

## 常用开发命令

### 开发环境运行
```bash
# 安装依赖
npm install

# 启动开发服务器 (http://localhost:5173)
npm run dev
```

### 构建和部署
```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

### 代码检查
```bash
# 运行ESLint检查并自动修复
npm run lint
```

## 核心配置

### Vite配置 (vite.config.js)
- **代理配置**: `/api` 代理到 `http://localhost:8080` (后端服务)
- **路径别名**: `@` 指向 `src` 目录
- **服务器配置**: 允许通过IP访问，支持局域网开发

### HTTP请求封装 (src/utils/request.js)
- **基础配置**: 基础URL为 `/api`，超时时间60秒
- **请求拦截**: 自动添加JWT token到请求头
- **响应拦截**: 统一处理401认证失败和错误消息提示
- **Token存储**: 使用localStorage存储登录用户信息

## 页面路由结构

- `/` - 首页仪表板
- `/login` - 登录页面
- `/dept` - 部门管理
- `/emp` - 员工管理
- `/clazz` - 班级管理
- `/stu` - 学员管理
- `/report` - 数据统计报表
- `/log` - 操作日志

## API接口设计

所有API接口都通过统一的request模块调用，接口模块化组织在 `src/api/` 目录下：

- **登录认证**: `/api/login`
- **部门管理**: `/api/depts`
- **员工管理**: `/api/emps`
- **班级管理**: `/api/clazzs`
- **学员管理**: `/api/students`
- **数据统计**: `/api/report/*`
- **日志管理**: `/api/log/*`
- **文件上传**: `/api/upload`

## UI组件规范

### Element Plus配置
- **国际化**: 使用中文语言包 (`zhCn`)
- **图标**: 全局注册Element Plus图标组件
- **主题**: 使用默认主题配色

### 布局结构
- **主布局**: 左侧菜单 + 顶部导航 + 内容区域
- **响应式**: 适配不同屏幕尺寸
- **导航**: 基于Vue Router的动态菜单

## 开发规范

### 组件开发
- 使用Vue 3 Composition API
- 组件文件使用PascalCase命名
- 单文件组件结构：`<template>` + `<script setup>` + `<style>`

### API调用
- 统一使用request.js封装的axios实例
- API方法按业务模块组织
- 异步操作使用async/await语法

### 状态管理
- 用户登录状态存储在localStorage
- 组件间通信使用props/emit
- 复杂状态可考虑Pinia（当前项目未使用）

## 代理配置说明

开发环境下，Vite代理配置将 `/api/*` 请求转发到后端服务：
- 前端请求: `http://localhost:5173/api/depts`
- 实际转发到: `http://localhost:8080/depts`

## 构建部署

1. **开发环境**: `npm run dev` 启动开发服务器
2. **生产构建**: `npm run build` 生成dist目录
3. **部署**: 将dist目录内容部署到Web服务器

## 注意事项

1. 确保后端服务在 `http://localhost:8080` 运行
2. 首次运行需要执行 `npm install` 安装依赖
3. 登录后的token会自动存储，过期后需要重新登录
4. 开发时遵循ESLint规范，保持代码风格一致
5. 图片等静态资源放在 `src/assets/` 目录下