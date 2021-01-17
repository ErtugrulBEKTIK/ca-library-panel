<template>
  <b-card class="mt-4">
    <b-tabs content-class="mt-3">
      <b-tab title="Onay Bekleyenler" active>
        <comments-by-status :status="0" />
      </b-tab>
      <b-tab title="Onaylananlar">
        <comments-by-status :status="1" />
      </b-tab>
    </b-tabs>

  </b-card>
</template>

<script>
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import CommentsByStatus from "./CommentsByStatus";

export default {
  components: {
    CommentsByStatus
  },

  data() {
    return {
    };
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [
      { title: "Yönetim Paneli" },
      { title: "Yorum İşlemleri" }
    ]);

  },

};
</script>
