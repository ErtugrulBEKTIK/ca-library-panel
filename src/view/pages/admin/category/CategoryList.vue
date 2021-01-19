<template>
  <b-row>
    <b-col md="7">
      <b-card :title="$t('project.categoryList')">
        <b-table-simple
          borderless
          :responsive="true"
          table-class="table-vertical-center"
        >
          <b-thead>
            <b-tr>
              <b-th>{{ $t('project.category') }}</b-th>
              <b-th>{{ $t('project.transaction') }}</b-th>
            </b-tr>
          </b-thead>
          <b-tbody>
            <template v-if="!loading">
              <b-tr v-for="(item, i) in categories" :key="i">
                <b-td>
                  {{ item.name }}
                </b-td>
                <b-td>
                  <edit-category
                    :category-id="item.id"
                    @refreshList="getCategories"
                  />
                  <b-button
                    @click="deleteCategory(item.id)"
                    size="xs"
                    variant="light-danger"
                    class="btn-icon"
                  >
                    <span class="svg-icon">
                      <inline-svg src="/media/svg/icons/General/Trash.svg" />
                    </span>
                  </b-button>
                </b-td>
              </b-tr>
            </template>
            <tr v-if="categories.length === 0 && !loading" class="text-center">
              <td colspan="2">{{ $t('project.noRecord') }}</td>
            </tr>
            <tr v-if="loading" class="text-center">
              <td colspan="2"><b-spinner variant="primary" /></td>
            </tr>
          </b-tbody>
        </b-table-simple>
        <b-pagination
          v-if="pageSize < totalRows"
          v-model="pageNumber"
          :total-rows="totalRows"
          :per-page="pageSize"
        ></b-pagination>
      </b-card>
    </b-col>
    <b-col md="5">
      <form-wrapper :validator="$v.createForm">
        <b-card :title="$t('project.addCategory')">
          <b-row>
            <form-group name="name" xs="12" :label="$t('project.categoryName')">
              <b-input
                slot-scope="{ attrs, listeners }"
                v-bind="attrs"
                v-on="listeners"
                v-model="createForm.name"
              />
            </form-group>
          </b-row>
          <b-row>
            <b-col>
              <b-button @click="addCategory">{{ $t('project.add') }}</b-button>
            </b-col>
          </b-row>
        </b-card>
      </form-wrapper>
    </b-col>
  </b-row>
</template>

<script>
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import { required } from "vuelidate/lib/validators";
import EditCategory from "./EditCategory";

export default {
  components: {
    EditCategory,
  },
  validations: {
    createForm: {
      name: { required },
    },
  },
  data() {
    return {
      createForm: {
        name: "",
      },
      categories: [],
      loading: true,
      pageSize: 10,
      pageNumber: 1,
      totalRows: null,
    };
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [
      { title: 'project.adminPanel' },
      { title: 'project.categoryTransactions' }
    ]);

    this.getCategories();
  },
  methods: {
    async getCategories() {
      try {
        this.loading = true;
        const { data } = await this.axios.get("admin/categories", {
          params: { ...this.requestQuery },
        });
        this.categories = data.rows;
        this.totalRows = data.count;
      } catch (e) {
        console.log(e);
      } finally {
        this.loading = false;
      }
    },

    async deleteCategory(id) {
      try {
        const { isConfirmed } = await this.confirmDelete();

        if (!isConfirmed) return false;

        await this.axios.delete("admin/categories/" + id);
        this.toast({ message: 'deleteSuccess', item: 'category' });
        this.getCategories();
      } catch (e) {
        this.toast({ type: "danger", message: "deleteError", item: "category" });
        console.log(e);
      }
    },

    async addCategory() {
      try {
        this.$v.createForm.$touch();
        if (this.$v.createForm.$anyError) {
          this.toast({ type: 'danger', message: 'validationError' });
          return false;
        }
        await this.axios.post("admin/categories", this.createForm);

        this.createForm = {
          name: "",
        };
        this.$v.createForm.$reset();

        this.toast({ message: 'createSuccess', item: 'category' });
        this.getCategories();
      } catch (e) {
        this.toast({ type: "danger", message: "createError", item: "category" });
        console.log(e);
      }
    },
  },
  computed: {
    requestQuery() {
      return {
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
      };
    },
  },
  watch: {
    requestQuery() {
      this.getCategories();
    },
  },
};
</script>
