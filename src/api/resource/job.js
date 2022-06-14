import axios from 'axios';

import { jsonParse } from '@/utils/helpers';

const apiResources = jsonParse(window.localStorage.getItem('api-resources')) || {};
let apiVersion = apiResources['job'] || 'batch/v1';
apiVersion = apiVersion === 'v1' ? 'core/v1' : apiVersion;

// 任务列表
export const getJobList = (clusterName, namespace, query = {}) =>
  axios(`proxy/cluster/${clusterName}/custom/${apiVersion}/namespaces/${namespace}/jobs`, {
    params: query,
  });
// 任务详情
export const getJobDetail = (clusterName, namespace, name, query = {}) =>
  axios(`proxy/cluster/${clusterName}/${apiVersion}/namespaces/${namespace}/jobs/${name}`, {
    params: query,
  });
// 添加任务
export const postAddJob = (clusterName, namespace, name, body = {}) =>
  axios.post(`proxy/cluster/${clusterName}/${apiVersion}/namespaces/${namespace}/jobs/${name}`, body);
// 更新任务
export const patchUpdateJob = (clusterName, namespace, name, body) =>
  axios.patch(`proxy/cluster/${clusterName}/${apiVersion}/namespaces/${namespace}/jobs/${name}`, body);
// 删除任务
export const deleteJob = (clusterName, namespace, name) =>
  axios.delete(`proxy/cluster/${clusterName}/${apiVersion}/namespaces/${namespace}/jobs/${name}`);
