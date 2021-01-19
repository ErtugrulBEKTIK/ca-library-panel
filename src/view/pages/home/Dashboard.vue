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
            :placeholder="$t('project.selectCategory')"
            v-model="selectedCategories"
            :options="categories"
            :normalizer="normalizer"
          />
        </b-col>
        <b-col md="5">
          <b-input-group>
            <b-input :placeholder="$t('project.searchBookName')" v-model="search" />
            <template #append>
              <b-input-group-text class="p-1 pl-3 pr-3">
                <inline-svg src="media/svg/icons/General/Search.svg" />
              </b-input-group-text>
            </template>
          </b-input-group>
        </b-col>
        <b-col md="3">
          <b-button block @click="getBooks">
            {{ $t('project.search') }}
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
            <b-th style="width: 200px">{{ $t('project.title') }}</b-th>
            <b-th style="min-width: 150px">{{ $t('project.author') }}</b-th>
            <b-th style="min-width: 150px">{{ $t('project.category') }}</b-th>
            <b-th style="min-width: 140px">{{ $t('project.publisher') }}</b-th>
            <b-th style="min-width: 110px">{{ $t('project.publishDate') }}</b-th>
            <b-th style="min-width: 110px">{{ $t('project.status') }}</b-th>
            <b-th style="min-width: 50px">{{ $t('project.transaction') }}</b-th>
          </b-tr>
        </b-thead>
        <b-tbody>
          <template v-if="!loading">
            <b-tr v-for="(item, i) in books" :key="i">
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
                  v-if="item.status === BookStatus.AVAILABLE"
                  class="label label-lg label-inline label-light-success">
                  {{ $t('project.onTheShelf') }}
                </span>
                <span
                  v-if="item.status === BookStatus.BORROWED"
                  class="label label-lg label-inline label-light-danger">
                  {{ $t('project.outOfTheShelf') }}
                </span>
              </b-td>
              <b-td class="pr-0">
                <book-modal :book="item"/>
              </b-td>
            </b-tr>
          </template>
          <b-tr v-if="loading" class="text-center">
            <b-td colspan="7">
              <b-spinner variant="primary" />
            </b-td>
          </b-tr>
        </b-tbody>
      </b-table-simple>
    </b-card>
  </div>
</template>

<script>
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import Treeselect from '@riophae/vue-treeselect'
import BookModal from './BookModal'
import {BookStatus} from '@/core/data/enum'

export default {
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "project.bookList" }]);
    this.getBooks();
    this.getCategories()
  },
  components: {
    Treeselect,
    BookModal
  },
  data() {
    return {
      BookStatus,
      books: [],
      categories: [],
      selectedCategories: [],
      search: '',
      loading: true,
      pageSize: 10,
      pageNumber: 1,
      totalRows: null,
    };
  },
  methods: {
    async getBooks() {
      try {
        this.loading = true;
        const { data } = await this.axios.post("public/books", { ...this.requestQuery });
        this.books = data.rows;
        this.totalRows = data.count;
      } catch (e) {
        console.log(e);
      } finally {
        this.loading = false
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
        ...this.pagination,
        search: this.search,
        categories: this.selectedCategories
      };
    },
    pagination() {
      return {
        pageSize: this.pageSize,
        pageNumber: this.pageNumber
      };
    },
  },
  watch: {
    pagination: {
      handler: "getBooks",
      deep: true
    }
  }
};
</script>
