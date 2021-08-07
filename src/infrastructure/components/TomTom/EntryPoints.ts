import tt from "@tomtom-international/web-sdk-maps";
import { SearchMarkerPopup } from "./SearchMarkerPopup";

const ENTRY_POINTS_CONNECTORS_SOURCE_NAME = 'entry-points-connectors';

function createGeoJsonFeaturesCollection(): {type: string, features: any[]} {
    return {
        'type': 'FeatureCollection',
        'features': []
    };
}

function createGeoJsonLine(from: any, to: any) {
    return {
        'type': 'Feature',
        'geometry': {
            'type': 'LineString',
            'coordinates': [from, to]
        }
    };
}

export class EntryPoints {
    options: any;
    poiData: any;
    poiMarker: any
    reverseGeocodeService: any;
    entryPointsMarkers: any;
    entryPointsMarkersMapping: any;
    map: tt.Map | undefined;

    constructor (poiData: any, poiMarker: any, options: any) {
        if (!options.reverseGeocodeService) {
            throw new Error('In order to show entry points, you need to pass reverseGeocode service');
        }
        this.options = options;
        this.poiData = poiData;
        this.poiMarker = poiMarker;
        this.reverseGeocodeService = options.reverseGeocodeService;
        this.entryPointsMarkers = [];
        this.entryPointsMarkersMapping = [];
        this.draw();
    }

    _drawCounter = () => {
        const entryPointsCounter = document.createElement('div');
        entryPointsCounter.className = 'entry-points-counter';
        entryPointsCounter.innerText = String(this.poiData.entryPoints.length);
        this.poiMarker.appendChild(entryPointsCounter);
    }

    mainMarkerClick = () => {
        if (this.entryPointsMarkers.length > 0) {
            this.clearEntryPoints();
        } else {
            this.renderEntryPoints();
            this.getEntryPointsAddresses().then(function(this: EntryPoints) {
                this.updateEntryPointMarkerPopups();
            }.bind(this));
        }
    };
 
    clearEntryPoints = () => {
        this.entryPointsMarkers.forEach(function(this: EntryPoints, marker: any) {
            marker.remove();
            const src = this.map?.getSource(ENTRY_POINTS_CONNECTORS_SOURCE_NAME)
            if (src && (src as any).setData)
                (src as any).setData(createGeoJsonFeaturesCollection());
        }, this);
        this.entryPointsMarkers = [];
        this.entryPointsMarkersMapping = [];
    }

    renderEntryPoints = () => {
        const parentMarkerPosition = [this.poiData.position.lng, this.poiData.position.lat];
        const featuresCollection = createGeoJsonFeaturesCollection();
    
        this.poiData.entryPoints.forEach(function(this: EntryPoints, entryPoint: any) {
            const entryPointMarker = this.createEntryPointMarker(entryPoint);
    
            featuresCollection.features.push(createGeoJsonLine(parentMarkerPosition, [
                entryPoint.position.lng,
                entryPoint.position.lat
            ]));
            if (this.map)
                entryPointMarker.addTo(this.map);
            this.entryPointsMarkers.push(entryPointMarker);
            this.entryPointsMarkersMapping.push({entryPoint: entryPoint, entryPointMarker: entryPointMarker});
        }, this);
        const src = this.map?.getSource(ENTRY_POINTS_CONNECTORS_SOURCE_NAME)
        if (src && (src as any).setData)
            (src as any).setData(featuresCollection);
}

    getEntryPointsAddresses = () => {
        var batchItems = this.poiData.entryPoints.map(function(entryPoint: any) {
            return { position: entryPoint.position.lng + ',' + entryPoint.position.lat };
        });
        return this.reverseGeocodeService({
            batchItems: batchItems
        }).then(function(this: EntryPoints, addresses: any) {
            for (var i = 0; i < addresses.batchItems.length; i++) {
                this.poiData.entryPoints[i].address = addresses.batchItems[i].addresses[0].address;
            }
        }.bind(this));
    };

    bindMap = (map: tt.Map) => {
        this.map = map;
    };

    createEntryPointMarker = (entryPoint: any) => {
        const entryPointsMarker = new tt.Marker({
            element: this.renderEntryPointMarkerElem(),
            anchor: 'bottom'
        });
    
        entryPointsMarker.setPopup(this.getLoadingPopup());
        entryPointsMarker.setLngLat(entryPoint.position);
        return entryPointsMarker;
    }

    getLoadingPopup = () => {
        const spinner = document.createElement('div');
        spinner.setAttribute('class', 'loading-circle-small');
    
        const popup = new tt.Popup({ offset: [0, -38] });
        popup.setDOMContent(spinner);
    
        return popup;
    }

    updateEntryPointMarkerPopups = () => {
        this.entryPointsMarkersMapping.forEach(function(this: EntryPoints, mapping: any) {
            const entryPointMarker = mapping.entryPointMarker;
            const entryPoint = mapping.entryPoint;
    
            const isOpen = entryPointMarker.getPopup().isOpen();
    
            entryPointMarker.getPopup().remove();
            const popup = this.getEntryPointMarkerPopup(entryPoint);
            entryPointMarker.setPopup(popup);
    
            if (isOpen) {
                entryPointMarker.togglePopup();
            }
        }.bind(this));
    }

    getEntryPointMarkerPopup = (entryPoint: any) => {
        const poiData = {
            name: this.poiData.name,
            address: entryPoint.address.freeformAddress + ', ' + entryPoint.address.countryCodeISO3,
            classification: this.poiData.classification,
            position: entryPoint.position,
            type: entryPoint.type
        };
        return new SearchMarkerPopup(poiData, this.options);
    }

    renderEntryPointMarkerElem = () => {
        const elem = document.createElement('div');
        elem.className = 'tt-entry-point-marker';
    
        const icon = document.createElement('div');
        icon.className = 'icon tt-icon-ic_entry_point';
        elem.appendChild(icon);
    
        const pointer = document.createElement('div');
        pointer.className = 'pointer';
        icon.appendChild(pointer);
    
        return elem;
    }

    draw = () => {
        this._drawCounter();
        this.poiMarker.addEventListener('click', this.mainMarkerClick.bind(this));
    }
}
