/**
 * database.js
 *
 * 数据库操作核心模块
 * 提供与uniCloud数据库交互的JQL操作接口
 *
 * JQL (JSON Query Language) 是uniCloud提供的类MongoDB查询语法
 * 详情参考：https://uniapp.dcloud.net.cn/uniCloud/jql.html
 */

import { getDbServiceUrl, getRequestTimeout } from './config.js';

// 获取数据库服务URL和请求超时时间
const DEFAULT_DB_URL = getDbServiceUrl();
const REQUEST_TIMEOUT = getRequestTimeout();

/**
 * 执行数据库查询操作
 *
 * @param {string} collection - 集合名称
 * @param {object} where - 查询条件(JQL格式)
 * @param {object} [options] - 查询选项
 * @param {object} [options.field] - 指定返回字段
 * @param {object} [options.orderBy] - 排序条件
 * @param {number} [options.limit] - 返回数量限制
 * @param {number} [options.skip] - 跳过记录数
 * @returns {Promise<object>} 查询结果
 */
export async function queryDatabase(collection, where, options = {}) {
  try {
    // 创建请求控制器，用于超时处理
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    // 发送请求
    const response = await fetch(DEFAULT_DB_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        operation: {
          collection,
          action: 'query',
          where,
          field: options.field,
          orderBy: options.orderBy,
          limit: options.limit,
          skip: options.skip,
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const result = await response.json();

    // 处理响应结果
    if (result.code !== 0) {
      throw new Error(result.msg || '查询失败');
    }

    return result.data;
  } catch (error) {
    // 超时错误特殊处理
    if (error.name === 'AbortError') {
      throw new Error(`查询超时: 请求超过${REQUEST_TIMEOUT}毫秒`);
    }
    throw new Error(`查询错误: ${error.message}`);
  }
}

/**
 * 执行数据库添加操作
 *
 * @param {string} collection - 集合名称
 * @param {object} data - 要添加的数据(JQL格式)
 * @returns {Promise<object>} 操作结果
 */
export async function addToDatabase(collection, data) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const response = await fetch(DEFAULT_DB_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        operation: {
          collection,
          action: 'insert',
          data,
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const result = await response.json();

    if (result.code !== 0) {
      throw new Error(result.msg || '添加失败');
    }

    return result.data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(`添加超时: 请求超过${REQUEST_TIMEOUT}毫秒`);
    }
    throw new Error(`添加错误: ${error.message}`);
  }
}

/**
 * 执行数据库更新操作
 *
 * @param {string} collection - 集合名称
 * @param {object} where - 查询条件(JQL格式)
 * @param {object} data - 要更新的数据(JQL格式)
 * @returns {Promise<object>} 操作结果
 */
export async function updateDatabase(collection, where, data) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const response = await fetch(DEFAULT_DB_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        operation: {
          collection,
          action: 'update',
          where,
          data,
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const result = await response.json();

    if (result.code !== 0) {
      throw new Error(result.msg || '更新失败');
    }

    return result.data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(`更新超时: 请求超过${REQUEST_TIMEOUT}毫秒`);
    }
    throw new Error(`更新错误: ${error.message}`);
  }
}

/**
 * 执行数据库删除操作
 *
 * @param {string} collection - 集合名称
 * @param {object} where - 查询条件(JQL格式)
 * @returns {Promise<object>} 操作结果
 */
export async function removeFromDatabase(collection, where) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const response = await fetch(DEFAULT_DB_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        operation: {
          collection,
          action: 'delete',
          where,
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const result = await response.json();

    if (result.code !== 0) {
      throw new Error(result.msg || '删除失败');
    }

    return result.data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(`删除超时: 请求超过${REQUEST_TIMEOUT}毫秒`);
    }
    throw new Error(`删除错误: ${error.message}`);
  }
}

/**
 * MCP工具处理函数
 */

/**
 * 处理查询工具请求
 *
 * @param {object} params - 工具参数
 * @returns {object} 工具响应
 */
