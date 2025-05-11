'use strict';
/**
 * MCP数据库操作服务
 * 提供统一的数据库操作接口，支持增删改查等基本操作
 *
 * 使用示例：
 * // 查询数据
 * const result = await uniCloud.callFunction({
 *     name: 'mcp_service',
 *     data: {
 *         operation: {
 *             collection: 'users',          // 集合名称
 *             action: 'query',              // 操作类型：query-查询
 *             where: { age: { $gt: 18 } },  // 查询条件
 *             field: { name: 1, age: 1 },   // 返回字段
 *             orderBy: { field: 'age', order: 'desc' }, // 排序
 *             limit: 10,                    // 限制返回数量
 *             skip: 0                       // 跳过记录数
 *         }
 *     }
 * });
 *
 * HTTP访问格式: (POST方法)
 * - URL: https://[your-cloud-function-url]/mcp
 * - Body: {
 *     "operation": {
 *       "collection": "users",
 *       "action": "query",
 *       "where": { "age": { "$gt": 18 } },
 *       "field": { "name": 1, "age": 1 },
 *       "orderBy": { "field": "age", "order": "desc" },
 *       "limit": 10,
 *       "skip": 0
 *     }
 *   }
 */

// 引入 vk-unicloud
const vkCloud = require('vk-unicloud');
var db = uniCloud.database(); // 全局数据库引用
// 通过 vkCloud.createInstance 创建 vk 实例
const vk = vkCloud.createInstance({
  baseDir: __dirname,
  requireFn: require,
});

/**
 * 数据库操作处理函数
 * @param {Object} operation - 操作参数对象
 * @param {string} operation.collection - 集合名称
 * @param {string} operation.action - 操作类型：query-查询, insert-插入, update-更新, delete-删除
 * @param {Object} [operation.data] - 数据对象（插入或更新时使用）
 * @param {Object} [operation.where] - 查询条件（查询、更新、删除时使用）
 * @param {Object} [operation.field] - 返回字段（查询时使用）
 * @param {Object} [operation.orderBy] - 排序条件（查询时使用）
 * @param {number} [operation.limit] - 限制返回数量（查询时使用）
 * @param {number} [operation.skip] - 跳过记录数（查询时使用）
 * @returns {Promise<Object>} 操作结果
 */
async function handleDatabaseOperation(operation) {
  try {
    const { collection, action, data, where, field, orderBy, limit, skip } =
      operation;
    let query = db.collection(collection);

    switch (action) {
      case 'query':
        if (where) query = query.where(where);
        if (field) query = query.field(field);
        if (orderBy) query = query.orderBy(orderBy.field, orderBy.order);
        if (limit) query = query.limit(limit);
        if (skip) query = query.skip(skip);
        return await query.get();

      case 'insert':
        return await query.add(data);

      case 'update':
        if (!where) throw new Error('更新操作必须提供where条件');
        return await query.where(where).update(data);

      case 'delete':
        if (!where) throw new Error('删除操作必须提供where条件');
        return await query.where(where).remove();

      default:
        throw new Error('未知的操作类型');
    }
  } catch (error) {
    throw new Error(`数据库操作失败: ${error.message}`);
  }
}

/**
 * 解析HTTP请求参数
 * @param {Object} event - HTTP请求事件对象
 * @returns {Object} 解析后的操作参数
 */
function parseHttpRequest(event) {
  try {
    // 处理来自HTTP请求的参数
    let body = event.body;

    // 处理可能的base64编码
    if (event.isBase64Encoded) {
      body = Buffer.from(body, 'base64').toString('utf8');
    }

    // 尝试解析JSON格式的请求体
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }

    // 返回操作参数
    return body.operation || {};
  } catch (error) {
    throw new Error(`解析请求参数失败: ${error.message}`);
  }
}

/**
 * 云函数入口函数
 * @param {Object} event - 云函数调用参数或HTTP请求事件
 * @param {Object} context - 云函数上下文
 * @returns {Promise<Object>} 返回操作结果
 */
exports.main = async (event, context) => {
  try {
    // 判断是否是HTTP请求
    const isHttpRequest = event.httpMethod && event.headers;
    let operation;

    if (isHttpRequest) {
      // 解析HTTP请求
      operation = parseHttpRequest(event);
    } else {
      // 直接函数调用
      operation = event.operation;
    }

    if (!operation) {
      throw new Error('缺少必要的操作参数');
    }

    const result = await handleDatabaseOperation(operation);

    // 返回结果
    const response = {
      code: 0,
      data: result,
      msg: '操作成功',
    };

    // 如果是HTTP请求，包装为HTTP响应格式
    if (isHttpRequest) {
      return {
        mpserverlessComposedResponse: true, // 阿里云返回集成响应时需要此字段为true
        isBase64Encoded: false,
        statusCode: 200,
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(response),
      };
    }

    return response;
  } catch (error) {
    console.error('MCP服务错误:', error);

    const errorResponse = {
      code: -1,
      msg: error.message || '服务器内部错误',
    };

    // 如果是HTTP请求，包装为HTTP响应格式
    if (event.httpMethod && event.headers) {
      return {
        mpserverlessComposedResponse: true,
        isBase64Encoded: false,
        statusCode: 400,
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(errorResponse),
      };
    }

    return errorResponse;
  }
};
