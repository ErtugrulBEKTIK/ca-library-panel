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
    <router-link
      to="/profile/detail"
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
          <span class="menu-text"> Profilim </span>
        </a>
      </li>
    </router-link>
    <router-link
      to="/profile/book-history"
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
          <span class="menu-text"> Okuma Geçmişim </span>
        </a>
      </li>
    </router-link>
    <router-link
      to="/profile/wish-list"
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
          <span class="menu-text"> İstek Listem </span>
        </a>
      </li>
    </router-link>
    <li
      aria-haspopup="true"
      data-menu-toggle="click"
      v-if="currentUser.roleId === Roles.ADMIN || currentUser.roleId === Roles.EDITOR"
      class="menu-item menu-item-submenu menu-item-open-dropdown"
      :class="{ 'menu-item-active': hasActiveChildren('/custom') }"
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
              :class="{'menu-item-active': isExactActive}"
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
              :class="{'menu-item-active': isExactActive}"
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
              :class="{'menu-item-active': isExactActive}"
            >
              <a :href="href" class="menu-link menu-toggle" @click="navigate">
                <i class="menu-icon flaticon2-sheet"></i>
                <span class="menu-text"> Yazarlar </span>
              </a>
            </li>
          </router-link>
          <router-link
            to="/admin/user"
            v-slot="{ href, navigate, isActive, isExactActive }"
          >
            <li
              aria-haspopup="true"
              data-menu-toggle="hover"
              class="menu-item menu-item-submenu"
              :class="{'menu-item-active': isExactActive}"
            >
              <a :href="href" class="menu-link menu-toggle" @click="navigate">
                <i class="menu-icon flaticon2-group"></i>
                <span class="menu-text"> Kullanıcılar </span>
              </a>
            </li>
          </router-link>
          <router-link
            to="/admin/comment"
            v-slot="{ href, navigate, isActive, isExactActive }"
          >
            <li
              aria-haspopup="true"
              data-menu-toggle="hover"
              class="menu-item menu-item-submenu"
              :class="{'menu-item-active': isExactActive}"
            >
              <a :href="href" class="menu-link menu-toggle" @click="navigate">
                <i class="menu-icon flaticon2-talk"></i>
                <span class="menu-text"> Yorumlar </span>
              </a>
            </li>
          </router-link>
        </ul>
      </div>
    </li>
  </ul>
</template>

<script>
import {mapGetters} from "vuex";
import {Roles} from "@/core/data/enum";

export default {
  name: "KTMenu",
  data(){
    return {
      Roles
    }
  },
  methods: {
    hasActiveChildren(match) {
      return this.$route["path"].indexOf(match) !== -1;
    }
  },
  computed: {
    ...mapGetters(['currentUser'])
  }
};
</script>
