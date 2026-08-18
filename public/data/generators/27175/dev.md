# Notes about the Universal Rayhatcher dev environment

The ***Universal Rayhatcher dev environment*** is a modified version of the official fx(lens) development environment with some extra features. It's not hosted by fx(hash).

But it's way easier to use so it is generally recommended to develop your SDFs there, and then copy over the params to the fx(hash) minting page. If you do so, be sure to set the correct [Minter address](#minter-address).

## Links

* [Universal Rayhatcher dev environment](https://extreme-rayhatching.netlify.app/)

* [Documentation](https://gist.github.com/tripzilch/9042195ae6f62901909ff7c99aeb8fcc)

## Keyboard shortcuts

* **ctrl-enter** to click the "Refresh" button.
* **ctrl-,** and **ctrl-.** will page the params through a sort of undo history (especially useful if you accidentally close or reload).

## Presets

The numbered buttons are "presets" you can shift-click to save, click to load, alt-click to clear and ctrl-click to copy the params as JSON to your clipboard.

The presets are saved in the browser's `localStorage` which gets cleared when you clear cookies and sometimes when you restart the browser. Be sure to back up your favourite formulas in a text file!

## Minter address

The *Title Seed* and the *Minter address* are concatenated to seed the PRNG for everything. This includes the camera viewpoint, the light source location and the exact shapes in the noise function.

When developing SDFs in the ***Universal Rayhatcher dev environment***, make sure to set the *Minter address* to the wallet address that you will mint from.

If you want to automatically set the *Minter address*, you can use a URL like this:

https://extreme-rayhatching.netlify.app/?target=https://extreme-rayhatching.netlify.app/dist?fxminter=tz1YOURWALLETADDRESSHERE


