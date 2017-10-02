<template>
  <div class="login-from card" style="width: 25rem;">
    <div class="card-body">
      <form class="form" @submit.prevent="validateBeforeSubmit">
        <div class="form-group row">
          <label for="staticEmail" class="col-sm-4 col-form-label">Email</label>
          <div class="col-sm-8">
            <input class="form-control" v-model="loginForm.email" v-validate="{ required: true, email: true }" type="text" placeholder="Email">

          </div>
        </div>
        <div class="form-group row">
          <label for="staticEmail" class="col-sm-4 col-form-label">Password</label>
          <div class="col-sm-8">
            <input class="form-control" v-model="loginForm.password" v-validate="{ required: true }" type="password" palceholder="password">
          </div>
        </div>
        <div class="form-group row">
          <div class="col-sm-4"></div>
          <div class="col-md-4 ">
            <button class="btn btn-primary my-2 my-sm-0" type="submit">Submit</button>
          </div>
          <div class="col-sm-4"></div>
        </div>
        <div class="form-group row">
          <div class="col-sm-4"></div>
          <div class="col-md-4 ">
            <a href="/connect/facebook">facebook</a> |
            <a href="/connect/google">google</a>
          </div>
          <div class="col-sm-4"></div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>

export default {
  name: 'login',
  data() {
    return {
      loginForm: {
        email: '',
        'password': ''
      }
    }
  },
  computed: {
    renderer() {
      return this.$store.state.renderer
    }
  },
  methods: {
    validateBeforeSubmit() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.$store.dispatch('login', this.loginForm).then((result) => {
            result && this.$router.push(this.$route.query.redirect || "/");
          });
          return;
        }
      });
      return false;
    }
  }
}
</script>

<style scoped lang="scss">
.login-from {
  margin: auto;
  margin-top: 20%;
}
</style>
