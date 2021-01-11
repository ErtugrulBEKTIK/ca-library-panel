<template>
  <div style="display: inline">
    <b-button
      size="xs"
      variant="light-primary"
      class="btn-icon mr-2"
      @click="modal = true"
    >
      <span class="svg-icon">
        <inline-svg src="/media/svg/icons/Design/Edit.svg" />
      </span>
    </b-button>
    <b-modal
      v-model="modal"
      @close="onClose"
      :title="$t('common.edit')"
      size="md"
      no-close-on-esc
      no-close-on-backdrop
    >
      <form-wrapper :validator="$v.form" class="av-tooltip tooltip-right-top">
        <b-row>
          <form-group name="name" xs="12" label="Kategori Adı">
            <b-input
              slot-scope="{ attrs, listeners }"
              v-bind="attrs"
              v-on="listeners"
              v-model="form.name"
            />
          </form-group>
        </b-row>
      </form-wrapper>
      <template slot="modal-footer">
        <b-button variant="light" @click="onClose">{{
          $t("common.cancel")
        }}</b-button>
        <b-button
          variant="primary"
          @click="submitForm"
          :disabled="$v.$anyError || saved"
          class="mr-1"
          >{{ $t("common.save") }}</b-button
        >
      </template>
    </b-modal>
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators";
export default {
  props: ["categoryId"],
  validations: {
    form: {
      name: { required },
    },
  },
  data() {
    return {
      modal: false,
      countries: [],
      form: {
        name: "",
      },
      saved: true,
    };
  },
  methods: {
    onClose(bvModalEvt) {
      bvModalEvt.preventDefault();
      if (this.saved) {
        this.modal = false;
      } else {
        this.confirmChanges().then((result) => {
          if (result.value) {
            this.submitForm();
          } else {
            this.modal = false;
          }
        });
      }
    },
    async getCategory() {
      try {
        const { data } = await this.axios.get(
          "admin/categories/" + this.categoryId
        );
        this.form = data;
        setTimeout(() => {
          this.saved = true;
        }, 200);
      } catch (e) {
        console.log(e);
      }
    },
    async submitForm() {
      try {
        this.$v.$touch();
        if (this.$v.$anyError) {
          this.toast({ type: 'danger', message: 'validationError' });
          return false;
        }

        await this.axios.patch(
          "admin/categories/" + this.categoryId,
          this.form
        );
        this.$emit("refreshList");
        this.saved = true;
        this.modal = false;

        this.toast({ message: 'updateSuccess', item: 'category' });
      } catch (e) {
        this.toast({ type: "danger", message: "updateError", item: "category" });
        console.log(e);
      }
    },
  },
  watch: {
    modal(nv) {
      if (nv) {
        this.getCategory();
        this.$v.$reset();
      }
    },
    form: {
      handler() {
        this.saved = false;
      },
      deep: true,
    },
  },
};
</script>
