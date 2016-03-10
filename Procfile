#web: rails server -p $PORT
#webpack: webpack --config config/webpack/development.config.js --watch --colors

rails: rails server
#webpack: ./node_modules/webpack-dev-server/bin/webpack-dev-server.js --config config/webpack/development.config.js --inline
webpack: ./node_modules/webpack-dev-server/bin/webpack-dev-server.js --content-base build/ --config config/webpack/development.config.js --inline --hot
