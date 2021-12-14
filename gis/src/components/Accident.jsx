import L from 'leaflet';
import { Marker, Popup } from 'react-leaflet';
import css from './marker.module.css'
L.Icon.Default.imagePath = "https://unpkg.com/leaflet@1.5.0/dist/images/";

const Accident = ({ children, position }) => {
    let icon = L.divIcon({
        className: css.marker,
        html: `<div></div>`,
        iconSize: [10, 10],
        iconAnchor: [5, 5],
    })
    return <Marker
        icon={icon}
        position={[position[1], position[0]]}
        eventHandlers={{
            click: () => { },
        }}
    >
        {children}
    </Marker>
}

export default Accident;