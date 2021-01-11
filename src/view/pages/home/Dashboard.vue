<template>
  <div>
    <!--begin::Dashboard-->

    <b-card class="mb-5">
      <b-row>
        <b-col md="4">
          <treeselect
            :multiple="true"
            :limit="2"
            :max-height="150"
            :noOptionsText="$t('common.treeSelectNoOption')"
            :limitText="count => $t('common.treeSelectLimit', {count})"
            placeholder=""
            v-model="selectedCategories"
            :options="categories"
            :normalizer="normalizer"
          />
        </b-col>
        <b-col md="5">
          <b-input-group>
            <b-input placeholder="Kitap Adı Ara" v-model="search" />
            <template #append>
              <b-input-group-text class="p-1 pl-3 pr-3">
                <inline-svg src="media/svg/icons/General/Search.svg" />
              </b-input-group-text>
            </template>
          </b-input-group>
        </b-col>
        <b-col md="3">
          <b-button block @click="getBooks">
            Ara
          </b-button>
        </b-col>
      </b-row>
    </b-card>

    <b-card class="mb-5">
      <b-table-simple
        borderless
        :responsive="true"
        table-class="table-vertical-center"
      >
        <b-thead>
          <b-tr>
            <b-th style="width: 200px">Başlık</b-th>
            <b-th style="min-width: 150px">Yazar</b-th>
            <b-th style="min-width: 150px">Kategori</b-th>
            <b-th style="min-width: 140px">Basım Evi</b-th>
            <b-th style="min-width: 110px">Basım Yılı</b-th>
            <b-th style="min-width: 110px">Durumu</b-th>
            <b-th style="min-width: 50px">İşlem</b-th>
          </b-tr>
        </b-thead>
        <b-tbody>
          <template v-for="(item, i) in books">
            <b-tr v-bind:key="i">
              <b-td>
                <span
                  class="font-weight-bolder text-hover-primary font-size-lg"
                >
                  {{ item.title }}
                </span>
              </b-td>
              <b-td class="pl-0">
                <span class="text-muted font-weight-500">
                  {{ item.authors.map(a => a.fullName).join(', ') }}
                </span>
              </b-td>
              <b-td class="pl-0">
                <span class="text-muted font-weight-500">
                  {{ item.categories.map(c => c.name).join(', ') }}
                </span>
              </b-td>
              <b-td>
                <span class="text-muted font-weight-500">
                  {{ item.publisher }}
                </span>
              </b-td>
              <b-td>
                <span class="text-muted font-weight-500">
                  {{ item.year }}
                </span>
              </b-td>
              <b-td>
                <span
                  class="label label-lg label-inline"
                  v-bind:class="`label-light-${item.status ? 'success': 'danger'}`"
                  >{{ item.status ? 'Rafta' : 'Ödünç Verildi' }}</span
                >
              </b-td>
              <b-td class="pr-0">
                <a href="#" class="btn btn-icon btn-light btn-sm">
                  <span class="svg-icon svg-icon-md svg-icon-success">
                    <inline-svg
                      src="media/svg/icons/Navigation/Arrow-right.svg"
                    />
                  </span>
                </a>
              </b-td>
            </b-tr>
          </template>
        </b-tbody>
      </b-table-simple>
    </b-card>
  </div>
</template>

<script>
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import Treeselect from '@riophae/vue-treeselect'

export default {
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Kitap Listesi" }]);
    this.getBooks();
    this.getCategories()
  },
  components: {
    Treeselect,
  },
  data() {
    return {
      books: [],
      categories: [],
      selectedCategories: [],
      search: '',
      pageSize: 10,
      pageNumber: 1,
      totalRows: null,
    };
  },
  methods: {
    async getBooks() {
      try {
        const { data } = await this.axios.post("public/books", { ...this.requestQuery });
        this.books = data.rows;
        this.totalRows = data.count;
      } catch (e) {
        console.log(e);
      }
    },
    async getCategories() {
      try {
        const { data } = await this.axios.get("public/categories");
        this.categories = data;
      } catch (e) {
        console.log(e);
      }
    },
    normalizer(node) {
      return {
        id: node.id,
        label: node.name,
      }
    },
  },
  computed: {
    requestQuery() {
      return {
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
        search: this.search,
        categories: this.selectedCategories
      };
    }
  },
};
</script>
