<template>
  <div>
    <b-row>
      <b-col xs="12">
        <vue-select
          :value="author"
          @search="search"
          @input="onChange"
          :placeholder="placeholder"
          :options="authors"
          :filterable="false"
          label="fullName"
        >

          <template #option="{ id, fullName}">
            <b-row>
              <b-col xs="12">
                <div class="font-weight-bold">
                  {{fullName}}
                  <span v-if="!id">({{ $t('project.newAuthor') }})</span>
                </div>
              </b-col>
            </b-row>
          </template>
          <template #no-options="{ search, searching, loading }">
            {{$t('validation.threeChrForSearch')}}
          </template>
        </vue-select>
      </b-col>
    </b-row>
    <b-row>
      <b-col xs="12">
        <div v-for="(a, i) in selectedAuthors" :key="i" class="m-3">
          {{a.fullName}}
          <b-button
            @click="deleteAuthor(i)"
            size="xs"
            variant="light-danger"
            class="btn-icon float-right"
          >
            <span class="svg-icon">
              <inline-svg src="/media/svg/icons/General/Trash.svg" />
            </span>
          </b-button>
        </div>
      </b-col>
    </b-row>

  </div>
</template>

<script>
  import vueSelect from "vue-select";
  import { required } from "vuelidate/lib/validators";

export default {
  props: ["value", 'placeholder'],
  components: {
    vueSelect
  },
  validations: {
    form: {
      fullName: { required },
      description: {}
    }
  },
  data() {
    return {
      authors: [],
      author: '',
      selectedAuthors: []
    };
  },
  methods: {
    async search(search, loading){
      try{
        loading(true);
        await this.searchAuthor(search);
        loading(false);
      }catch (e) {
        loading(false);
      }
    },

    async searchAuthor(search) {
      try {
        if(search.length > 2){

          const { data } = await this.axios.get("admin/authors", {
            params: {
              search
            }
          });

          let authors = data.rows.filter((author) => {
            return !this.selectedAuthors.some(a => author.id === a.id)
          });

          if(authors.length === 0){
            authors = [
              {
                fullName: search
              }
            ];
          }

          this.authors = authors;

        }else{
          this.authors = [];
        }

      } catch (e) {
        console.log(e);
      }
    },

    reset(){
      this.author = null
    },

    onChange(value){
      this.selectedAuthors.push(value);
      this.author = '';
      this.$emit('input', this.selectedAuthors)
    },

    deleteAuthor(index){
      this.selectedAuthors.splice(index, 1);
      this.$emit('input', this.selectedAuthors)
    }

  },
  watch: {
    value(val){
      this.selectedAuthors = val
    }
  }
};
</script>

