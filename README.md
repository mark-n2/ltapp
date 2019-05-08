# ltapp

This is web application checking how train/taxi/bus ride comfortable.  
=>[Demo](https://mark-n2.github.io/ltapp)

## todo

+ [x] getting sensor value from phone
+ [x] store sensor values to Google Drive
+ [ ] calculate comfortable value
+ [ ] post comfortable value to SNS (twitter, facebook, ..etc)
+ [ ] analyze sensor values on Google Colab-Notebook

# Develop

## Requirements

install below:
* node/npm
* rustup and add target **wasm32-unknown-unknown**

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Deploy to gh-pages
```
yarn run deploy
```

### Lints and fixes files
```
yarn run lint
```

### Run your end-to-end tests
```
yarn run test:e2e
```

### Run your unit tests
```
yarn run test:unit
```
