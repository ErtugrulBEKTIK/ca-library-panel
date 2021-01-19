<template>
  <div class="d-flex flex-column flex-root">
    <div
      class="login login-1 d-flex flex-column flex-lg-row flex-column-fluid bg-white"
      :class="{
        'login-signin-on': this.state == 'signin',
        'login-signup-on': this.state == 'signup',
        'login-forgot-on': this.state == 'forgot'
      }"
      id="kt_login"
    >
      <!--begin::Aside-->
      <div
        class="login-aside d-flex flex-column flex-row-auto"
        style="background-color: #F2C98A;"
      >
        <div class="d-flex flex-column-auto flex-column pt-lg-40 pt-15">
          <a href="#" class="text-center mb-10">
            <img
              src="media/logos/logo-letter-1.png"
              class="max-h-70px"
              alt=""
            />
          </a>
          <h3
            class="font-weight-bolder text-center font-size-h4 font-size-h1-lg"
            style="color: #986923;"
          >
            {{ $t('project.selectBookWithNewSys1') }} <br />{{ $t('project.selectBookWithNewSys2') }}
          </h3>
        </div>
        <div
          class="aside-img d-flex flex-row-fluid bgi-no-repeat bgi-position-y-bottom bgi-position-x-center"
          style="background-size: contain"
          :style="{ backgroundImage: `url(${backgroundImage})` }"
        ></div>
      </div>
      <!--begin::Aside-->
      <!--begin::Content-->
      <div
        class="login-content flex-row-fluid d-flex flex-column justify-content-center position-relative p-7 mx-auto"
      >
        <div class="d-flex flex-row justify-content-between align-items-center">
          <router-link to="/home">
            <span class="svg-icon svg-icon-4x svg-icon-warning">
              <inline-svg
                src="media/svg/icons/Navigation/Angle-double-left.svg"
              />
            </span>
          </router-link>
          <KTDropdownLanguage />
        </div>


        <div class="d-flex flex-column-fluid flex-center overflow-hidden">
          <!--begin::Signin-->
          <div class="login-form login-signin">
            <form-wrapper :validator="$v.loginForm" id="kt_login_signin_form">
              <div class="pb-13 pt-lg-0 pt-5">
                <h3
                  class="font-weight-bolder text-dark font-size-h4 font-size-h1-lg"
                >
                  {{ $t('project.welcome') }}
                </h3>
                <span class="text-muted font-weight-bold font-size-h4"
                >{{ $t('project.areYouNew') }}
                  <a
                    id="kt_login_signup"
                    class="text-primary font-weight-bolder"
                    style="cursor: pointer"
                    @click="showForm('signup')"
                  >{{ $t('project.createAnAccount') }}</a
                  ></span
                >
              </div>
              <div class="form-group">
                <label class="font-size-h6 font-weight-bolder text-dark">
                  {{ $t('project.email') }}
                </label>
                <b-row>
                  <form-group name="email" xs="12" no-label no-margin>
                    <b-input
                      slot-scope="{ attrs, listeners }"
                      v-bind="attrs"
                      v-on="listeners"
                      class="form-control-lg form-control-solid h-auto py-7 px-6 rounded-lg"
                      v-model="loginForm.email"
                    />
                  </form-group>
                </b-row>
              </div>
              <div class="form-group">
                <div class="d-flex justify-content-between mt-n5">
                  <label class="font-size-h6 font-weight-bolder text-dark pt-5">
                    {{ $t('project.password') }}
                  </label>
                  <a
                    class="text-primary font-size-h6 font-weight-bolder text-hover-primary pt-5"
                    id="kt_login_forgot"
                    style="cursor: pointer"
                    @click="showForm('forgot')"
                  >{{ $t('project.forgetPassword') }}</a
                  >
                </div>
                <b-row>
                  <form-group name="password" xs="12" no-label no-margin>
                    <b-input
                      slot-scope="{ attrs, listeners }"
                      v-bind="attrs"
                      v-on="listeners"
                      type="password"
                      class="form-control-lg form-control-solid h-auto py-7 px-6 rounded-lg"
                      v-model="loginForm.password"
                    />
                  </form-group>
                </b-row>
              </div>
              <div class="pb-lg-0 pb-5">
                <b-button
                  size="lg"
                  variant="primary"
                  @click="submitLogin"
                  :disabled="$v.loginForm.$anyError || submitting"
                  class="font-weight-bolder font-size-h6 px-15 py-4 my-3 mr-3">
                  {{ $t('project.login') }} <b-spinner small v-if="submitting" />
                </b-button>
              </div>
            </form-wrapper>
          </div>
          <!--end::Signin-->
          <!--begin::Signup-->
          <div class="login-form login-signup">
            <form-wrapper :validator="$v.registerForm" id="kt_login_signup_form">
              <div class="pb-13 pt-lg-0 pt-5">
                <h3
                  class="font-weight-bolder text-dark font-size-h4 font-size-h1-lg"
                >
                  {{ $t('project.register') }}
                </h3>
                <p class="text-muted font-weight-bold font-size-h4">
                  {{ $t('project.enterDetailsToCreate') }}
                </p>
              </div>
              <b-row class="form-group">
                <form-group name="firstName" xs="12" md="6" no-label no-margin>
                  <b-input
                    slot-scope="{ attrs, listeners }"
                    v-bind="attrs"
                    v-on="listeners"
                    :placeholder="$t('project.firstName')"
                    class="form-control-lg form-control-solid h-auto py-7 px-6 rounded-lg"
                    v-model="registerForm.firstName"
                  />
                </form-group>
                <form-group name="lastName" xs="12" md="6" no-label no-margin>
                  <b-input
                    slot-scope="{ attrs, listeners }"
                    v-bind="attrs"
                    v-on="listeners"
                    :placeholder="$t('project.lastName')"
                    class="form-control-lg form-control-solid h-auto py-7 px-6 rounded-lg"
                    v-model="registerForm.lastName"
                  />
                </form-group>
              </b-row>
              <b-row class="form-group">
                <form-group name="email" xs="12" no-label no-margin>
                  <b-input
                    slot-scope="{ attrs, listeners }"
                    v-bind="attrs"
                    v-on="listeners"
                    :placeholder="$t('project.email')"
                    class="form-control-lg form-control-solid h-auto py-7 px-6 rounded-lg"
                    v-model="registerForm.email"
                  />
                </form-group>
              </b-row>
              <b-row class="form-group">
                <form-group name="password" xs="12" no-label no-margin>
                  <b-input
                    slot-scope="{ attrs, listeners }"
                    v-bind="attrs"
                    v-on="listeners"
                    type="password"
                    :placeholder="$t('project.password')"
                    class="form-control-lg form-control-solid h-auto py-7 px-6 rounded-lg"
                    v-model="registerForm.password"
                  />
                </form-group>
              </b-row>
              <b-row class="form-group">
                <form-group name="reNewPassword" xs="12" no-label no-margin>
                  <b-input
                    slot-scope="{ attrs, listeners }"
                    v-bind="attrs"
                    v-on="listeners"
                    :placeholder="$t('project.reNewPassword')"
                    type="password"
                    class="form-control-lg form-control-solid h-auto py-7 px-6 rounded-lg"
                    v-model="registerForm.reNewPassword"
                  />
                </form-group>
              </b-row>
              <b-row class="form-group" v-if="$i18n.locale === 'tr'">
                <form-group name="accept" xs="12" no-label no-margin>
                  <label class="checkbox mb-0" slot-scope="{ attrs, listeners }">
                    <input
                      v-bind="attrs"
                      v-on="listeners"
                      type="checkbox"
                      name="agree"
                      v-model="registerForm.accept"
                    />
                    <span class="mr-2"></span>
                    <a href="#" class="ml-2 mr-1">
                      Gizlilik ve kullanım koşullarını
                    </a>
                    kabul ediyorum.
                  </label>
                </form-group>
              </b-row>
              <div class="form-group" v-if="$i18n.locale === 'en'">
                <label class="checkbox mb-0">
                  <input type="checkbox" name="agree" />
                  <span class="mr-2"></span>
                  I agree to the
                  <a href="#" class="ml-2 mr-1">
                    Privacy and Terms of Use
                  </a>
                </label>
              </div>
              <div class="form-group d-flex flex-wrap pb-lg-0 pb-3">
                <b-button
                  size="lg"
                  variant="primary"
                  @click="submitRegister"
                  :disabled="$v.registerForm.$anyError || submitting"
                  class="font-weight-bolder font-size-h6 px-15 py-4 my-3 mr-3">
                  {{ $t('project.register') }} <b-spinner v-if="submitting" />
                </b-button>
                <b-button
                  size="lg"
                  variant="primary"
                  @click="showForm('signin')"
                  class="btn-light-primary font-weight-bolder font-size-h6 px-15 py-4 my-3 mr-3">
                  {{ $t('project.cancel') }}
                </b-button>
              </div>
            </form-wrapper>
          </div>
          <!--end::Signup-->
          <!--begin::Forgot-->
          <div class="login-form login-forgot">
            <form-wrapper :validator="$v.forgotForm" id="kt_login_forgot_form">
              <div class="pb-13 pt-lg-0 pt-5">
                <h3
                  class="font-weight-bolder text-dark font-size-h4 font-size-h1-lg"
                >
                  {{ $t('project.forgetPassword') }}
                </h3>
                <p class="text-muted font-weight-bold font-size-h4">
                  {{ $t('project.enterEmailToResetPassword') }}
                </p>
              </div>
              <b-row class="form-group">
                <form-group name="email" xs="12" no-label no-margin>
                  <b-input
                    slot-scope="{ attrs, listeners }"
                    v-bind="attrs"
                    v-on="listeners"
                    :placeholder="$t('project.email')"
                    class="form-control-lg form-control-solid h-auto py-7 px-6 rounded-lg"
                    v-model="forgotForm.email"
                  />
                </form-group>
              </b-row>
              <div class="form-group d-flex flex-wrap pb-lg-0">
                <b-button
                  size="lg"
                  variant="primary"
                  :disabled="$v.forgotForm.$anyError || submitting"
                  class="font-weight-bolder font-size-h6 px-15 py-4 my-3 mr-3">
                  {{ $t('project.send') }} <b-spinner small v-if="submitting" />
                </b-button>
                <b-button
                  size="lg"
                  variant="primary"
                  @click="showForm('signin')"
                  class="btn-light-primary font-weight-bolder font-size-h6 px-15 py-4 my-3 mr-3">
                  {{ $t('project.cancel') }}
                </b-button>
              </div>
            </form-wrapper>
          </div>
          <!--end::Forgot-->
        </div>
        <!--begin::Content footer-->
        <!--end::Content footer-->
      </div>
      <!--end::Content-->
    </div>
  </div>
