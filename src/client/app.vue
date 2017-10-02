<template>
  <div id="app">
    <nav v-if="isLogged" class="navbar navbar-expand-lg navbar-light bg-light">
      <a class="navbar-brand" href="#">VKS</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item" :class="{ active : currentPath == '/'}">
            <router-link class="nav-link" to="/">index</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/second" :class="{active : currentPath == '/second'}">second</router-link>
          </li>
        </ul>
        <form class="form-inline my-2 my-lg-0">
          <input class="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search">
          <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
        </form>
      </div>
    </nav>
    <transition name="fade" mode="out-in">
      <router-view class="view"></router-view>
    </transition>
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.css';
import './styles/style.scss';
export default {
  name: 'app',

  computed: {
    isLogged() {
      return false;//this.$store.state.auth.isLogged;
    },
    currentPath (){
      return this.$store.state.route.path;
    }
  },

  title() {
    return this.user
      ? this.user.id
      : 'User not found'
  }
}
</script>

<style lang="scss">
#app>span {
  a {
    color: green;
  }
  color:red;
}
</style>
