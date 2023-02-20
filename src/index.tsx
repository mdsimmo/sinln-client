import React, { Fragment } from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import { UserList } from './list';
import { RegisterForm } from './register-form';
import { Menu, Page } from './menu';

type SiteProps = Record<string, never>

type SiteState = {
  page: Page;
}

class Site extends React.Component<SiteProps, SiteState> {
  constructor(props: SiteProps) {
    super(props);
    this.state = {
      page: Page.REGISTER,
    };
  }

  render() {
    let page;
    switch (this.state.page) {
      case Page.LIST:
        page = <UserList />;
        break;
      case Page.REGISTER: 
        page = <RegisterForm />;
        break;
      default:
        console.error("Page not programmed: " + this.state.page);
        break;
    }

    return (
      <Fragment>
        <Menu onDisplay={(page) => this.setState({page: page})}/>
        {page}
      </Fragment>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <Site/>
);