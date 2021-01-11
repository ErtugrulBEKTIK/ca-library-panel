<template>
  <b-row>
    <b-col md="7">
      <b-card title="Yazar Listesi">
        <b-table-simple
          borderless
          :responsive="true"
          table-class="table-vertical-center"
        >
          <b-thead>
            <b-tr>
              <b-th>Yazar</b-th>
              <b-th>Açıklama</b-th>
              <b-th>İşlem</b-th>
            </b-tr>
          </b-thead>
          <b-tbody>
            <template v-for="(item, i) in authors">
              <b-tr :key="i">
                <b-td>
                  {{ item.fullName }}
                </b-td>
                <b-td>
                  {{ item.description }}
                </b-td>
                <b-td>
                  <edit-author :author-id="item.id" @refreshList="getAuthors" />
                  <b-button
                    @click="deleteAuthor(item.id)"
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
          </b-tbody>
        </b-table-simple>
        <b-pagination
          v-model="pageNumber"
          :total-rows="totalRows"
          :per-page="pageSize"
          aria-controls="my-table"
        ></b-pagination>
      </b-card>
    </b-col>
    <b-col md="5">
      <form-wrapper :validator="$v.createForm">
        <b-card title="Yazar Ekle">
          <b-row>
            <form-group name="fullName" xs="12" label="Yazar Adı">
              <b-input
                slot-scope="{ attrs, listeners }"
                v-bind="attrs"
                v-on="listeners"
                v-model="createForm.fullName"
              />
            </form-group>
          </b-row>
          <b-row>
            <form-group name="description" xs="12" label="Açıklama">
              <b-input
                slot-scope="{ attrs, listeners }"
                v-bind="attrs"
                v-on="listeners"
                v-model="createForm.description"
              />
            </form-group>
          </b-row>
          <b-row>
            <b-col>
              <b-button @click="addAuthor">Ekle</b-button>
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
import EditAuthor from "./EditAuthor";

export default {
  components: {
    EditAuthor
  },
  validations: {
    createForm: {
      fullName: { required }
    }
  },
  data() {
    return {
      createForm: {
        fullName: "",
        description: ""
      },
      authors: [],
      pageSize: 10,
      pageNumber: 1,
      totalRows: null
    };
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [
      { title: "Yönetim Paneli" },
      { title: "Yazar İşlemleri" }
    ]);

    this.getAuthors();
  },
  methods: {
    async getAuthors() {
      try {
        const { data } = await this.axios.get("admin/authors", {
          params: { ...this.requestQuery }
        });
        this.authors = data.rows;
        this.totalRows = data.count;
      } catch (e) {
        console.log(e);
      }
    },

    async deleteAuthor(id) {
      try {
        const { isConfirmed } = await this.confirmDelete();

        if (!isConfirmed) return false;

        await this.axios.delete("admin/authors/" + id);
        this.toast({ message: 'deleteSuccess', item: 'author' });
        this.getAuthors();
      } catch (e) {
        this.toast({ type: "danger", message: "deleteError", item: "author" });
        console.log(e);
      }
    },

    async addAuthor() {
      try {
        this.$v.createForm.$touch();
        if (this.$v.createForm.$anyError) {
          this.toast({ type: 'danger', message: 'validationError' });
          return false;
        }
        await this.axios.post("admin/authors", this.createForm);

        this.createForm = {
          fullName: "",
          description: ""
        };
        this.$v.createForm.$reset();

        this.toast({ message: 'createSuccess', item: 'author' });
        this.getAuthors();
      } catch (e) {
        this.toast({ type: "danger", message: "createError", item: "author" });
        console.log(e);
      }
    }
  },
  computed: {
    requestQuery() {
      return {
        pageSize: this.pageSize,
        pageNumber: this.pageNumber
      };
    }
  },
  watch: {
    requestQuery() {
      this.getAuthors();
    }
  }
};
</script>
