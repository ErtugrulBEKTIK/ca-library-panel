<template>
  <b-row>
    <b-col md="8">
      <b-card title="Yönetim Listesi" v-if="currentUser.roleId === Roles.ADMIN" class="mb-4">
        <b-table-simple
          borderless
          :responsive="true"
          table-class="table-vertical-center"
        >
          <b-thead>
            <b-tr>
              <b-th>User</b-th>
              <b-th>Email</b-th>
              <b-th>Role</b-th>
              <b-th>İşlem</b-th>
            </b-tr>
          </b-thead>
          <b-tbody>
            <template v-for="(item, i) in admins">
              <b-tr :key="i">
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
          </b-tbody>
        </b-table-simple>
      </b-card>
      <b-card title="Kullanıcı Listesi">
        <b-table-simple
          borderless
          :responsive="true"
          table-class="table-vertical-center"
        >
          <b-thead>
            <b-tr>
              <b-th>User</b-th>
              <b-th>Email</b-th>
              <b-th>İşlem</b-th>
            </b-tr>
          </b-thead>
          <b-tbody>
            <template v-for="(item, i) in users">
              <b-tr :key="i">
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
          </b-tbody>
        </b-table-simple>
        <b-pagination
          v-model="pageNumber"
          :total-rows="totalRows"
          :per-page="pageSize"
          aria-controls="my-table"
        ></b-pagination>
      </b-card>
    </b-col>
    <b-col md="4">
      <form-wrapper :validator="$v.createForm">
        <b-card title="Kullanıcı Ekle">
          <b-row>
            <form-group name="firstName" xs="12" no-label>
              <b-input
                placeholder="Ad"
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
                placeholder="Soyad"
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
                placeholder="Email"
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
                <b-select-option value="1">Admin</b-select-option>
                <b-select-option value="2">Editor</b-select-option>
                <b-select-option value="3">Basic User</b-select-option>
              </b-select>
            </form-group>
          </b-row>
          <b-row>
            <form-group name="password" xs="12" no-label>
              <b-input
                placeholder="Şifre"
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
                placeholder="Şifre Tekrar"
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
              <b-button @click="addUser">Ekle</b-button>
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
      pageSize: 10,
      pageNumber: 1,
      totalRows: null
    };
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [
      { title: "Yönetim Paneli" },
      { title: "Kullanıcı İşlemleri" }
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
        const { data } = await this.axios.get("admin/admin-list");
        this.admins = data;
      } catch (e) {
        console.log(e);
      }
    },
    async getUsers() {
      try {
        const { data } = await this.axios.get("admin/users", {
          params: { ...this.requestQuery }
        });
        this.users = data.rows;
        this.totalRows = data.count;
      } catch (e) {
        console.log(e);
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
      this.getUsers();
    }
  }
};
</script>
