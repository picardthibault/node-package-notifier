# Node Package Notifier

This repository holds the source code of the NPN application. It's a electronJS build to help developpers to keep they npm module up to date by sending a native notification when a new npm module version are released.

This repository is under a GPL-3 licence, please read [LICENCE file](https://github.com/picardthibault/node-package-notifier/blob/main/LICENCE) for more information.

## Application architecture

NPN is an electronJS app written in Typescript. It use electron-forge with webpack to build the main and renderer process. The renderer process is a ReactJS app with Antdesign as UI library.

## Dev instruction

If you want to make some development on this projet you can run the command ``yarn start`` to launch the app in development mode. It will create a webpack dev server for the renderer process so if you are working only on the renderer process you does not have to close and reload the entire app after each modification.

## Build instruction

At the moment only build of Windows MSI have been tested.

### Windows MSI

In order to build windows MSI you shall:

- Install Wix toolkit v3 [[link]](https://wixtoolset.org/docs/wix3/)
- Add bin/ folder of the Wix toolkit in your path
- Excute the command ``yarn make --targets=@electron-forge/maker-wix`` 
