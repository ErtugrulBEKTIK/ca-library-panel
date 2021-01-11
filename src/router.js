import Vue from 'vue';
import Router from 'vue-router';
import store from '@/core/services/store';
import { VERIFY_AUTH } from '@/core/services/store/auth.module';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/home',
      component: () => import('@/view/layout/Layout'),
      children: [
        {
          path: '/home',
          name: 'home',
          component: () => import('@/view/pages/home/Dashboard.vue'),
        },
        {
          path: '/profile',
          name: 'profile',
          redirect: '/profile/detail',
          component: () => import('@/view/pages/profile/Profile.vue'),
          children: [
            {
              path: 'detail',
              name: 'detail',
              component: () => import('@/view/pages/profile/Details/Details'),
            },
            {
              path: 'change-password',
              name: 'change-password',
              component: () => import('@/view/pages/profile/ChangePassword/ChangePassword'),
            }
          ],
        },
      ],
    },
    {
      path: '/admin',
      redirect: '/admin/book',
      beforeEnter: (to, from, next) =>
        Promise.all([store.dispatch(VERIFY_AUTH)]).then(next),
      component: () => import('@/view/layout/Layout'),
      children: [
        {
          path: 'book',
          name: 'book',
          component: () => import('@/view/pages/admin/book/BookList'),
        },
        {
          path: 'author',
          name: 'author',
          component: () => import('@/view/pages/admin/author/AuthorList'),
        },
        {
          path: 'category',
          name: 'category',
          component: () => import('@/view/pages/admin/category/CategoryList'),
        },
      ],
    },
    {
      path: '/error',
      name: 'error',
      component: () => import('@/view/pages/error/Error.vue'),
      children: [
        {
          path: 'error-1',
          name: 'error-1',
          component: () => import('@/view/pages/error/Error-1.vue'),
        },
        {
          path: 'error-2',
          name: 'error-2',
          component: () => import('@/view/pages/error/Error-2.vue'),
        },
        {
          path: 'error-3',
          name: 'error-3',
          component: () => import('@/view/pages/error/Error-3.vue'),
        },
        {
          path: 'error-4',
          name: 'error-4',
          component: () => import('@/view/pages/error/Error-4.vue'),
        },
        {
          path: 'error-5',
          name: 'error-5',
          component: () => import('@/view/pages/error/Error-5.vue'),
        },
        {
          path: 'error-6',
          name: 'error-6',
          component: () => import('@/view/pages/error/Error-6.vue'),
        },
      ],
    },
    {
      path: '/',
      component: () => import('@/view/pages/auth/login_pages/Login-1'),
      children: [
        {
          name: 'login',
          path: '/login',
          component: () => import('@/view/pages/auth/login_pages/Login-1'),
        },
        {
          name: 'register',
          path: '/register',
          component: () => import('@/view/pages/auth/login_pages/Login-1'),
        },
      ],
    },
    {
      path: '*',
      redirect: '/404',
    },
    {
      // the 404 route, when none of the above matches
      path: '/404',
      name: '404',
      component: () => import('@/view/pages/error/Error-1.vue'),
    },
  ],
});
