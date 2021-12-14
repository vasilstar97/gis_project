import { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';

const Zoom = ({ bounds }) => {
    const map = useMap();
    useEffect(() => { if (bounds) map.fitBounds(bounds) }, bounds)
    return null;
}

const Map = ({ children, bounds }) => {
    const position = [59.9323387, 30.3503255];
    return <MapContainer
        style={{ height: '100%' }}
        center={position}
        zoom={15}
        zoomControl={false}
    >
        {bounds && <Zoom bounds={bounds} />}
        <TileLayer
            attribution='&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png"
        />
        {children}
    </MapContainer>
}

export default Map;