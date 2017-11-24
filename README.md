![origami](banner.png "The Origami banner")

## Presentation

Origami is an open-source research tool focused on graphical representations of data.

## Download

Visit the [Releases](https://github.com/aMarcireau/origami/releases)  page to download Origami for your platform. MacOS users should download *Origami-darwin-x64.zip*.

## Themes

To change the color theme, edit the *colors.json* file with the path:
- *Origami/resources/app/colors.json* under Linux
- *Origami.app/Contents/Resources/app/colors.json* under macOS (right-cick on the app and choose *Show Package Contents*)
- *Origami\resources\app\colors.json* under Windows

The *themes* directory of this repository contains several themes suggestions.

## Contribute

### Install

Origami is build with [Electron](https://electronjs.org), [React](https://reactjs.org) and [Redux](https://redux.js.org).

Follow these steps to download the source code, edit and build Origami:

1. Install [Node.js](https://nodejs.org).
2. Clone the repository by running from a terminal `git clone https://github.com/aMarcireau/origami.git`.
3. Go to the created *origami* folder and run `npm install`.

For development, run from the *origami* folder the command `npm start`. It will trigger a development build whenever something from the *souce* directory changes.

In order to create a new release, run:
1. `npm run build` to generate production builds for each supported platform
2. `npm run release -- v<major>.<minor>.<patch> [--prerelease]` to create a new Github release (requires administration rights on this repository).

### Help out

Check the [Projects](https://github.com/aMarcireau/origami/projects) page to see what's urgent or expected by the community.

## License

See the [LICENSE](LICENSE.txt) file for license rights and limitations (MIT).
