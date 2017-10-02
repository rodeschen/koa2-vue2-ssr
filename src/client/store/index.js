import Vue from 'vue'
import Vuex from 'vuex'
import user from './user';
Vue.use(Vuex);
export function createStore() {
    return new Vuex.Store({
        modules: { user },
        state: {
            renderer: "??",
            testData: "testData1"
                //   activeType: null,
                //   itemsPerPage: 20,
                //   items: {/* [id: number]: Item */},
                //   users: {/* [id: string]: User */},
                //   lists: {
                //     top: [/* number */],
                //     new: [],
                //     show: [],
                //     ask: [],
                //     job: []
                //   }
        },
        actions: {
            SET_RENDERER: ({ commit, dispatch, state }, { type }) => {
                commit('SET_RENDERER_DATA', { type })
            }
        },
        mutations: {
            SET_RENDERER_DATA: (state, { type }) => {
                state.renderer = type
            }
        }
        // getters
    })
}