<template>
<div>
  <div class="second">{{renderer}} -- second</div>
  <div class="test-css">test css</div>
  </div>
</template>

<script>

export default {
  name: 'second', 

  computed: {
    renderer() {
      return this.$store.state.renderer
    }
  },

  asyncData ({ store, route: { params: { id }}}) {
    console.log("second asyncData");
    return store.dispatch('SET_RENDERER', { type: process.env.VUE_ENV +" render" })
  },

  title () {
    // return this.user
    //   ? this.user.id
    //   : 'User not found'
  }
}
</script>

<style scoped lang="scss">
  .second {
    color: peru;
  }
  .test-css{
    color:darkred;
  }
</style>
