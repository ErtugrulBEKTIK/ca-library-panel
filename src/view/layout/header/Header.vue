<template>
  <div id="kt_header" ref="kt_header" class="header flex-column header-fixed">
    <div class="header-top">
      <div class="container">
        <div class="d-none d-lg-flex align-items-center mr-3">
          <!--begin::Logo-->
          <div class="mr-20">
            <router-link to="/">
              <img
                alt="Logo"
                :src="layoutConfig('self.logo.default')"
                class="max-h-35px"
              />
            </router-link>
          </div>
          <!--end::Logo-->
        </div>
        <KTTopbar></KTTopbar>
      </div>
    </div>
    <div class="header-bottom">
      <div class="container">
        <div
          class="header-navs header-navs-left"
          id="kt_header_navs"
          ref="kt_header_navs"
        >
          <div class="tab-pane py-5 show active">
            <!--begin::Menu-->
            <div
              id="kt_header_menu"
              ref="kt_header_menu"
              class="header-menu header-menu-mobile header-menu-layout-default"
            >
              <KTMenu></KTMenu>
            </div>
            <!--end::Menu-->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import KTTopbar from "@/view/layout/header/Topbar.vue";
import KTLayoutHeader from "@/assets/js/layout/base/header.js";
import KTLayoutHeaderMenu from "@/assets/js/layout/base/header-menu.js";
import KTMenu from "@/view/layout/header/Menu.vue";

export default {
  name: "KTHeader",
  data() {
    return {
      tabIndex: 0
    };
  },
  components: {
    KTTopbar,
    KTMenu
  },
  mounted() {
    // Init Desktop & Mobile Headers
    KTLayoutHeader.init(
      this.$refs["kt_header"],
      this.$refs["kt_header_mobile"]
    );

    // Init Header Menu
    KTLayoutHeaderMenu.init(
      this.$refs["kt_header_menu"],
      this.$refs["kt_header_navs"]
    );
  },
  computed: {
    ...mapGetters(["layoutConfig", "getClasses"]),

    /**
     * Check if the header menu is enabled
     * @returns {boolean}
     */
    headerMenuEnabled() {
      return !!this.layoutConfig("header.menu.self.display");
    },

    /**
     * Get extra classes for header based on the options
     * @returns {null|*}
     */
    headerClasses() {
      const classes = this.getClasses("header");
      if (typeof classes !== "undefined") {
        return classes.join(" ");
      }
      return null;
    },

    /**
     * Get extra classes for header menu based on the options
     * @returns {null|*}
     */
    headerMenuClasses() {
      const classes = this.getClasses("header_menu");
      if (typeof classes !== "undefined") {
        return classes.join(" ");
      }
      return null;
    },

    /**
     * Check if header container is fluid
     */
    widthFluid() {
      return this.layoutConfig("header.self.width") === "fluid";
    }
  },
  methods: {
    /**
     * Set current active on click
     * @param event
     */
    setActiveTab(event) {
      let target = event.target;
      if (!event.target.classList.contains("nav-link")) {
        target = event.target.closest(".nav-link");
      }

      const tab = target.closest('[role="tablist"]');
      const links = tab.querySelectorAll(".nav-link");
      // remove active tab links
      for (let i = 0; i < links.length; i++) {
        links[i].classList.remove("active");
      }

      // set clicked tab index to bootstrap tab
      this.tabIndex = parseInt(target.getAttribute("data-tab"));

      // set current active tab
      target.classList.add("active");
    }
  }
};
</script>
