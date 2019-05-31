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
              <h3>LT</h3>
            </v-card-title>
            <v-card-text>
              <v-sparkline :value="lt_array_x" color="blue"></v-sparkline>
              <div>
                X: {{lt_x}}
              </div>
            </v-card-text>
          </v-card>
          <v-card>
            <v-card-title>
              <h3>Acceleration</h3>
            </v-card-title>
            <v-card-text>
              <v-sparkline :value="acc_x" color="primary"></v-sparkline>
              <div>
                X: {{acc_x.slice(-1)[0]}}
              </div>
              <div>
                {{acc_x.length}}/3000
              </div>
              <v-sparkline :value="acc_y" color="green"></v-sparkline>
              <div>
                Y: {{acc_y.slice(-1)[0]}}
              </div>
              <div>
                {{acc_y.length}}/3000
              </div>
              <v-sparkline :value="acc_z" color="red"></v-sparkline>
              <div>
                Z: {{acc_z.slice(-1)[0]}}
              </div>
              <div>
                {{acc_z.length}}/3000
              </div>
            </v-card-text>
          </v-card>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import NoSleep from 'nosleep.js'
import ndarray from 'ndarray'
import fft from 'ndarray-fft'
import ops from 'ndarray-ops'
import linspace from 'ndarray-linspace'
import hann from 'scijs-window-functions/hann'
//import show from 'ndarray-show'
const array_size = 60 * 50
const overlap = 10
export default{
  data () {
    return {
      db: null,
      record: null, // 保存の有効/無効
      number: -1,
      timer: null,  // 周期処理ID
      ltimer: null,
      accelerometer: null,  // 加速度センサ
      acc_x: [],
      acc_y: [],
      acc_z: [],
      gyroscope: null,  // ジャイロセンサ
      gyro_beta: [],
      gyro_gamma: [],
      gyro_alpha: [],
      absoluteorient: null, // 絶対オリエンテーション
      quaternion: [0.0,0.0,0.0,0.0],
      position: null,  // GeoLocationAPIのID
      lat: 0.0,
      lon: 0.0,
      lt_x: null,
      lt_array_x: [],
      lock: new NoSleep()
    }
  },
  methods: {
    devicemotion () {
      this.acc_x.push(this.accelerometer.x)
      if(this.acc_x.length > array_size){
        this.acc_x.shift()
      }
      this.acc_y.push(this.accelerometer.y)
      if(this.acc_y.length > array_size){
        this.acc_y.shift()
      }
      this.acc_z.push(this.accelerometer.z)
      if(this.acc_z.length > array_size){
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
        this.lock.enable()  // スリープさせないようにする
        let now = new Date()
        let now_str = "Record" + this.number
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
        this.lock.disable() // ノースリープを解除
        this.lock = null
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
    interval_lt() {
      if(this.acc_x.length >= array_size) {
        let xx = ndarray(this.acc_x.slice(0,array_size))
        this.acc_x.splice(0, overlap * 50)  // 計算済みのデータを削除
        this.lt_x = this.calc_lt(xx, 1 / 50, 60, overlap)
        this.lt_array_x.push(this.lt_x)
        if(this.lt_array_x.length > 50){
          this.lt_array_x.shift()
        }
      }
    },
    calc_fft(value) {
      //console.log('calc_fft')
      let fft_result = ndarray(new Float32Array(value.shape[0]))
      //console.log(show(value))
      fft(-1, value, fft_result)
      ops.mulseq(fft_result, value.shape[0])
      ops.abseq(fft_result)
      //console.log(show(fft_result))
      return fft_result
    },
    calc_periodogram(x, sampling, nfft) {
      //console.log('calc_periodogram')
      let window = ndarray(new Float32Array(nfft))
      for (var i=0;i<nfft;i++){
        window.data[i] = hann(i,nfft)
      }
      let xdft = this.calc_fft(ops.muleq(x.hi(nfft), window))
      xdft = xdft.hi(nfft/2)
      ops.abseq(xdft)
      let psdx = ops.mulseq(xdft,1/(sampling * nfft))
      for(let i=2;i<nfft-2;i++){
        psdx[i] *= 2
      }
      // 窓関数の減衰分を補正
      ops.mulseq(psdx, 1 / ops.sum(ops.muleq(window, window)) / nfft)
      return psdx
    },
    calc_welch(x, sampling, nperseg, nfft, noverlap) {
      //console.log('calc_welch', sampling, nperseg, nfft, noverlap)
      let calculated = 0
      let count = 0
      let psdx = ndarray(new Float32Array(nperseg/2))
      let tmp
      while(calculated + nperseg < nfft) {
        tmp = this.calc_periodogram(x.hi(calculated + nperseg).lo(calculated), sampling, nperseg)
        ops.addeq(psdx, tmp)
        calculated += nperseg - nperseg/2
        count += 1
      }
      ops.divseq(psdx, count-1)
      return psdx
    },
    calc_lt(data, samplingtime, fft_length, noverlap) {
      let nfft = Math.floor(fft_length / samplingtime)
      if(noverlap == 0) {
        noverlap = nfft / 2
      }
      let WP = [0.5, 0.8, 2.00, 80]
      
      let pxx = this.calc_welch(data, 1 / samplingtime, nfft/2, nfft, nfft/2)
      // 周波数成分の生成
      let fp = ndarray(new Float32Array(256/2))
      linspace(fp, 0, (1/samplingtime)/2, (1/samplingtime)/nfft)
      
      let wdata = new Float32Array(fp.shape[0])
      let aw2tmp = new Float32Array(fp.shape[0])
      let aw2 = 0.0
      for(let ff=0;ff<fp.shape[0];ff++) {
        if(fp.data[ff] < WP[0]) {
          wdata[ff] = 0
        }
        else if(fp.data[ff] < WP[1]) {
          wdata[ff] = (1.6/fp.data[ff]) ** 0.5
        }
        else if(fp.data[ff] < WP[2]) {
          wdata[ff] = Math.sqrt(2)
        }
        else if(fp.data[ff] < WP[3]) {
          wdata[ff] = 2 * Math.sqrt(2) / fp.data[ff]
        }
        else {
          wdata[ff] = 0
        }
        aw2tmp[ff] = pxx.data[ff] * (wdata[ff] ** 2)
        aw2 += aw2tmp[ff]
      }
      aw2 = aw2 * (fp.data[1] - fp.data[0])
      return 20 * Math.log10(Math.sqrt(aw2) / 1e-5)
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
    },
    simulate_sensors() {
      this.acc_x.push(Math.random())
      if(this.acc_x.length > array_size){
        this.acc_x.shift()
      }
      this.acc_y.push(Math.random())
      if(this.acc_y.length > array_size){
        this.acc_y.shift()
      }
      this.acc_z.push(Math.random())
      if(this.acc_z.length > array_size){
        this.acc_z.shift()
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
      setInterval(this.simulate_sensors, 20)
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
    this.ltimer = setInterval(this.interval_lt, overlap*1000)
  },
  beforeDestroy() {
    clearInterval(this.ltimer)
    this.lock.disable()
  }
}
</script>