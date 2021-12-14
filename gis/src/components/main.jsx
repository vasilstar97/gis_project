import css from './main.module.css';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import mainStore from './stores/mainStore';
import { observer } from 'mobx-react-lite';
import Map from './map';
import Accident from './Accident';
import clusterData from '../clusters.json';
import { GeoJSON, Popup } from 'react-leaflet';
import getColorGradient from '../ColorGradient';
import { polygon } from 'leaflet';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const localizedProperties = {
    id: 'ID',
    dateTime: 'Дата и время',
    category: 'Категория',
    deadCount: 'Кол-во погибших',
    injuredCount: 'Количество пострадавших'
}

const Main = observer(() => {
    const selectedCluster = mainStore.selectedCluster;
    const [pedestrianAccidentsPercent, setPedestrianAccidentsPercent] = useState(0);
    const [accidentsLength, setAccidentsLength] = useState(1);

    const clusterClickHandler = cluster => e => mainStore.setSelectedCluster(cluster);

    const clusters = clusterData
        .filter(cluster => cluster.accidents.length > accidentsLength)
        .filter(cluster => {
            const pedestrianAccidents = cluster.accidents.filter(accident => accident.properties.category === 'Наезд на пешехода');
            const percent = 100.0 * pedestrianAccidents.length / cluster.accidents.length;
            return percent >= pedestrianAccidentsPercent;
        })

    const maxAccidentsLength = useMemo(() => Math.max(...clusterData.map(cluster => cluster.accidents.length)), []);

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
    }), [accidentsLength, pedestrianAccidentsPercent]);

    const categories = useMemo(() => {
        let accidents = clusters.map(cluster => cluster.accidents).flat();
        let data = {};
        accidents.forEach(accident => {
            if (!(accident.properties.category in data)) data[accident.properties.category] = 0;
            data[accident.properties.category] += 1;
        })
        return Object.keys(data);
    }, [])

    const renderCharts = useMemo(() => {
        let accidents = null;
        let cluster = mainStore.selectedCluster;
        if (cluster) accidents = cluster.accidents;
        else accidents = clusters.map(cluster => cluster.accidents).flat();
        let data = {};
        categories.forEach(category => data[category] = 0)
        accidents.forEach(accident => {
            data[accident.properties.category] += 1;
        })

        return <div style={{ width: '100%', height: 300 }}>
            <Pie
                options={{
                    maintainAspectRatio: false,
                    animation: {
                        duration: 500
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }}
                data={{
                    labels: Object.keys(data),
                    datasets: [
                        {
                            label: '# of Votes',
                            data: Object.values(data),
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.5)',
                                'rgba(54, 162, 235, 0.5)',
                                'rgba(255, 206, 86, 0.5)',
                                'rgba(75, 192, 192, 0.5)',
                                'rgba(153, 102, 255, 0.5)',
                                'rgba(255, 159, 64, 0.5)',
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)',
                            ],
                            borderWidth: 1,
                        },
                    ],
                }}
            />
        </div>
    }, [mainStore.selectedCluster, accidentsLength, pedestrianAccidentsPercent])

    return <section className={css.wrapper}>
        <Map
            bounds={bounds}
        >
            {renderClusters}
            {selectedCluster && clusters.filter(cluster => cluster.polygon.properties.id === selectedCluster.polygon.properties.id).length > 0 && selectedCluster.accidents.map(accident => {

                return <Accident
                    properties={accident.properties}
                    key={accident.properties.id}
                    position={accident.geometry.coordinates}
                >
                    <Popup>{Object.entries(accident.properties).map(entry => {
                        let property = localizedProperties[entry[0]];
                        let value = property === localizedProperties.dateTime ? (new Date(entry[1])).toLocaleDateString() : entry[1];
                        return <div key={entry[0]}>
                            <b>{property}:</b> {value}
                        </div>
                    })}</Popup>
                </Accident>
            })}
        </Map>
        <div className={css.sidebar} style={{ left: 15 }}>
            <h3>Карта ДТП</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{}}></div>
            </div>
            <label style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginTop: 5 }}>
                <span style={{ marginRight: 5 }}>Мин. процент столкновений с пешеходами</span>
                <input type="number" min="0" max="100" step="10" placeholder='мин (%)' value={pedestrianAccidentsPercent} onChange={e => setPedestrianAccidentsPercent(e.target.value)} style={{ width: 60 }} />
            </label>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 }}>
                <span style={{ marginRight: 5 }}>Мин. количество ДТП в кластере</span>
                <input type="number" min="1" max={maxAccidentsLength} placeholder='мин (%)' value={accidentsLength} onChange={e => setAccidentsLength(e.target.value)} style={{ width: 60 }} />
            </label>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <p style={{ fontSize: 10, marginTop: 30, width: '50%' }}>Представлены данные по городу Санкт-Петербург за 2019-2021 гг.</p>
                <p style={{ fontSize: 10, marginTop: 30, width: '50%', textAlign: 'right' }}>Василий Стариков C4104</p>
            </div>
        </div>
        {<div className={css.sidebar} style={{ right: 15 }}>
            <h3>{mainStore.selectedCluster ? 'Текущий очаг ДТП' : 'Все очаги ДТП'}</h3>
            {renderCharts}
        </div>}
    </section>
})

export default Main;