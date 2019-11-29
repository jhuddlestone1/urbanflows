/*
https://sheffield-portal.urbanflows.ac.uk/uflobin/ufdex0A?action=CSV_show
*/

function fetchCSV(options) {
	var url = 'http://stuwww.dcs.shef.ac.uk/people/jhuddlestone1/urbanflows/api.php';
	options = options ? '?' + new URLSearchParams(options).toString() : '';
	return fetch(url + options);
}


/*
	csvToGeoJSON.js
	2019 Jamie Huddlestone
	
	Takes a string corresponding to the CSV_show output from the Urban Flows Observatory portal,
	and creates a canonical GeoJSON object from the data, for use in front-end mapping libraries.
	
	Params:
	csv        - string;  CSV_show output
	timestamps - boolean; if true, add timestamps to output
	stringify  - boolean; if true, return GeoJSON object as string, else return JavaScript object
*/
function csvToGeoJSON(csv, timestamps=false, stringify=false) {

	var collection = {type: 'FeatureCollection', features: []};
	var features = csv.trim().split(/\n{2,}/);
	var camelCase = (str) => str.
		replace(/^\w/, (x) => x.toLowerCase()).
		replace(/\W(\w)/g, (_,x) => x.toUpperCase());

	for (var f = 1; f < features.length; f++) {

		var lines = features[f].split(/\n+/);

		var propertiesArray = lines.filter(x => /^#\s*[\w.]+:/.test(x)).map(x => x.split(/:?\s+/));
		var properties = {};
		for (var p = 0; p < propertiesArray.length; p++) {
			var propertyName = camelCase(propertiesArray[p][1]);
			properties[propertyName] = Number(propertiesArray[p][2]) || propertiesArray[p][2];
		}

		var columnsArray = lines.filter(x => /^#\s*Column/.test(x)).map(x => x.split(/\s+\/\s+/));
		var data = {};
		for (var c = 2; c < columnsArray.length; c++) {
			var columnName = camelCase(columnsArray[c][1]);
			var property = data[columnName] = {};
			property.units = columnsArray[c][2];
			property.description = columnsArray[c][4];
			property.minValue = Number(columnsArray[c][6]);
			property.maxValue = Number(columnsArray[c][7]);
			property.avgValue = Number(columnsArray[c][8]);
			property.lastValue = Number(columnsArray[c][9]);
		}

		if (timestamps) {
			var timesArray = lines.filter(x => /^[^#]/.test(x)).map(x => x.split(/,/));
			var times = {};
			for (var t = 0; t < timesArray.length; t++) {
				var values = times[timesArray[t][0]] = {};
				for (var v = 2; v < timesArray[t].length; v++) {
					var valueName = camelCase(columnsArray[v][1]);
					values[valueName] = Number(timesArray[t][v]) || timesArray[t][v];
				}
			}
		}

		var point = {
			type: 'Feature',
			geometry: {
				type: 'Point',
				coordinates: [properties.siteLongitude, properties.siteLatitude]
			},
			properties: properties,
			data: data
		};
		if (timestamps) point.timestamps = times;

		collection.features.push(point);
	}

	return stringify ? JSON.stringify(collection) : collection;
}