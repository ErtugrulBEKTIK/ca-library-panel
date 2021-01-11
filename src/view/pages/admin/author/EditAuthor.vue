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
          <form-group name="fullName" xs="12" label="Yazar Adı">
            <b-input
              slot-scope="{ attrs, listeners }"
              v-bind="attrs"
              v-on="listeners"
              v-model="form.fullName"
            />
          </form-group>
        </b-row>
        <b-row>
          <form-group name="description" xs="12" label="Açıklama">
            <b-input
              slot-scope="{ attrs, listeners }"
              v-bind="attrs"
              v-on="listeners"
              v-model="form.description"
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
  props: ["authorId"],
  validations: {
    form: {
      fullName: { required },
      description: {}
    }
  },
  data() {
    return {
      modal: false,
      countries: [],
      form: {
        fullName: "",
        description: ""
      },
      saved: true
    };
  },
  methods: {
    onClose(bvModalEvt) {
      bvModalEvt.preventDefault();
      if (this.saved) {
        this.modal = false;
      } else {
        this.confirmChanges().then(result => {
          if (result.value) {
            this.submitForm();
          } else {
            this.modal = false;
          }
        });
      }
    },
    async getAuthor() {
      try {
        const { data } = await this.axios.get("admin/authors/" + this.authorId);
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

        await this.axios.patch("admin/authors/" + this.authorId, this.form);
        this.$emit("refreshList");
        this.saved = true;
        this.modal = false;
        this.toast({ message: 'updateSuccess', item: 'author' });

      } catch (e) {
        this.toast({ type: "danger", message: "updateError", item: "author" });
        console.log(e);
      }
    }
  },
  watch: {
    modal(nv) {
      if (nv) {
        this.getAuthor();
        this.$v.$reset();
      }
    },
    form: {
      handler() {
        this.saved = false;
      },
      deep: true
    }
  }
};
</script>