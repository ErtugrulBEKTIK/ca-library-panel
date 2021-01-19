<template>
  <b-row>
    <b-col md="8">
      <b-card :title="$t('project.adminList')" v-if="currentUser.roleId === Roles.ADMIN" class="mb-4">
        <b-table-simple
          borderless
          :responsive="true"
          table-class="table-vertical-center"
        >
          <b-thead>
            <b-tr>
              <b-th>{{ $t('project.user') }}</b-th>
              <b-th>{{ $t('project.email') }}</b-th>
              <b-th>{{ $t('project.role') }}</b-th>
              <b-th>{{ $t('project.transaction') }}</b-th>
            </b-tr>
          </b-thead>
          <b-tbody>
            <template v-if="!adminLoading">
              <b-tr v-for="(item, i) in admins" :key="i">
                <b-td>
                  {{ item.fullName }}
                </b-td>
                <b-td>
                  {{ item.email }}
                </b-td>
                <b-td>
                  {{ item.role }}
                </b-td>
                <b-td>
                  <edit-user :user-id="item.id" @refreshList="getData" />
                  <b-button
                    @click="deleteUser(item.id)"
                    size="xs"
                    variant="light-danger"
                    class="btn-icon"
                  >
                    <span class="svg-icon">
                      <inline-svg src="/media/svg/icons/General/Trash.svg" />
                    </span>
                  </b-button>
                </b-td>
              </b-tr>
            </template>
            <tr v-if="admins.length === 0 && !adminLoading" class="text-center">
              <td colspan="4">{{ $t('project.noRecord') }}</td>
            </tr>
            <tr v-if="adminLoading" class="text-center">
              <td colspan="4"><b-spinner variant="primary" /></td>
            </tr>
          </b-tbody>
        </b-table-simple>
      </b-card>
      <b-card :title="$t('project.userList')">
        <b-table-simple
          borderless
          :responsive="true"
          table-class="table-vertical-center"
        >
          <b-thead>
            <b-tr>
              <b-th>{{ $t('project.user') }}</b-th>
              <b-th>{{ $t('project.email') }}</b-th>
              <b-th>{{ $t('project.transaction') }}</b-th>
            </b-tr>
          </b-thead>
          <b-tbody>
            <template v-if="!userLoading">
              <b-tr v-for="(item, i) in users" :key="i">
                <b-td>
                  {{ item.fullName }}
                </b-td>
                <b-td>
                  {{ item.email }}
                </b-td>
                <b-td>
                  <edit-user :user-id="item.id" @refreshList="getData" />
                  <b-button
                    @click="deleteUser(item.id)"
                    size="xs"
                    variant="light-danger"
                    class="btn-icon"
                  >
                    <span class="svg-icon">
                      <inline-svg src="/media/svg/icons/General/Trash.svg" />
                    </span>
                  </b-button>
                </b-td>
              </b-tr>
            </template>
            <tr v-if="users.length === 0 && !userLoading" class="text-center">
              <td colspan="3">{{ $t('project.noRecord') }}</td>
            </tr>
            <tr v-if="userLoading" class="text-center">
              <td colspan="3"><b-spinner variant="primary" /></td>
            </tr>
          </b-tbody>
        </b-table-simple>
        <b-pagination
          v-if="pageSize < totalRows"
          v-model="pageNumber"
          :total-rows="totalRows"
          :per-page="pageSize"
        ></b-pagination>
      </b-card>
    </b-col>
    <b-col md="4">
      <form-wrapper :validator="$v.createForm">
        <b-card :title="$t('project.addUser')">
          <b-row>
            <form-group name="firstName" xs="12" no-label>
              <b-input
                :placeholder="$t('project.firstName')"
                slot-scope="{ attrs, listeners }"
                v-bind="attrs"
                v-on="listeners"
                v-model="createForm.firstName"
              />
            </form-group>
          </b-row>
          <b-row>
            <form-group name="lastName" xs="12" no-label>
              <b-input
                :placeholder="$t('project.lastName')"
                slot-scope="{ attrs, listeners }"
                v-bind="attrs"
                v-on="listeners"
                v-model="createForm.lastName"
              />
            </form-group>
          </b-row>
          <b-row>
            <form-group name="email" xs="12" no-label>
              <b-input
                :placeholder="$t('project.email')"
                slot-scope="{ attrs, listeners }"
                v-bind="attrs"
                v-on="listeners"
                v-model="createForm.email"
              />
            </form-group>
          </b-row>
          <b-row v-if="currentUser.roleId === Roles.ADMIN">
            <form-group name="roleId" xs="12" no-label>
              <b-select
                slot-scope="{ attrs, listeners }"
                v-bind="attrs"
                v-on="listeners"
                v-model="createForm.roleId"
              >
                <b-select-option value="1">{{ $t('project.admin') }}</b-select-option>
                <b-select-option value="2">{{ $t('project.editor') }}</b-select-option>
                <b-select-option value="3">{{ $t('project.user') }}</b-select-option>
              </b-select>
            </form-group>
          </b-row>
          <b-row>
            <form-group name="password" xs="12" no-label>
              <b-input
                :placeholder="$t('project.password')"
                type="password"
                slot-scope="{ attrs, listeners }"
                v-bind="attrs"
                v-on="listeners"
                v-model="createForm.password"
              />
            </form-group>
          </b-row>
          <b-row>
            <form-group name="rePassword" xs="12" no-label>
              <b-input
                :placeholder="$t('project.reNewPassword')"
                type="password"
                slot-scope="{ attrs, listeners }"
                v-bind="attrs"
                v-on="listeners"
                v-model="createForm.rePassword"
              />
            </form-group>
          </b-row>
          <b-row>
            <b-col>
              <b-button @click="addUser">{{ $t('project.add') }}</b-button>
            </b-col>
          </b-row>
        </b-card>
      </form-wrapper>
    </b-col>
  </b-row>
