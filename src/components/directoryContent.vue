<template>
  <v-container fluid>
    <v-row justify="end">
      <v-col md="3" align="end" class="mt-3 ml-3">
        <v-btn @click="NameDialog = !NameDialog">
          <v-icon left dark>mdi-folder-plus</v-icon>
          Add
        </v-btn>
      </v-col>
    </v-row>

    <v-row class="mt-4 pl-3">
      <v-col
        v-for="child in directoryList"
        :key="child.id"
        sm="6"
        md="4"
        lg="3"
      >
        <v-list elevation="2" shaped outlined>
          <v-list-item>
            <v-list-item-icon style="align-self: center">
              <v-icon>mdi-folder</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title
                class="clickable"
                @dblclick="openDirectory(child)"
                >{{ child.name }}</v-list-item-title
              >
            </v-list-item-content>

            <v-list-item-icon>
              <v-btn icon @click="renameDirectory(child)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </v-list-item-icon>
            <v-list-item-icon>
              <v-btn icon @click="deleteDirectory(child)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-list-item-icon>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-dialog persistent v-model="NameDialog" max-width="300">
        <v-card class="pt-5">
          <v-card-text>
            <v-text-field
              label="Enter Directory Name"
              required
              v-model="name"
            ></v-text-field>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="closeDialog">CLOSE</v-btn>
            <v-btn text @click="saveDirectory">SAVE</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <v-row justify="center">
      <v-dialog persistent max-width="400" v-model="deleteDialog">
        <v-card class="pt-5">
          <v-card-text>
            Directory is not Empty. Cannot delete directory
          </v-card-text>

          <v-card-actions>
            <v-spacer> </v-spacer>
            <v-btn text @click="deleteDialog = !deleteDialog">CLOSE</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <v-snackbar v-model="snackbar" timeout="2000" color="green">
      <span style="line-height: 2.5">{{ snackbarMsg }}</span>
      <v-btn text @click="snackbar = false" style="float: right">CLOSE</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import Directory from "../utility/directory";

export default {
  name: "directory-content",
  props: ["selectedDirectory", "openDirectory"],

  data() {
    return {
      NameDialog: false,
      name: "",
      editDirectory: null,
      snackbar: false,
      snackbarMsg: "",
      deleteDialog: false,
    };
  },

  computed: {
    /** get the children of the selected directory */
    directoryList() {
      return this.$store.getters.directoryList(this.selectedDirectory.id);
    },
  },

  mounted() {
    /** Emit an event notifying which present working directory is loaded */
    this.$emit("pwd", this.selectedDirectory);
  },

  methods: {
    /** create a new instance of a directory if it's added, or rename in case it's edited */
    saveDirectory() {
      this.NameDialog = false;
      if (this.editDirectory) {
        this.editDirectory.editName(this.name);
        this.$store.commit("EDIT_DIRECTORY", this.editDirectory);
        this.name = "";
        this.editDirectory = null;
        this.openSnackBar("Directory RENAMED");
      } else {
        const directory = new Directory(this.name);
        this.selectedDirectory.addchildren(directory);
        this.$store.commit("ADD_DIRECTORY", directory);
        this.name = "";
        this.openSnackBar("Directory ADDED");
      }
    },

    /** close the name dialog & refresh the initialized variables */
    closeDialog() {
      this.name = "";
      this.NameDialog = false;
      this.editDirectory = null;
    },

    /** open the name dialog & initialze the variables */
    renameDirectory(directory) {
      this.editDirectory = directory;
      this.name = directory.name;
      this.NameDialog = true;
    },

    /** if the directory has children, then abort */
    deleteDirectory(directory) {
      if (directory.children.length) {
        this.deleteDialog = true;
        return;
      }
      this.selectedDirectory.removeChildren(directory.id);
      this.$store.commit("DELETE_DIRECTORY", directory.id);
      this.openSnackBar("Directory DELETED");
    },

    /** display message on successful actions performed on directory */
    openSnackBar(message) {
      this.snackbar = true;
      this.snackbarMsg = message;
    },
  },
};
</script>

<style>
.clickable {
  cursor: pointer;
  user-select: none;
}
.clickable:hover {
  color: blue;
}

.align-center {
  align-self: center;
}
</style>
