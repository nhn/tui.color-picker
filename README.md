# Colorpicker
Component - ColorPicker for web

![Colorpicker Screenshot](https://github.com/nhnent/tui.color-picker/raw/master/screenshot.png)

## Documentation
* **API** : https://nhnent.github.io/tui.color-picker/latest
* **Tutorial** : https://github.com/nhnent/tui.color-picker/wiki
* **Sample** :
http://nhnent.github.io/tui.color-picker/latest/tutorial-sample1.html

## Dependency
* [tui.code-snippet: 1.2.8](https://github.com/nhnent/tui.code-snippet/releases/tag/v1.2.8)

## Tested Browsers
* IE7+
* Edge
* Chrome
* Firefox
* Safari

## Usage
### Use `npm`
Install the latest version using `npm` command:

```
$ npm install tui-color-picker --save
```

or want to install the each version:

```
$ npm install tui-color-picker@<version> --save
```

To access as module format in your code:

```javascript
var colorPicker = require('tui-color-picker');
var instance = colorPicker.create({
    container: document.getElementById('colorpicker')
});
```

### Use `bower`
Install the latest version using `bower` command:

```
$ bower install tui-color-picker
```

or want to install the each version:

```
$ bower install tui-color-picker#<tag>
```

To access as namespace format in your code:

```javascript
var instance = tui.colorPicker.create({
    container: document.getElementById('colorpicker')
});
```
### Download
* [Download bundle files from `dist` folder](https://github.com/nhnent/tui.color-pditor/tree/production/dist)
* [Download all sources for each version](https://github.com/nhnent/tui.color-picker/releases)

## License
[MIT LICENSE](https://github.com/nhnent/tui.color-picker/raw/master/LICENSE)
