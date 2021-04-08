import {FunctionComponent} from 'react';
import {Header} from '../Components/Header/Header';
import {SideBar} from '../Components/SideBar/SideBar';
import {Content} from '../Components/Content/Content';
import './Main.style.scss';

/**
 * Главная страница приложения, предоставляющая его основной функционал.
 */
const Main: FunctionComponent = () => (
    <div id="main">
        <Header />
        <SideBar />
        <Content />
    </div>
);

export default Main;
