import React from 'react';

type MenuProps = {
    onDisplay: (page: string) => void;
};

export class Menu extends React.Component<MenuProps> {

    render() {
        return (
            <header>
                <ul>
                    <li key="login"><button onClick={() => this.props.onDisplay("login")}>Member Sign In</button></li>
                    <li key="list"><button onClick={() => this.props.onDisplay("list")}>List Members</button></li>
                </ul>
            </header>
        );
    }
}