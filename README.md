gulp-ionic-channels
================
## Information

This plugin facilitates the handling of Ionic Platform's deploy channels to use a single codebase for several versions of your application.

## Usage

This plugin is best used when piped with `gulp-ng-constant` to generate angular constants such as the deploy channel.

### Gulpfile example

_**gulpfile.js**_

```javascript
var gulp = require('gulp');
var ionicChannels = require('gulp-ionic-channels');
var ngConstant = require('gulp-ng-constant');


gulp.task('config', function() {
  gulp.src('./config.json')
  .pipe(ionicChannels({
    channelTag: 'staging'
  }))
  .pipe(gulp.dest('.'));
});
```

### Input configuration

_**config.json**_
```json
{
  "staging": {
    "appId": "fr.theodo.updaty-staging",
    "appName": "Updaty Staging"
  },
  "prod": {
    "appId": "fr.theodo.updaty",
    "appName": "Updaty"
  }
}
```

### Javascript Output

Piping this plugin with [gulp-ng-constant](https://github.com/guzart/gulp-ng-constant) will allow the generation of a javascript file containing constants
included in the requested deploy channel (from the input configuration), along with the version from your `package.json` file and the tag of the channel itself.

Apart from the 'Multiple Environments' section of their documentation (which is incompatible with our plugin as it is already handled by it), the other options can be used with no issue.

_**config.js**_ _(output)_

```javascript
angular.module("config", [])

.constant("appId", "fr.theodo.updaty-staging")

.constant("appName", "Updaty Staging")

.constant("version", "0.0.1")

.constant("channelTag", "staging")

;
```

### Input Cordova Configuration Template

_**config.tpl.xml**_

```xml
<widget xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0" id="<%=appId%>" version="<%=version%>">
  <name><%=appName%></name>
  <description>Updaty is a great app which self updates</description>
  <author email="dev@theodo.fr" href="http://theodo.fr">Theodo</author>
  <content src="index.html"/>
</widget>
```

### Cordova Configuration Output

_**config.xml**_ _(output)_

```xml
<widget xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0" id="fr.theodo.updaty-staging" version="0.0.1">
  <name>Updaty Staging</name>
  <description>Updaty is a great app which self updates</description>
  <author email="dev@theodo.fr" href="http://theodo.fr">Theodo</author>
  <content src="index.html"/>
</widget>
```

## Options

#### options.deployChannel

Type: `string`  
Default: `prod`  
_optional_

The deploy channel which will be used to filter the input configuration passed as source.

#### options.configTemplatePath

Type: `string`  
Default: `./config.tpl.xml`  
_optional_

The path to the cordova configuration template file.

#### options.configOutputPath

Type: `string`  
Default: `./config.xml`  
_optional_

The path on which the cordova configuration file will be outputted.

### Special thanks

Thanks to the developers/maintainers of gulp-ng-constant, as most of their code was used to create the skeleton for this plugin.
