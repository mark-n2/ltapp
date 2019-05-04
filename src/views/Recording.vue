<template>
  <div class="recording">
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-toolbar dark>
            <v-toolbar-side-icon>
              <v-btn to="/">
                <v-icon>navigate_before</v-icon>
              </v-btn>
            </v-toolbar-side-icon>
            <v-toolbar-title>Recording Sensors</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-title>Record:</v-toolbar-title>
            <v-btn-toggle v-model="record">
              <v-btn icon @click="create_data()">
                <v-icon color="red">album</v-icon>
              </v-btn>
            </v-btn-toggle>
          </v-toolbar>
          <v-card>
            <v-card-title>
              <h3>Acceleration</h3>
            </v-card-title>
            <v-card-text>
              <v-sparkline :value="acc_x" color="primary"></v-sparkline>
              <div>
                X: {{acc_x.slice(-1)[0]}}
              </div>
              <v-sparkline :value="acc_y" color="green"></v-sparkline>
              <div>
                Y: {{acc_y.slice(-1)[0]}}
              </div>
              <v-sparkline :value="acc_z" color="red"></v-sparkline>
              <div>
                Z: {{acc_z.slice(-1)[0]}}
              </div>
            </v-card-text>
          </v-card>
          <v-card>
            <v-card-title>
              <h3>Gyroscope</h3>
            </v-card-title>
            <v-card-text>
              <v-sparkline :value="gyro_beta" color="primary"></v-sparkline>
              <div>
                beta: {{gyro_beta.slice(-1)[0]}}
              </div>
              <v-sparkline :value="gyro_gamma" color="green"></v-sparkline>
              <div>
                gamma: {{gyro_gamma.slice(-1)[0]}}
              </div>
              <v-sparkline :value="gyro_alpha" color="red"></v-sparkline>
              <div>
                alpha: {{gyro_alpha.slice(-1)[0]}}
              </div>
            </v-card-text>
          </v-card>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import moment from 'moment'
export default{
  data () {
    return {
      db: null,
      record: null,
      number: -1,
      timer: null,
      accelerometer: null,
      acc_x: [0.0],
      acc_y: [0.0],
      acc_z: [0.0],
      gyroscope: null,
      gyro_beta: [0.0],
      gyro_gamma: [0.0],
      gyro_alpha: [0.0]
    }
  },
  methods: {
    devicemotion () {
      this.acc_x.push(this.accelerometer.x)
      if(this.acc_x.length > 1000){
        this.acc_x.shift()
      }
      this.acc_y.push(this.accelerometer.y)
      if(this.acc_y.length > 1000){
        this.acc_y.shift()
      }
      this.acc_z.push(this.accelerometer.z)
      if(this.acc_z.length > 1000){
        this.acc_z.shift()
      }
    },
    deviceorientation () {
      this.gyro_beta.push(this.gyroscope.x)
      if(this.gyro_beta.length > 1000){
        this.gyro_beta.shift()
      }
      this.gyro_gamma.push(this.gyroscope.y)
      if(this.gyro_gamma.length > 1000){
        this.gyro_gamma.shift()
      }
      this.gyro_alpha.push(this.gyroscope.z)
      if(this.gyro_alpha.length > 1000){
        this.gyro_alpha.shift()
      }
    },
    async create_data() {
      if(this.record !== 0){
        console.log('Start Recording!')
        let now = new Date()
        let now_str = moment(now).format('YYYY/MM/DD HH:mm:ss')
        this.db.notes.add({
          title: now_str, subtitle:now}
        )
        const number = await this.db.notes.orderBy('subtitle').reverse().limit(1).toArray()
        this.number = number[0].id
        this.timer = setInterval(this.add_data, 20)
        this.add_data()
      }else{
        console.log('End Recording!')
        clearInterval(this.timer)
        this.timer = null
      }
    },
    async add_data() {
      if(this.record === 0) {
        console.log('add data: ', this.number)
        await this.db.data.add({
          no: this.number,
          date:new Date(),
          accX:this.accelerometer.x,
          accY:this.accelerometer.y,
          accZ:this.accelerometer.z,
          gyro_beta:this.gyroscope.x,
          gyro_gamma:this.gyroscope.y,
          gyro_alpha:this.gyroscope.z
        })
      }
    }
  },
  created () {
    // eslint-disable-next-line
    this.accelerometer = new Accelerometer({frequency: 50})
    // eslint-disable-next-line
    this.accelerometer.addEventListener('activate', (event) => {
      console.log("加速度センサが有効になりました")
    })
    this.accelerometer.addEventListener('reading', this.devicemotion)
    // eslint-disable-next-line
    this.accelerometer.addEventListener('error', (event) => {
      console.log("加速度センサでエラーが発生しました")
      console.log(event.error)
      this.accelerometer.stop()
    })
    this.accelerometer.start()
    
    // eslint-disable-next-line
    this.gyroscope = new Gyroscope({frequency: 50})
    // eslint-disable-next-line
    this.gyroscope.addEventListener('activate', (event) => {
      console.log("ジャイロスコープが有効になりました")
    })
    this.gyroscope.addEventListener('reading', this.deviceorientation)
    // eslint-disable-next-line
    this.gyroscope.addEventListener('error', (event) => {
      console.log("ジャイロスコープでエラーが発生しました")
      console.log(event.error)
      this.gyroscope.stop()
    })
    this.gyroscope.start()
  }
}
</script>