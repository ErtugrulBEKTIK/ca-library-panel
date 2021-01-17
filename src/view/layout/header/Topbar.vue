<template>
  <!-- begin:: Header Topbar -->
  <div class="topbar">

    <KTDropdownNotification></KTDropdownNotification>

    <KTDropdownLanguage></KTDropdownLanguage>
    <!--begin: User Bar -->
    <KTQuickUser v-show="isAuthenticated"></KTQuickUser>
    <!--end: User Bar -->
    <div class="topbar-item" v-show="!isAuthenticated">
      <router-link to="/login">
        <div
          class="btn btn-icon btn-hover-transparent-white d-flex align-items-center btn-lg px-md-2 w-md-auto"
        >
          {{$t('common.login')}}
        </div>
      </router-link>
    </div>
  </div>
  <!-- end:: Header Topbar -->
</template>

<style lang="scss">
.topbar {
  .dropdown-toggle {
    padding: 0;
    &:hover {
      text-decoration: none;
    }

    &.dropdown-toggle-no-caret {
      &:after {
        content: none;
      }
    }
  }

  .dropdown-menu {
    margin: 0;
    padding: 0;
    outline: none;
    .b-dropdown-text {
      padding: 0;
    }
  }
}
</style>

<script>
import KTQuickUser from "@/view/layout/extras/offcanvas/QuickUser.vue";
import KTDropdownNotification from "@/view/layout/extras/dropdown/DropdownNotification.vue";
import KTDropdownLanguage from "@/view/layout/extras/dropdown/DropdownLanguage";
import i18nService from "@/core/services/i18n.service.js";
import { mapGetters } from "vuex";

export default {
  name: "KTTopbar",
  data() {
    return {
      languageFlag: "",
      languages: i18nService.languages
    };
  },
  components: {
    KTDropdownLanguage,
    KTQuickUser,
    KTDropdownNotification,
  },
  methods: {
    onLanguageChanged() {
      this.languageFlag = this.languages.find(val => {
        return val.lang === i18nService.getActiveLanguage();
      }).flag;
    }
  },
  computed: {
    ...mapGetters(["isAuthenticated"]),
    getLanguageFlag() {
      return this.onLanguageChanged();
    }
  }
};
</script>
