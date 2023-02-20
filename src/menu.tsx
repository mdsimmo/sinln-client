import { faGear, faTableList, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import './menu.scss';

export enum Page {
    REGISTER,
    LIST,
    SETTINGS,
}

type MenuProps = {
    onDisplay: (page: Page) => void;
};

export class Menu extends React.Component<MenuProps> {

    render() {
        return (
            <header>
                <ul>
                    <li key="register" id="register-button"><button title="" onClick={() => this.props.onDisplay(Page.REGISTER)}><FontAwesomeIcon icon={faUserPlus} /></button></li>
                    <li key="list" id="list-button"><button title="List members" onClick={() => this.props.onDisplay(Page.LIST)}><FontAwesomeIcon icon={faTableList} /></button></li>
                    <li key="settings" id="settings-button"><button title="Settings" onClick={() => console.log(Page.SETTINGS)}><FontAwesomeIcon icon={faGear} /></button></li>
                    <li></li>
                </ul>
            </header>
        );
    }
}