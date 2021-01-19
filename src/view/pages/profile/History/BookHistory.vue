<template>
  <div class="card card-custom">
    <div class="card-header py-3">
      <div class="card-title align-items-start flex-column">
        <h3 class="card-label font-weight-bolder text-dark">
          {{ $t('project.bookHistory') }}
        </h3>
        <span class="text-muted font-weight-bold font-size-sm mt-1">
          {{ $t('project.bookHistoryInfo') }}
        </span>
      </div>
    </div>
    <div class="card-body">
      <div class="table-responsive">
        <table class="table table-head-custom table-vertical-center">
          <thead>
            <tr class="text-left">
              <th class="pl-0" style="min-width: 120px">{{ $t('project.book') }}</th>
              <th style="min-width: 110px">{{ $t('project.receivedDate') }}</th>
              <th style="min-width: 110px">{{ $t('project.returnedDate') }}</th>
              <th style="min-width: 120px">{{ $t('project.status') }}</th>
              <th class="pr-0" style="min-width: 50px">{{ $t('project.transaction') }}</th>
            </tr>
          </thead>
          <tbody>
          <template v-for="(item, i) in bookings">
            <tr :key="i">
              <td class="pl-0">
                 <span class="text-dark-75 font-weight-bolder d-block font-size-lg">
                   {{ item.bookTitle }}
                 </span>
              </td>
              <td>
                 <span class="text-dark-75 font-weight-bolder d-block font-size-lg">
                   {{ item.startDate | formatDate(1) }}
                 </span>
              </td>
              <td>
                 <span class="text-dark-75 font-weight-bolder d-block font-size-lg">
                   {{ item.endDate | formatDate(1) }}
                 </span>
              </td>
              <td>
                <span
                  v-if="item.status === BookingStatus.BORROWED"
                  class="label label-lg label-inline label-light-success">
                  {{ $t('project.borrowed') }}
                </span>
                <span
                  v-if="item.status === BookingStatus.RETURNED"
                  class="label label-lg label-inline label-light-danger">
                  {{ $t('project.returned') }}
                </span>
              </td>
              <td class="pr-0">
                <a
                  href="#"
                  v-if="item.status === BookingStatus.BORROWED"
                  @click="returnBook(item.id)"
                  class="btn btn-icon btn-light btn-hover-primary btn-sm"
                  v-b-tooltip="$t('project.return')"
                >
                  <span class="svg-icon svg-icon-md svg-icon-primary">
                    <inline-svg src="/media/svg/icons/Media/Repeat.svg"/>
                  </span>
                </a>
                <comment-modal v-if="item.status === BookingStatus.RETURNED"
                               :booking="item"
                               class="btn btn-icon btn-light btn-sm"
                               v-b-tooltip:v-b-hover="$t('project.comment')"/>
              </td>
            </tr>
          </template>
          <tr v-if="bookings.length === 0" class="text-center">
            <td colspan="5">{{ $t('project.noRecord') }}</td>
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
  import {BookingStatus} from '@/core/data/enum'
  import Swal from "sweetalert2";
  import CommentModal from "./CommentModal";

  export default {
    components: {
      CommentModal
    },
    data() {
      return {
        BookingStatus,
        modal: false,
        bookings: [],
        pageSize: 10,
        pageNumber: 1,
        totalRows: null,
      };
    },
    mounted() {
      this.$store.dispatch(SET_BREADCRUMB, [
        { title: this.$t('project.profile') },
        { title: this.$t('project.bookHistory') }
      ]);

      this.getBookings()
    },
    methods: {
      ...mapMutations(["setUser"]),
      async getBookings() {
        try {
          const { data } = await this.axios.get("profile/bookings", {
            params: { ...this.requestQuery }
          });
          this.bookings = data.rows;
          this.totalRows = data.count;
        } catch (e) {
          console.log(e);
        }
      },
      async returnBook(bookingId) {
        try {
          const { isConfirmed } = await Swal.fire({
            title: "",
            text: this.$t('project.returnConfirm'),
            icon: "warning",
            confirmButtonColor: "#3699FF",
            confirmButtonText: this.$t('project.confirm'),
            cancelButtonText: this.$t('project.cancel'),
            showCancelButton: true,
            reverseButtons: true,
            heightAuto: false
          });

          if(!isConfirmed) return false;

          await this.axios.patch("profile/bookings", {
            bookingId
          });

          this.toast({ message: 'deleteSuccess', item: 'book' });

          this.getBookings()
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
      }
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
