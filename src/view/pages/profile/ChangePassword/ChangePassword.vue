<template>
  <!--begin::Card-->
  <div class="card card-custom">
    <!--begin::Header-->
    <div class="card-header py-3">
      <div class="card-title align-items-start flex-column">
        <h3 class="card-label font-weight-bolder text-dark">{{ $t('project.changePassword') }}</h3>
        <span class="text-muted font-weight-bold font-size-sm mt-1">
          {{ $t('project.canChangePassword') }}
        </span>
      </div>
      <div class="card-toolbar">
        <b-button
          variant="success"
          :disabled="submitting"
          @click="submit()"
        >
          {{ $t('project.saveChanges') }} <b-spinner small v-if="submitting" />
        </b-button>
      </div>
    </div>
    <!--end::Header-->
    <!--begin::Form-->
    <form-wrapper :validator="$v.form" class="form">
      <div class="card-body">

        <div class="form-group row">
          <label class="col-xl-3 col-lg-3 col-form-label text-right">
            {{ $t('project.currentPassword') }}
          </label>
          <form-group name="oldPassword" lg="9" xl="6" no-label no-margin>
            <b-input
              slot-scope="{ attrs, listeners }"
              v-bind="attrs"
              v-on="listeners"
              type="password"
              class="form-control-lg form-control-solid"
              v-model="form.oldPassword"
            />
          </form-group>
        </div>
        <div class="form-group row">
          <label class="col-xl-3 col-lg-3 col-form-label text-right">
            {{ $t('project.newPassword') }}
          </label>
          <form-group name="newPassword" lg="9" xl="6" no-label no-margin>
            <b-input
              slot-scope="{ attrs, listeners }"
              v-bind="attrs"
              v-on="listeners"
              type="password"
              class="form-control-lg form-control-solid"
              v-model="form.newPassword"
            />
          </form-group>
        </div>
        <div class="form-group row">
          <label class="col-xl-3 col-lg-3 col-form-label text-right">
            {{ $t('project.reNewPassword') }}
          </label>
          <form-group name="reNewPassword" lg="9" xl="6" no-label no-margin>
            <b-input
              slot-scope="{ attrs, listeners }"
              v-bind="attrs"
              v-on="listeners"
              type="password"
              class="form-control-lg form-control-solid"
              v-model="form.reNewPassword"
            />
          </form-group>
        </div>
      </div>
    </form-wrapper>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {SET_BREADCRUMB} from "@/core/services/store/breadcrumbs.module";
import {required, sameAs, minLength} from "vuelidate/lib/validators";

export default {
  validations: {
    form: {
      oldPassword: { required },
      newPassword: { required, minLength: minLength(6) },
      reNewPassword: { sameAs: sameAs('newPassword') },
    }
  },
  data() {
    return {
      form: {
        oldPassword: '',
        newPassword: '',
        reNewPassword: ''
      },
      submitting: false
    };
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [
      { title: 'project.profile' },
      { title: 'project.changePassword' }
    ]);
  },
  methods: {
    async submit() {
      try {
        this.submitting = true;
        this.$v.form.$touch();
        if (this.$v.form.$anyError) {
          this.toast({ type: 'danger', message: 'validationError' });
          return false;
        }
        await this.axios.patch("profile/changePassword", this.form);

        this.reset();

        this.toast({ message: 'updateSuccess', item: 'password' });

      } catch (e) {
        if(e.response.status === 401){
          this.toast({ type: "danger", message: "oldPasswordWrong"});
        }else{
          this.toast({ type: "danger", message: "updateError", item: "password" });
          console.log(e);
        }
      }finally {
        this.submitting = false;
      }

    },
    reset(){
      this.form = {
        oldPassword: '',
        newPassword: '',
        reNewPassword: ''
      };
      this.$v.form.$reset();
    }
  },
  computed: {
    ...mapGetters(["currentUser"])
  }
};
</script>
