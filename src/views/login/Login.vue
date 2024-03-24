<template>
  <div class="register">
    <b-row class="mt-5">
      <b-col
        md="8"
        offset-md="2"
        lg="6"
        offset-lg="3"
      >
        <b-card title="Login">
          <b-form>
            <b-form-group label="Phone Number">
              <b-form-input
                v-model="$v.user.telephone.$model"
                type="text"
                placeholder="Enter Telephone Number"
                :state="validateState('telephone')"
              ></b-form-input>
              <b-form-invalid-feedback :state="validateState('telephone')">
                Phone number format error.
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group label="Password">
              <b-form-input
                v-model="$v.user.password.$model"
                type="password"
                placeholder="Enter Password"
                :state="validateState('password')"
              ></b-form-input>
              <b-form-invalid-feedback :state="validateState('password')">
                Your password must be more than 6 characters long.
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group label="">
              <b-button
                @click="login"
                variant="outline-primary"
                block
              >Login</b-button>
            </b-form-group>
          </b-form>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { required, minLength } from 'vuelidate/lib/validators';
import customValidator from '@/helper/validator';
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      user: {
        telephone: '',
        password: '',
      },
      validation: null,
    };
  },
  validations: {
    user: {
      telephone: {
        required,
        telephone: customValidator.telephoneValidator,
      },
      password: {
        required,
        minLength: minLength(6),
      },
    },
  },
  methods: {
    ...mapActions('userModule', { userlogin: 'login' }),
    validateState(name) {
      // ES6 destructuring assignment
      const { $dirty, $error } = this.$v.user[name];
      return $dirty ? !$error : null;
    },
    login() {
      // Validate data
      this.$v.user.$touch();
      if (this.$v.user.$anyError) {
        return;
      }

      // Request API
      this.userlogin(this.user).then(() => {
        // turn to Home
        this.$router.replace({ name: 'postlist' });
      }).catch((err) => {
        this.$bvToast.toast(err.response.data.msg, {
          title: 'Data validate error',
          variant: 'danger',
          solid: true,
        });
      });
    },
  },
};
</script>

  <style lang="scss" scoped>
</style>
