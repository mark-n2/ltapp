<template>
  <div class="about">
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-toolbar dark>
            <v-toolbar-side-icon>
              <v-btn to="/">
                <v-icon>navigate_before</v-icon>
              </v-btn>
            </v-toolbar-side-icon>
            <v-toolbar-title>About</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card>
            <v-card-title>LT App</v-card-title>
            <v-card-text>
              このアプリは、輸送機器の乗り心地を測定するためのものです。<br>
              現状、加速度/ジャイロセンサ値を計測し保存する機能しかありません。
            </v-card-text>
          </v-card>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>
