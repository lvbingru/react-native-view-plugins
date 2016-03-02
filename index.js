/**
 * Created by lvbingru on 3/2/16.
 */


var ViewPlugins = {
  get NavBar() { return require('NavBar'); },
  get Button() { return require('Button'); },
  get TabBar() { return require('TabBar'); },
  get TouchView() { return require('TouchView'); },
  get TextInputWithClear() { return require('TextInputWithClear'); },
}

module.exports = ViewPlugins;