</template>

<!-- Load login custom page styles -->
<style lang="scss">
@import "@/assets/sass/pages/login/login-1.scss";
</style>

<script>

import KTUtil from "@/assets/js/components/util";
import { mapGetters } from "vuex";
import { LOGIN, LOGOUT, REGISTER } from "@/core/services/store/auth.module";
//import Swal from "sweetalert2";
import KTDropdownLanguage from "@/view/layout/extras/dropdown/DropdownLanguage";
import {minLength, required, email, sameAs} from "vuelidate/lib/validators";

export default {
  components: {
    KTDropdownLanguage,
  },
  validations: {
    loginForm: {
      email: { required, email },
      password: { required },
    },
    registerForm: {
      firstName: { required },
      lastName: { required },
      email: { required, email },
      password: { required, minLength: minLength(6) },
      reNewPassword: { sameAs: sameAs('password') },
      accept: { needToConfirmPrivacyAndPolicy: value => value }
    },
    forgotForm: {
      email: { required, email },
    },
  },
  data() {
    return {
      state: "signin",
      loginForm: {
        email: '',
        password: ''
      },
      registerForm: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        reNewPassword: '',
        accept: false
      },
      forgotForm: {
        email: '',
      },
      submitting: false
    };
  },
  computed: {
    ...mapGetters(["currentUser"]),
    backgroundImage() {
      return process.env.BASE_URL + "media/svg/illustrations/working.svg";
    }
  },
  methods: {
    async submitLogin(){
      try {

        this.submitting = true;
        this.$store.dispatch(LOGOUT);

        await this.$store.dispatch(LOGIN, this.loginForm);

        this.$router.push({ name: "home" });

      }catch (e) {
        this.toast({ type: 'danger', message: 'wrongCredentials' });
        console.log(e);
      }finally {
        this.submitting = false;
      }
    },
    async submitRegister(){
      try {
        this.submitting = true;
        this.$store.dispatch(LOGOUT);

        await this.$store.dispatch(REGISTER, this.loginForm);
        this.$router.push({ name: "home" });

      }catch (e) {
        this.toast({ type: 'danger', message: 'somethingWentWrong' });
        console.log(e);
      }finally {
        this.submitting = false;
      }
    },
    showForm(form) {
      this.state = form;
      var form_name = "kt_login_" + form + "_form";
      KTUtil.animateClass(
        KTUtil.getById(form_name),
        "animate__animated animate__backInUp"
      );
    }
  }
};
</script>
