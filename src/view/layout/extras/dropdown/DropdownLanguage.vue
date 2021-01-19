<template>
  <b-dropdown
    size="sm"
    variant="link"
    ref="lngDropdown"
    toggle-class="topbar-item text-decoration-none"
    no-caret
    right
    no-flip
  >
    <template v-slot:button-content>
      <div
        class="btn btn-icon btn-hover-transparent-white btn-dropdown btn-lg mr-1 pulse pulse-primary"
      >
        <span class="symbol symbol-20">
          <img :src="languages.find(l => l.lang === $i18n.locale).flag" alt="" />
        </span>
      </div>
    </template>
    <b-dropdown-text tag="div" class="min-w-md-150px">
      <form>
        <ul class="navi navi-hover py-4">
          <template v-for="(item, i) in languages">
            <li
              class="navi-item"
              :class="{ 'navi-item-active': $i18n.locale === item.lang }"
              :key="i"
            >
              <a
                href="#"
                class="navi-link"
                @click="selectLanguage(item.lang)"
              >
              <span class="symbol symbol-20 mr-3">
                <img :src="item.flag" alt="" />
              </span>
                <span class="navi-text">{{ item.name }}</span>
              </a>
            </li>
          </template>
        </ul>
      </form>
    </b-dropdown-text>
  </b-dropdown>

</template>

<script>
import i18nService from "@/core/services/i18n.service.js";

export default {
  name: "KTDropdownLanguage",
  data() {
    return {
      languages: i18nService.languages
    };
  },
  methods: {
    selectLanguage(lang) {
      this.$i18n.locale = lang;
      i18nService.setActiveLanguage(lang);
      this.$refs.lngDropdown.hide()
    },
    isActiveLanguage(current) {
      return this.activeLanguage === current;
    }
  },
  computed: {
    activeLanguage() {
      return i18nService.getActiveLanguage();
    }
  }
};
</script>
