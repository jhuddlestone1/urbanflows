/*	map.js
 *	depends on: leaflet.js
 */

// Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.
// https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png
// https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png
// https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png
// http://{s}.sm.mapstack.stamen.com/streets-and-labels/{z}/{x}/{y}.png
// http://{s}.sm.mapstack.stamen.com/positron/{z}/{x}/{y}.png
// http://{s}.sm.mapstack.stamen.com/darkmatter/{z}/{x}/{y}.png

// Map tiles by <a href="https://carto.com/location-data-services/basemaps/">Carto</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.
// https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png
// https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png

// &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors
// https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png


var Map = {

	MIN_ZOOM: 5,
	MAX_ZOOM: 18,		/* maximum 18 */
	DEFAULT_COORDS: [54, -3],
	DEFAULT_ZOOM: Math.ceil(Math.min(innerWidth, innerHeight)**0.25),

	data: {},
	layers: {},

	create: function (element, coords, defaultZoomOffset=0, initialZoomOffset=0) {
		
		this.frame = L.map(element);

		this.base =	L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png', {
			attribution: `
				Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.
			`,
			minZoom: this.MIN_ZOOM,
			maxZoom: this.MAX_ZOOM,
			detectRetina: true
		});
		this.frame.addLayer(this.base);
		
		//this.layers = L.control.layers(null, null, {sortLayers: true, position: 'topleft'});
		this.frame.zoomControl.setPosition('bottomright');
		this.frame.attributionControl.setPosition('bottomleft');
		L.control.scale().addTo(this.frame).setPosition('bottomleft');

		this.frame.setView(coords || this.DEFAULT_COORDS, this.DEFAULT_ZOOM + defaultZoomOffset);
		// Try to set view to current location
		this.getCoords(location => {
			this.frame.setView(location, this.DEFAULT_ZOOM + defaultZoomOffset + initialZoomOffset);
		});
	},

	getCoords: function (callback) {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(success) => callback([success.coords.latitude, success.coords.longitude]),
				(error) => console.log("Geolocation is not currently enabled by this browser."),
			);
			return true;
		}
		else {
			console.log("Geolocation is not supported by this browser.");
			return false;
		}
	}
}
