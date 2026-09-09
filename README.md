# CatGuessr - Subtle GeoGuessr Cheat Tooling
A geoguessr cheat that opens an OpenStreetMap iframe in the devtools, pinpointing the exact location of your current game.

-- **Tested in all gamemodes** --

## How To Use

1. **Installation**
   - Clone or download the repository to your local machine.
   - Open Google Chrome and navigate to `chrome://extensions/`.
   - Enable the "Developer mode" toggle switch in the top right corner.
   - Click on the "Load unpacked" button and select the directory where you saved the extension files.

2. **Usage**
   1. After installing the extension, navigate to the GeoGuessr Website.
   2. Open the Devtools
   3. Click the 2 Arrows in the top right and select "CatGuessr"
   4. Start a game an enjoy.
   5. (Optionally) Press the 3 Dots in the very top right, under `Dock Side` select the `Undock` Icon to turn the Devtools into a seperate window you can move around and put on your second monitor.

## Fallback
- If OpenStreetMap fails to load because of whatever reason, the latitude & longtidute will be logged in the console, allowing a manual lookup in google maps.
