<template>
  <v-app>
    <v-app-bar max-height="9vh" dark color="#6A76AB">
      <v-btn
        icon
        :disabled="$router.currentRoute.name === 'root'"
        @click="goBack"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>

      <v-btn icon :disabled="disableForwardNav" @click="goNext">
        <v-icon>mdi-arrow-right</v-icon>
      </v-btn>

      <v-toolbar-title class="name ml-3">{{
        currentDirectory.name
      }}</v-toolbar-title>
    </v-app-bar>

    <v-main class="bg">
      <router-view :key="$route.path" @pwd="setCurrentDirectory"></router-view>
    </v-main>
  </v-app>
</template>

<script>
import DirectoryContent from "./components/directoryContent.vue";

export default {
  name: "App",

  data() {
    return {
      currentDirectory: this.$store.state.directory[0],
      disableForwardNav: true, //to check whether next route is available
    };
  },

  created() {
    /** the root directory will be the starting path in the route */
    this.$router.addRoute({
      path: "/",
      name: "root",
      component: DirectoryContent,
      props: {
        selectedDirectory: this.currentDirectory, // the selected directory
        openDirectory: this.goToDirectory, // callback function to add route dynamically
      },
    });
  },

  methods: {
    /** enable the forward button as soon as user navigate back once */
    goBack() {
      this.$router.go(-1);
      this.disableForwardNav = false;
    },

    goNext() {
      this.$router.go(1);
    },

    /** check if the route already exists. If not, add a new route & navigate to it */
    goToDirectory(directory) {
      const routes = this.$router.getRoutes();
      const existingRoute = routes.find((route) => route.name === directory.id);
      if (existingRoute) {
        this.$router.push({ name: directory.id });
      } else {
        const path =
          this.$router.currentRoute.name === "root"
            ? `/${directory.name}`
            : `${this.$router.currentRoute.fullPath}/${directory.name}`;
        this.$router.addRoute({
          name: directory.id,
          path: path,
          component: DirectoryContent,
          props: {
            selectedDirectory: directory,
            openDirectory: this.goToDirectory,
          },
        });
        this.$router.push({ name: directory.id });
      }
    },

    /** as the child directory is navigated to, it emits its pwd, which is shown at the appBar  */
    setCurrentDirectory(directory) {
      this.currentDirectory = directory;
    },
  },
};
</script>

<style>
.name {
  text-transform: capitalize;
}

.bg {
  background-color: #e8eaf6;
}
</style>
