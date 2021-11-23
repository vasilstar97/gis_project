import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';

const Map = ({ children }) => {
    const position = [59.9386300, 30.3141300];
    return <MapContainer style={{ height: '100%' }} center={position} zoom={13} zoomControl={false}>
        <TileLayer
            attribution='&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png"
        />
        {children}
    </MapContainer>
}

export default Map;