<template>
  <div>
    <a href="#" @click="modal=true" class="btn btn-icon btn-light btn-sm">
      <span class="svg-icon svg-icon-md svg-icon-success">
        <inline-svg
          src="media/svg/icons/Navigation/Arrow-right.svg"
        />
      </span>
    </a>
    <b-modal v-model="modal" hide-header centered hide-footer>
      <b-tabs content-class="mt-3" v-if="!loading">
        <b-tab :title="$t('project.details')" active class="p-3">
          <b-row>
            <b-col md="4"><h6>{{ $t('project.rating') }}</h6></b-col>
            <b-col md="8">
              <b-form-rating
                v-if="book.comment.count !== 0"
                v-model="book.comment.rating"
                readonly variant="warning"
                no-border
                inline
                class="p-0"
                style="height: auto; width: 100px"
              />
              <span class="text-muted" v-if="book.comment.count !== 0"> ({{book.comment.rating}})</span>
              <span v-if="book.comment.count === 0">
                {{ $t('project.noRatings') }}
              </span>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="4"><h6>{{ $t('project.book') }}</h6></b-col>
            <b-col md="8">{{book.title}}</b-col>
          </b-row>
          <b-row>
            <b-col md="4"><h6>{{ $t('project.author') }}</h6></b-col>
            <b-col md="8">  {{ book.authors.map(a => a.fullName).join(', ') }}</b-col>
          </b-row>
          <b-row>
            <b-col md="4"><h6>{{ $t('project.category') }}</h6></b-col>
            <b-col md="8"> {{ book.categories.map(c => c.name).join(', ') }}</b-col>
          </b-row>
          <b-row>
            <b-col md="4"><h6>{{ $t('project.publisher') }}</h6></b-col>
            <b-col md="8"> {{ book.publisher }}</b-col>
          </b-row>
          <b-row>
            <b-col md="4"><h6>{{ $t('project.publishDate') }}</h6></b-col>
            <b-col md="8"> {{ book.year }}</b-col>
          </b-row>
          <b-row>
            <b-col md="4"><h6>{{ $t('project.status') }}</h6></b-col>
            <b-col md="8">
          <span v-if="book.status === BookStatus.AVAILABLE">
            {{ $t('project.onTheShelf') }}
          </span>
              <span v-if="book.status === BookStatus.BORROWED">
            {{ $t('project.outOfTheShelf') }}
          </span>
            </b-col>
          </b-row>
          <b-row class="mt-4 p-3">
            <button
              v-if="book.status === BookStatus.AVAILABLE"
              @click="barrow" class="btn btn-light-primary btn-bold w-100">
              {{ $t('project.borrow') }}
            </button>
            <button
              @click="addToWishList"
              class="btn btn-light-danger btn-bold w-100 mt-3">
              {{ $t('project.addToWishlist') }}
            </button>
          </b-row>
        </b-tab>
        <b-tab :title="$t('project.comments')+'('+book.comment.count+')'" class="p-3">
          <div v-if="book.comment.count === 0">
            {{ $t('project.noComments') }}
          </div>
          <div v-else>
            <div>
              <div v-for="comment in comments" :key="comment.id" class="d-flex flex-row mb-3">
                <a href="#" class="symbol symbol-60 symbol-light mr-3">
                  <div class="symbol-label">
                    <img :src="'media/svg/avatars/'+comment.avatar" alt="" class="h-75 align-self-end">
                  </div>
                </a>
                <div class="w-100">
                  <div class="d-flex flex-row justify-content-between align-content-start">
                    <div class="mb-2">
                      <h6 class="m-0"> {{comment.user}}</h6>
                      <span class="text-muted small">{{comment.createdAt | formatDate(1)}}</span>
                    </div>
                    <b-form-rating
                      v-model="comment.star"
                      readonly
                      variant="warning"
                      no-border
                      class="p-0"
                      style="width: 100px"
                    />
                  </div>
                  <div>{{comment.content}}</div>
                </div>
              </div>
            </div>
            <b-pagination
              v-if="pageSize < totalRows"
              v-model="pageNumber"
              :total-rows="totalRows"
              :per-page="pageSize"
              aria-controls="my-table"
            ></b-pagination>
          </div>
        </b-tab>
      </b-tabs>
      <div class="text-center" v-if="loading">
        <b-spinner variant="primary" />
      </div>
    </b-modal>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import Swal from "sweetalert2";
  import {BookStatus} from '@/core/data/enum'

  export default {
    props: ['book'],
    data(){
      return {
        BookStatus,
        modal: false,
        comments: [],
        pageSize: 10,
        pageNumber: 1,
        totalRows: null,
        loading: false
      }
    },
    methods: {
      async getComments() {
        try {
          const { data } = await this.axios.get("public/comments/"+this.book.id, {
            params: { ...this.requestQuery }
          });
          this.comments = data.rows;
          this.totalRows = data.count;
        } catch (e) {
          console.log(e);
        }
      },
      async checkUser(){
        // If Person is not authenticated, make alert
        if(!this.isAuthenticated){
          const { isConfirmed } = await Swal.fire({
            title: "",
            text: this.$t('project.loginFirst'),
            icon: "warning",
            confirmButtonColor: "#3699FF",
            confirmButtonText: this.$t('project.login'),
            cancelButtonText: this.$t('project.cancel'),
            showCancelButton: true,
            reverseButtons: true,
            heightAuto: false
          });
          if(isConfirmed){
            await this.$router.push('/login')
          }

          return false
        }
        return true
      },
      async barrow(){
        try {

          if(!await this.checkUser()){
            return false
          }

          const { isConfirmed } = await Swal.fire({
            title: "",
            text: this.$t('project.borrowConfirm'),
            icon: "warning",
            confirmButtonColor: "#3699FF",
            confirmButtonText: this.$t('project.confirm'),
            cancelButtonText: this.$t('project.cancel'),
            showCancelButton: true,
            reverseButtons: true,
            heightAuto: false
          });
          if(isConfirmed){
            this.loading = true;
            await this.axios.post("profile/bookings", {
              bookId: this.book.id
            });

            await this.$router.push('/profile/book-history');

            this.toast({ message: 'borrowSuccessful' });

          }

        } catch (e) {
          this.toast({ type: "danger", message: "somethingWentWrong" });
          console.log(e);
        }
      },
      async addToWishList(){
        try {

          if(!await this.checkUser()){
            return false
          }

          const { isConfirmed } = await Swal.fire({
            title: "",
            text: this.$t('project.wishListConfirm'),
            icon: "warning",
            confirmButtonColor: "#3699FF",
            confirmButtonText: this.$t('project.confirm'),
            cancelButtonText: this.$t('project.cancel'),
            showCancelButton: true,
            reverseButtons: true,
            heightAuto: false
          });
          if(isConfirmed){
            this.loading = true;
            await this.axios.post("profile/wishes", {
              bookId: this.book.id
            });

            this.modal = false;
            this.toast({ message: 'addToWishSuccessful' });

          }

        } catch (e) {
          this.toast({ type: "danger", message: "somethingWentWrong" });
          console.log(e);
        }
      }
    },
    computed: {
      ...mapGetters(["isAuthenticated"]),
      requestQuery() {
        return {
          pageSize: this.pageSize,
          pageNumber: this.pageNumber
        };
      }
    },
    watch: {
      modal(nv){
        if(nv){
          this.getComments()
        }
      }
    }

  }
</script>

<style scoped>

</style>
