<template>
  <div id="app">
    <v-app id="inspire">
      <router-view/>
    </v-app>
    <v-footer class="pa-3">
    <v-spacer></v-spacer>
    <div>mog&copy; {{ new Date().getFullYear() }}</div>
  </v-footer>
  </div>
</template>
<style lang="stylus">
@import '~vuetify/src/stylus/main' // Ensure you are using stylus-loader
</style>
