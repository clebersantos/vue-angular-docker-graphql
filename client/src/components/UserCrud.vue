<template>
  <div>
    <v-toolbar flat >
      <v-toolbar-title>Crud para cadastro de usuário</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" max-width="500px">
        <v-btn slot="activator" color="primary" dark class="mb-2">Novo usuário</v-btn>
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm12 md12>
                  <v-text-field v-model="editedItem.name" label="Name"></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
            <v-btn color="blue darken-1" flat @click.native="save">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="users"
      hide-actions
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td>{{ props.item.name }}</td>
        <td class="justify-center layout px-0">
          <v-icon
            small
            class="mr-2"
            @click="editItem(props.item)"
          >
            edit
          </v-icon>
          <v-icon
            small
            @click="deleteItem(props.item)"
          >
            delete
          </v-icon>
        </td>
      </template>
    </v-data-table>
    
  </div>
</template>

<script>
import gql from 'graphql-tag'

import USERS from '../graphql/Users.gql';
import ADD_USER from '../graphql/AddUser.gql';
import UPDATE_USER from '../graphql/UpdateUser.gql';
import REMOVER_USER from '../graphql/RemoverUser.gql';

export default {
  data: () => ({
    dialog: false,
    headers: [
      {
        text: 'Name',
        align: 'left',
        sortable: true,
        value: 'name',
      },
      {
        text: 'Actions',
        value: 'name',
        align: 'center',
        sortable: false,
      },
    ],
    users: [],
    editedIndex: -1,
    editedItem: {
      name: '',
    },
    defaultItem: {
      name: '',
    },
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Novo item' : 'Editar Item';
    },
  },
  watch: {
    dialog(val) {
      // eslint-disable-next-line
      val || this.close();
    },
  },
  apollo: {
    users: USERS,
  },
  methods: {
    editItem(item) {
      this.editedIndex = this.users.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      // eslint-disable-next-line
      confirm('Tem certeza que deseja deletar o usuário?') && this.removerUser(item)
    },
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    async addUser() {
      const newUser = this.editedItem;
      await this.$apollo.mutate({
        mutation: ADD_USER,
        variables: {
          name: newUser.name,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          addUser: {
            __typename: 'user',
            id: -1,
            name: newUser.name,
          },
        },
      }).then((data) => {
        this.users.push(data.data.addUser);
      }).catch((error) => {
        console.error(error);
      });
    },
    async updateUser() {
      const newUser = this.editedItem;
      await this.$apollo.mutate({
        mutation: UPDATE_USER,
        variables: {
          id: newUser.id,
          name: newUser.name,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          updateUser: {
            __typename: 'user',
            id: -1,
            name: newUser.name,
          },
        },
      }).then((data) => {
        Object.assign(this.users[this.editedIndex], this.editedItem);
      }).catch((error) => {
        console.error(error);
      });
    },
    removerUser(item) {
      this.$apollo.mutate({
        mutation: REMOVER_USER,
        variables: {
          id: item.id,
        },
      }).then((data) => {
        const index = this.users.indexOf(item);
        this.users.splice(index, 1);
      }).catch((error) => {
        console.error('error delete user ', error);
      });
    },
    save() {
      if (this.editedIndex > -1) {
        this.updateUser();
      } else {
        this.addUser();
      }
      this.close();
    },
  },
};
</script>
