<template>
  <div class="home">
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-toolbar dark>
            <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
            <v-toolbar-title>Data List</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon>
              <v-icon>search</v-icon>
            </v-btn>
          </v-toolbar>
          <v-list two-line>
            <p v-if="!files || files.length < 1">No Data</p>
            <template v-else v-for="(item, index) in files.slice(0, 6)">
              <v-divider :key="index" :inset="item.inset"></v-divider>
              <v-list-tile :key="item.title" avatar @click="$router.push({name: 'viewer', params: { id: item.id }})">
                <v-list-tile-avatar>
                  <v-icon :class="['blue white--text']">assignment</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title>{{item.title}}</v-list-tile-title>
                  <v-list-tile-sub-title>{{item.subtitle}}</v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-btn icon @click="delete_by_id(item.id)">
                    <v-icon color="grey lighten-1">delete</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
            </template>
          </v-list>
          <v-btn color="pink" dark small absolute bottom right fab to="/recording">
            <v-icon>add</v-icon>
          </v-btn>
        </v-card>
      </v-flex>
    </v-layout>

    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list class="pt-0" dense>
        <v-divider></v-divider>
        <v-list-tile @click="add_test()">
          <v-list-tile-content>
            <v-list-tile-title>Add Test</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="delete_all()">
          <v-list-tile-content>
            <v-list-tile-title>Delete All</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="wasm_test()">
          <v-list-tile-content>
            <v-list-tile-title>WASM Test</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider></v-divider>
        <v-list-tile to="/about">
          <v-list-tile-content>
            <v-list-tile-title>About</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import loadWasm from '../../rust-lib/src/lib.rs'
export default {
  name: 'home',
  data () {
    return {
      db: null,
      drawer: false,
      files: null,
      calc: null  // rust wasm
    }
  },
  methods: {
    delete_all () {
      /* DB上の全データ削除 */
      this.db.notes.clear()
      this.db.data.clear()
      this.update_file_list()
    },
    async delete_by_id(id) {
      /* ID指定して削除 */
      console.log('delete id:', id)
      await this.db.data.where('no').equals(id).delete()
      await this.db.notes.where('id').equals(id).delete()
      this.update_file_list()
    },
    add_test () {
      /* テスト用:notesにアイテムを追加 */
      this.db.notes.add(
        {title:'TestAdd', subtitle:'Jan 21, 2019'}
      )
    },
    async update_file_list() {
      /* ファイルリストの更新 */
      this.files = await this.db.notes.toArray().then((notes) => {
        return notes
      })
    },
    wasm_test () {  // rust wasm
      console.log('return value was', this.calc(2,3))
    }
  },
  async created () {
    this.update_file_list()
    this.calc = await loadWasm().then(result => {
      return result.instance.exports.add
    })
  }
}
</script>
