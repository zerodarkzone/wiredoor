/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createRouter,
  createWebHistory,
  type RouteLocationNormalizedGeneric,
  type RouteLocationNormalizedLoadedGeneric,
  type Router,
} from 'vue-router'
import auth from '@/middlewares/auth'
import guest from '@/middlewares/guest'
import HomeView from '@/views/HomeView.vue'
import DomainsView from '@/views/DomainsView.vue'
import NodesView from '@/views/nodes/NodesView.vue'
import LoginView from '@/views/LoginView.vue'
import SingleNode from '@/views/nodes/SingleNode.vue'
import NotFound from '@/views/errors/NotFound.vue'
import LogsView from '@/views/LogsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        middleware: [guest],
      },
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        middleware: [auth],
      },
    },
    {
      path: '/domains',
      name: 'domains',
      component: DomainsView,
      meta: {
        middleware: [auth],
      },
    },
    {
      path: '/domains/:domain/logs',
      name: 'domain-logs',
      component: LogsView,
      meta: {
        middleware: [auth],
      },
    },
    {
      path: '/nodes',
      name: 'nodes',
      component: NodesView,
      meta: {
        middleware: [auth],
      },
    },
    {
      path: '/nodes/:id',
      name: 'node',
      component: SingleNode,
      meta: {
        middleware: [auth],
      },
    },
    {
      path: '/nodes/:nodeId/:type/:id/logs',
      name: 'service-logs',
      component: LogsView,
      meta: {
        middleware: [auth],
      },
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => NotFound,
    },
  ],
})

function nextFactory({
  context,
  middleware,
  index,
}: {
  context: {
    to?: RouteLocationNormalizedGeneric
    from?: RouteLocationNormalizedLoadedGeneric
    next: unknown
    router?: Router
  }
  middleware: any[]
  index: number
}): any {
  const nextMiddleware = middleware[index]

  if (!nextMiddleware) {
    return context.next
  }
  const subsequentMiddleware = nextFactory({ context, middleware, index: index + 1 })
  return nextMiddleware({ ...context, next: subsequentMiddleware })
}

router.beforeEach((to, from, next) => {
  if (!to.meta.middleware) {
    return next()
  }

  const middleware = Array.isArray(to.meta.middleware) ? to.meta.middleware : [to.meta.middleware]
  const context = {
    to,
    from,
    next,
    router,
  }

  return middleware[0]({ ...context, next: nextFactory({ context, middleware, index: 1 }) })
})

export default router
