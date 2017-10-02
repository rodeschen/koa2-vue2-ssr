import axios from '../services/axios'
const emptyUser = {
    userName: '',
    token: ''
}

const state = {
    logining: false,
    userName: '',
    token: ''
};



const actions = {
    login({ commit, dispatch }, data) {
        commit('LOGIN_ACTION', true);
        return axios.post('/auth/login', data).then(function(response) {
                dispatch("setUserData", response.data);
                //commit('LOGIN_SUCCESS', response.data);
                commit('LOGIN_ACTION', false);
                return true;
            }, function(response) {
                commit('LOGIN_FAIL');
                commit('LOGIN_ACTION', false);
                return false;
            }).catch(function(response) {
                commit('LOGIN_FAIL');
                commit('LOGIN_ACTION', false);
                return false;
            })
            // .finally(function() {
            //   commit('LOGIN_ACTION', false);
            // })
    },
    setUserData({ commit }, data) {
        axios.defaults.headers.common['Authorization'] = data.token;
        commit('SET_AUTH_DATA', data);
    },
}


const mutations = {
    'LOGIN_ACTION' (state, active) {
        state.logining = active;
    },
    'LOGIN_SUCCESS' (state, data) {
        Object.assign(state, emptyUser, data);
    },
    'LOGIN_FAIL' (state) {
        Object.assign(state, emptyUser);
    },
    'SET_AUTH_DATA' (state, data) {
        Object.assign(state, emptyUser, data);
    }

}

export default {
    state,
    actions,
    mutations
};