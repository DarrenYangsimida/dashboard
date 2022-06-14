import axios from 'axios';

import { jsonParse } from '@/utils/helpers';

const apiResources = jsonParse(window.localStorage.getItem('api-resources')) || {};
let apiVersion = apiResources['secret'] || 'core/v1';
apiVersion = apiVersion === 'v1' ? 'core/v1' : apiVersion;

// 密钥列表
export const getSecretList = (clusterName, namespace, query = {}) =>
  axios(`proxy/cluster/${clusterName}/custom/core/v1/namespaces/${namespace}/secrets`, {
    params: query,
  });
// 密钥详情
export const getSecretDetail = (clusterName, namespace, name, query = {}) =>
  axios(`proxy/cluster/${clusterName}/${apiVersion}/namespaces/${namespace}/secrets/${name}`, {
    params: query,
  });
// 添加密钥
export const postAddSecret = (clusterName, namespace, name, body = {}) =>
  axios.post(`proxy/cluster/${clusterName}/${apiVersion}/namespaces/${namespace}/secrets/${name}`, body);
// 更新密钥
export const patchUpdateSecret = (clusterName, namespace, name, body = {}) =>
  axios.patch(`proxy/cluster/${clusterName}/${apiVersion}/namespaces/${namespace}/secrets/${name}`, body);
// 删除密钥
export const deleteSecret = (clusterName, namespace, name) =>
  axios.delete(`proxy/cluster/${clusterName}/${apiVersion}/namespaces/${namespace}/secrets/${name}`);
