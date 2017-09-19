<template>
<div>
  <div>{{renderer}} -- index page</div>
  <div class="test-css">test css</div>
  </div>
</template>

<script>

export default {
  name: 'index',

  computed: {
    renderer() {
      return this.$store.state.renderer
    }
  },

  asyncData({ store }) {
    return store.dispatch('SET_RENDERER', { type: process.env.VUE_ENV + " render" })
  },

  title() {
    return this.user
      ? this.user.id
      : 'User not found'
  }
}
</script>

<style>

</style>
