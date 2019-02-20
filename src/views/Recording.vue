<template>
  <div class="recording">
    <v-hover>
      <v-card
        slot-scope="{ hover }"
        class="mx-auto"
        color="grey lighten-4"
        max-width="600"
      >
        <v-img
          :aspect-ratio="16/9"
          src="https://www.webtech.co.jp/blog/wp-content/uploads/2015/06/sensor.png"
        >
          <v-expand-transition>
            <div
              v-if="hover"
              class="d-flex transition-fast-in-fast-out orange darken-2 v-card--reveal display-3 white--text"
              style="height: 100%;"
            >
              $14.99
            </div>
          </v-expand-transition>
        </v-img>
        <v-card-text
          class="pt-4"
          style="position: relative;"
        >
          <v-btn
            absolute
            color="orange"
            class="white--text"
            fab
            large
            right
            top
          >
            <v-icon>mdi-cart</v-icon>
          </v-btn>
          <div class="font-weight-light grey--text title mb-2">Recording Sensors</div>
          <h3 class="display-1 font-weight-light orange--text mb-2">Acceleration</h3>
          <v-sparkline :value="acc_x" color="primary"></v-sparkline>
          <div class="font-weight-light title mb-2">
            X: {{acc_x.slice(-1)[0]}}
          </div>
          <v-sparkline :value="acc_y" color="green"></v-sparkline>
          <div class="font-weight-light title mb-2">
            Y: {{acc_y.slice(-1)[0]}}
          </div>
          <v-sparkline :value="acc_z" color="red"></v-sparkline>
          <div class="font-weight-light title mb-2">
            Z: {{acc_z.slice(-1)[0]}}
          </div>
          <h3 class="display-1 font-weight-light orange--text mb-2">Gyroscope</h3>
          <div class="font-weight-light title mb-2">
            beta: {{gyro_beta}}
          </div>
          <div class="font-weight-light title mb-2">
            gamma: {{gyro_gamma}}
          </div>
          <div class="font-weight-light title mb-2">
            alpha: {{gyro_alpha}}
          </div>
        </v-card-text>
      </v-card>
    </v-hover>
  </div>
</template>

<script>
export default{
  data () {
    return {
      accelerometer: null,
      acc_x: [0.0],
      acc_y: [0.0],
      acc_z: [0.0],
      gyroscope: null,
      gyro_beta: 0.0,
      gyro_gamma: 0.0,
      gyro_alpha: 0.0
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
      this.gyro_beta = this.gyroscope.x
      this.gyro_gamma = this.gyroscope.y
      this.gyro_alpha = this.gyroscope.z
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