<template>
  <div class="viewer">
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-toolbar dark>
            <v-toolbar-side-icon>
              <v-btn to="/">
                <v-icon>navigate_before</v-icon>
              </v-btn>
            </v-toolbar-side-icon>
            <v-toolbar-title>Data Viewer</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-title>download:</v-toolbar-title>
            <v-progress-circular v-if="processing" indeterminate color="primary"></v-progress-circular>
            <v-btn v-else icon @click="download">
              <v-icon>cloud_download</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card v-if="records">
            <v-card-text>
              <h2>Data Table</h2>
            </v-card-text>
            <v-data-table :headers="headers" :items="records" class="elevation-1">
              <template v-slot:items="props">
                <td>{{ props.item.date }}</td>
                <td>{{ props.item.accX }}</td>
                <td>{{ props.item.accY }}</td>
                <td>{{ props.item.accZ }}</td>
                <td>{{ props.item.gyro_beta }}</td>
                <td>{{ props.item.gyro_gamma }}</td>
                <td>{{ props.item.gyro_alpha }}</td>
                <td>{{ props.item.qX }}</td>
                <td>{{ props.item.qY }}</td>
                <td>{{ props.item.qZ }}</td>
                <td>{{ props.item.qW }}</td>
                <td>{{ props.item.lat }}</td>
                <td>{{ props.item.lon }}</td>
              </template>
            </v-data-table>
          </v-card>
          <v-progress-circular v-else indeterminate color="primary">
          </v-progress-circular>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {
  data () {
    return {
      records: [],
      headers: [
        { text:'date', value: 'date' },
        { text:'Acc X', value: 'accX'},
        { text:'Acc Y', value: 'accY'},
        { text:'Acc Z', value: 'accZ'},
        { text:'Gyro X', value: 'gyro_beta'},
        { text:'Gyro Y', value: 'gyro_gamma'},
        { text:'Gyro Z', value: 'gyro_alpha'},
        { text:'Q X', value: 'qX'},
        { text:'Q Y', value: 'qY'},
        { text:'Q Z', value: 'qZ'},
        { text:'Q Q', value: 'qW'},
        { text:'Latitude', value: 'lat'},
        { text:'Longitude', value: 'lon'}
      ],
      processing: false
    }
  },
  methods: {
    generate_csv () {
      var csv = '\ufeff' + 'date,AccX,AccY,AccZ,GyroX,GyroY,GyroZ,Qx,Qy,Qz,Qw,Lat,Lon\n'
      this.records.forEach(el => {
      var line = el['date'] + ',' + el['accX'] + ',' + el['accY'] + ',' + el['accZ'] + ',' + el['gyro_beta'] + ',' + el['gyro_gamma'] + ',' + el['gyro_alpha'] + ',' + el['qX'] + ',' + el['qY'] + ',' + el['qZ'] + ',' + el['qW'] + ',' + el['lat'] + ',' + el['lon'] + '\n'
        csv += line
      })
      return csv
    },
    share () {
      if(navigator.share) {
        this.processing = true
        let csv = this.generate_csv()
        navigator.share({
          title: 'records_' + this.$route.params.id,
          text: csv
        })
        this.processing = false
      }
    },
    download () {
      // CSVに保存
      this.processing = true
      let csv = this.generate_csv()
      let blob = new Blob([csv], { type: 'text/csv'})
      let link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = 'records_' + this.$route.params.id + '.csv'
      link.click()
      this.processing = false
    }
  },
  async created () {
    console.log('viewer id:', this.$route.params.id)
    this.records = await this.db.data.where('no').equals(this.$route.params.id).toArray()
  }
}
</script>