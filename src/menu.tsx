import { faTableList, faUserCircle, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import './menu.scss';

export enum Page {
    REGISTER,
    LIST,
    LOGIN,
}

type MenuProps = {
    onDisplay: (page: Page) => void;
};

export class Menu extends React.Component<MenuProps> {

    constructor(props: MenuProps) {
        super(props);
    }

    render() {
        return (
            <header>
                <ul>
                    <li key="register" id="register-button"><button title="" onClick={() => this.props.onDisplay(Page.REGISTER)}><FontAwesomeIcon icon={faUserPlus} /></button></li>
                    <li key="list" id="list-button"><button title="List members" onClick={() => this.props.onDisplay(Page.LIST)}><FontAwesomeIcon icon={faTableList} /></button></li>
                    <li key="settings" id="settings-button"><button title="Log In" onClick={() => this.props.onDisplay(Page.LOGIN)}><FontAwesomeIcon icon={faUserCircle} /></button></li>
                </ul>
            </header>
        );
    }
}