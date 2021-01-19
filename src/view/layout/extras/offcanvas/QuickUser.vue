<template>
  <div class="topbar-item">
    <div
      id="kt_quick_user_toggle"
      class="btn btn-icon btn-hover-transparent-white d-flex align-items-center btn-lg px-md-2 w-md-auto"
    >
      <div class="d-flex flex-column text-right pr-3">
        <span
          class="text-white font-weight-bolder font-size-sm d-none d-md-inline"
          >{{currentUser.firstName}} {{currentUser.lastName}}</span
        >
      </div>
      <span class="symbol symbol-35">
        <span
          class="symbol-label font-size-h5 font-weight-bold text-white bg-white-o-30"
          >{{currentUser.firstName.slice(0,1)}}{{currentUser.lastName.slice(0,1)}}</span
        >
      </span>
    </div>

    <div
      id="kt_quick_user"
      ref="kt_quick_user"
      class="offcanvas offcanvas-right p-10"
    >
      <!--begin::Header-->
      <div
        class="offcanvas-header d-flex align-items-center justify-content-between pb-5"
      >
        <h3 class="font-weight-bold m-0">
          {{ $t('project.profile') }}
        </h3>
        <a
          href="#"
          class="btn btn-xs btn-icon btn-light btn-hover-primary"
          id="kt_quick_user_close"
        >
          <i class="ki ki-close icon-xs text-muted"></i>
        </a>
      </div>
      <!--end::Header-->

      <!--begin::Content-->
      <vue-perfect-scrollbar
        class="offcanvas-content pr-5 mr-n5 scroll"
        style="max-height: 90vh; position: relative;"
      >
        <!--begin::Header-->
        <div class="d-flex align-items-center mt-5">
          <div class="symbol symbol-100 mr-5">
            <img class="symbol-label" :src="'/media/svg/avatars/'+currentUser.avatar" alt="" />
            <i class="symbol-badge bg-success"></i>
          </div>
          <div class="d-flex flex-column">
            <a
              href="#"
              class="font-weight-bold font-size-h5 text-dark-75 text-hover-primary"
            >
              {{currentUser.firstName}} {{currentUser.lastName}}
            </a>
            <div class="text-muted mt-1">
              <span v-if="currentUser.roleId === Roles.ADMIN">{{ $t('project.admin') }}</span>
              <span v-if="currentUser.roleId === Roles.EDITOR">{{ $t('project.editor') }}</span>
              <span v-if="currentUser.roleId === Roles.BASIC_USER">{{ $t('project.member') }}</span>
            </div>
            <div class="navi mt-2">
              <a href="#" class="navi-item">
                <span class="navi-link p-0 pb-2">
                  <span class="navi-icon mr-1">
                    <span class="svg-icon svg-icon-lg svg-icon-primary">
                      <!--begin::Svg Icon-->
                      <inline-svg
                        src="/media/svg/icons/Communication/Mail-notification.svg"
                      />
                      <!--end::Svg Icon-->
                    </span>
                  </span>
                  <span class="navi-text text-muted text-hover-primary">
                    {{currentUser.email}}
                  </span>
                </span>
              </a>
            </div>
            <button class="btn btn-light-primary btn-bold" @click="onLogout">
              {{ $t('project.logOut') }}
            </button>
          </div>
        </div>
        <!--end::Header-->
        <div class="separator separator-dashed mt-8 mb-5"></div>
        <!--begin::Nav-->
        <div class="navi navi-spacer-x-0 p-0">
          <!--begin::Item-->
          <router-link
            to="/profile"
            @click.native="closeOffcanvas"
            href="#"
            class="navi-item"
          >
            <div class="navi-link">
              <div class="symbol symbol-40 bg-light mr-3">
                <div class="symbol-label">
                  <span class="svg-icon svg-icon-md svg-icon-success">
                    <!--begin::Svg Icon-->
                    <inline-svg
                      src="/media/svg/icons/General/Notification2.svg"
                    />
                    <!--end::Svg Icon-->
                  </span>
                </div>
              </div>
              <div class="navi-text">
                <div class="font-weight-bold">{{ $t('project.profile') }}</div>
              </div>
            </div>
          </router-link>
          <!--end:Item-->
          <!--begin::Item-->
          <router-link
            to="/profile/change-password"
            @click.native="closeOffcanvas"
            href="#"
            class="navi-item"
          >
            <div class="navi-link">
              <div class="symbol symbol-40 bg-light mr-3">
                <div class="symbol-label">
                  <span class="svg-icon svg-icon-md svg-icon-warning">
                    <!--begin::Svg Icon-->
                    <inline-svg src="/media/svg/icons/Shopping/Chart-bar1.svg" />
                    <!--end::Svg Icon-->
                  </span>
                </div>
              </div>
              <div class="navi-text">
                <div class="font-weight-bold">{{ $t('project.changePassword') }}</div>
              </div>
            </div>
          </router-link>
          <!--end:Item-->
          <!--begin::Item-->
          <router-link
            to="/profile/book-history"
            @click.native="closeOffcanvas"
            href="#"
            class="navi-item"
          >
            <div class="navi-link">
              <div class="symbol symbol-40 bg-light mr-3">
                <div class="symbol-label">
                  <span class="svg-icon svg-icon-md svg-icon-danger">
                    <inline-svg src="/media/svg/icons/Home/Book-open.svg" />
                  </span>
                </div>
              </div>
              <div class="navi-text">
                <div class="font-weight-bold">{{ $t('project.bookHistory') }}</div>
              </div>
            </div>
          </router-link>
          <!--end:Item-->
          <!--begin::Item-->
          <router-link
            to="/profile/wish-list"
            @click.native="closeOffcanvas"
            href="#"
            class="navi-item"
          >
            <div class="navi-link">
              <div class="symbol symbol-40 bg-light mr-3">
                <div class="symbol-label">
                  <span class="svg-icon svg-icon-md svg-icon-primary">
                    <inline-svg src="/media/svg/icons/General/Star.svg" />
                  </span>
                </div>
              </div>
              <div class="navi-text">
                <div class="font-weight-bold">{{ $t('project.wishList') }}</div>
              </div>
            </div>
          </router-link>
          <!--end:Item-->
        </div>
        <!--end::Nav-->
        <!--end::Notifications-->
      </vue-perfect-scrollbar>
      <!--end::Content-->
    </div>
  </div>
</template>

<style lang="scss" scoped>
#kt_quick_user {
  overflow: hidden;
}
</style>

<script>
import { mapGetters } from "vuex";
import { LOGOUT } from "@/core/services/store/auth.module";
import KTLayoutQuickUser from "@/assets/js/layout/extended/quick-user.js";
import KTOffcanvas from "@/assets/js/components/offcanvas.js";
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import {Roles} from '@/core/data/enum'
export default {
  components: {
    VuePerfectScrollbar
  },
  name: "KTQuickUser",
  data() {
    return {
      Roles
    };
  },
  mounted() {
    // Init Quick User Panel
    KTLayoutQuickUser.init(this.$refs["kt_quick_user"]);
  },
  methods: {
    onLogout() {
      this.$store
        .dispatch(LOGOUT)
        .then(() => this.$router.push({ name: "login" }));
    },
    closeOffcanvas() {
      new KTOffcanvas(KTLayoutQuickUser.getElement()).hide();
    }
  },
  computed: {
    ...mapGetters(['currentUser'])
  }
};
</script>
