import * as tt from "@tomtom-international/web-sdk-maps";
import { EntryPoints } from "./EntryPoints";
import { SearchIconCreator } from "./SearchIconCreator";
import { SearchMarkerPopup } from "./SearchMarkerPopup";

export class SearchMarker {
    poiData:any;
    options: any; 
    marker: tt.Marker; 
    _map: tt.Map | null = null;
    entryPoints: any;
    _onClickCallback: any;

    constructor (poiData: any, options: any) {
        this.poiData = poiData;
        this.options = options || {};
        this.marker = new tt.Marker({
            element: this.createMarker(),
            anchor: 'bottom'
        });
        const lon = this.poiData.position.lng || this.poiData.position.lon;
        this.marker.setLngLat([
            lon,
            this.poiData.position.lat
        ]);
        this.marker.setPopup(new SearchMarkerPopup(this.poiData, this.options));
    }
    
    createMarker = () => {
        const elem = document.createElement('div');
        elem.className = 'tt-icon-marker-black tt-search-marker';
        if (this.options.markerClassName) {
            elem.className += ' ' + this.options.markerClassName;
        }
        const innerElem = document.createElement('div');
        innerElem.setAttribute('style', 'border-radius: 50%; border: 3px solid black;');
        const icon = new SearchIconCreator('white', this.poiData).getIcon();
        innerElem.className = 'marker-inner ' + icon;
        elem.appendChild(innerElem);
        this.drawEntryPoints(elem);
        return elem;
    }

    addTo = (map: tt.Map) => {
        this.marker.addTo(map);
        if (this.entryPoints) {
            this.entryPoints.bindMap(map);
        }
        this._map = map;
        return this;
    }

    remove = () => {
        this.marker.remove();
        if (this.entryPoints) {
            this.entryPoints.clearEntryPoints();
        }
        this._map = null;
        this._onClickCallback = null;
    }

    getLngLat = () => this.marker.getLngLat();
    
    getPopup = () => this.marker.getPopup();
    
    togglePopup = () => this.marker.togglePopup();
    
    onClick = (callback: any) => { this._onClickCallback = callback} ;
    
    drawEntryPoints = (elem: any) => {
        if (this.options.entryPoints && this.poiData.entryPoints) {
            this.entryPoints = new EntryPoints(this.poiData, elem, this.options);
        }
    };
}
