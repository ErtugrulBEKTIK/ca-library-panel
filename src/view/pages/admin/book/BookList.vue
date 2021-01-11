<template>
  <b-row>
    <b-col md="9">
      <b-card>
        <b-row class="mb-5">
          <b-col md="6">
            <h4 class="mt-2">Kitap Listesi</h4>
          </b-col>
          <b-col md="6">
            <b-input
              placeholder="Ara"
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
              <b-th>Kitap Adı</b-th>
              <b-th>Yazar(lar)</b-th>
              <b-th>Kategoriler</b-th>
              <b-th>Yayın Evi</b-th>
              <b-th>Basım Yılı</b-th>
              <b-th>Raf</b-th>
              <b-th>Barkod</b-th>
              <b-th>İşlem</b-th>
            </b-tr>
          </b-thead>
          <b-tbody>
            <template v-for="(item, i) in books">
              <b-tr :key="i">
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
      search: '',
    };
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [
      { title: "Yönetim Paneli" },
      { title: "Kitap İşlemleri" }
    ]);

    this.getBooks();
  },
  methods: {
    async getBooks() {
      try {
        const { data } = await this.axios.get("admin/books", {
          params: { ...this.requestQuery }
        });
        this.books = data.rows;
        this.totalRows = data.count;
      } catch (e) {
        console.log(e);
      }
    },

    async deleteBook(id) {
      try {
        const { isConfirmed } = await this.confirmDelete();

        if (isConfirmed) {
          await this.axios.delete("admin/books/" + id);
        }

        this.toast({ message: 'deleteSuccess', item: 'book' });
        this.getBooks();
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