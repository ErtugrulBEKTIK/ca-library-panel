<template>
  <b-row>
    <b-col md="9">
      <b-card>
        <b-row class="mb-5">
          <b-col md="6">
            <h4 class="mt-2">{{ $t('project.bookList') }}</h4>
          </b-col>
          <b-col md="6">
            <b-input
              :placeholder="$t('project.search')"
              v-model="search"
            />
          </b-col>
        </b-row>
        <b-table-simple
          borderless
          :responsive="true"
          table-class="table-vertical-center"
        >
          <b-thead>
            <b-tr>
              <b-th>{{ $t('project.books') }}</b-th>
              <b-th>{{ $t('project.authors') }}</b-th>
              <b-th>{{ $t('project.categories') }}</b-th>
              <b-th>{{ $t('project.publisher') }}</b-th>
              <b-th>{{ $t('project.publishDate') }}</b-th>
              <b-th>{{ $t('project.shelf') }}</b-th>
              <b-th>{{ $t('project.barcode') }}</b-th>
              <b-th style="min-width: 80px">{{ $t('project.transaction') }}</b-th>
            </b-tr>
          </b-thead>
          <b-tbody>
            <template v-if="!loading">
              <b-tr v-for="(item, i) in books" :key="i">
                <b-td>{{ item.title }}</b-td>
                <b-td>{{ item.authors.map(a => a.fullName).join(', ') }}</b-td>
                <b-td>{{ item.categories.map(c => c.name).join(', ') }}</b-td>
                <b-td>{{ item.publisher }}</b-td>
                <b-td>{{ item.year }}</b-td>
                <b-td>{{ item.shelf }}</b-td>
                <b-td>{{ item.barcode }}</b-td>
                <b-td>
                  <edit-book :book-id="item.id" @refreshList="getBooks" />
                  <b-button
                    @click="deleteBook(item.id)"
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
            <tr v-if="books.length === 0 && !loading" class="text-center">
              <td colspan="8">{{ $t('project.noRecord') }}</td>
            </tr>
            <tr v-if="loading" class="text-center">
              <td colspan="8"><b-spinner variant="primary" /></td>
            </tr>
          </b-tbody>
        </b-table-simple>
        <b-pagination
          v-if="pageSize < totalRows"
          v-model="pageNumber"
          :total-rows="totalRows"
          :per-page="pageSize"
          aria-controls="my-table"
        ></b-pagination>
      </b-card>
    </b-col>
    <b-col md="3">
      <add-book @refreshList="getBooks" />
    </b-col>
  </b-row>
</template>

<script>
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import EditBook from "./EditBook";
import AddBook from "./AddBook";

export default {
  components: {
    EditBook,
    AddBook
  },

  data() {
    return {
      books: [],
      pageSize: 10,
      pageNumber: 1,
      totalRows: null,
      loading: true,
      search: '',
    };
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [
      { title: 'project.adminPanel' },
      { title: 'project.bookTransactions' }
    ]);

    this.getBooks();
  },
  methods: {
    async getBooks() {
      try {
        this.loading = true;
        const { data } = await this.axios.get("admin/books", {
          params: { ...this.requestQuery }
        });
        this.books = data.rows;
        this.totalRows = data.count;
      } catch (e) {
        console.log(e);
      } finally {
        this.loading = false;
      }
    },

    async deleteBook(id) {
      try {
        const { isConfirmed } = await this.confirmDelete();

        if (isConfirmed) {
          await this.axios.delete("admin/books/" + id);

          this.toast({ message: 'deleteSuccess', item: 'book' });
          this.getBooks();
        }

      } catch (e) {
        this.toast({ type: "danger", message: "deleteError", item: "book" });
        console.log(e);
      }
    },

  },
  computed: {
    requestQuery() {
      return {
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
        search: this.search,
      };
    }
  },
  watch: {
    requestQuery() {
      this.getBooks();
    }
  }
};
</script>
