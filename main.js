let lat = 999;
let long = 999;
let strCoord = null;
const coordInfoSet = new Set();
window.__catguessrLocations = [];
window.__catguessrLatestLocation = null;

function isDecimal(str) {
    str = String(str);
    return !isNaN(str) && str.includes('.') && !isNaN(parseFloat(str));
}

window.addEventListener('message', async function (e) {
    if (e.data?.type !== 'xhr') return;

    const msg = e.data.data;
    if (msg) {
        try {
            const arr = JSON.parse(msg);
            let foundCoords = false;
            try {
                const nextLat = arr[1][0][5][0][1][0][2];
                const nextLong = arr[1][0][5][0][1][0][3];

                if (isDecimal(nextLat) && isDecimal(nextLong)) {
                    lat = nextLat;
                    long = nextLong;
                    foundCoords = true;
                }
            } catch (e) {
                // useless to output
            }

            if (!foundCoords) {
                try {
                    const nextLat = arr[1][5][0][1][0][2];
                    const nextLong = arr[1][5][0][1][0][3];

                    if (isDecimal(nextLat) && isDecimal(nextLong)) {
                        lat = nextLat;
                        long = nextLong;
                        foundCoords = true;
                    }
                } catch (e) {
                    // useless to output
                }
            }

            if (!foundCoords) return;

            strCoord = null;
            const coordInfo = await getCoordInfo();
            if (coordInfo) {
                coordInfoSet.add(JSON.stringify(coordInfo));
                const lastCoordInfo = Array.from(coordInfoSet).at(-1);
                if (lastCoordInfo) {
                    const osmUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${long}#map=12/${lat}/${long}`;
                    const location = {
                        address: JSON.parse(lastCoordInfo),
                        lat,
                        long,
                        osmUrl
                    };

                    window.__catguessrLatestLocation = location;
                    window.__catguessrLocations = Array.from(coordInfoSet).map((entry) => JSON.parse(entry));
                    console.log(location.address, location.osmUrl);
                }
            }
        } catch {
            return;
        }
    }
});

async function getCoordInfo() {
    if (strCoord !== null) {
        return strCoord;
    }

    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${long}&format=json`);

        if (!response.ok) {
            return;
        }

        const data = await response.json();
        strCoord = data.address;
        return data.address;
    } catch {
        return;
    }
}
