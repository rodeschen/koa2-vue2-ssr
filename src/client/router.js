import Vue from 'vue'
import Router from 'vue-router'
import indexComp from './views/index.vue'
import secondComp from './views/second.vue'
import loginComp from './views/login.vue'
Vue.use(Router)

// route-level code splitting
// const createListView = id => () => import('../views/CreateListView').then(m => m.default(id))
// const ItemView = () => import('../views/ItemView.vue')
// const UserView = () => import('../views/UserView.vue')

export function createRouter() {
    return new Router({
        mode: 'history',
        scrollBehavior: () => ({ y: 0 }),
        routes: [
            //   { path: '/top/:page(\\d+)?', component: createListView('top') },
            //   { path: '/new/:page(\\d+)?', component: createListView('new') },
            //   { path: '/show/:page(\\d+)?', component: createListView('show') },
            //   { path: '/ask/:page(\\d+)?', component: createListView('ask') },
            //   { path: '/job/:page(\\d+)?', component: createListView('job') },
            //   { path: '/item/:id(\\d+)', component: ItemView },
            //   { path: '/user/:id', component: UserView },
            { path: '/second', component: secondComp },
            { path: '/login', component: loginComp },
            { path: '/', component: indexComp }
        ]
    })
}