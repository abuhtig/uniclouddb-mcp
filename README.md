# UniCloudDB-MCP

[![NPM version](https://img.shields.io/npm/v/uniclouddb-mcp.svg)](https://www.npmjs.com/package/uniclouddb-mcp)
[![Node.js Version](https://img.shields.io/node/v/uniclouddb-mcp.svg)](https://nodejs.org)
[![License](https://img.shields.io/npm/l/uniclouddb-mcp.svg)](https://github.com/abuhtig/uniclouddb-mcp/LICENSE)

基于 MCP 协议的 uniCloud 数据库操作工具，支持通过 AI 助手进行数据库 CRUD 操作。

## 功能特点

- 支持标准化的 MCP 协议工具集成
- 提供完整的 JQL 格式数据库操作接口
- 支持查询、添加、更新和删除等常用操作
- 简单易用的 API 设计
- 适配主流的 AI 模型工具调用
- 支持本地运行，修改源码

### 直接配置MCP使用

```json
{
 "uniclouddb-mcp": {
    "command": "npx",
    "args": ["-y", "uniclouddb-mcp"],
    "env": {
      "DB_SERVICE_URL": "https://你的uniCloud云函数URL.next.bspapp.com/mcp"
    }
  }
}
```


### 本地运行使用方法

## 安装

```bash
npm install uniclouddb-mcp
```
## 环境变量配置

你可以通过环境变量配置数据库服务参数：

```bash
# .env 文件
DB_SERVICE_URL=https://你的uniCloud云函数URL/mcp
REQUEST_TIMEOUT=30000
```

# 复制 mcp_service 文件夹到 自己项目的uniCloud/cloudfunctions 目录下并上传云函数

# 打开uniCloud web 控制台，找到mcp_service云函数，设置云函数URL化


设置通过HTTP或HTTPS访问本云函数的URL。域名在云函数列表界面绑定，此处仅设置path。 参考文档:   https://uniapp.dcloud.io/uniCloud/http


# 设置mcp service

```json
{
 "uniclouddb": {
      "name": "uniclouddb",
      "key": "uniclouddb",
      "command": "node",
      "args":[
        "D:\\uniCloudDB-mcp\\index.js"
      ],
      "disabled": false,
      "env": {}
  }
}
```

## MCP 工具说明

本库提供以下 MCP 工具，可供 AI 助手直接调用：

### 1. query - 查询数据

**参数：**
- `collection`: 集合名称
- `where`: 查询条件（JQL 格式）
- `field`（可选）: 返回字段
- `limit`（可选）: 返回数量限制
- `skip`（可选）: 跳过记录数
- `orderBy`（可选）: 排序条件

### 2. add - 添加数据

**参数：**
- `collection`: 集合名称
- `data`: 要添加的数据（object/array）

### 3. update - 更新数据

**参数：**
- `collection`: 集合名称
- `where`: 更新条件（JQL 格式）
- `data`: 要更新的数据（object）

### 4. remove - 删除数据

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

