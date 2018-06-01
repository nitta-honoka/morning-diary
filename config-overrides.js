/**
 * Created by honoka on 18/5/30.
 */
const rewireLess = require('react-app-rewire-less')
const rewireReactHotLoader = require('react-app-rewire-hot-loader')
const { compose, injectBabelPlugin } = require('react-app-rewired')

module.exports = function override(config, env) {
  //do stuff with the webpack config...
  const rewires = compose(
    rewireLess,
    rewireReactHotLoader
  )
  config = injectBabelPlugin(['import', { libraryName: 'antd', libraryDirectory: 'es', style: 'css' }], config)
  return rewires(config, env)
}