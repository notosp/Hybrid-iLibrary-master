gulp = require 'gulp'
shelljs = require 'shelljs'
mergeStream = require 'merge-stream'
runSequence = require 'run-sequence'
manifest = require './package.json'
$ = require('gulp-load-plugins')()

# Remove directories used by the tasks
gulp.task 'clean', ->
  shelljs.rm '-rf', './build'
  shelljs.rm '-rf', './dist'

# Build for each platform; on OSX/Linux, you need Wine installed to build win32 (or remove winIco below)
['win32', 'osx64', 'linux32', 'linux64'].forEach (platform) ->
  gulp.task 'build:' + platform, ->
    if process.argv.indexOf('--toolbar') > 0
      shelljs.sed '-i', '"toolbar": false', '"toolbar": true', './src/package.json'

    gulp.src './src/**'
      .pipe $.nodeWebkitBuilder
        platforms: [platform]
        version: '0.12.2'
        winIco: if process.argv.indexOf('--noicon') > 0 then undefined else './src/assets/assets-windows/icon.ico'
        macIcns: './src/assets/assets-osx/icon.icns'
        macZip: true
        macPlist:
          NSHumanReadableCopyright: 'ingawi.id'
          CFBundleIdentifier: 'com.iNgawi'
      .on 'end', ->
        if process.argv.indexOf('--toolbar') > 0
          shelljs.sed '-i', '"toolbar": true', '"toolbar": false', './src/package.json'

# Only runs on OSX (requires XCode properly configured)
gulp.task 'sign:osx64', ['build:osx64'], ->
  shelljs.exec 'codesign -v -f -s "iNgawi Apps" ./build/iNgawi/osx64/iNgawi.app/Contents/Frameworks/*'
  shelljs.exec 'codesign -v -f -s "iNgawi Apps" ./build/iNgawi/osx64/iNgawi.app'
  shelljs.exec 'codesign -v --display ./build/iNgawi/osx64/iNgawi.app'
  shelljs.exec 'codesign -v --verify ./build/iNgawi/osx64/iNgawi.app'

# Create a DMG for osx64; only works on OS X because of appdmg
gulp.task 'pack:osx64', ['sign:osx64'], ->
  shelljs.mkdir '-p', './dist'            # appdmg fails if ./dist doesn't exist
  shelljs.rm '-f', './dist/iNgawi.dmg'   # appdmg fails if the dmg already exists

  gulp.src []
    .pipe require('gulp-appdmg')
      source: './src/assets/assets-osx/dmg.json'
      target: './dist/iNgawi.dmg'

# Create a nsis installer for win32; must have `makensis` installed
gulp.task 'pack:win32', ['build:win32'], ->
   shelljs.exec 'makensis ./src/assets/assets-windows/installer.nsi'

# Create packages for linux
[32, 64].forEach (arch) ->
  ['deb', 'rpm'].forEach (target) ->
    gulp.task "pack:linux#{arch}:#{target}", ['build:linux' + arch], ->
      shelljs.rm '-rf', './build/linux'

      move_opt = gulp.src [
        './src/assets/assets-linux/iNgawi.desktop'
        './src/assets/assets-linux/after-install.sh'
        './src/assets/assets-linux/after-remove.sh'
        './src/assets/build/iNgawi/linux' + arch + '/**'
      ]
        .pipe gulp.dest './build/linux/opt/iNgawi'

      move_png48 = gulp.src './src/assets/assets-linux/icons/48/iNgawi.png'
        .pipe gulp.dest './build/linux/usr/share/icons/hicolor/48x48/apps'

      move_png256 = gulp.src './src/assets/assets-linux/icons/256/iNgawi.png'
        .pipe gulp.dest './build/linux/usr/share/icons/hicolor/256x256/apps'

      move_svg = gulp.src './src/assets/assets-linux/icons/scalable/iNgawi.png'
        .pipe gulp.dest './build/linux/usr/share/icons/hicolor/scalable/apps'

      mergeStream move_opt, move_png48, move_png256, move_svg
        .on 'end', ->
          shelljs.cd './build/linux'

          port = if arch == 32 then 'i386' else 'x86_64'
          output = "../../dist/iNgawi_linux#{arch}.#{target}"

          shelljs.mkdir '-p', '../../dist' # it fails if the dir doesn't exist
          shelljs.rm '-f', output          # it fails if the package already exists

          shelljs.exec "fpm -s dir -t #{target} -a #{port} --rpm-os linux -n iNgawi --after-install ./opt/iNgawi/after-install.sh --after-remove ./opt/iNgawi/after-remove.sh --license MIT --category Book --url \"http://ingawi.id\" --description \"iNgawi Desktop.\" -m \"PT Woolu Aksaramaya\" -p #{output} -v #{manifest.version} ."
          shelljs.cd '../..'

# Make packages for all platforms
gulp.task 'pack:all', (callback) ->
  runSequence 'pack:osx64', 'pack:win32', 'pack:linux32:deb', 'pack:linux64:deb', callback

# Build osx64 and run it
gulp.task 'run:osx64', ['build:osx64'], ->
  shelljs.exec 'open ./build/iNgawi/osx64/iNgawi.app'

# Run osx64 without building
gulp.task 'open:osx64', ->
  shelljs.exec 'open ./build/iNgawi/osx64/iNgawi.app'

# Upload release to GitHub
gulp.task 'release', ['pack:all'], (callback) ->
  gulp.src './dist/*'
    .pipe $.githubRelease
      draft: true
      manifest: manifest

# Make packages for all platforms by default
gulp.task 'default', ['pack:all']
