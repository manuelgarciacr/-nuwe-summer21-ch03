import tt from "@tomtom-international/web-sdk-maps";
import { EntryPoints } from "./EntryPoints";
import { SearchMarker } from "./SearchMarker";

// function checkDependencyAvailability() {
//     if (!window.tt) {
//         throw new Error('tt is not available');
//     }
//     if (!window.SearchMarker) {
//         throw new Error('Search Marker is not available');
//     }
// }

function addEntryPointsMapLayersIfNecessary(map: tt.Map, options: any) {
    if (options.entryPoints) {
        map.addSource('entry-points-connectors', {
            'type': 'geojson',
            'data': {
                'type': 'FeatureCollection',
                'features': []
            }
        });

        map.addLayer({
            id: 'entry-points-connectors',
            type: 'line',
            source: 'entry-points-connectors',
            layout: {
                'line-cap': 'round',
                'line-join': 'round'
            },
            paint: {
                'line-color': '#000',
                'line-width': 0.5,
                'line-dasharray': [10, 10]
            },
            filter: ['in', '$type', 'LineString']
        });
    }
}

interface IPoi {
    type: string,
    id: any,
    poi: {
        name: string,
        classifications: [
            {code: string}
        ]
    },
    address: {
        freeformAddress: string,
        country: string
    },
    dist: any,
    position: any,
    entryPoints: any
}

export class SearchMarkersManager {
    map: tt.Map;
    _options: {};
    _poiList: IPoi[] = [];
    markers: {[k: string]: any} = {};
    _lastClickedMarker: EntryPoints | null = null;
    
    constructor(map: tt.Map, options?: {}) {
        if (!map || typeof map !== 'object') {
            throw new Error('map is not valid');
        }

        this.map = map;
        this._options = options || {};
        addEntryPointsMapLayersIfNecessary(map, this._options);
    }

    draw = (poiList: IPoi[]) => {
        if (!(poiList && Array.isArray(poiList))) {
            throw new Error('Poi list(poiList) must be an array');
        }
        this._poiList = poiList;
        this.clear();
        this._poiList.forEach(function (this: SearchMarkersManager, poi) {
            const markerId = poi.id;

            const poiOpts = {
                name: poi.poi ? poi.poi.name : undefined,
                address: poi.address ? poi.address.freeformAddress : '',
                distance: poi.dist,
                classification: poi.poi ? poi.poi.classifications[0].code : undefined,
                position: poi.position,
                entryPoints: poi.entryPoints
            };

            if (poiOpts.name === undefined && poi.type === 'Geography') {
                poiOpts.name = poi.address ? poi.address.freeformAddress : '';
                poiOpts.address = poi.address.country;
            }
            const marker = new SearchMarker(poiOpts, this._options);
            marker.onClick(function(this: SearchMarkersManager, clickedMarker: EntryPoints) {
                
                if (this._lastClickedMarker && this._lastClickedMarker !== clickedMarker) {
                    this._lastClickedMarker?.clearEntryPoints();
                }
                this._lastClickedMarker = clickedMarker;
            }.bind(this));
            marker.addTo(this.map);
            this.markers[markerId] = marker;
        }, this);
    }

    getMarkers = () => this.markers;

    openPopup = (markerId: string) => {
        //this ensures, that only one popup is opened at the time
        for (const marker in this.markers) {
            const current = this.markers[marker];
            if (current.getPopup().isOpen()) {
                current.togglePopup();
            }
        }
        this.markers[markerId].togglePopup();
    };

    jumpToMarker = (markerId: string) => this.map.jumpTo({ center: this.markers[markerId].getLngLat(), zoom: 16 });

    getMarkersBounds = () => {
        const bounds = new tt.LngLatBounds();
    
        for (const marker in this.markers) {
            bounds.extend(this.markers[marker].getLngLat());
        }
    
        return bounds;
    };
    
    clear = () => {
        for (const markerId in this.markers) {
            const marker = this.markers[markerId];
            marker.remove();
        }
        this.markers = {};
        this._lastClickedMarker = null;
    }
}
