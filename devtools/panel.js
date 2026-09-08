const empty = document.getElementById('empty');
const map = document.getElementById('map');
const locationHeader = document.getElementById('locationHeader');
const city = document.getElementById('city');
const country = document.getElementById('country');
let currentMapUrl = null;

function getCity(address) {
    return address.city || address.town || address.village || address.municipality || address.county || address.state || 'Unknown city';
}

function getEmbedUrl(lat, long) {
    const latitude = Number(lat);
    const longitude = Number(long);
    const offset = 8;
    const bbox = [
        longitude - offset,
        latitude - offset,
        longitude + offset,
        latitude + offset
    ].join('%2C');

    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude}%2C${longitude}`;
}

function updatePanel(location) {
    if (!location || location.lat == null || location.long == null) return;

    const address = location.address || {};
    const mapUrl = getEmbedUrl(location.lat, location.long);
    if (mapUrl === currentMapUrl) return;

    currentMapUrl = mapUrl;
    city.textContent = getCity(address);
    country.textContent = address.country || 'Unknown country';
    locationHeader.style.display = 'block';
    map.src = mapUrl;
    map.style.display = 'block';
    empty.style.display = 'none';
}

function pollLocation() {
    chrome.devtools.inspectedWindow.eval(
        'window.__catguessrLatestLocation',
        function (location, error) {
            if (!error) updatePanel(location);
        }
    );
}

pollLocation();
setInterval(pollLocation, 1000);
