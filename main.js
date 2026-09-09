let lat = 999;
let long = 999;
let strCoord = null;
let lastSavedCoord = null;
const MIN_COORD_DISTANCE_METERS = 1000;
const coordSet = new Set();
const coordInfoSet = new Set();
window.__catguessrLocations = [];
window.__catguessrLatestLocation = null;

function isDecimal(str) {
    str = String(str);
    return !isNaN(str) && str.includes('.') && !isNaN(parseFloat(str));
}

function getDistanceMeters(firstCoord, secondCoord) {
    const earthRadiusMeters = 6371000;
    const firstLat = Number(firstCoord.lat) * Math.PI / 180;
    const secondLat = Number(secondCoord.lat) * Math.PI / 180;
    const latDiff = (Number(secondCoord.lat) - Number(firstCoord.lat)) * Math.PI / 180;
    const longDiff = (Number(secondCoord.long) - Number(firstCoord.long)) * Math.PI / 180;
    const a = Math.sin(latDiff / 2) ** 2 + Math.cos(firstLat) * Math.cos(secondLat) * Math.sin(longDiff / 2) ** 2;

    return earthRadiusMeters * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
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

            const coord = JSON.stringify({ lat, long });
            if (coordSet.has(coord)) return;

            if (lastSavedCoord && getDistanceMeters(lastSavedCoord, { lat, long }) < MIN_COORD_DISTANCE_METERS) return;

            coordSet.add(coord);
            lastSavedCoord = { lat, long };
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
                    console.log({ lat, long });
                    console.log(location.address, location.osmUrl);
                }
            } else {
                console.log({ lat, long });
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
