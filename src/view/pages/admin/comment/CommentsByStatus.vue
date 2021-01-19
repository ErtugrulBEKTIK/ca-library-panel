<template>
  <div>
    <b-table-simple
      borderless
      :responsive="true"
      table-class="table-vertical-center"
    >
      <b-thead>
        <b-tr>
          <b-th style="min-width: 150px">{{ $t('project.user') }}</b-th>
          <b-th>{{ $t('project.book') }}</b-th>
          <b-th>{{ $t('project.comment') }}</b-th>
          <b-th>{{ $t('project.rating') }}</b-th>
          <b-th style="min-width: 80px">{{ $t('project.transaction') }}</b-th>
        </b-tr>
      </b-thead>
      <b-tbody>
        <template v-for="(item, i) in comments">
          <b-tr :key="i">
            <b-td>{{ item.user }}</b-td>
            <b-td>{{ item.book }}</b-td>
            <b-td>{{ item.content }}</b-td>
            <b-td>
              <b-form-rating
                v-model="item.star"
                readonly variant="warning"
                no-border
                inline
                class="p-0"
                style="height: auto; width: 100px"
              />
            </b-td>
            <b-td>
              <b-button
                v-if="!status"
                @click="approveComment(item.id)"
                size="xs"
                variant="light-primary"
                class="btn-icon mr-2"
                v-b-tooltip="$t('project.approve')"
              >
                <span class="svg-icon">
                  <inline-svg src="/media/svg/icons/Navigation/Check.svg" />
                </span>
              </b-button>
              <b-button
                @click="deleteComment(item.id)"
                size="xs"
                variant="light-danger"
                class="btn-icon"
                v-b-tooltip="$t('project.remove')"
              >
                <span class="svg-icon">
                  <inline-svg src="/media/svg/icons/General/Trash.svg" />
                </span>
              </b-button>
            </b-td>
          </b-tr>
        </template>
        <tr v-if="comments.length === 0" class="text-center">
          <td colspan="5">{{ $t('project.noRecord') }}</td>
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
  </div>
</template>

<script>
import EventBus, {REFRESH_COMMENTS} from '@/event-bus'
export default {
  props: ['status'],
  data() {
    return {
      comments: [],
      pageSize: 10,
      pageNumber: 1,
      totalRows: null
    };
  },
  mounted() {
    this.getComments();
    EventBus.$on(REFRESH_COMMENTS, () => {
      this.getComments();
    })
  },
  methods: {
    async getComments() {
      try {
        const { data } = await this.axios.get("admin/comments", {
          params: {
            ...this.requestQuery,
            status: this.status
          }
        });
        this.comments = data.rows;
      } catch (e) {
        console.log(e);
      }
    },

    async deleteComment(id) {
      try {
        const { isConfirmed } = await this.confirmDelete();

        if (!isConfirmed) return false;

        await this.axios.delete("admin/comments/" + id);
        this.toast({ message: 'deleteSuccess', item: 'comment' });
        this.getComments();
      } catch (e) {
        this.toast({ type: "danger", message: "deleteError", item: "comment" });
        console.log(e);
      }
    },

    async approveComment(commentId) {
      try {

        await this.axios.patch("admin/comments/"+commentId);

        this.toast({ message: 'updateSuccess', item: 'comment' });
        EventBus.$emit(REFRESH_COMMENTS)
      } catch (e) {
        this.toast({ type: "danger", message: "updateError", item: "comment" });
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
      this.getComments();
    }
  },
  beforeRouteLeave(){
    EventBus.$off()
  }
};
</script>
