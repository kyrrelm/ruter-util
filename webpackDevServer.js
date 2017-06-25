const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const path = require("path");

const config = require('./webpack.config');

const port = 8080;
const ip = '0.0.0.0';

const server = new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  historyApiFallback: true,
  hot: true,
  inline: true
});

server.use('/', function(req, res) {
  res.sendFile(path.join(__dirname+'/index.html'));
});

server.listen(port, ip, function (err) {
  if(err) {
    return console.log(err);
  }

  console.log('Listening at ' + ip + ':' + port);
});