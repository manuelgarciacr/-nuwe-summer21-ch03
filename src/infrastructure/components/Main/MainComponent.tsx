import * as React from "react";
import { useState, useEffect, useRef, MutableRefObject } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import * as tt from "@tomtom-international/web-sdk-maps";
import ttSvc from "@tomtom-international/web-sdk-services";
import { SearchMarkersManager } from "../TomTom/SearchMarkersManager";
import "../../css/index.css";
import "../../css/poi.css";
import { DomHelpers } from "../TomTom/dom-helpers";

import axios from "axios";
import circle from '@turf/circle';

import SidePanel from "./SidePanel";

import Button from "@material-ui/core/Button";
import useStyles from "./styles";
import { ResultsManager } from "../TomTom/results-manager";
import GuidancePanel from "../TomTom/guidance-panel";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Paper from "@material-ui/core/Paper";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";

interface moveEvent extends tt.TTEvent {
    geolocateSource: boolean
}

function Main() {
    const classes = useStyles();
    const mapElement = useRef() as MutableRefObject<HTMLDivElement>;
    const resultsManager = new ResultsManager("");
    const routePoints: { start?: tt.LngLat, finish?: tt.LngLat } = {};
    const [localization, setLocalization] = useState<tt.LngLat>();
    const [center, setCenter] = useState<tt.LngLat>(new tt.LngLat(0, 0));
    const [error, setError] = useState("");
    const [count, setCount] = useState(0);
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

    const handleState = (value: any, categorySet: string, radius: number, status: "idle" | "searching" | "success") => {
        if (value) {
            handleResultsFound([value], true)
        } else if (categorySet) {
            handleSearch(categorySet, radius)
        }
    }

    const handleSearch = async (categorySet: string, radius: number) => {
        if (!map)
            return;
        const data = circle(center.toArray(), radius / 1000);
        (map.getSource('radiusofsearch') as tt.GeoJSONSource).setData(data);
        const cat = categorySet.length ? categorySet : "0000"
        const query = "";
        const baseUrl = 'https://api.tomtom.com/search/2/nearbySearch';
        const queryString = `&limit=110&lat=${center?.lat}&lon=${center?.lng}&radius=${radius}&language=es-ES&categorySet=${cat}&key=${process.env.REACT_APP_NUWE2103_API_KEY || ""}`;
        const response = await axios.get(`${baseUrl}/${query}.json?${queryString}`);
        handleResultsFound(response.data.results)
    }

    function handleResultsFound(results: any, success?: boolean) {
        clearMap();
        resultsManager.resultsNotFound();
        searchMarkersManager?.clear();
        if (results.length === 0) {
            setTimeout(() => setError(""), 8000)
            setError("No hemos encontrado ninguna coincidencia")
            return
        }
        setTimeout(() => setCount(0), 8000)
        setCount(results.length);
        searchMarkersManager?.draw(results);
        if (success) {
            const { lat, lon } = results[0].position;
            updateMapView("finish", new tt.LngLat(lon, lat))
        }
        fitToViewport(results);
    }

    function fitToViewport(markerData: string | any[]) {
        // eslint-disable-next-line no-mixed-operators
        if (!markerData || markerData instanceof Array && !markerData.length) {
            return;
        }
        const bounds = new tt.LngLatBounds();
        if (markerData instanceof Array) {
            markerData.forEach(function (marker) {
                bounds.extend(getBounds(marker));
            });
        } else {
            bounds.extend(getBounds(markerData));
        }
        map?.fitBounds(bounds, { padding: 10, linear: true });
    }

    function getBounds(data: any): tt.LngLatBounds {
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

    //////////////////////////////////////////////////////
    //
    // Handle Route
    //

    const updateMapView = (type: string, position?: tt.LngLat) => {
        if (type === "start")
            routePoints.start = center;
        else {
            routePoints.start = center;
            routePoints.finish = position!;
        }

        if (routePoints.start && routePoints.finish)
            handleDrawRoute(type);
    }

    const handleDrawRoute = (type: string) => {
        // errorHint.hide();
        // loadingHint.setMessage('Loading...');
        resultsManager.loading();
        performCalculateRouteRequest()
            .then(function (response: any) {
                handleCalculateRouteResponse(response, type);
            })
            .catch(handleCalculateRouteError);
    }

    function handleCalculateRouteError() {
        clearMap();
        resultsManager.resultsNotFound();
        setTimeout(() => setError(""), 8000)
        setError("There was a problem calculating the route")
        // errorHint.setMessage('There was a problem calculating the route');
        // loadingHint.hide();
    }

    function performCalculateRouteRequest() {
        return ttSvc.services.calculateRoute({
            key: process.env.REACT_APP_NUWE2103_API_KEY || "",
            instructionsType: 'tagged',
            traffic: false,
            locations: routePoints.start!.toArray().join() + ':' + routePoints.finish!.toArray().join()
        });
    }

    const handleCalculateRouteResponse = (response: any, type: string) => {
        const geojson = response.toGeoJson();
        const feature = geojson.features[0];
        const coordinates = feature.geometry.coordinates;
        const guidance = feature.properties.guidance;

        clearMap();
        resultsManager.success();
        const guidancePanelElement = DomHelpers.elementFactory('div', 'guidance-panel');
        resultsManager.append(guidancePanelElement);
        const guidancePanel = new (GuidancePanel as any)(guidance, {
            map: map,
            coordinates: coordinates
        });
        guidancePanel.bindEvents();
        map?.addLayer({
            'id': 'route',
            'type': 'line',
            'source': {
                'type': 'geojson',
                'data': geojson
            },
            'paint': {
                'line-color': '#4a90e2',
                'line-width': 6
            }
        });
        const bounds = new tt.LngLatBounds();
        coordinates.forEach(function (point: any) {
            bounds.extend(tt.LngLat.convert(point));
        });
        map?.fitBounds(bounds, { duration: 0, padding: 50 });
        // loadingHint.hide();
    }


    function clearMap() {
        if (!map?.getLayer('route')) {
            return;
        }
        map?.removeLayer('route');
        map?.removeSource('route');
    }

    //
    // Handle Route
    //
    //////////////////////////////////////////////////////

    useEffect(() => {
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
            fitBoundsOptions: { zoom: 16 }
        });
        map.addControl(geolocateControl);
        map.addControl(new tt.NavigationControl({ showZoom: false, showExtendedRotationControls: true, showPitch: true, showExtendedPitchControls: true }));

        map.on("moveend", e => {
            if ((e as moveEvent).geolocateSource)
                setCenter(map.getCenter())
        });
        map.on('styledata', function () {
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
        navigator.geolocation.getCurrentPosition(e => {
            setLocalization(new tt.LngLat(e.coords.longitude, e.coords.latitude));
            setCenter(new tt.LngLat(e.coords.longitude, e.coords.latitude));
        }, async (err) => setError(err.message));
    }, []);

    useEffect(() => {
        if (!map || !isStyleData)
            return;
        centerMarker.remove().setLngLat(center).addTo(map)
    }, [center, centerMarker, isStyleData, map])

    return (
        <div className="App">
            <AppBar className={classes.appBar}>
                <Typography variant="h6">Life after Google</Typography>
            </AppBar>
            <Paper className={classes.mapContainer}>
                <Paper className={classes.panel}>
                    <SidePanel center={center} handleState={handleState}></SidePanel>
                </Paper>
                <Paper className={classes.map}>
                    <CustomControl></CustomControl>
                    <div ref={mapElement} className="mapDiv" />
                    {error &&
                        <Alert onClose={() => setError("")} style={{position: "absolute", bottom: 5, right: 50}} severity="warning">
                            <AlertTitle>Warning</AlertTitle>
                            {error}
                        </Alert>
                    }
                    {count &&
                        <Alert onClose={() => setError("")} style={{position: "absolute", bottom: 5, right: 50}} severity="success">
                            <AlertTitle>Success</AlertTitle>
                            {count === 1 ? "Encontrado un único sitio" : "Encontrados " + count + " sitios."}
                        </Alert>
                    }
                </Paper>
            </Paper>
        </div>
    );
}

export default Main;
