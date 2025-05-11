/**
 * config.js
 *
 * 配置管理模块
 * 处理UniCloudDB-MCP服务的配置项
 */
const defaultConfig = {
  // uniCloud数据库服务URL
  DB_SERVICE_URL: 'https://fc-mp-.next.bspapp.com/mcp',

  // 环境设置
  NODE_ENV: process.env.NODE_ENV || 'development',

  // 请求超时时间（毫秒）
  REQUEST_TIMEOUT: 30000,
};

/**
 * 尝试从环境变量中加载配置
 * @returns {Object} 从环境变量中加载的配置
 */
function loadEnvConfig() {
  const envConfig = {};

  // 从环境变量中获取配置
  if (process.env.DB_SERVICE_URL) {
    envConfig.DB_SERVICE_URL = process.env.DB_SERVICE_URL;
  }

  if (process.env.REQUEST_TIMEOUT) {
    envConfig.REQUEST_TIMEOUT = parseInt(process.env.REQUEST_TIMEOUT, 10);
  }

  return envConfig;
}

// 合并默认配置和环境变量配置
const config = { ...defaultConfig, ...loadEnvConfig() };

/**
 * 获取配置项值
 * @param {string} key - 配置项键名
 * @param {any} defaultValue - 配置项不存在时的默认值
 * @returns {any} 配置项值
 */
export function getConfig(key, defaultValue = null) {
  return config[key] !== undefined ? config[key] : defaultValue;
}

/**
 * 获取数据库服务URL
 * @returns {string} 数据库服务URL
 */
export function getDbServiceUrl() {
  return getConfig('DB_SERVICE_URL');
}

/**
 * 获取请求超时时间
 * @returns {number} 请求超时时间（毫秒）
 */
export function getRequestTimeout() {
  const timeout = getConfig('REQUEST_TIMEOUT', 30000);
  return typeof timeout === 'string' ? parseInt(timeout, 10) : timeout;
}

/**
 * 获取当前环境
 * @returns {string} 当前环境（development、production等）
 */
export function getEnvironment() {
  return getConfig('NODE_ENV', 'development');
}

/**
 * 检查是否为开发环境
 * @returns {boolean} 是否为开发环境
 */
export function isDevelopment() {
  return getEnvironment() === 'development';
}

// 导出所有配置函数
export default {
  getConfig,
  getDbServiceUrl,
  getRequestTimeout,
  getEnvironment,
  isDevelopment,
};
