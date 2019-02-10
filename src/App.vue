<template>
  <div id="app">
    <v-app id="inspire">
      <v-tabs centered color="cyan" dark icons-and-text>
        <v-tabs-slider color="yellow"></v-tabs-slider>
        <v-tab to="/" router>
          Recording
          <v-icon>add_to_queue</v-icon>
        </v-tab>
        <v-tab to="/home" router>
          Favorites
          <v-icon>favorite</v-icon>
        </v-tab>
        <v-tab to="/about" router>
          About
          <v-icon>contacts</v-icon>
        </v-tab>
      </v-tabs>
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
