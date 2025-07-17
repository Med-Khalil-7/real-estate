import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './App.scss';
import AppRoutes from './AppRoutes';
import Header from './shared/Header';
import SettingsPanel from './shared/SettingsPanel';
import Footer from './shared/Footer';
import { withTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import SentryBoundary from '../utils/SentryBoundary';
import { Provider } from 'react-redux';
import { hot } from 'react-hot-loader/root';
import store from '../store';
class App extends Component {
  state = {};

  componentDidMount() {
    this.onRouteChanged();
  }
  render() {
    let headerComponent = !this.state.isFullPageLayout ? <Header /> : '';
    let SettingsPanelComponent = !this.state.isFullPageLayout ? <SettingsPanel /> : '';
    let footerComponent = !this.state.isFullPageLayout ? <Footer /> : '';
    return (
      <>
      
        <SentryBoundary>
          <Provider store={store}>
            <ToastContainer
              autoClose={4000}
              closeOnClick
              draggable
              hideProgressBar={false}
              newestOnTop={false}
              pauseOnFocusLoss
              pauseOnHover
              position="top-right"
              rtl={false}
              theme="light"
            />
            <div className="container-scroller">
              {headerComponent}
              <div className="container-fluid page-body-wrapper">
                <div className="main-panel">
                  <div className="content-wrapper">
                    <AppRoutes />
                    {SettingsPanelComponent}
                  </div>
                  {footerComponent}
                </div>
              </div>
            </div>
          </Provider>
        </SentryBoundary>
      </>
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }

  onRouteChanged() {
    const { i18n } = this.props;

    const body = document.querySelector('body');
    if (i18n.language === 'ar') {
      body.classList.add('rtl');
    } else {
      body.classList.remove('rtl');
    }
    window.scrollTo(0, 0);
    const fullPageLayoutRoutes = [
      '/user-pages/login-1',
      '/user-pages/login-2',
      '/user-pages/register-1',
      '/user-pages/register-2',
      '/user-pages/lockscreen',
      '/error-pages/error-404',
      '/error-pages/error-500',
      '/general-pages/landing-page',
      '/user/accept_application',
      '/general-pages/confirmation',
      '/user-pages/resetpassword',
      '/user-pages/resetpasswordcheck'
    ];
    for (const element of fullPageLayoutRoutes) {
      if (this.props.location.pathname.includes(element)) {
        this.setState({
          isFullPageLayout: true,
        });
        document.querySelector('.page-body-wrapper').classList.add('full-page-wrapper');
        break;
      } else {
        this.setState({
          isFullPageLayout: false,
        });
        document.querySelector('.page-body-wrapper').classList.remove('full-page-wrapper');
      }
    }
  }
}

export default hot(withTranslation()(withRouter(App)));
