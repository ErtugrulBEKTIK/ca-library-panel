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
      <b-tabs content-class="mt-3">
        <b-tab title="Detay" active class="p-3">
          <b-row>
            <b-col md="4"><h6>Puan</h6></b-col>
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
                Hiç Puan yok
              </span>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="4"><h6>Kitap</h6></b-col>
            <b-col md="8">{{book.title}}</b-col>
          </b-row>
          <b-row>
            <b-col md="4"><h6>Yazar</h6></b-col>
            <b-col md="8">  {{ book.authors.map(a => a.fullName).join(', ') }}</b-col>
          </b-row>
          <b-row>
            <b-col md="4"><h6>Kategori</h6></b-col>
            <b-col md="8"> {{ book.categories.map(c => c.name).join(', ') }}</b-col>
          </b-row>
          <b-row>
            <b-col md="4"><h6>Basım Evi</h6></b-col>
            <b-col md="8"> {{ book.publisher }}</b-col>
          </b-row>
          <b-row>
            <b-col md="4"><h6>Basım Yılı</h6></b-col>
            <b-col md="8"> {{ book.year }}</b-col>
          </b-row>
          <b-row>
            <b-col md="4"><h6>Durumu</h6></b-col>
            <b-col md="8">
          <span v-if="book.status === BookStatus.AVAILABLE">
            Rafta
          </span>
              <span v-if="book.status === BookStatus.BORROWED">
            Dışarıda
          </span>
            </b-col>
          </b-row>
          <b-row class="mt-4 p-3">
            <button
              v-if="book.status === BookStatus.AVAILABLE"
              @click="barrow" class="btn btn-light-primary btn-bold w-100">
              Ödünç Al
            </button>
            <button
              @click="addToWishList"
              class="btn btn-light-danger btn-bold w-100 mt-3">
              İstek Listeme Ekle
            </button>
          </b-row>
        </b-tab>
        <b-tab :title="'Yorumlar('+book.comment.count+')'" class="p-3">
          <div v-if="book.comment.count === 0">
            Henüz hiç değerlendirme yapılmamış
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
                      <span class="text-muted small">{{comment.createdAt | formatDate(2)}}</span>
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
            text: 'Kitap ödünç alabilmek için giriş yapmanız gerekiyor',
            icon: "warning",
            confirmButtonColor: "#3699FF",
            confirmButtonText: "Giriş Yap",
            cancelButtonText: 'İptal',
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
            text: 'Kitabı ödünç almak istediğinize emin misiniz?',
            icon: "warning",
            confirmButtonColor: "#3699FF",
            confirmButtonText: "Onayla",
            cancelButtonText: 'İptal',
            showCancelButton: true,
            reverseButtons: true,
            heightAuto: false
          });
          if(isConfirmed){
            await this.axios.post("profile/bookings", {
              bookId: this.book.id
            });

            await this.$router.push('/profile/book-history');

            this.toast({ message: 'createSuccess', item: 'book' });

          }

        }catch (e) {
          this.toast({ type: "danger", message: "createError", item: "book" });

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
            text: 'Kitabı istek listenize eklemek istediğinize emin misiniz?',
            icon: "warning",
            confirmButtonColor: "#3699FF",
            confirmButtonText: "Onayla",
            cancelButtonText: 'İptal',
            showCancelButton: true,
            reverseButtons: true,
            heightAuto: false
          });
          if(isConfirmed){
            await this.axios.post("profile/wishes", {
              bookId: this.book.id
            });

            this.modal = false;
            this.toast({ message: 'createSuccess', item: 'book' });

          }

        }catch (e) {
          this.toast({ type: "danger", message: "createError", item: "book" });

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