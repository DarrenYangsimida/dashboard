import Vue, { computed } from 'vue';
import Router, { RawLocation, Route } from 'vue-router';

import { adminObserve } from './admin_observe';
import { adminWorkspace } from './admin_workspace';
import { appStore } from './app_store';
import { dashboard } from './dashboard';
import { entryMicroService } from './entry_microservice';
import { global } from './global';
import { microService } from './microservice';
import { modelStore } from './model_store';
import { observe } from './observe';
import { platform } from './platform';
import { projectWorkspace } from './project_workspace';
import { tool } from './tool';
import { userCenter } from './user_center';
import { workspace } from './workspace';
import { PLATFORM } from '@/constants/platform';
import store from '@/store';

type routerHandler = (_: RawLocation) => Promise<Route>;

const originalPush: routerHandler = Router.prototype.push;
Router.prototype.push = (location: RawLocation): Promise<Route> => {
  return originalPush.call(router, location).catch((err) => err);
};

const originalReplace: routerHandler = Router.prototype.replace;
Router.prototype.replace = (location: RawLocation): Promise<Route> => {
  return originalReplace.call(router, location).catch((err) => err);
};

Vue.use(Router);

const router: Router = new Router({
  mode: 'history',
  routes: global
    .concat(platform) // 平台管理
    .concat(adminWorkspace) // 管理员工作台
    .concat(projectWorkspace) // 项目工作台
    .concat(workspace) // 租户工作台
    .concat(dashboard) // 首页
    .concat(adminObserve) // 管理员可观测性
    .concat(observe) // 租户可观测性
    .concat(entryMicroService) // 微服务入口
    .concat(microService) // 微服务工作台
    .concat(tool) // 租户工具箱
    .concat(appStore) // 应用商店
    .concat(userCenter) // 用户中心
    .concat(modelStore), //模型商店
});

router.beforeResolve((to, from, next): void => {
  if (window) {
    window.document.title = `${Vue.prototype.$_i18n.t(to.meta.title)} - ${PLATFORM}`;
  }
  next();
});

router.beforeEach(async (to, from, next): Promise<void> => {
  if (to.name === null) {
    next({ name: '404' });
    return;
  }
  if (to.meta.requireAuth && !store.state.JWT) {
    store.commit('SET_SNACKBAR', {
      text: Vue.prototype.$_i18n.t('tip.need_login'),
      color: 'warning',
    });
    next({ name: 'login', query: { redirect: to.fullPath } });
    return;
  } else {
    store.state.ReconnectCount = 0;
    store.dispatch('INIT_MESSAGE_STREAM');
    // 虚拟空间
    if (to.params.virtualspace && store.state.VirtualSpaceStore.length === 0) {
      await store.dispatch('UPDATE_VIRTUALSPACE_DATA');
    }
    // 集群
    if (to.params.cluster) {
      if (store.state.Admin) {
        store.commit('SET_ADMIN_VIEWPORT', true);
        if (store.state.ClusterStore.length === 0) {
          await store.dispatch('UPDATE_CLUSTER_DATA');
        }
        if (to.params.cluster !== store.state.LatestCluster.cluster) {
          await store.dispatch('LOAD_RESTMAPPING_RESOURCES', { clusterName: to.params.cluster });
        }
        store.commit('SET_LATEST_CLUSTER', { cluster: to.params.cluster });
        await store.dispatch('INIT_PLUGINS', to.params.cluster);
      }
    }
    let currentTenant: { [key: string]: string | number } = null;
    if (to.params.tenant) {
      if (store.state.TenantStore.length === 0 || store.state.LatestTenant.tenant !== to.params.tenant) {
        await store.dispatch('UPDATE_TENANT_DATA');
      }
      const tenant: { [key: string]: string | number } =
        store.state.TenantStore &&
        store.state.TenantStore.find((t) => {
          return t.TenantName === to.params.tenant;
        });
      if (!tenant) {
        next({ name: '403' });
        return;
      }
      store.commit('SET_LATEST_TENANT', { tenant: tenant.TenantName });
      currentTenant = tenant;
    }
    let currentProject: { [key: string]: string | number } = null;
    if (to.params.project) {
      if (store.state.ProjectStore.length === 0 || store.state.LatestProject.project !== to.params.project) {
        await store.dispatch('UPDATE_PROJECT_DATA', currentTenant.ID);
      }
      const project: { [key: string]: string | number } =
        store.state.ProjectStore &&
        store.state.ProjectStore.find((p) => {
          return p.ProjectName === to.params.project;
        });
      if (!project) {
        next({ name: '403' });
        return;
      }
      store.commit('SET_LATEST_PROJECT', { project: project.ProjectName });
      currentProject = project;
    }
    if (to.params.environment) {
      if (
        store.state.EnvironmentStore.length === 0 ||
        store.state.LatestEnvironment.environment !== to.params.environment
      ) {
        await store.dispatch('UPDATE_ENVIRONMENT_DATA', currentProject.ID);
      }
      const environment: { [key: string]: string | number } =
        store.state.EnvironmentStore &&
        store.state.EnvironmentStore.find((e) => {
          return e.EnvironmentName === to.params.environment;
        });
      if (!environment) {
        next({ name: '403' });
        return;
      }
      if (environment.ClusterName !== store.state.LatestEnvironment.cluster) {
        await store.dispatch('LOAD_RESTMAPPING_RESOURCES', { clusterName: environment?.ClusterName });
      }
      store.commit('SET_LATEST_ENVIRONMENT', {
        environment: environment.EnvironmentName,
        cluster: environment.ClusterName,
      });
      await store.dispatch('INIT_PLUGINS', environment?.ClusterName);
    }
    store.dispatch('INIT_GLOBAL_PLUGINS');
    if (store.state.AdminViewport && to.meta.upToAdmin) {
      next({
        name: `admin-${to.name}`,
        params: {
          ...to.params,
          cluster: store.getters.Cluster.ClusterName || from.params.cluster,
        },
        query: { ...to.query },
      });
    } else {
      next();
    }
  }
});

const routeData = Vue.observable({ params: {}, query: {}, path: '', name: '' });
router.afterEach((route) => {
  routeData.params = route.params;
  routeData.query = route.query;
  routeData.path = route.path;
  routeData.name = route.name;
});
export function useParams() {
  return computed<{ [key: string]: string }>(() => routeData.params);
}
export function useQuery() {
  return computed<{ [key: string]: string }>(() => routeData.query);
}
export function usePath() {
  return computed<string>(() => routeData.path);
}
export function useName() {
  return computed<string>(() => routeData.name);
}

export const useRouter = () => router;
export default router;
