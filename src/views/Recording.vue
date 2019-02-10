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
          <div class="font-weight-light title mb-2">
            X: {{acc_x}}
          </div>
          <div class="font-weight-light title mb-2">
            Y: {{acc_y}}
          </div>
          <div class="font-weight-light title mb-2">
            Z: {{acc_z}}
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
      acc_x : 0.0,
      acc_y : 0.0,
      acc_z : 0.0,
      gyro_beta: 0.0,
      gyro_gamma: 0.0,
      gyro_alpha: 0.0
    }
  },
  methods: {
    devicemotion (e) {
      this.acc_x = e.acceleration.x
      this.acc_y = e.acceleration.y
      this.acc_z = e.acceleration.z
    },
    deviceorientation (e) {
      this.gyro_beta = e.beta
      this.gyro_gamma = e.gamma
      this.gyro_alpha = e.alpha
    }
  },
  created () {
    window.addEventListener('devicemotion', this.devicemotion)
    window.addEventListener('deviceorientation', this.deviceorientation)
  }
}
</script>