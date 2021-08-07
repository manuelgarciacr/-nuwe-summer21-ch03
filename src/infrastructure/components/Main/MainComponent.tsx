import * as React from "react";
import { useState, useEffect, useRef, MutableRefObject } from "react";
import {
    Container,
    Row,
    Col,
    Navbar,
    NavbarBrand
} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import * as tt from "@tomtom-international/web-sdk-maps";
import axios from "axios";
import circle from '@turf/circle';

import { SearchMarkersManager } from "../TomTom/SearchMarkersManager";
import SidePanel from "./SidePanel";

import "../../css/index.css";
import "../../css/poi.css";
import Button from "@material-ui/core/Button";
import useStyles from "./styles";

interface moveEvent extends tt.TTEvent {
    geolocateSource: boolean
}

function Main() {
    const classes = useStyles();
    const mapElement = useRef() as MutableRefObject<HTMLDivElement>;
    const [localization, setLocalization] = useState<tt.LngLat>();
    const [center, setCenter] = useState<tt.LngLat>(new tt.LngLat(0, 0));
    // const [radius, setRadius] = useState(200)
    const [error, setError] = useState("");
    const [map, setMap] = useState<tt.Map | null>(null);
    const [searchMarkersManager, setSearchMarkersManage] = useState<SearchMarkersManager>();
    const [isStyleData, setStyleData] = useState(false);
    
    //////////////////////////////////////////////////////
    //
    // Origin Point Marker
    //

    // Set search origin center
    const onDragEnd = () => {
        setCenter(centerMarker.getLngLat());
    }

    // Origin point marker 
    const [centerMarker, setCenterMarker] = useState(
        () => {
            const marker = new tt.Marker({
                draggable: true,
                color: "blue"
            })
                .setLngLat(center)
                .on('dragend', onDragEnd);
            marker.getElement().classList.add("cls-center-marker");
            return marker
        }
    
    );

    // Custom control for move the origin point marker 
    const CustomControl = () => {
        return (
            <Button onClick={() => setCenter(map!.getCenter())} className={classes.customControl}>
                <svg width="30" height="30" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" preserveAspectRatio="none"><path fill="black" d="M285.81 179.765a11.96 11.96 0 0 0-8.483-3.513 11.97 11.97 0 0 0-8.486 3.514 11.962 11.962 0 0 0-3.51 8.486c0 3.315 1.344 6.316 3.517 8.488 2.17 2.17 8.482 7.112 8.482 7.112s6.312-4.943 8.484-7.115a11.962 11.962 0 0 0 3.515-8.485 11.97 11.97 0 0 0-3.518-8.487zM22.957 13.3L13.03 8.53v9.535zM11.71 7.674c.01-1.144-1.99-1.202-1.99-.096v16.207h1.986"></path></svg>
            </Button>
        )
    }

    //
    // Origin Point Marker
    //
    //////////////////////////////////////////////////////

    
    //////////////////////////////////////////////////////
    //
    // Handle Search
    //

    const handleSearch = async (categorySet: string[], radius: number) => {
        if (!map)
            return;
console.log("handleSearch", radius, map.getLayer("radiusofsearch"))
        const data = circle(center.toArray(), radius / 1000);
console.log("DATAS", data);
        (map.getSource('radiusofsearch') as tt.GeoJSONSource).setData(data);
        const cat = categorySet.length ? categorySet.join(',') : "0000"
        const query = "";
        const baseUrl = 'https://api.tomtom.com/search/2/nearbySearch';
        const queryString = `&limit=110&lat=${center?.lat}&lon=${center?.lng}&radius=${radius}&language=es-ES&categorySet=${cat}&key=${process.env.REACT_APP_NUWE2103_API_KEY || ""}`;
        const response = await axios.get(`${baseUrl}/${query}.json?${queryString}`);
console.log("END handleSearch")
        handleResultsFound({data: {results: {fuzzySearch: {results: response.data.results}}}})
    }

    function handleResultsFound(event: { data: { results: { fuzzySearch: { results: any; }; }; }; }) {
        var results = event.data.results.fuzzySearch.results;
        if (results.length === 0) {
            searchMarkersManager?.clear();
        }
        searchMarkersManager?.draw(results);
        fitToViewport(results);
    }

    function fitToViewport(markerData: string | any[]) {
console.log("fitToViewport", markerData)        
        // eslint-disable-next-line no-mixed-operators
        if (!markerData || markerData instanceof Array && !markerData.length) {
            return;
        }
        var bounds = new tt.LngLatBounds();
        if (markerData instanceof Array) {
            markerData.forEach(function (marker) {
                 bounds.extend(getBounds(marker));
            });
        } else {
            bounds.extend(getBounds(markerData));
        }
        map?.fitBounds(bounds, { padding: 10, linear: true });
    }
    
    function getBounds(data: any):tt.LngLatBounds {
        if (data.viewport) {
            const btmRight = data.viewport.btmRightPoint.lng || data.viewport.btmRightPoint.lon;
            const topLeft = data.viewport.topLeftPoint.lng || data.viewport.topLeftPoint.lon;
            const sw = new tt.LngLat(btmRight, data.viewport.btmRightPoint.lat);
            const ne = new tt.LngLat(topLeft, data.viewport.topLeftPoint.lat);
            return new tt.LngLatBounds(sw, ne);
        }
        return new tt.LngLatBounds(undefined, undefined)
    }
    
    //
    // Handle Search
    //
    //////////////////////////////////////////////////////

    useEffect(() => {
console.log("useEffect MAP")
        const map = tt.map({
            key: process.env.REACT_APP_NUWE2103_API_KEY || "",
            container: mapElement.current!,
            center: localization,
            zoom: 17, // mapZoom,
            stylesVisibility: {
                poi: true
            },
        });
        map.addControl(new tt.FullscreenControl());
        const geolocateControl = new tt.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            showAccuracyCircle: false,
            trackUserLocation: false,
            showUserLocation: false,
            fitBoundsOptions: {zoom: 16}
        });
        map.addControl(geolocateControl);
        map.addControl(new tt.NavigationControl({showZoom: false, showExtendedRotationControls: true, showPitch: true, showExtendedPitchControls: true}));
        
        map.on("moveend", e => {
            if ((e as moveEvent).geolocateSource)
                setCenter(map.getCenter())
        });
        map.on('styledata', function() {
            if (!map.getLayer("radiusofsearch"))
                map.addLayer({
                    'id': 'radiusofsearch',
                    'type': 'fill',
                    'source': {
                        'type': 'geojson',
                        'data': {
                            'type': 'Feature',
                            'geometry': {
                                'type': "Polygon",
                                'coordinates': []
                            },
                            'properties': {}
                        }
                    },
                    'layout': {},
                    'paint': {
                        'fill-color': '#db356c',
                        'fill-opacity': 0.1,
                        'fill-outline-color': 'black'
                    }
                });
            
            setStyleData(true);
        });
        setMap(map)
        setSearchMarkersManage(new SearchMarkersManager(map))
        return () => map.remove();
    }, [localization]);

    useEffect(() => {
console.log("useEffect LOC")
        navigator.geolocation.getCurrentPosition(e => {
            setLocalization(new tt.LngLat(e.coords.longitude, e.coords.latitude));
            setCenter(new tt.LngLat(e.coords.longitude, e.coords.latitude));
        }, async (err) => setError(err.message));
    }, []);

    useEffect(() => {
        if (!map || !isStyleData)
            return;
console.log("useEffect CENTERMARKER")
        centerMarker.remove().setLngLat(center).addTo(map)
    }, [center, centerMarker, isStyleData, map])

    return (
        <div className="App">
            <Navbar dark={true} style={{ backgroundColor: "#4287f5" }}>
                <NavbarBrand>Life after Google</NavbarBrand>
            </Navbar>
            <Container className="mapContainer">
                <Row>
                    <Col xs="4">
                        <SidePanel center={center} handleSearch={handleSearch}></SidePanel>
                    </Col>
                    <Col xs="8">
                        <CustomControl></CustomControl>
                        <div ref={mapElement} className="mapDiv" />
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Main;
