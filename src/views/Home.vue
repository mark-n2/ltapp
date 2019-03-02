<template>
  <div class="home">
    <v-btn color="success" @click="add">Add</v-btn>
    <v-btn color="success" @click="display_update">Display</v-btn>
    <v-btn color="success" @click="delete_all">Clear</v-btn>
    <div v-if="this.head !== null">
      <v-data-table :headers="this.keys" :items="this.head" class="elevation-1">
        <template v-slot:items="props">
          <td>{{props.item.id}}</td>
          <td class="text-xs-right">{{props.item.date}}</td>
          <td class="text-xs-right">{{props.item.accX}}</td>
          <td class="text-xs-right">{{props.item.accY}}</td>
          <td class="text-xs-right">{{props.item.accZ}}</td>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
import Dexie from 'dexie'

export default {
  name: 'home',
  data () {
    return {
      db: null,
      head: null,
      keys: [
        { text: 'ID', value: "id" },
        { text: 'Date', value: "date"},
        { text: '加速度X', value: 'accX', sortable: false},
        { text: '加速度Y', value: 'accY', sortable: false},
        { text: '加速度Z', value: 'accZ', sortable: false}
      ]
    }
  },
  methods: {
    add () {
      this.db.notes.put({
        accX: 0.02,
        accY: -0.03,
        accZ: 1.00,
        date: new Date()
      }).then((id) => {
        console.log('record saved: ', id)
      })
    },
    display_update () {
      this.db.notes.limit(20).toArray().then((notes) => {
        this.head = notes
      })
    },
    delete_all () {
      this.db.notes.clear()
    },
    export () {
      this.db.export()
    }
  },
  created () {
    this.db = new Dexie('AppDatabase')
    this.db.version(1).stores({
      notes: "++id, date, accX, accY, accZ"
    })
  }
}
</script>
