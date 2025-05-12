#!/usr/bin/env node
/**
 * uniclouddb-mcp
 *
 * 基于MCP协议的uniCloud数据库操作服务
 * 提供与AI助手集成的数据库CRUD能力
 *
 * @author June
 * @license MIT
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

// 导入数据库操作模块
import { getToolDefinitions, getHelpPrompt } from './database.js';

// 获取环境变量中的URL链接
const dbServiceUrl = process.env.DB_SERVICE_URL || '';
console.log('数据库服务URL:', dbServiceUrl);

/**
 * 创建MCP服务器实例
 * 该服务器提供标准化工具与uniCloud数据库交互
 */
const server = new McpServer({
  name: 'UniCloudDB-MCP',
  version: '1.0.3',
  description:
    '基于JQL的uniCloud数据库操作工具，支持查询、添加、更新和删除操作',
});

// 获取工具定义
const tools = getToolDefinitions(z, { dbServiceUrl });

// 注册所有工具，支持完整的CRUD操作
server.tool(
  tools.queryTool.name,
  tools.queryTool.params,
  tools.queryTool.handler
);

server.tool(tools.addTool.name, tools.addTool.params, tools.addTool.handler);

server.tool(
  tools.updateTool.name,
  tools.updateTool.params,
  tools.updateTool.handler
);

server.tool(
  tools.removeTool.name,
  tools.removeTool.params,
  tools.removeTool.handler
);

// 创建帮助提示，供AI模型了解工具使用方法
server.prompt('help', {}, () => getHelpPrompt());

/**
 * 启动MCP服务器
 */
async function main() {
  try {
    // 创建标准输入输出传输通道
    const transport = new StdioServerTransport();

    console.log('正在启动UniCloudDB-MCP服务...');
    await server.connect(transport);
    console.log('UniCloudDB-MCP服务已启动并准备接收请求');

    // 设置进程错误处理
    process.on('uncaughtException', (err) => {
      console.error('未捕获的异常:', err);
    });

    process.on('unhandledRejection', (reason) => {
      console.error('未处理的Promise拒绝:', reason);
    });
  } catch (error) {
    console.error('服务启动错误:', error);
    process.exit(1);
  }
}

main();
