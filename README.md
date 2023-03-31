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
- Execute the command ``yarn make --targets=@electron-forge/maker-wix`` 

### Windows appx

In order to build a windows MSI you shall:

- Execute the command ``yarn package``
- Install globally the npm package electron-windows-store ``npm install -g electron-windows-store``
- Configure electron-windows-store, run in an administrator powershell ``electron-windows-store`` 
- Navigate to out directory
- Execute the command ``electron-windows-store --input-directory NPN-win32-x64 --output-directory ./appx --package-version X.X.X.X --package-name npn --package-display-name NPN --publisher-display-name "Node Package Notifier" --assets ../src/main/ressources/ --make-pri true``
- Unzip generated .appx file in a subfolder called npn and navigate to this folder
- Open AppxManifest.xml 
- Add the following namespace ``xmlns:desktop="http://schemas.microsoft.com/appx/manifest/desktop/windows10"``
- Add the following node

``<Application Id="npn" Executable="app\npn.exe" EntryPoint="Windows.FullTrustApplication">
        ...
	  <Extensions>
		<desktop:Extension
			Category="windows.startupTask"
			Executable="app\npn.exe"
			EntryPoint="Windows.FullTrustApplication">
			<desktop:StartupTask TaskId="npnStartup" Enabled="true" DisplayName="NPN" />
		</desktop:Extension>
	  </Extensions>
    </Application>``
- Save the file, close it and navigate to the root folder of the unzipped .appx file
- Run the following command ``makeappx pack -d ".\npn" -p "npn.appx" -l``
- Rn the following command ``signtool.exe sign -f path\to\your\cert.pfx -fd SHA256 -v .\npn.appx``

Sources: 
- [Medium article for electron-windows-store configuration](https://medium.com/@sangamrajpara/publishing-electron-app-to-windows-store-3cadeed26a32)
- [Github issue with procedure to configure logos](https://github.com/electron-userland/electron-builder/issues/987)
- [Microsoft documentation for startupTasks](https://learn.microsoft.com/en-us/uwp/schemas/appxpackage/uapmanifestschema/element-desktop-startuptasks)
