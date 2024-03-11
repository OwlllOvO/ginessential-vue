<template>
  <div class="register">
    <b-row class="mt-5">
      <b-col
        md="8"
        offset-md="2"
        lg="6"
        offset-lg="3"
      >
        <b-card title="Register">
          <b-form>
            <b-form-group label="Name">
              <b-form-input
                v-model="user.name"
                type="text"
                placeholder="Enter Username(Option)"
              ></b-form-input>
            </b-form-group>
            <b-form-group label="Phone Number">
              <b-form-input
                v-model="user.telephone"
                type="text"
                placeholder="Enter Telephone Number"
              ></b-form-input>
            </b-form-group>
            <b-form-group label="Password">
              <b-form-input
                v-model="user.password"
                type="password"
                placeholder="Enter Password"
              ></b-form-input>
            </b-form-group>
            <b-form-group label="">
              <b-button
                @click="register"
                variant="outline-primary"
                block
              >Register</b-button>
            </b-form-group>
          </b-form>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        name: '',
        telephone: '',
        password: '',
      },
    };
  },
  methods: {
    register() {
      console.log('register');
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
