import React, { Fragment } from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import { UserList } from './list';
import { RegisterScreen } from './register-form';
import { Menu, Page } from './menu';
import { getUserToken, login, UserToken } from './auth';

type SiteProps = Record<string, never>

type SiteState = {
  page: Page;
  userToken: UserToken | null,
}

class Site extends React.Component<SiteProps, SiteState> {
  constructor(props: SiteProps) {
    super(props);
    this.state = {
      page: Page.REGISTER,
      userToken: null,
    };
    getUserToken().then(token => {
      if (token != null) {
        this.setState({
          userToken: token,
        });
      }
    });
  }

  render() {
    let page;
    switch (this.state.page) {
      case Page.LIST:
        page = <UserList userToken={this.state.userToken}/>;
        break;
      case Page.REGISTER: 
        page = <RegisterScreen />;
        break;
      case Page.LOGIN:
        login();
        return <p>Redirecting...</p>;
      default:
        console.error("Page not programmed: " + this.state.page);
        break;
    }

    return (
      <Fragment>
        <Menu onDisplay={(page) => this.setState({page: page})}/>
        <main>{page}</main>
      </Fragment>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <Site/>
);