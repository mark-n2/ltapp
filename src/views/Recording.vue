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
              <v-btn icon @click="toggle_recording()">
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
      record: null, // 保存の有効/無効
      number: -1,
      timer: null,  // 周期処理ID
      accelerometer: null,  // 加速度センサ
      acc_x: [0.0],
      acc_y: [0.0],
      acc_z: [0.0],
      gyroscope: null,  // ジャイロセンサ
      gyro_beta: [0.0],
      gyro_gamma: [0.0],
      gyro_alpha: [0.0],
      absoluteorient: null, // 絶対オリエンテーション
      quaternion: [0.0,0.0,0.0,0.0],
      position: null,  // GeoLocationAPIのID
      lat: 0.0,
      lon: 0.0
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
    absoluteorientation () {
      this.quaternion = this.absoluteorient.quaternion
    },
    async toggle_recording() {
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
        this.get_position()
        this.add_data()
      }else{
        console.log('End Recording!')
        clearInterval(this.timer)
        this.timer = null
        if(this.position){
          navigator.geolocation.clearWatch(this.position)
          this.position = null
        }
      }
    },
    async add_data() {
      if(this.record === 0) {
        await this.db.data.add({
          no: this.number,
          date:new Date(),
          accX:this.accelerometer.x,
          accY:this.accelerometer.y,
          accZ:this.accelerometer.z,
          gyro_beta:this.gyroscope.x,
          gyro_gamma:this.gyroscope.y,
          gyro_alpha:this.gyroscope.z,
          qX: this.quaternion[0],
          qY: this.quaternion[1],
          qZ: this.quaternion[2],
          qW: this.quaternion[3],
          lat:this.lat,
          lon:this.lon
        })
        this.get_position()
      }
    },
    async update_latlon(position) {
      // GeoLocationAPIで位置を取得し緯度・経度を保持
      this.lat = position.coords.latitude
      this.lon = position.coords.longitude
      navigator.geolocation.clearWatch(this.position)
      this.position = null
    },
    get_position() {
      // Getting Geolocation
      if(navigator.geolocation) {
        let option = {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000
        }
        this.position = navigator.geolocation.watchPosition(this.update_latlon, (error) => { console.log(error) }, option)
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

    // eslint-disable-next-line
    this.absoluteorient = new AbsoluteOrientationSensor({frequency: 50})
    // eslint-disable-next-line
    this.absoluteorient.addEventListener('activate', (event) => {
      console.log("絶対オリエンテーションセンサが有効になりました")
    })
    this.absoluteorient.addEventListener('reading', this.absoluteorientation)
    this.absoluteorient.addEventListener('error', (event) => {
      console.log("絶対オリエンテーションセンサでエラーが発生しました");
      console.log(event.error)
      this.absoluteorient.stop()
    });
    this.absoluteorient.start()

    this.get_position()
  }
}
</script>