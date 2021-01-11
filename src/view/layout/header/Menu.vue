<template>
  <ul class="menu-nav">
    <router-link
      to="/home"
      v-slot="{ href, navigate, isActive, isExactActive }"
    >
      <li
        aria-haspopup="true"
        data-menu-toggle="hover"
        class="menu-item"
        :class="[
          isActive && 'menu-item-active',
          isExactActive && 'menu-item-active'
        ]"
      >
        <a :href="href" class="menu-link" @click="navigate">
          <span class="menu-text"> Kütüphane </span>
        </a>
      </li>
    </router-link>
    <li
      aria-haspopup="true"
      data-menu-toggle="click"
      class="menu-item menu-item-submenu menu-item-open-dropdown"
      v-bind:class="{ 'menu-item-active': hasActiveChildren('/custom') }"
    >
      <a href="#" class="menu-link menu-toggle">
        <span class="menu-text"> Yönetim </span>
      </a>
      <div class="menu-submenu menu-submenu-classic">
        <ul class="menu-subnav">
          <router-link
            to="/admin/book"
            v-slot="{ href, navigate, isActive, isExactActive }"
          >
            <li
              aria-haspopup="true"
              data-menu-toggle="hover"
              class="menu-item menu-item-submenu"
              :class="{
                'menu-item-active': hasActiveChildren('/custom-wizard/wizard')
              }"
            >
              <a :href="href" class="menu-link menu-toggle" @click="navigate">
                <i class="menu-icon flaticon2-open-text-book"></i>
                <span class="menu-text"> Kitaplar </span>
              </a>
            </li>
          </router-link>

          <router-link
            to="/admin/category"
            v-slot="{ href, navigate, isActive, isExactActive }"
          >
            <li
              aria-haspopup="true"
              data-menu-toggle="hover"
              class="menu-item menu-item-submenu"
              :class="{
                'menu-item-active': hasActiveChildren('/custom-wizard/wizard')
              }"
            >
              <a :href="href" class="menu-link menu-toggle" @click="navigate">
                <i class="menu-icon flaticon2-indent-dots"></i>
                <span class="menu-text"> Kategoriler </span>
              </a>
            </li>
          </router-link>
          <router-link
            to="/admin/author"
            v-slot="{ href, navigate, isActive, isExactActive }"
          >
            <li
              aria-haspopup="true"
              data-menu-toggle="hover"
              class="menu-item menu-item-submenu"
              :class="{
                'menu-item-active': hasActiveChildren('/custom-wizard/wizard')
              }"
            >
              <a :href="href" class="menu-link menu-toggle" @click="navigate">
                <i class="menu-icon flaticon2-sheet"></i>
                <span class="menu-text"> Yazarlar </span>
              </a>
            </li>
          </router-link>
          <router-link
            to="/custom-error/error-1"
            v-slot="{ href, navigate, isActive, isExactActive }"
          >
            <li
              aria-haspopup="true"
              data-menu-toggle="hover"
              class="menu-item menu-item-submenu"
              :class="{
                'menu-item-active': hasActiveChildren('/custom-wizard/wizard')
              }"
            >
              <a href="#" class="menu-link menu-toggle">
                <i class="menu-icon flaticon2-group"></i>
                <span class="menu-text"> Kullanıcılar </span>
              </a>
            </li>
          </router-link>
        </ul>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: "KTMenu",
  methods: {
    hasActiveChildren(match) {
      return this.$route["path"].indexOf(match) !== -1;
    }
  }
};
</script>
