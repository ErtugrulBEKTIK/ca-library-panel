<template>
  <div class="card card-custom">
    <div class="card-header py-3">
      <div class="card-title align-items-start flex-column">
        <h3 class="card-label font-weight-bolder text-dark">
          {{ $t('project.personalInformation') }}
        </h3>
        <span class="text-muted font-weight-bold font-size-sm mt-1">
          {{ $t('project.canUpdatePersonalInformation') }}
        </span>
      </div>
      <div class="card-toolbar">
        <button
          type="reset"
          class="btn btn-success mr-2"
          @click="submit()"
          ref="kt_save_changes"
        >
          {{ $t('project.saveChanges') }}
        </button>
        <button type="reset" class="btn btn-secondary" @click="reset()">
          {{ $t('project.cancel') }}
        </button>
      </div>
    </div>
    <form-wrapper :validator="$v.form" class="form">
      <div class="card-body">
        <div class="form-group row">
          <label class="col-xl-3 col-lg-3 col-form-label text-right">
            {{ $t('project.avatar') }}
          </label>
          <div class="col-lg-9 col-xl-6 mb-5">
            <div class="image-input image-input-outline" id="kt_profile_avatar">
              <div
                class="image-input-wrapper"
                :style="{ backgroundImage: `url(/media/svg/avatars/${form.avatar})` }"
              ></div>
              <label
                class="btn btn-xs btn-icon btn-circle btn-white btn-hover-text-primary btn-shadow"
                data-action="change"
                @click="modal=true"
              >
                <i class="fa fa-pen icon-sm text-muted"></i>
              </label>
            </div>
          </div>
        </div>
        <div class="form-group row">
          <label class="col-xl-3 col-lg-3 col-form-label text-right">
            {{ $t('project.firstName') }}
          </label>
          <form-group name="firstName" lg="9" xl="6" no-label no-margin>
            <b-input
              slot-scope="{ attrs, listeners }"
              v-bind="attrs"
              v-on="listeners"
              class="form-control-lg form-control-solid"
              v-model="form.firstName"
            />
          </form-group>
        </div>
        <div class="form-group row">
          <label class="col-xl-3 col-lg-3 col-form-label text-right">
            {{ $t('project.lastName') }}
          </label>
          <form-group name="lastName" lg="9" xl="6" no-label no-margin>
            <b-input
              slot-scope="{ attrs, listeners }"
              v-bind="attrs"
              v-on="listeners"
              class="form-control-lg form-control-solid"
              v-model="form.lastName"
            />
          </form-group>
        </div>
        <div class="form-group row">
          <label class="col-xl-3 col-lg-3 col-form-label text-right">
            {{ $t('project.email') }}
          </label>
          <form-group name="email" lg="9" xl="6" no-label no-margin>
            <div class="input-group input-group-lg input-group-solid" slot-scope="{ attrs, listeners }">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="la la-at"></i>
                </span>
              </div>
              <b-input
                v-bind="attrs"
                v-on="listeners"
                class="form-control-lg form-control-solid"
                v-model="form.email"
              />
            </div>
          </form-group>
        </div>
      </div>
    </form-wrapper>
    <b-modal v-model="modal" :title="$t('project.selectAvatar')" hide-footer size="lg" scrollable>
      <b-row>
        <b-col md="2" v-for="(avatar, i) in avatars" :key="i" @click="selectAvatar(avatar)">
          <div class="image-input image-input-outline">
            <div
              class="image-input-wrapper cursor-pointer"
              :style="{ backgroundImage: `url(/media/svg/avatars/${avatar})` }"
            ></div>
          </div>
        </b-col>
      </b-row>
    </b-modal>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from "vuex";
  import avatars from "@/core/data/avatars";
  import {required, email} from "vuelidate/lib/validators";
  import {SET_BREADCRUMB} from "@/core/services/store/breadcrumbs.module";

  export default {
    validations: {
      form: {
        firstName: { required },
        lastName: { required },
        email: { required, email },
        avatar: { required },
      }
    },
    data() {
      return {
        modal: false,
        form: {
          firstName: '',
          lastName: '',
          email: '',
          avatar: ''
        },
        avatars,
      };
    },
    mounted() {

      this.$store.dispatch(SET_BREADCRUMB, [
        { title: 'project.profile' },
        { title: 'project.profileOverview' }
      ]);

      this.reset()
    },
    methods: {
      ...mapMutations(["setUser"]),
      reset() {
        this.form = {
          firstName: this.currentUser.firstName,
          lastName: this.currentUser.lastName,
          email: this.currentUser.email,
          avatar: this.currentUser.avatar
        };
        this.$v.form.$reset();
      },
      selectAvatar(avatar){
        this.form.avatar = avatar;
        this.modal = false;
      },
      async submit() {
        try {
          this.$v.form.$touch();
          if (this.$v.form.$anyError) {
            this.toast({ type: 'danger', message: 'validationError' });
            return false;
          }
          await this.axios.patch("profile/detail", this.form);

          this.$v.form.$reset();

          this.setUser({
            ...this.form,
            token: this.currentUser.token
          });

          this.toast({ message: 'updateSuccess', item: 'profile' });

        } catch (e) {
          this.toast({ type: "danger", message: "updateError", item: "profile" });
          console.log(e);
        }
      }
    },
    computed: {
      ...mapGetters(["currentUser"]),
    }
  };
</script>
