# Node Package Notifier

This repository holds the source code of the NPN application. It's a electronJS build to help developpers to keep they npm module up to date by sending a native notification when a new npm module version are released.

This repository is under a GPL-3 licence, please read [LICENCE file](https://github.com/picardthibault/node-package-notifier/blob/main/LICENCE) for more information.

## Application distribution
The application is available on the Windows [Microsoft Store](https://apps.microsoft.com/store/detail/nodepackagenotifier/9PJL1B4F0JM0).

## Application architecture

NPN is an electronJS app written in Typescript. It use electron-forge with webpack to build the main and renderer process. The renderer process is a ReactJS app with Antdesign as UI library.

## Dev instruction

If you want to make some development on this projet you can run the command ``yarn start`` to launch the app in development mode. It will create a webpack dev server for the renderer process so if you are working only on the renderer process you does not have to close and reload the entire app after each modification.

## Build instruction

At the moment only build of Windows builds have been tested (MSI and Appx).

### Windows MSI

In order to build windows MSI you shall:

- Install [Wix toolkit v3](https://wixtoolset.org/docs/wix3/)
- Add bin/ folder of the Wix toolkit in your path
- Execute the command ``yarn make --targets=@electron-forge/maker-wix`` 

### Windows appx

In order to build a windows appX you shall:

- Update *@electron-forge/maker-appx* configuration in *forge.config.ts* file
- Execute the command ``yarn make --targets=@electron-forge/maker-appx``
- Unzip generated .appx file in a subfolder called nodepackagenotifier and navigate to this folder
- Open AppxManifest.xml 
- Add the following namespace ``xmlns:desktop="http://schemas.microsoft.com/appx/manifest/desktop/windows10"``
- Add the following node

```xml
<Application Id="npn" Executable="app\node-package-notifier.exe" EntryPoint="Windows.FullTrustApplication">
	<Extensions>
	<desktop:Extension
		Category="windows.startupTask"
		Executable="app\node-package-notifier.exe"
		EntryPoint="Windows.FullTrustApplication">
		<desktop:StartupTask TaskId="npnStartup" Enabled="true" DisplayName="node-package-notifier" />
	</desktop:Extension>
	</Extensions>
</Application>
```
- Save the file, close it and navigate to the root folder of the unzipped .appx file
- Run the following command ``makeappx pack -d ".\nodepackagenotifier" -p "nodepackagenotifier.appx" -l``
- Rn the following command ``signtool.exe sign -f path\to\your\cert.pfx -fd SHA256 -v .\nodepackagenotifier.appx``

Sources: 
- [Medium article for electron-windows-store configuration](https://medium.com/@sangamrajpara/publishing-electron-app-to-windows-store-3cadeed26a32)
- [Github issue with procedure to configure logos](https://github.com/electron-userland/electron-builder/issues/987)
- [Microsoft documentation for startupTasks](https://learn.microsoft.com/en-us/uwp/schemas/appxpackage/uapmanifestschema/element-desktop-startuptasks)
- [Inspiration for windows startupTasks](https://www.npmjs.com/package/electron-winstore-auto-launch)
