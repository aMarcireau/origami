![origami](banner.png "The Origami banner")

## Presentation

Origami is an open-source research tool focused on graphical representations of data.

## Download

Visit the [releases page](https://github.com/aMarcireau/origami/releases) to download Origami for your platform.

## Themes

To change the color theme, edit the *colors.json* file with the path:
- *Origami/resources/app/colors.json* under Linux
- *Origami.app/Contents/Resources/app/colors.json* under macOS (right-cick on the app and choose *Show Package Contents*)
- *Origami\resources\app\colors.json* under Windows

The *themes* directory of this repository contains several themes suggestions.

## Contribute

Origami is build with [Electron](https://electronjs.org), [React](https://reactjs.org) and [Redux](https://redux.js.org).

Follow these steps to download the source code, edit and build Origami:

1. Install [Node.js](https://nodejs.org).
2. Clone the repository by running from a terminal `git clone git@github.com:aMarcireau/origami.git`.
3. Go to the created *origami* folder and run `npm install`.

For development, run form the *origami* folder: `npm start`. This command will trigger a development build whenever something from the *souce* directory changes.

In order to create a new release, run:
1. `npm run build` to generate production builds for each supported platform
2. `npm run release -- v<major>.<minor>.<patch> [--prerelease]` to create a new Github release (requires administration rights on this repository).

## License

See the [LICENSE](LICENSE.txt) file for license rights and limitations (MIT).
