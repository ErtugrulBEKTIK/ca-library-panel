<template>
  <div>
    <a href="#" @click="modal=true" class="btn btn-icon btn-light btn-sm">
      <span class="svg-icon svg-icon-md svg-icon-primary">
        <inline-svg src="/media/svg/icons/Communication/Chat6.svg"/>
      </span>
    </a>
    <b-modal :title="$t('project.toComment')" v-model="modal" centered @close="onClose" no-close-on-backdrop no-close-on-esc>
      <div v-if="!loading">
        <form-group xs="12" no-label no-margin>
          <b-form-rating v-model="form.star" variant="warning"/>
        </form-group>
        <form-group xs="12">
          <b-form-textarea :placeholder="$t('project.toComment')" rows="5" v-model="form.content" />
        </form-group>
      </div>
      <div class="text-center" v-if="loading">
        <b-spinner variant="primary" />
      </div>
      <template slot="modal-footer">
        <b-button variant="light" @click="onClose">
          {{ $t("common.cancel") }}
        </b-button>
        <b-button
          variant="primary"
          @click="submit"
          :disabled="saved || submitting"
          class="mr-1">
          {{ $t("common.save") }} <b-spinner small v-if="submitting" />
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
  import {BookStatus} from '@/core/data/enum'

  export default {
    props: ['booking'],
    data(){
      return {
        BookStatus,
        modal: false,
        form: {
          star: 0,
          content: ''
        },
        loading: true,
        submitting: false,
        saved: false,
        isNew: true
      }
    },
    methods: {
      async getComment() {
        try {
          this.loading = true;
          const { data } = await this.axios.get("profile/comments", {
            params: {
              bookId: this.booking.bookId
            }
          });

          if(data){
            this.form = data;
            this.isNew = false;
          }else{
            this.form = {
              star: 0,
              content: ''
            }
          }


          setTimeout(() => {
            this.saved = true;
          }, 200);
        } catch (e) {
          console.log(e);
        } finally {
          this.loading = false;
        }
      },
      async submit(){
        try {
          this.submitting = true;
          const method = this.isNew ? 'post' : 'patch';
          await this.axios[method]("profile/comments", {
            bookId: this.booking.bookId,
            ...this.form
          });

          this.modal = false;
          this.toast({ message: 'createSuccess', item: 'book' });

        }catch (e) {
          this.toast({ type: "danger", message: "createError", item: "book" });
          console.log(e);
        } finally {
          this.submitting = false;
        }
      },
      onClose(bvModalEvt) {
        bvModalEvt.preventDefault();
        if (this.saved) {
          this.modal = false;
        } else {
          this.confirmChanges().then(result => {
            if (result.value) {
              this.submitForm();
            } else {
              this.modal = false;
            }
          });
        }
      },
    },
    computed: {
    },
    watch: {
      modal(nv){
        if(nv){
          this.getComment()
        }
      },
      form: {
        handler() {
          this.saved = false;
        },
        deep: true
      }
    }

  }
</script>

<style scoped>

</style>
