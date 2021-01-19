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
      :title="$t('project.edit')"
      size="md"
      no-close-on-esc
      no-close-on-backdrop
    >
      <form-wrapper :validator="$v.form" v-if="!loading" class="av-tooltip tooltip-right-top">
        <b-row>
          <form-group name="name" xs="12" :label="$t('project.categoryName')">
            <b-input
              slot-scope="{ attrs, listeners }"
              v-bind="attrs"
              v-on="listeners"
              v-model="form.name"
            />
          </form-group>
        </b-row>
      </form-wrapper>
      <div class="text-center" v-if="loading">
        <b-spinner variant="primary" />
      </div>
      <template slot="modal-footer">
        <b-button variant="light" @click="onClose">
          {{ $t("common.cancel") }}
        </b-button>
        <b-button
          variant="primary"
          @click="submitForm"
          :disabled="$v.$anyError || saved || submitting"
          class="mr-1">
          {{ $t("common.save") }} <b-spinner small v-if="submitting" />
        </b-button>
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
      loading: true,
      submitting: false,
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
        this.loading = true;
        const { data } = await this.axios.get(
          "admin/categories/" + this.categoryId
        );
        this.form = data;
        setTimeout(() => {
          this.saved = true;
        }, 200);
      } catch (e) {
        console.log(e);
      } finally {
        this.loading = false;
      }
    },
    async submitForm() {
      try {
        this.submitting = true;
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
      } finally {
        this.submitting = false;
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
