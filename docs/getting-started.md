## Install

``` sh
# npm
$ npm install --save tui-color-picker # Latest version
$ npm install --save tui-color-picker@<version> # Specific version
```

It can also be installed by using bower or downloaded by CDN. Please refer to the [💾 Install](https://github.com/nhn/tui.color-picker#-install).

## Usage

```javascript
// ES6
import ColorPicker from 'tui-color-picker';
import 'tui-color-picker/dist/tui-color-picker.css';

const colorpicker = ColorPicker.create({
  container: document.getElementById('color-picker-container'),
  color: '#f9f9f9',
  preset: ['#181818', '#292929', '#393939'],
  ...
});
```

It can also be used by namespace or CommonJS module. Please refer to the [🔨 Usage](https://github.com/nhn/tui.color-picker#-usage).

For more information about the API, please see [here](https://nhn.github.io/tui.color-picker/latest/ColorPicker).