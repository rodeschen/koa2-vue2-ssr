import axios from 'axios';
//axios.defaults.baseURL = 'https://api.example.com';
//axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
if (process.env.VUE_ENV == 'client' && window.__INITIAL_STATE__) {
    if (window.__INITIAL_STATE__.user) {
        axios.defaults.headers.common['Authorization'] = window.__INITIAL_STATE__.user.token;
    }
}
axios.defaults.headers.common['x-requested-with'] = 'XMLHttpRequest';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';


export default axios;