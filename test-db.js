/**
 * test-db.js
 *
 * 数据库连接测试工具
 * 用于验证数据库服务是否正常工作
 *
 * 执行命令: npm test
 */

import { queryDatabase } from './database.js';
import { getDbServiceUrl } from './config.js';

// 配置项
const DB_URL = getDbServiceUrl();
const TEST_COLLECTION = 'information'; // 测试集合名称
const TEST_LIMIT = 5; // 测试查询数量

/**
 * 格式化日志输出
 * @param {string} message - 日志消息
 * @param {any} [data] - 可选的数据对象
 */
function log(message, data = null) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
  if (data) {
    console.log(JSON.stringify(data, null, 2));
  }
}

/**
 * 测试数据库查询功能
 * 尝试查询测试集合的前几条数据
 *
 * @returns {Promise<boolean>} 测试结果
 */
async function testDatabaseQuery() {
  log('开始数据库连接测试');
  log(`数据库服务URL: ${DB_URL}`);

  try {
    // 执行查询操作
    log(`测试查询${TEST_COLLECTION}集合...`);
    const queryResult = await queryDatabase(
      TEST_COLLECTION,
      {}, // 空条件查询所有记录
      {
        limit: TEST_LIMIT, // 限制返回条数
        orderBy: { field: '_id', order: 'desc' }, // 按ID倒序
      }
    );

    // 输出结果
    log('查询成功，获取数据:', queryResult);

    if (queryResult && Array.isArray(queryResult.data)) {
      log(`共获取到 ${queryResult.data.length} 条记录`);
    }

    log('测试完成，数据库连接正常');
    return true;
  } catch (error) {
    log(`测试失败: ${error.message}`);
    if (error.message.includes('查询超时')) {
      log('可能原因: 数据库服务未响应或URL配置错误');
    } else if (error.message.includes('查询错误')) {
      log('可能原因: 权限问题或服务端错误');
    }
    return false;
  }
}

// 执行测试并处理结果
(async () => {
  try {
    const success = await testDatabaseQuery();
    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error('测试过程发生未捕获的异常:', error);
    process.exit(1);
  }
})();
