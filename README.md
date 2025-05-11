# UniCloudDB-MCP

[![NPM version](https://img.shields.io/npm/v/uniclouddb-mcp.svg)](https://www.npmjs.com/package/uniclouddb-mcp)
[![Node.js Version](https://img.shields.io/node/v/uniclouddb-mcp.svg)](https://nodejs.org)
[![License](https://img.shields.io/npm/l/uniclouddb-mcp.svg)](https://github.com/username/uniclouddb-mcp/blob/main/LICENSE)

基于 MCP 协议的 uniCloud 数据库操作工具，支持通过 AI 助手进行数据库 CRUD 操作。

## 功能特点

- 支持标准化的 MCP 协议工具集成
- 提供完整的 JQL 格式数据库操作接口
- 支持查询、添加、更新和删除等常用操作
- 简单易用的 API 设计
- 适配主流的 AI 模型工具调用

## 安装

```bash
npm install uniclouddb-mcp
```

## 基本配置

### 环境变量配置

你可以通过环境变量配置数据库服务参数：

```bash
# .env 文件
DB_SERVICE_URL=https://你的uniCloud云函数URL/mcp
REQUEST_TIMEOUT=30000
```

## 使用方法

### 1. 启动 MCP 服务

```bash
# 直接启动服务
npm start

# 开发模式（自动重载）
npm run dev
```

### 2. 作为 JS 模块使用

```javascript
// 导入并启动 MCP 服务
import { main } from 'uniclouddb-mcp';
main();

// 直接使用数据库操作函数
import { 
  queryDatabase, 
  addToDatabase, 
  updateDatabase, 
  removeFromDatabase 
} from 'uniclouddb-mcp/database.js';

// 查询示例
const result = await queryDatabase(
  'collection_name',  // 集合名称
  { status: 'active' },  // 查询条件
  {
    field: { name: 1, age: 1 },  // 返回字段
    limit: 10,  // 返回数量限制
    skip: 0,  // 跳过记录数
    orderBy: { field: 'createdAt', order: 'desc' }  // 排序
  }
);

// 添加示例
await addToDatabase(
  'collection_name',  // 集合名称
  { name: '测试', age: 25 }  // 添加的数据
);

// 更新示例
await updateDatabase(
  'collection_name',  // 集合名称
  { _id: 'document_id' },  // 更新条件
  { age: 26 }  // 更新数据
);

// 删除示例
await removeFromDatabase(
  'collection_name',  // 集合名称
  { _id: 'document_id' }  // 删除条件
);
```

## MCP 工具说明

本库提供以下 MCP 工具，可供 AI 助手直接调用：

### 1. mcp_uniclouddb_query - 查询数据

**参数：**
- `collection`: 集合名称
- `where`: 查询条件（JQL 格式）
- `field`（可选）: 返回字段
- `limit`（可选）: 返回数量限制
- `skip`（可选）: 跳过记录数
- `orderBy`（可选）: 排序条件

### 2. mcp_uniclouddb_add - 添加数据

**参数：**
- `collection`: 集合名称
- `data`: 要添加的数据（JQL 格式）

### 3. mcp_uniclouddb_update - 更新数据

**参数：**
- `collection`: 集合名称
- `where`: 更新条件（JQL 格式）
- `data`: 要更新的数据（JQL 格式）

### 4. mcp_uniclouddb_remove - 删除数据

**参数：**
- `collection`: 集合名称
- `where`: 删除条件（JQL 格式）

## 数据库连接测试

使用内置测试工具验证数据库连接和基本功能：

```bash
npm test
```

## 系统要求

- Node.js >= 18.0.0
- 已部署的 uniCloud 云函数

## uniCloud 云函数集成

本工具需要搭配 uniCloud 云函数使用，请确保已部署对应的处理函数。
云函数接收标准 JQL 格式请求，处理数据库操作并返回结果。

## 安全提示

- 生产环境中建议配置访问控制和身份验证
- 避免在公开环境中暴露数据库 URL
- 定期更新依赖包以修复潜在安全问题

## 许可证

MIT

