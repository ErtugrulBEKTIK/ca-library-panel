<template>
  <form-wrapper :validator="$v.createForm">
    <b-card :title="$t('project.addBook')">
      <b-row>
        <form-group name="title" xs="12" no-label>
          <b-input
            slot-scope="{ attrs, listeners }"
            v-bind="attrs"
            v-on="listeners"
            :placeholder="$t('project.bookName')"
            v-model="createForm.title"
          />
        </form-group>
      </b-row>
      <b-row>
        <form-group name="authors" xs="12" no-label>
          <add-author
            slot-scope="{ attrs, listeners }"
            v-bind="attrs"
            v-on="listeners"
            v-model="createForm.authors"
            :placeholder="$t('project.authors')"
          />
        </form-group>
      </b-row>
      <b-row>
        <form-group name="categories" xs="12" no-label>
          <add-category
            slot-scope="{ attrs, listeners }"
            v-bind="attrs"
            v-on="listeners"
            v-model="createForm.categories"
            :placeholder="$t('project.categories')"
          />
        </form-group>
      </b-row>

      <b-row>
        <form-group name="publisher" xs="12" no-label>
          <b-input
            slot-scope="{ attrs, listeners }"
            v-bind="attrs"
            v-on="listeners"
            :placeholder="$t('project.publisher')"
            v-model="createForm.publisher"
          />
        </form-group>
      </b-row>
      <b-row>
        <form-group name="year" xs="12" no-label>
          <b-input
            slot-scope="{ attrs, listeners }"
            v-bind="attrs"
            v-on="listeners"
            :placeholder="$t('project.publishDate')"
            v-model="createForm.year"
          />
        </form-group>
      </b-row>
      <b-row>
        <form-group name="shelf" xs="12" no-label>
          <b-input
            slot-scope="{ attrs, listeners }"
            v-bind="attrs"
            v-on="listeners"
            :placeholder="$t('project.shelf')"
            v-model="createForm.shelf"
          />
        </form-group>
      </b-row>
      <b-row>
        <form-group name="barcode" xs="12" no-label>
          <b-input
            slot-scope="{ attrs, listeners }"
            v-bind="attrs"
            v-on="listeners"
            :placeholder="$t('project.barcode')"
            v-model="createForm.barcode"
          />
        </form-group>
      </b-row>
      <b-row>
        <form-group name="description" xs="12" no-label>
          <b-input
            slot-scope="{ attrs, listeners }"
            v-bind="attrs"
            v-on="listeners"
            :placeholder="$t('project.description')"
            v-model="createForm.description"
          />
        </form-group>
      </b-row>
      <b-row>
        <b-col>
          <b-button @click="addBook">{{ $t('project.add') }}</b-button>
        </b-col>
      </b-row>
    </b-card>
  </form-wrapper>
</template>

<script>
  import {integer, required} from "vuelidate/lib/validators";
  import AddAuthor from "@/view/pages/admin/book/AddAuthor";
  import AddCategory from "@/view/pages/admin/book/AddCategory";

export default {
  components: {
    AddAuthor,
    AddCategory
  },
  validations: {
    createForm: {
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
      createForm: {
        title: '',
        publisher: '',
        year: '',
        shelf: '',
        description: '',
        barcode: '',
        authors: [],
        categories: []
      },
    };
  },
  methods: {
    async addBook() {
      try {
        this.$v.createForm.$touch();
        if (this.$v.createForm.$anyError) {
          this.toast({ type: 'danger', message: 'validationError' });
          return false;
        }
        await this.axios.post("admin/books", this.createForm);

        this.createForm = {
          title: '',
          publisher: '',
          year: '',
          shelf: '',
          description: '',
          barcode: '',
          authors: [],
          categories: []
        };
        this.$v.createForm.$reset();

        this.toast({ message: 'createSuccess', item: 'book' });
        this.$emit('refreshList')

      } catch (e) {
        this.toast({ type: "danger", message: "createError", item: "book" });
        console.log(e);
      }
    }
  }
};
</script>

