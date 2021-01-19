<template>
  <div style="display: inline">
    <b-button
      size="xs"
      variant="light-primary"
      class="btn-icon mr-2"
      @click="modal = true"
    >
      <span class="svg-icon">
        <inline-svg src="/media/svg/icons/Design/Edit.svg" />
      </span>
    </b-button>
    <b-modal
      v-model="modal"
      @close="onClose"
      :title="$t('common.edit')"
      size="md"
      no-close-on-esc
      no-close-on-backdrop
    >
      <form-wrapper :validator="$v.form" class="av-tooltip tooltip-right-top">
        <b-row>
          <form-group name="firstName" xs="12" :label="$t('project.firstName')">
            <b-input
              slot-scope="{ attrs, listeners }"
              v-bind="attrs"
              v-on="listeners"
              v-model="form.firstName"
            />
          </form-group>
          <form-group name="lastName" xs="12" :label="$t('project.lastName')">
            <b-input
              slot-scope="{ attrs, listeners }"
              v-bind="attrs"
              v-on="listeners"
              v-model="form.lastName"
            />
          </form-group>
        </b-row>
        <b-row>
          <form-group name="email" xs="12" :label="$t('project.email')">
            <b-input
              slot-scope="{ attrs, listeners }"
              v-bind="attrs"
              v-on="listeners"
              v-model="form.email"
            />
          </form-group>
          <form-group name="roleId" xs="12" :label="$t('project.role')" v-if="currentUser.roleId === Roles.ADMIN">
            <b-select
              slot-scope="{ attrs, listeners }"
              v-bind="attrs"
              v-on="listeners"
              v-model="form.roleId"
            >
              <b-select-option value="1">Admin</b-select-option>
              <b-select-option value="2">Editor</b-select-option>
              <b-select-option value="3">Basic User</b-select-option>
            </b-select>
          </form-group>
        </b-row>
      </form-wrapper>
      <template slot="modal-footer">
        <b-button variant="light" @click="onClose">{{
          $t("common.cancel")
        }}</b-button>
        <b-button
          variant="primary"
          @click="submitForm"
          :disabled="$v.$anyError || saved"
          class="mr-1"
          >{{ $t("common.save") }}</b-button
        >
      </template>
    </b-modal>
  </div>
</template>

<script>
  import {email, required} from "vuelidate/lib/validators";
  import {mapGetters} from "vuex";
  import {Roles} from "@/core/data/enum";
export default {
  props: ["userId"],
  validations: {
    form: {
      firstName: { required },
      lastName: { required },
      email: {
        required,
        email
      },
      description: {}
    }
  },
  data() {
    return {
      Roles,
      modal: false,
      countries: [],
      form: {
        firstName: "",
        lastName: "",
        email: "",
        roleId: null,
      },
      saved: true
    };
  },
  methods: {
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
    async getUser() {
      try {
        const { data } = await this.axios.get("admin/users/" + this.userId);
        this.form = data;
        setTimeout(() => {
          this.saved = true;
        }, 200);
      } catch (e) {
        console.log(e);
      }
    },
    async submitForm() {
      try {
        this.$v.$touch();
        if (this.$v.$anyError) {
          this.toast({ type: 'danger', message: 'validationError' });
          return false;
        }

        await this.axios.patch("admin/users/" + this.userId, this.form);
        this.$emit("refreshList");
        this.saved = true;
        this.modal = false;
        this.toast({ message: 'updateSuccess', item: 'user' });

      } catch (e) {
        this.toast({ type: "danger", message: "updateError", item: "user" });
        console.log(e);
      }
    }
  },
  computed: {
    ...mapGetters(['currentUser']),
  },
  watch: {
    modal(nv) {
      if (nv) {
        this.getUser();
        this.$v.$reset();
      }
    },
    form: {
      handler() {
        this.saved = false;
      },
      deep: true
    }
  }
};
</script>