export async function handleQueryTool(params) {
  const { collection, where, field, orderBy, limit, skip } = params;

  try {
    const options = {
      field: field || undefined,
      orderBy: orderBy || undefined,
      limit: limit || undefined,
      skip: skip || undefined,
    };

    const data = await queryDatabase(collection, where, options);
    return {
      content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
    };
  } catch (error) {
    return {
      content: [{ type: 'text', text: error.message }],
      isError: true,
    };
  }
}

/**
 * 处理添加工具请求
 *
 * @param {object} params - 工具参数
 * @returns {object} 工具响应
 */
export async function handleAddTool(params) {
  const { collection, data } = params;

  try {
    const result = await addToDatabase(collection, data);
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  } catch (error) {
    return {
      content: [{ type: 'text', text: error.message }],
      isError: true,
    };
  }
}

/**
 * 处理更新工具请求
 *
 * @param {object} params - 工具参数
 * @returns {object} 工具响应
 */
export async function handleUpdateTool(params) {
  const { collection, where, data } = params;

  try {
    const result = await updateDatabase(collection, where, data);
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  } catch (error) {
    return {
      content: [{ type: 'text', text: error.message }],
      isError: true,
    };
  }
}

/**
 * 处理删除工具请求
 *
 * @param {object} params - 工具参数
 * @returns {object} 工具响应
 */
export async function handleRemoveTool(params) {
  const { collection, where } = params;

  try {
    const result = await removeFromDatabase(collection, where);
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  } catch (error) {
    return {
      content: [{ type: 'text', text: error.message }],
      isError: true,
    };
  }
}

/**
 * 获取帮助提示内容
 *
 * @returns {object} 提示内容
 */
export function getHelpPrompt() {
  return {
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: `UniCloudDB-MCP 提供以下JQL数据库操作工具:

1. query - 查询数据库记录
   参数: collection(集合名称), where(查询条件), field(可选，返回字段), 
        orderBy(可选，排序条件), limit(可选，返回数量), skip(可选，跳过记录数)
   
2. add - 添加数据库记录
   参数: collection(集合名称), data(要添加的数据)
   
3. update - 更新数据库记录
   参数: collection(集合名称), where(查询条件), data(要更新的数据)
   
4. remove - 删除数据库记录
   参数: collection(集合名称), where(查询条件)

所有工具均使用JQL格式进行数据库操作，支持与MongoDB类似的查询语法。
更多JQL语法详情请参考: https://uniapp.dcloud.net.cn/uniCloud/jql.html`,
        },
      },
    ],
  };
}

/**
 * 获取工具定义及其参数结构
 *
 * @param {object} z - zod验证模块
 * @returns {object} 工具定义对象
 */
export function getToolDefinitions(z) {
  return {
    // 查询工具
    queryTool: {
      name: 'mcp_uniclouddb_query',
      params: {
        collection: z.string().describe('集合名称'),
        where: z.record(z.any()).describe('查询条件 (JQL格式)'),
        field: z.record(z.any()).optional().describe('返回字段 (可选)'),
        orderBy: z
          .object({
            field: z.string(),
            order: z.enum(['asc', 'desc']),
          })
          .optional()
          .describe('排序条件 (可选)'),
        limit: z.number().optional().describe('限制返回数量 (可选)'),
        skip: z.number().optional().describe('跳过记录数 (可选)'),
      },
      handler: handleQueryTool,
    },

    // 添加工具
    addTool: {
      name: 'mcp_uniclouddb_add',
      params: {
        collection: z.string().describe('集合名称'),
        data: z.record(z.any()).describe('要添加的数据 (JQL格式)'),
      },
      handler: handleAddTool,
    },

    // 更新工具
    updateTool: {
      name: 'mcp_uniclouddb_update',
      params: {
        collection: z.string().describe('集合名称'),
        where: z.record(z.any()).describe('查询条件 (JQL格式)'),
        data: z.record(z.any()).describe('要更新的数据 (JQL格式)'),
      },
      handler: handleUpdateTool,
    },

    // 删除工具
    removeTool: {
      name: 'mcp_uniclouddb_remove',
      params: {
        collection: z.string().describe('集合名称'),
        where: z.record(z.any()).describe('查询条件 (JQL格式)'),
      },
      handler: handleRemoveTool,
    },
  };
}
