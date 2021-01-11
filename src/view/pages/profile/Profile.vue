<template>
  <div class="d-flex flex-row">

    <div
      class="flex-row-auto offcanvas-mobile w-300px w-xl-350px"
      id="kt_profile_aside"
    >
      <navigator />
    </div>
    <div class="flex-row-fluid ml-lg-8">
      <transition name="fade-in-up">
        <router-view></router-view>
      </transition>
    </div>

  </div>
</template>

<script>
  import Navigator from "@/view/pages/profile/Navigator";
export default {
  components: {
    Navigator
  }
};
</script>
