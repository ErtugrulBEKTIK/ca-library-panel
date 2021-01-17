<template>
  <b-dropdown
    size="sm"
    variant="link"
    toggle-class="topbar-item text-decoration-none"
    no-caret
    right
    no-flip
  >
    <template v-slot:button-content>
      <div class="btn btn-icon btn-hover-transparent-white btn-dropdown btn-lg mr-1 pulse pulse-primary">
        <span class="svg-icon svg-icon-xl">
          <inline-svg src="/media/svg/icons/General/Notifications1.svg" />
        </span>
        <span class="pulse-ring" v-if="notifications.length > 0"></span>
      </div>
    </template>
    <b-dropdown-text tag="div" class="min-w-md-350px">
      <form>
        <div class="p-4">
          <h3 class="mb-5">Notifications</h3>
          <vue-perfect-scrollbar
            :settings="{wheelPropagation: false}"
            style="position: relative; max-height: 300px;"
          >
            <div class="d-flex align-items-center mb-6" :key="i" v-for="(item, i) in notifications">
              <div class="symbol symbol-40 symbol-light-success mr-5">
                <span class="symbol-label">
                  <span class="svg-icon svg-icon-lg svg-icon-success">
                    <inline-svg src="/media/svg/icons/Home/Library.svg" />
                  </span>
                </span>
              </div>
              <div class="d-flex flex-column font-weight-bold">
                <router-link
                  to="/profile/wish-list"
                  class="text-dark text-hover-primary mb-1 font-size-lg"
                >
                  İstek Kitap - {{ item.bookTitle }}
                </router-link>

                <span class="text-muted">
                  Kitap hazır seni bekliyor!
                </span>
              </div>
              <!--end::Text-->
            </div>

            <div v-if="notifications.length === 0">
              Hiç bildiriminiz yok
            </div>
          </vue-perfect-scrollbar>
        </div>

      </form>
    </b-dropdown-text>
  </b-dropdown>

</template>

<style lang="scss">
/* hide default vue-bootstrap tab links */
.hide-tabs > div:not(.tab-content) {
  display: none;
}
</style>

<script>
  import VuePerfectScrollbar from 'vue-perfect-scrollbar'
export default {
  name: 'Notifications',
  components: {
    VuePerfectScrollbar
  },
  data() {
    return {
      notifications: []
    };
  },
  mounted() {
    this.getNotifications()
  },
  methods: {
    async getNotifications() {
      try {
        const { data } = await this.axios.get("profile/notifications");
        this.notifications = data;
      } catch (e) {
        console.log(e);
      }
    },
  }
};
</script>
