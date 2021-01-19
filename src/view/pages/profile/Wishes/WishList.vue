<template>
  <div class="card card-custom">
    <div class="card-header py-3">
      <div class="card-title align-items-start flex-column">
        <h3 class="card-label font-weight-bolder text-dark">
          {{ $t('project.wishList') }}
        </h3>
        <span class="text-muted font-weight-bold font-size-sm mt-1">
          {{ $t('project.wishListInfo') }}
        </span>
      </div>
    </div>
    <div class="card-body">
      <div class="table-responsive">
        <table class="table table-head-custom table-vertical-center">
          <thead>
            <tr class="text-left">
              <th class="pl-0" style="min-width: 120px">{{ $t('project.book') }}</th>
              <th style="min-width: 120px">{{ $t('project.status') }}</th>
              <th class="pr-0" style="min-width: 50px">{{ $t('project.transaction') }}</th>
            </tr>
          </thead>
          <tbody>
          <template v-for="(item, i) in wishes">
            <tr :key="i">
              <td class="pl-0">
                 <span class="text-dark-75 font-weight-bolder d-block font-size-lg">
                   {{ item.bookTitle }}
                 </span>
              </td>
              <td>
                <span
                  v-if="item.status === BookStatus.BORROWED"
                  class="label label-lg label-inline label-light-danger">
                  {{ $t('project.outOfTheShelf') }}
                </span>
                <span
                  v-if="item.status === BookStatus.AVAILABLE"
                  class="label label-lg label-inline label-light-success">
                  {{ $t('project.onTheShelf') }}
                </span>
              </td>
              <td class="pr-0">
                <a
                  href="#"
                  @click="removeWish(item.id)"
                  class="btn btn-icon btn-light btn-hover-primary btn-sm"
                  v-b-tooltip="$t('project.remove')"
                >
                  <span class="svg-icon svg-icon-md svg-icon-primary">
                    <inline-svg src="/media/svg/icons/General/Trash.svg" />
                  </span>
                </a>
                <a href="#"
                   v-if="item.status === BookStatus.AVAILABLE"
                   @click="barrow(item.bookId)"
                   v-b-tooltip="$t('project.borrow')"
                   class="btn btn-icon btn-light btn-hover-primary btn-sm ml-2">
                  <span class="svg-icon svg-icon-md svg-icon-primary">
                    <inline-svg
                      src="/media/svg/icons/Navigation/Arrow-right.svg"
                    />
                  </span>
                </a>
              </td>
            </tr>
          </template>
          <tr v-if="wishes.length === 0" class="text-center">
            <td colspan="3">{{ $t('project.noRecord') }}</td>
          </tr>
          </tbody>
        </table>
      </div>
      <b-pagination
        v-model="pageNumber"
        :total-rows="totalRows"
        :per-page="pageSize"
        aria-controls="my-table"
      ></b-pagination>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from "vuex";
  import {SET_BREADCRUMB} from "@/core/services/store/breadcrumbs.module";
  import {BookStatus} from '@/core/data/enum'
  import Swal from "sweetalert2";

  export default {

    data() {
      return {
        BookStatus,
        modal: false,
        wishes: [],
        pageSize: 10,
        pageNumber: 1,
        totalRows: null,
      };
    },
    mounted() {
      this.$store.dispatch(SET_BREADCRUMB, [
        { title: this.$t('project.profile') },
        { title: this.$t('project.wishList') }
      ]);

      this.getWishes()
    },
    methods: {
      ...mapMutations(["setUser"]),
      async getWishes() {
        try {
          const { data } = await this.axios.get("profile/wishes", {
            params: { ...this.requestQuery }
          });
          this.wishes = data.rows;
          this.totalRows = data.count;
        } catch (e) {
          console.log(e);
        }
      },
      async removeWish(wishId) {
        try {
          const { isConfirmed } = await Swal.fire({
            title: "",
            text: this.$t('project.removeConfirm'),
            icon: "warning",
            confirmButtonColor: "#3699FF",
            confirmButtonText: this.$t('project.confirm'),
            cancelButtonText: this.$t('project.cancel'),
            showCancelButton: true,
            reverseButtons: true,
            heightAuto: false
          });

          if(!isConfirmed) return false;

          await this.axios.delete("profile/wishes", {
            params: {
              wishId
            }
          });

          this.toast({ message: 'deleteSuccess', item: 'book' });

          this.getWishes()
        } catch (e) {
          this.toast({ type: "danger", message: "deleteError", item: "book" });
          console.log(e);
        }
      },
      async submit() {
        try {
          this.$v.form.$touch();
          if (this.$v.form.$anyError) {
            this.toast({ type: 'danger', message: 'validationError' });
            return false;
          }
          await this.axios.patch("profile/detail", this.form);

          this.$v.form.$reset();

          this.setUser({
            ...this.form,
            token: this.currentUser.token
          });

          this.toast({ message: 'updateSuccess', item: 'profile' });

        } catch (e) {
          this.toast({ type: "danger", message: "updateError", item: "profile" });
          console.log(e);
        }
      },
      async barrow(bookId){
        try {

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
            await this.axios.post("profile/bookings", {
              bookId
            });

            await this.$router.push('/profile/book-history');

            this.toast({ message: 'createSuccess', item: 'book' });

          }

        }catch (e) {
          this.toast({ type: "danger", message: "createError", item: "book" });

          console.log(e);
        }
      },
    },
    computed: {
      ...mapGetters(["currentUser"]),
      requestQuery() {
        return {
          pageSize: this.pageSize,
          pageNumber: this.pageNumber
        };
      }
    }
  };
</script>
