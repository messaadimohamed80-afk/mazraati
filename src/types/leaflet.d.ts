declare module 'leaflet/dist/leaflet.css';
declare module 'leaflet-draw/dist/leaflet.draw.css';

/* Leaflet Draw type extensions */
declare module 'leaflet' {
    namespace Control {
        class Draw extends L.Control {
            constructor(options?: DrawConstructorOptions);
        }
    }

    interface DrawConstructorOptions {
        draw?: DrawOptions;
        edit?: EditOptions;
    }

    interface DrawOptions {
        polygon?: DrawPolygonOptions | false;
        polyline?: DrawPolylineOptions | false;
        rectangle?: DrawRectangleOptions | false;
        circle?: DrawCircleOptions | false;
        marker?: DrawMarkerOptions | false;
        circlemarker?: DrawCircleMarkerOptions | false;
    }

    interface DrawPolygonOptions {
        allowIntersection?: boolean;
        shapeOptions?: L.PathOptions;
    }

    interface DrawPolylineOptions {
        shapeOptions?: L.PathOptions;
    }

    interface DrawRectangleOptions {
        shapeOptions?: L.PathOptions;
    }

    interface DrawCircleOptions {
        shapeOptions?: L.PathOptions;
    }

    interface DrawMarkerOptions {
        icon?: L.Icon;
    }

    interface DrawCircleMarkerOptions {
        shapeOptions?: L.PathOptions;
    }

    interface EditOptions {
        featureGroup?: L.FeatureGroup;
        remove?: boolean;
    }

    namespace Draw {
        namespace Event {
            const CREATED: string;
            const EDITED: string;
            const DELETED: string;
        }
    }

    namespace Icon {
        namespace Default {
            const prototype: {
                _getIconUrl?: string;
            };
        }
    }

    interface DrawEventCreated {
        layer: L.Layer & {
            getLatLngs(): L.LatLng[][];
        };
        layerType: string;
    }
}
