import React, { Fragment } from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import { UserList } from './list';
import { RegisterForm } from './register-form';
import { Menu } from './menu';

type SiteProps = Record<string, never>

type SiteState = {
  page: string;
}

class Site extends React.Component<SiteProps, SiteState> {
  constructor(props: SiteProps) {
    super(props);
    this.state = {
      page: "login",
    };
  }

  render() {
    let page;
    switch (this.state.page) {
      case "list":
        page = <UserList />;
        break;
      case "login":
      default:
        page = <RegisterForm />;
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