</template>

<script>
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import {email, minLength, required, sameAs} from "vuelidate/lib/validators";
import {Roles} from "@/core/data/enum";
import EditUser from "./EditUser";
import {mapGetters} from "vuex";

export default {
  components: {
    EditUser
  },
  validations: {
    createForm: {
      firstName: { required },
      lastName: { required },
      email: {
        required,
        email
      },
      password: {
        required,
        minLength: minLength(6)
      },
      rePassword: { sameAs:sameAs('password') },
    }
  },
  data() {
    return {
      Roles,
      createForm: {
        firstName: "",
        lastName: "",
        email: "",
        roleId: Roles.BASIC_USER,
        password: "",
        rePassword: "",
      },
      admins: [],
      users: [],
      userLoading: true,
      adminLoading: true,
      pageSize: 10,
      pageNumber: 1,
      totalRows: null
    };
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [
      { title: 'project.adminPanel' },
      { title: 'project.userTransactions' }
    ]);

    this.getData();
  },
  methods: {
    getData(){
      this.getUsers();
      this.getAdmins();
    },
    async getAdmins() {
      try {
        this.adminLoading = true;
        const { data } = await this.axios.get("admin/admin-list");
        this.admins = data;
      } catch (e) {
        console.log(e);
      } finally {
        this.adminLoading = false;
      }
    },
    async getUsers() {
      try {
        this.userLoading = true;
        const { data } = await this.axios.get("admin/users", {
          params: { ...this.requestQuery }
        });
        this.users = data.rows;
        this.totalRows = data.count;
      } catch (e) {
        console.log(e);
      } finally {
        this.userLoading = false;
      }
    },

    async deleteUser(id) {
      try {
        const { isConfirmed } = await this.confirmDelete();

        if (!isConfirmed) return false;

        await this.axios.delete("admin/users/" + id);
        this.toast({ message: 'deleteSuccess', item: 'user' });
        this.getData();
      } catch (e) {
        this.toast({ type: "danger", message: "deleteError", item: "user" });
        console.log(e);
      }
    },

    async addUser() {
      try {
        this.$v.createForm.$touch();
        if (this.$v.createForm.$anyError) {
          this.toast({ type: 'danger', message: 'validationError' });
          return false;
        }
        await this.axios.post("admin/users", this.createForm);

        this.createForm = {
          firstName: "",
          lastName: "",
          email: "",
          roleId: 2,
          password: "",
          rePassword: "",
        };
        this.$v.createForm.$reset();

        this.toast({ message: 'createSuccess', item: 'user' });
        this.getData();
      } catch (e) {
        this.toast({ type: "danger", message: "createError", item: "user" });
        console.log(e);
      }
    }
  },
  computed: {
    ...mapGetters(['currentUser']),
    requestQuery() {
      return {
        pageSize: this.pageSize,
        pageNumber: this.pageNumber
      };
    }
  },
  watch: {
    requestQuery() {
      this.getAdmins();
      this.getUsers();
    }
  }
};
</script>
