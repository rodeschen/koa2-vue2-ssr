<template>
  <div id="app">
    <div>{{testData}}</div>
    <router-link to="/">index</router-link> &nbsp;&nbsp;       
    <router-link to="/second">second</router-link>
    <transition name="fade" mode="out-in">
      <router-view class="view"></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'app',

  computed: {
    testData() {
      return this.$store.state.testData
    }
  },

  //   asyncData ({ store, route: { params: { id }}}) {
  //     return store.dispatch('FETCH_USER', { id })
  //   },

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
