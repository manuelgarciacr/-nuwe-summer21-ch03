import tt from "@tomtom-international/web-sdk-maps";
import { SearchIconCreator } from "./SearchIconCreator";

export class SearchMarkerPopup extends tt.Popup{
    poiData: any;
    options: any;

    constructor (poiData: any, options: any) {
        super(options)
        this.poiData = poiData;
        this.options = options;
        return this.createPopup();
    }
    
    createPopup = () => 
        new tt.Popup({ offset: [0, -38] })
            .setDOMContent(this.createPopupContent()) as SearchMarkerPopup;

    createPopupContent = () => {
        const popupParentElem = document.createElement('div');
        popupParentElem.className = 'tt-pop-up-container';
    
        if (this.options.popupClassName) {
            popupParentElem.className += ' ' + this.options.popupClassName;
        }
    
        const popupIconContainer = document.createElement('div');
        popupIconContainer.className = 'pop-up-icon';
        const iconElem = document.createElement('div');
        iconElem.className = new SearchIconCreator('black', this.poiData).getIcon();
        popupIconContainer.appendChild(iconElem);
    
        const popupContentElem = document.createElement('div');
        popupContentElem.className = 'pop-up-content';
    
        const addressInformationElem = document.createElement('div');
    
        if (this.poiData.name) {
            this.createDivWithContent('pop-up-result-name', this.poiData.name, addressInformationElem);
        }
    
        this.createDivWithContent('pop-up-result-address', this.poiData.address, addressInformationElem);
    
        const longitude = this.poiData.position.lon ? this.poiData.position.lon : this.poiData.position.lng;
        this.createDivWithContent('pop-up-result-position', this.poiData.position.lat +
            ', ' + longitude, addressInformationElem);
    
        if (this.poiData.type) {
            this.createDivWithContent('pop-up-result-type', this.poiData.type + ' entry', addressInformationElem);
        }
    
        popupParentElem.appendChild(popupIconContainer);
        popupParentElem.appendChild(popupContentElem);
        popupContentElem.appendChild(addressInformationElem);
    
        if (this.poiData.distance) {
            this.createDivWithContent('pop-up-result-distance',
                this.convertDistance(this.poiData.distance), popupContentElem);
        }
    
        return popupParentElem;
    }

    createDivWithContent = (className: string, content: any, parent: any) => {
        const elem = document.createElement('div');
        elem.className = className;
        elem.appendChild(document.createTextNode(content));
        parent.appendChild(elem);
    }
    
    convertDistance = function(distanceMeters: number) {
        var distance = Math.round(distanceMeters);
    
        if (distance >= 1000) {
            return Math.round(distance / 100) / 10 + ' km';
        }
        return distance + ' m';
    }
}
