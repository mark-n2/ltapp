# これは何？

乗り物の乗り心地を計測するWebアプリです。  
乗り心地は、鉄道総研にて公表されているLT値[dB]で検証します。

# コンセプト

* なるべく新しい技術で作る
* データ解析を身近にする

というところをコンセプトに、

* ブラウザ上でセンサ値が取れるので、Webアプリ(PWA)で作成する
  * iPhone/Androidで可
  * Service Workerでバックグラウンド稼動させたい
  * Generic Sensor APIでセンサデータを取得する(サンプリングを固定)
* FFT等の計算負荷が高い処理は、Web Assembly(wasm)で作成する
  * 個人的に興味のあるRustで作ってみたい
* データはGoogle Driveに保存し、Colab Notebookで解析できるようにする
  * データは一旦IndexedDBに保存し、ボタンを押すとGoogle Driveへ転送する
  * Colab Notebookで解析するためのPythonモジュールも検討する


## データの流れ

``` plantuml
node スマートフォン {
    component 加速度センサ
    component GPSモジュール
    component ジャイロセンサ
    component ブラウザ {
        component IndexedDB
        cloud LTAPP {
            component LT計算
        }
    }
    加速度センサ -up-> LT計算
    ジャイロセンサ -up-> LT計算
    加速度センサ -up-> IndexedDB
    ジャイロセンサ -up-> IndexedDB
    GPSモジュール -up-> IndexedDB
}
cloud SNS
cloud "Google Drive" as gdrive
cloud "Colab Notebook" as note

LT計算 -up-> SNS:投稿
IndexedDB -up-> gdrive
note --> gdrive:データ取得
note --> SNS:公開

actor ユーザ
ユーザ -> note:解析
```

# 類似アプリ

Googleが出しているScience Journalというアプリがあり、同じようにセンサデータを計測して遊ぶことが可能。  
使ってみた限り、
* 位置情報が計測できない
* センサのサンプリングが一定でない

といった辺りで不満があり、作ってみることにした。