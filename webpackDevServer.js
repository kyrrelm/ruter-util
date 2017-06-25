const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const config = require('./webpack.config');


const port = 8080;
const ip = '0.0.0.0';
new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  historyApiFallback: true,
  hot: true,
  inline: true
}).listen(port, ip, function (err) {
  if(err) {
    return console.log(err);
  }

  console.log('Listening at ' + ip + ':' + port);
});