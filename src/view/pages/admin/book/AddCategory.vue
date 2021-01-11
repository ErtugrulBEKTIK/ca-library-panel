<template>
  <div>
    <b-row>
      <b-col xs="12">
        <vue-select
          :value="category"
          @search="search"
          @input="onChange"
          :placeholder="placeholder"
          :options="categories"
          :filterable="false"
          label="fullName"
        >

          <template #option="{ id, name}">
            <b-row>
              <b-col xs="12">
                <div class="font-weight-bold">
                  {{name}}
                  <span v-if="!id">(Yeni)</span>
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
        <div v-for="(a, i) in selectedCategories" :key="i" class="m-3">
          {{a.name}}
          <b-button
            @click="deleteCategory(i)"
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
      categories: [],
      category: '',
      selectedCategories: []
    };
  },
  methods: {
    async search(search, loading){
      try{
        loading(true);
        await this.searchCategory(search);
        loading(false);
      }catch (e) {
        loading(false);
      }
    },

    async searchCategory(search) {
      try {
        if(search.length > 2){

          const { data } = await this.axios.get("admin/categories", {
            params: {
              search
            }
          });

          let categories = data.rows.filter((category) => {
            return !this.selectedCategories.some(a => category.id === a.id)
          });

          if(categories.length === 0){
            categories = [
              {
                name: search
              }
            ];
          }

          this.categories = categories;

        }else{
          this.categories = [];
        }

      } catch (e) {
        console.log(e);
      }
    },

    reset(){
      this.category = null
    },

    onChange(value){
      this.selectedCategories.push(value);
      this.category = '';
      this.$emit('input', this.selectedCategories)
    },

    deleteCategory(index){
      this.selectedCategories.splice(index, 1);
      this.$emit('input', this.selectedCategories)
    }

  },
  watch: {
    value(val){
      this.selectedCategories = val
    }
  }
};
</script>

