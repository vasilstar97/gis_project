import L from 'leaflet';
import { Marker as LeafletMarker, Popup } from 'react-leaflet';
import css from './marker.module.css'
L.Icon.Default.imagePath = "https://unpkg.com/leaflet@1.5.0/dist/images/";

const Marker = ({ position }) => {
    let icon = L.divIcon({
        className: css.marker,
        html: `<div></div>`,
        iconSize: [15, 15],
        iconAnchor: [8, 8],
    })
    return <LeafletMarker
        icon={icon}
        position={position}
        eventHandlers={{
            click: () => { },
        }}
    >
        <Popup>
            ololo
        </Popup>
    </LeafletMarker>
}

export default Marker;