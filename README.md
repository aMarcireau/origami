![origami](banner.png "The Origami banner")

## Presentation

Origami is an open-source research tool focused on graphical representations of data.

## Download

Visit the [releases page](releases) to download Origami for your platform.

## Contribute

Origami is build with [Electron](https://electronjs.org), [React](https://reactjs.org) and [Redux](https://redux.js.org).

Follow these steps to download the source code, edit and build Origami:

1. Install [Node.js](https://nodejs.org).
2. Clone the repository by running from a terminal `git clone git@github.com:aMarcireau/origami.git`.
3. Go to the created *origami* folder and run `npm install`.

For development, run form the *origami* folder: `npm start`. This command will trigger a development build whenever something from the *souce* directory changes.

In order to create a new release, run `npm run-script build` to generate production builds for each supported platform, and `npm run-scrit release` to create a new Github release. The latter requires administration rights on this repository, and must run after creating the production builds.
