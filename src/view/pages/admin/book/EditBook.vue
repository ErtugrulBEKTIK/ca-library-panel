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
      size="lg"
      no-close-on-esc
      no-close-on-backdrop
    >
      <form-wrapper :validator="$v.form" v-if="!loading" class="av-tooltip tooltip-right-top">
        <b-row>
          <form-group name="title" md="6" :label="$t('project.bookName')">
            <b-input
              slot-scope="{ attrs, listeners }"
              v-bind="attrs"
              v-on="listeners"
              v-model="form.title"
            />
          </form-group>
          <form-group name="publisher" md="6" :label="$t('project.publisher')">
            <b-input
              slot-scope="{ attrs, listeners }"
              v-bind="attrs"
              v-on="listeners"
              v-model="form.publisher"
            />
          </form-group>
        </b-row>
        <b-row>
          <form-group name="authors" md="6" :label="$t('project.authors')">
            <add-author
              slot-scope="{ attrs, listeners }"
              v-bind="attrs"
              v-on="listeners"
              v-model="form.authors"
            />
          </form-group>
          <form-group name="categories" md="6" :label="$t('project.categories')">
            <add-category
              slot-scope="{ attrs, listeners }"
              v-bind="attrs"
              v-on="listeners"
              v-model="form.categories"
            />
          </form-group>
        </b-row>
        <b-row>
          <form-group name="year" md="6" :label="$t('project.publishDate')">
            <b-input
              slot-scope="{ attrs, listeners }"
              v-bind="attrs"
              v-on="listeners"
              v-model="form.year"
            />
          </form-group>
          <form-group name="shelf" md="6" :label="$t('project.shelf')">
            <b-input
              slot-scope="{ attrs, listeners }"
              v-bind="attrs"
              v-on="listeners"
              v-model="form.shelf"
            />
          </form-group>
        </b-row>

        <b-row>
          <form-group name="barcode" xs="12" :label="$t('project.barcode')">
            <b-input
              slot-scope="{ attrs, listeners }"
              v-bind="attrs"
              v-on="listeners"
              v-model="form.barcode"
            />
          </form-group>
        </b-row>

        <b-row>
          <form-group name="description" xs="12" :label="$t('project.description')">
            <b-input
              slot-scope="{ attrs, listeners }"
              v-bind="attrs"
              v-on="listeners"
              v-model="form.description"
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
  import {integer, required} from "vuelidate/lib/validators";
  import AddAuthor from "@/view/pages/admin/book/AddAuthor";
  import AddCategory from "@/view/pages/admin/book/AddCategory";

export default {
  props: ["bookId"],
  components: {
    AddAuthor,
    AddCategory
  },
  validations: {
    form: {
      title: { required },
      publisher: {},
      year: { integer },
      shelf: {},
      description: {},
      barcode: { required },
      authors: {
        required: (val) => {
          return val.length > 0
        }
      },
      categories: {
        required: (val) => {
          return val.length > 0
        }
      }
    }
  },
  data() {
    return {
      modal: false,
      countries: [],
      form: {
        title: '',
        publisher: '',
        year: '',
        shelf: '',
        description: '',
        barcode: '',
        authors: [],
        categories: []
      },
      loading: true,
      submitting: false,
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
    async getBook() {
      try {
        this.loading = true;
        const { data } = await this.axios.get("admin/books/" + this.bookId);
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

        await this.axios.patch("admin/books/" + this.bookId, this.form);
        this.$emit("refreshList");
        this.saved = true;
        this.modal = false;
        this.toast({ message: 'updateSuccess', item: 'book' });

      } catch (e) {
        this.toast({ type: "danger", message: "updateError", item: "book" });
        console.log(e);
      } finally {
        this.submitting = false;
      }
    }
  },
  watch: {
    modal(nv) {
      if (nv) {
        this.getBook();
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
