<template>
  <div class="card card-custom card-stretch">
    <div class="card-body pt-4">
      <div class="d-flex align-items-center mt-4">
        <div class="symbol symbol-60 symbol-xxl-100 mr-5 align-self-start align-self-xxl-center">
          <div
            class="symbol-label"
            :style="{backgroundImage: `url(/media/svg/avatars/${currentUser.avatar})`}"
          ></div>
        </div>
        <div>
          <a class="font-weight-bolder font-size-h5 text-dark-75 text-hover-primary">
            {{ currentUser.firstName }} {{ currentUser.lastName }}
          </a>
          <div class="text-muted">Üye</div>
          <div class="mt-2">
            <a class="text-muted text-hover-primary">
              {{ currentUser.email }}
            </a>
          </div>
        </div>
      </div>
      <!--end::User-->
      <!--begin::Nav-->
      <div class="navi navi-bold navi-hover navi-active navi-link-rounded py-9">
        <div class="navi-item mb-2">
          <router-link
            to="/profile/detail"
            v-slot="{ href, navigate, isExactActive }"
          >
            <a
              class="navi-link py-4"
              :class="{'active': isExactActive}"
              :href="href"
              @click="navigate"
              style="cursor:pointer"
            >
              <span class="navi-icon mr-2">
                <span class="svg-icon">
                  <inline-svg src="/media/svg/icons/Design/Layers.svg" />
                </span>
              </span>
              <span class="navi-text font-size-lg">Profile Overview</span>

            </a>
          </router-link>

        </div>
        <div class="navi-item mb-2">
          <router-link
            to="/profile/change-password"
            v-slot="{ href, navigate, isExactActive }"
          >
            <a
              class="navi-link py-4"
              :class="{'active': isExactActive}"
              :href="href"
              @click="navigate"
              style="cursor:pointer"
            >
              <span class="navi-icon mr-2">
                <span class="svg-icon">
                  <inline-svg src="/media/svg/icons/Communication/Shield-user.svg" />
                </span>
              </span>
              <span class="navi-text font-size-lg">Change Password</span>

            </a>
          </router-link>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";

  export default {
    name: "Navigator",
    methods: {
    },
    computed: {
      ...mapGetters(["currentUser"]),
    }
  }
</script>

<style scoped>

</style>
