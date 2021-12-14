import css from './main.module.css';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import mainStore from './stores/mainStore';
import { observer } from 'mobx-react-lite';
import Map from './map';
import Accident from './Accident';
import clusterData from '../clusters.json';
import { GeoJSON, Popup, Tooltip } from 'react-leaflet';
import getColorGradient from '../ColorGradient';
import { polygon } from 'leaflet';

const localizedProperties = {
    id: 'ID',
    dateTime: 'Дата и время',
    category: 'Категория',
    deadCount: 'Кол-во погибших',
    injuredCount: 'Количество пострадавших'
}

const Main = observer(() => {
    const selectedCluster = mainStore.selectedCluster;

    const clusterClickHandler = cluster => e => mainStore.setSelectedCluster(cluster);
    const clusters = clusterData.filter(cluster => cluster.accidents.length > 2);

    const bounds = useMemo(() => {
        const getBounds = (geometry) => {
            let coordinates = geometry.coordinates.flat(2);
            let bounds = [];
            bounds.push([Math.min(...coordinates.map(coordinate => coordinate[1])),
            Math.min(...coordinates.map(coordinate => coordinate[0]))])
            bounds.push([Math.max(...coordinates.map(coordinate => coordinate[1])),
            Math.max(...coordinates.map(coordinate => coordinate[0]))])
            return bounds;
        }
        if (!mainStore.selectedCluster) return null;
        let geometry = { coordinates: [] };
        geometry.coordinates.push([...mainStore.selectedCluster.polygon.geometry.coordinates])
        return getBounds(geometry);
    }, [mainStore.selectedCluster])

    const renderClusters = useMemo(() => clusters.map((cluster) => {
        const pedestrianAccidents = cluster.accidents.filter(accident => accident.properties.category === 'Наезд на пешехода');
        return <GeoJSON
            key={`${cluster.polygon.properties.id}`}
            data={cluster.polygon}
            style={{
                color: getColorGradient(1.0 * pedestrianAccidents.length / cluster.accidents.length, 0, 1),
                weight: 4
            }}
            eventHandlers={{
                click: clusterClickHandler(cluster)
            }}
        />
    }), []);

    // const currentCluster = selectedCluster ? clusters.find(cluster => cluster.polygon.properties.id === selectedCluster) : null

    return <section className={css.wrapper}>
        <Map
            bounds={bounds}
        >
            {renderClusters}
            {selectedCluster && selectedCluster.accidents.map(accident => <Accident
                properties={accident.properties}
                key={accident.properties.id}
                position={accident.geometry.coordinates}
            >
                <Popup>{Object.entries(accident.properties).map(entry => <div key={entry[0]}>
                    <b>{localizedProperties[entry[0]]}:</b> {entry[1]}
                </div>)}</Popup>
            </Accident>)}
        </Map>
        <div className={css.sidebar} style={{ left: 15 }}>
            <h3>Карта ДТП</h3>
        </div>
        {selectedCluster && <div className={css.sidebar} style={{ right: 15 }}>
            <h3>Текущий очаг ДТП</h3>
            <div>Количество ДТП: {selectedCluster.accidents.length}</div>
            <div>Процент ДТП с пешеходами: {selectedCluster.accidents.length}</div>
        </div>}
    </section>
})

export default Main;