"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import area from "@turf/area";
import { polygon as turfPolygon } from "@turf/helpers";

interface FieldMapProps {
    center: [number, number]; // [lat, lng]
    existingArea?: number; // hectares from data
    onAreaCalculated?: (hectares: number, coordinates: [number, number][]) => void;
}

export default function FieldMap({ center, existingArea, onAreaCalculated }: FieldMapProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapRef = useRef<any>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const drawnItemsRef = useRef<any>(null);
    const [calculatedArea, setCalculatedArea] = useState<number | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    const initMap = useCallback(async () => {
        if (!mapContainerRef.current || mapRef.current) return;

        // Dynamic imports for SSR safety
        const L = (await import("leaflet")).default;
        await import("leaflet-draw");
        await import("leaflet/dist/leaflet.css");
        await import("leaflet-draw/dist/leaflet.draw.css");

        // Fix default marker icons (known Leaflet workaround)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
            iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
            shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        });

        const map = L.map(mapContainerRef.current, {
            center,
            zoom: 16,
            scrollWheelZoom: true,
        });

        // Satellite tile layer (Esri — free, no API key)
        L.tileLayer(
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            {
                attribution: "Esri &mdash; Source: Esri, Maxar, Earthstar Geographics",
                maxZoom: 19,
            }
        ).addTo(map);

        // Labels overlay
        L.tileLayer(
            "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
            { maxZoom: 19, opacity: 0.6 }
        ).addTo(map);

        // Drawn items layer
        const drawnItems = new L.FeatureGroup();
        map.addLayer(drawnItems);
        drawnItemsRef.current = drawnItems;

        // Center marker
        L.marker(center).addTo(map)
            .bindPopup("📍 موقع الحقل")
            .openPopup();

        // Draw controls
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const drawControl = new (L.Control as any).Draw({
            draw: {
                polygon: {
                    allowIntersection: false,
                    shapeOptions: {
                        color: "#10b981",
                        weight: 3,
                        fillColor: "#10b981",
                        fillOpacity: 0.2,
                    },
                },
                polyline: false,
                rectangle: {
                    shapeOptions: {
                        color: "#3b82f6",
                        weight: 3,
                        fillColor: "#3b82f6",
                        fillOpacity: 0.2,
                    },
                },
                circle: false,
                marker: false,
                circlemarker: false,
            },
            edit: {
                featureGroup: drawnItems,
                remove: true,
            },
        });
        map.addControl(drawControl);

        // Handle draw events
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map.on((L as any).Draw.Event.CREATED, (e: any) => {
            drawnItems.clearLayers();
            const layer = e.layer;
            drawnItems.addLayer(layer);

            // Calculate area
            const latlngs = layer.getLatLngs()[0]; // Polygon ring
            const coords: [number, number][] = latlngs.map((ll: L.LatLng) => [ll.lng, ll.lat]); // GeoJSON is [lng, lat]
            coords.push(coords[0]); // Close the ring

            const poly = turfPolygon([coords]);
            const sqMeters = area(poly);
            const hectares = parseFloat((sqMeters / 10000).toFixed(2));

            setCalculatedArea(hectares);
            setIsDrawing(false);

            if (onAreaCalculated) {
                onAreaCalculated(hectares, latlngs.map((ll: L.LatLng) => [ll.lat, ll.lng]));
            }
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map.on((L as any).Draw.Event.DELETED, () => {
            setCalculatedArea(null);
        });

        map.on("draw:drawstart", () => setIsDrawing(true));
        map.on("draw:drawstop", () => setIsDrawing(false));

        mapRef.current = map;

        // Invalidate size after render
        setTimeout(() => map.invalidateSize(), 200);
    }, [center, onAreaCalculated]);

    useEffect(() => {
        initMap();
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [initMap]);

    return (
        <div className="field-map-wrapper">
            <div className="field-map-header">
                <h3>📐 خريطة الحقل وقياس المساحة</h3>
                <div className="field-map-info">
                    {isDrawing && (
                        <span className="field-map-badge field-map-badge-active">
                            ✏️ جارٍ الرسم — انقر لإضافة نقاط
                        </span>
                    )}
                    {calculatedArea !== null && (
                        <span className="field-map-badge field-map-badge-result">
                            📏 المساحة المحسوبة: <strong>{calculatedArea} هكتار</strong> ({(calculatedArea * 10000).toLocaleString()} م²)
                        </span>
                    )}
                    {existingArea && !calculatedArea && (
                        <span className="field-map-badge">
                            📋 المساحة المسجلة: {existingArea} هكتار
                        </span>
                    )}
                </div>
            </div>

            <div className="field-map-container" ref={mapContainerRef} />

            <div className="field-map-instructions">
                <p>💡 <strong>كيفية قياس المساحة:</strong></p>
                <ol>
                    <li>انقر على أيقونة <strong>المضلع</strong> (🔷) في شريط أدوات الرسم أعلى يسار الخريطة</li>
                    <li>انقر على زوايا الحقل لرسم حدوده</li>
                    <li>انقر على النقطة الأولى لإغلاق المضلع</li>
                    <li>ستظهر المساحة تلقائياً بالهكتار وبالمتر المربع</li>
                </ol>
            </div>
        </div>
    );
}
