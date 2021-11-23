import css from './main.module.css';
import mainStore from './stores/mainStore';
import { observer } from 'mobx-react-lite';
import Map from './map';
import Marker from './marker';

const Main = observer(() => {
    return <section className={css.wrapper}>
        <Map>
        </Map>
    </section>
})

export default Main;