import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Collapse } from 'react-bootstrap';
import { Trans } from 'react-i18next';

class Sidebar extends Component {
  state = {};

  toggleMenuState(menuState) {
    if (this.state[menuState]) {
      this.setState({[menuState] : false});
    } else if(Object.keys(this.state).length === 0) {
      this.setState({[menuState] : true});
    } else {
      Object.keys(this.state).forEach(i => {
        this.setState({[i]: false});
      });
      this.setState({[menuState] : true});
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }

  onRouteChanged() {
    document.querySelector('#sidebar').classList.remove('active');
    Object.keys(this.state).forEach(i => {
      this.setState({[i]: false});
    });

    const dropdownPaths = [
      {path:'/apps', state: 'appsMenuOpen'},
      {path:'/basic-ui', state: 'basicUiMenuOpen'},
      {path:'/advanced-ui', state: 'advancedUiMenuOpen'},
      {path:'/form-elements', state: 'formElementsMenuOpen'},
      {path:'/tables', state: 'tablesMenuOpen'},
      {path:'/maps', state: 'mapsMenuOpen'},
      {path:'/icons', state: 'iconsMenuOpen'},
      {path:'/charts', state: 'chartsMenuOpen'},
      {path:'/user-pages', state: 'userPagesMenuOpen'},
      {path:'/error-pages', state: 'errorPagesMenuOpen'},
      {path:'/general-pages', state: 'generalPagesMenuOpen'},
      {path:'/ecommerce', state: 'ecommercePagesMenuOpen'},
    ];

    dropdownPaths.forEach((obj => {
      if (this.isPathActive(obj.path)) {
        this.setState({[obj.state] : true})
      }
    }));
 
  } 
  render () {
    return (
      <nav className="sidebar sidebar-offcanvas" id="sidebar">
        <ul className="nav">
          <li className="nav-item nav-category"><Trans>Main</Trans></li>
          <li className={ this.isPathActive('/dashboard') ? 'nav-item active' : 'nav-item' }>
            <Link className="nav-link" to="/dashboard">
              <span className="icon-bg"><i className="mdi mdi-cube menu-icon"></i></span>
              <span className="menu-title"><Trans>Dashboard</Trans></span>
            </Link>
          </li>
          <li className={ this.isPathActive('/layout/RtlLayout') ? 'nav-item active' : 'nav-item' }>
            <Link className="nav-link" to="/layout/RtlLayout">
              <span className="icon-bg"><i className="mdi mdi-widgets menu-icon"></i></span>
              <span className="menu-title"><Trans>RTL</Trans></span>
            </Link>
          </li>
          <li className={ this.isPathActive('/widgets') ? 'nav-item active' : 'nav-item' }>
            <Link className="nav-link" to="/widgets">
              <span className="icon-bg"><i className="mdi mdi-widgets menu-icon"></i></span>
              <span className="menu-title"><Trans>Widgets</Trans></span>
            </Link>
          </li>
          <li className={ this.isPathActive('/apps') && !(this.isPathActive('/apps/email')) ? 'nav-item active' : 'nav-item' }>
            <div className={ this.state.appsMenuOpen ? 'nav-link menu-expanded' : 'nav-link' } onClick={ () => this.toggleMenuState('appsMenuOpen')} data-toggle="collapse">
              <span className="icon-bg"><i className="mdi mdi-cart-arrow-down menu-icon"></i></span>
              <span className="menu-title"><Trans>Applications</Trans></span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={ this.state.appsMenuOpen }>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <Link className={ this.isPathActive('/apps/kanban-board') ? 'nav-link active' : 'nav-link' } to="/apps/kanban-board"><Trans>Kanban Board</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/apps/todo-list') ? 'nav-link active' : 'nav-link' } to="/apps/todo-list"><Trans>Todo list</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/apps/tickets') ? 'nav-link active' : 'nav-link' } to="/apps/tickets"><Trans>Tickets</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/apps/chats') ? 'nav-link active' : 'nav-link' } to="/apps/chats"><Trans>Chat</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/apps/email') ? 'nav-link active' : 'nav-link' } to="/apps/email"><Trans>E-mail</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/apps/calendar') ? 'nav-link active' : 'nav-link' } to="/apps/calendar"><Trans>Calendar</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/apps/gallery') ? 'nav-link active' : 'nav-link' } to="/apps/gallery"><Trans>Gallery</Trans></Link></li>
              </ul>
            </Collapse>
          </li>
          <li className="nav-item nav-category"><Trans>UI Features</Trans></li>
          <li className={ this.isPathActive('/basic-ui') ? 'nav-item active' : 'nav-item' }>
            <div className={ this.state.basicUiMenuOpen ? 'nav-link menu-expanded' : 'nav-link' } onClick={ () => this.toggleMenuState('basicUiMenuOpen') } data-toggle="collapse">
              <span className="icon-bg"><i className="mdi mdi-crosshairs-gps menu-icon"></i></span>
              <span className="menu-title"><Trans>Basic UI Elements</Trans></span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={ this.state.basicUiMenuOpen }>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <Link className={ this.isPathActive('/basic-ui/accordions') ? 'nav-link active' : 'nav-link' } to="/basic-ui/accordions"><Trans>Accordions</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/basic-ui/buttons') ? 'nav-link active' : 'nav-link' } to="/basic-ui/buttons"><Trans>Buttons</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/basic-ui/badges') ? 'nav-link active' : 'nav-link' } to="/basic-ui/badges"><Trans>Badges</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/basic-ui/breadcrumbs') ? 'nav-link active' : 'nav-link' } to="/basic-ui/breadcrumbs"><Trans>Breadcrumbs</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/basic-ui/dropdowns') ? 'nav-link active' : 'nav-link' } to="/basic-ui/dropdowns"><Trans>Dropdowns</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/basic-ui/modals') ? 'nav-link active' : 'nav-link' } to="/basic-ui/modals"><Trans>Modals</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/basic-ui/progressbar') ? 'nav-link active' : 'nav-link' } to="/basic-ui/progressbar"><Trans>Progress bar</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/basic-ui/pagination') ? 'nav-link active' : 'nav-link' } to="/basic-ui/pagination"><Trans>Pagination</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/basic-ui/tabs') ? 'nav-link active' : 'nav-link' } to="/basic-ui/tabs"><Trans>Tabs</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/basic-ui/typography') ? 'nav-link active' : 'nav-link' } to="/basic-ui/typography"><Trans>Typography</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/basic-ui/tooltips') ? 'nav-link active' : 'nav-link' } to="/basic-ui/tooltips"><Trans>Tooltips</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/basic-ui/popups') ? 'nav-link active' : 'nav-link' } to="/basic-ui/popups"><Trans>Popups</Trans></Link></li>
              </ul>
            </Collapse>
          </li>
          <li className={ this.isPathActive('/advanced-ui') ? 'nav-item active' : 'nav-item' }>
            <div className={ this.state.advancedUiMenuOpen ? 'nav-link menu-expanded' : 'nav-link' } onClick={ () => this.toggleMenuState('advancedUiMenuOpen') } data-toggle="collapse">
              <span className="icon-bg"><i className="mdi mdi-cards-variant menu-icon"></i></span>
              <span className="menu-title"><Trans>Advanced UI</Trans></span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={ this.state.advancedUiMenuOpen }>
              <ul className="nav flex-column sub-menu">
              <li className="nav-item"> <Link className={ this.isPathActive('/advanced-ui/dragula') ? 'nav-link active' : 'nav-link' } to="/advanced-ui/dragula"><Trans>Dragula</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/advanced-ui/clipboard') ? 'nav-link active' : 'nav-link' } to="/advanced-ui/clipboard"><Trans>Clipboard</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/advanced-ui/context-menu') ? 'nav-link active' : 'nav-link' } to="/advanced-ui/context-menu"><Trans>Context menu</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/advanced-ui/sliders') ? 'nav-link active' : 'nav-link' } to="/advanced-ui/sliders"><Trans>Sliders</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/advanced-ui/carousel') ? 'nav-link active' : 'nav-link' } to="/advanced-ui/carousel"><Trans>Carousel</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/advanced-ui/loaders') ? 'nav-link active' : 'nav-link' } to="/advanced-ui/loaders"><Trans>Loaders</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/advanced-ui/tree-view') ? 'nav-link active' : 'nav-link' } to="/advanced-ui/tree-view"><Trans>Tree View</Trans></Link></li>
              </ul>
            </Collapse>
          </li>
          <li className={ this.isPathActive('/notifications') ? 'nav-item active' : 'nav-item' }>
            <Link className="nav-link" to="/notifications">
              <span className="icon-bg"><i className="mdi mdi-bell-ring menu-icon"></i></span>
              <span className="menu-title"><Trans>Notifications</Trans></span>
            </Link>
          </li>
          <li className={ this.isPathActive('/icons') ? 'nav-item active' : 'nav-item' }>
            <div className={ this.state.iconsMenuOpen ? 'nav-link menu-expanded' : 'nav-link' } onClick={ () => this.toggleMenuState('iconsMenuOpen') } data-toggle="collapse">
              <span className="icon-bg"><i className="mdi mdi-contacts menu-icon"></i></span>
              <span className="menu-title"><Trans>Icons</Trans></span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={ this.state.iconsMenuOpen }>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <Link className={ this.isPathActive('/icons/mdi') ? 'nav-link active' : 'nav-link' } to="/icons/mdi"><Trans>Material</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/icons/flag-icons') ? 'nav-link active' : 'nav-link' } to="/icons/flag-icons"><Trans>Flag icons</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/icons/font-awesome') ? 'nav-link active' : 'nav-link' } to="/icons/font-awesome"><Trans>Font Awesome</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/icons/simple-line') ? 'nav-link active' : 'nav-link' } to="/icons/simple-line"><Trans>Simple Line Icons</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/icons/themify') ? 'nav-link active' : 'nav-link' } to="/icons/themify"><Trans>Themify</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/icons/typicons') ? 'nav-link active' : 'nav-link' } to="/icons/typicons"><Trans>Typicons</Trans></Link></li>
              </ul>
            </Collapse>
          </li>
          <li className={ this.isPathActive('/form-elements') ? 'nav-item active' : 'nav-item' }>
            <div className={ this.state.formElementsMenuOpen ? 'nav-link menu-expanded' : 'nav-link' } onClick={ () => this.toggleMenuState('formElementsMenuOpen') } data-toggle="collapse">
              <span className="icon-bg"><i className="mdi mdi-format-list-bulleted menu-icon"></i></span>
              <span className="menu-title"><Trans>Form elements</Trans></span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={ this.state.formElementsMenuOpen }>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <Link className={ this.isPathActive('/form-elements/basic-elements') ? 'nav-link active' : 'nav-link' } to="/form-elements/basic-elements"><Trans>Basic Elements</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/form-elements/advanced-elements') ? 'nav-link active' : 'nav-link' } to="/form-elements/advanced-elements"><Trans>Advanced Elements</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/form-elements/validation') ? 'nav-link active' : 'nav-link' } to="/form-elements/validation"><Trans>Validation</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/form-elements/wizard') ? 'nav-link active' : 'nav-link' } to="/form-elements/wizard"><Trans>Wizard</Trans></Link></li>
              </ul>
            </Collapse>
          </li>
          <li className="nav-item nav-category"><Trans>Data Representation</Trans></li>
          <li className={ this.isPathActive('/charts') ? 'nav-item active' : 'nav-item' }>
            <div className={ this.state.chartsMenuOpen ? 'nav-link menu-expanded' : 'nav-link' } onClick={ () => this.toggleMenuState('chartsMenuOpen') } data-toggle="collapse">
              <span className="icon-bg"><i className="mdi mdi-chart-bar menu-icon"></i></span>
              <span className="menu-title"><Trans>Charts</Trans></span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={ this.state.chartsMenuOpen }>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <Link className={ this.isPathActive('/charts/chart-js') ? 'nav-link active' : 'nav-link' } to="/charts/chart-js"><Trans>Chart Js</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/charts/c3-chart') ? 'nav-link active' : 'nav-link' } to="/charts/c3-chart"><Trans>C3 Charts</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/charts/chartist') ? 'nav-link active' : 'nav-link' } to="/charts/chartist"><Trans>Chartist</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/charts/google-charts') ? 'nav-link active' : 'nav-link' } to="/charts/google-charts"><Trans>Google Charts</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/charts/sparkline-charts') ? 'nav-link active' : 'nav-link' } to="/charts/sparkline-charts"><Trans>Sparkline Charts</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/charts/guage-chart') ? 'nav-link active' : 'nav-link' } to="/charts/guage-chart"><Trans>Guage Chart</Trans></Link></li>
              </ul>
            </Collapse>
          </li>
          <li className={ this.isPathActive('/tables') ? 'nav-item active' : 'nav-item' }>
            <div className={ this.state.tablesMenuOpen ? 'nav-link menu-expanded' : 'nav-link' } onClick={ () => this.toggleMenuState('tablesMenuOpen') } data-toggle="collapse">
              <span className="icon-bg"><i className="mdi mdi-table-large menu-icon"></i></span>
              <span className="menu-title"><Trans>Tables</Trans></span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={ this.state.tablesMenuOpen }>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <Link className={ this.isPathActive('/tables/basic-table') ? 'nav-link active' : 'nav-link' } to="/tables/basic-table"><Trans>Basic Table</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/tables/data-table') ? 'nav-link active' : 'nav-link' } to="/tables/data-table"><Trans>Data Table</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/tables/react-table') ? 'nav-link active' : 'nav-link' } to="/tables/react-table"><Trans>React Table</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/tables/sortable-table') ? 'nav-link active' : 'nav-link' } to="/tables/sortable-table"><Trans>Sortable Table</Trans></Link></li>
              </ul>
            </Collapse>
          </li>
          <li className={ this.isPathActive('/maps') ? 'nav-item active' : 'nav-item' }>
            <div className={ this.state.mapsMenuOpen ? 'nav-link menu-expanded' : 'nav-link' } onClick={ () => this.toggleMenuState('mapsMenuOpen') } data-toggle="collapse">
              <span className="icon-bg"><i className="mdi mdi-map-marker-radius menu-icon"></i></span>
              <span className="menu-title"><Trans>Maps</Trans></span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={ this.state.mapsMenuOpen }>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <Link className={ this.isPathActive('/maps/vector-map') ? 'nav-link active' : 'nav-link' } to="/maps/vector-map"><Trans>Vector Maps</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/maps/simple-map') ? 'nav-link active' : 'nav-link' } to="/maps/simple-map"><Trans>Simple Maps</Trans></Link></li>
              </ul>
            </Collapse>
          </li>
          <li className="nav-item nav-category"><Trans>Editors</Trans></li>
          <li className={ this.isPathActive('/text-editors') ? 'nav-item active' : 'nav-item' }>
            <Link className="nav-link" to="/text-editors">
              <span className="icon-bg"><i className="mdi mdi-file-document menu-icon"></i></span>
              <span className="menu-title"><Trans>Text Editors</Trans></span>
            </Link>
          </li>
          <li className={ this.isPathActive('/code-editor') ? 'nav-item active' : 'nav-item' }>
            <Link className="nav-link" to="/code-editor">
              <span className="icon-bg"><i className="mdi mdi-code-not-equal-variant menu-icon"></i></span>
              <span className="menu-title"><Trans>Code Editors</Trans></span>
            </Link>
          </li>
          <li className="nav-item nav-category">Sample Pages</li>
          <li className={ this.isPathActive('/user-pages') ? 'nav-item active' : 'nav-item' }>
            <div className={ this.state.userPagesMenuOpen ? 'nav-link menu-expanded' : 'nav-link' } onClick={ () => this.toggleMenuState('userPagesMenuOpen') } data-toggle="collapse">
              <span className="icon-bg"><i className="mdi mdi-lock menu-icon"></i></span>
              <span className="menu-title"><Trans>User Pages</Trans></span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={ this.state.userPagesMenuOpen }>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <Link className={ this.isPathActive('/user-pages/login-1') ? 'nav-link active' : 'nav-link' } to="/user-pages/login-1"><Trans>Login</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/user-pages/login-2') ? 'nav-link active' : 'nav-link' } to="/user-pages/login-2"><Trans>Login 2</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/user-pages/register-1') ? 'nav-link active' : 'nav-link' } to="/user-pages/register-1"><Trans>Register</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/user-pages/register-2') ? 'nav-link active' : 'nav-link' } to="/user-pages/register-2"><Trans>Register 2</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/user-pages/lockscreen') ? 'nav-link active' : 'nav-link' } to="/user-pages/lockscreen"><Trans>Lockscreen</Trans></Link></li>
              </ul>
            </Collapse>
          </li>
          <li className={ this.isPathActive('/error-pages') ? 'nav-item active' : 'nav-item' }>
            <div className={ this.state.errorPagesMenuOpen ? 'nav-link menu-expanded' : 'nav-link' } onClick={ () => this.toggleMenuState('errorPagesMenuOpen') } data-toggle="collapse">
              <span className="icon-bg"><i className="mdi mdi-security menu-icon"></i></span>
              <span className="menu-title"><Trans>Error pages</Trans></span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={ this.state.errorPagesMenuOpen }>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <Link className={ this.isPathActive('/error-pages/error-404') ? 'nav-link active' : 'nav-link' } to="/error-pages/error-404"><Trans>404</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/error-pages/error-500') ? 'nav-link active' : 'nav-link' } to="/error-pages/error-500"><Trans>500</Trans></Link></li>
              </ul>
            </Collapse>
          </li>
          <li className={ this.isPathActive('/general-pages') ? 'nav-item active' : 'nav-item' }>
            <div className={ this.state.generalPagesMenuOpen ? 'nav-link menu-expanded' : 'nav-link' } onClick={ () => this.toggleMenuState('generalPagesMenuOpen') } data-toggle="collapse">
              <span className="icon-bg"><i className="mdi mdi-medical-bag menu-icon"></i></span>
              <span className="menu-title"><Trans>General Pages</Trans></span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={ this.state.generalPagesMenuOpen }>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <Link className={ this.isPathActive('/general-pages/blank-page') ? 'nav-link active' : 'nav-link' } to="/general-pages/blank-page"><Trans>Blank Page</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/general-pages/landing-page') ? 'nav-link active' : 'nav-link' } to="/general-pages/landing-page"><Trans>Landing Page</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/general-pages/profile') ? 'nav-link active' : 'nav-link' } to="/general-pages/profile"><Trans>Profile</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/general-pages/faq-1') ? 'nav-link active' : 'nav-link' } to="/general-pages/faq-1"><Trans>FAQ</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/general-pages/faq-2') ? 'nav-link active' : 'nav-link' } to="/general-pages/faq-2"><Trans>FAQ 2</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/general-pages/news-grid') ? 'nav-link active' : 'nav-link' } to="/general-pages/news-grid"><Trans>News grid</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/general-pages/timeline') ? 'nav-link active' : 'nav-link' } to="/general-pages/timeline"><Trans>Timeline</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/general-pages/search-results') ? 'nav-link active' : 'nav-link' } to="/general-pages/search-results"><Trans>Search Results</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/general-pages/portfolio') ? 'nav-link active' : 'nav-link' } to="/general-pages/portfolio"><Trans>Portfolio</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/general-pages/user-listing') ? 'nav-link active' : 'nav-link' } to="/general-pages/user-listing"><Trans>User Listing</Trans></Link></li>
              </ul>
            </Collapse>
          </li>
          <li className={ this.isPathActive('/ecommerce') ? 'nav-item active' : 'nav-item' }>
            <div className={ this.state.ecommercePagesMenuOpen ? 'nav-link menu-expanded' : 'nav-link' } onClick={ () => this.toggleMenuState('ecommercePagesMenuOpen') } data-toggle="collapse">
              <span className="icon-bg"><i className="mdi mdi-security menu-icon"></i></span>
              <span className="menu-title"><Trans>E-commerce</Trans></span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={ this.state.ecommercePagesMenuOpen }>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <Link className={ this.isPathActive('/ecommerce/invoice') ? 'nav-link active' : 'nav-link' } to="/ecommerce/invoice"><Trans>Invoice</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/ecommerce/pricing') ? 'nav-link active' : 'nav-link' } to="/ecommerce/pricing"><Trans>Pricing Table</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/ecommerce/product-catalogue') ? 'nav-link active' : 'nav-link' } to="/ecommerce/product-catalogue"><Trans>Product Catalog</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/ecommerce/project-list') ? 'nav-link active' : 'nav-link' } to="/ecommerce/project-list"><Trans>Project List</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/ecommerce/orders') ? 'nav-link active' : 'nav-link' } to="/ecommerce/orders"><Trans>Orders</Trans></Link></li>
              </ul>
            </Collapse>
          </li>
          <li className="nav-item documentation-link">
            <a className="nav-link" href="http://bootstrapdash.com/demo/connect-plus/react/documentation/documentation.html">
              <span className="icon-bg">
                <i className="mdi mdi-file-document-box menu-icon"></i>
              </span>
              <span className="menu-title"><Trans>Documentation</Trans></span>
            </a>
          </li>
    <li className="nav-item sidebar-user-actions">
      <div className="user-details">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <div className="d-flex align-items-center">
              <div className="sidebar-profile-img">
                <img src={require("../../assets/images/faces/face28.png")} alt="profile" />
              </div>
              <div className="sidebar-profile-text">
                <p className="mb-1"><Trans>Henry Klein</Trans></p>
              </div>
            </div>
          </div>
          <div className="badge badge-danger">3</div>
        </div>
      </div>
    </li>
    <li className="nav-item sidebar-user-actions">
      <div className="sidebar-user-menu">
        <a href="!#" onClick={event => event.preventDefault()} className="nav-link"><i className="mdi mdi-settings menu-icon"></i>
          <span className="menu-title"><Trans>Settings</Trans></span>
        </a>
      </div>
    </li>
    <li className="nav-item sidebar-user-actions">
      <div className="sidebar-user-menu">
        <a href="!#" onClick={event => event.preventDefault()} className="nav-link"><i className="mdi mdi-speedometer menu-icon"></i>
          <span className="menu-title"><Trans>Take Tour</Trans></span></a>
      </div>
    </li>
    <li className="nav-item sidebar-user-actions">
      <div className="sidebar-user-menu">
        <a href="!#" onClick={event => event.preventDefault()} className="nav-link"><i className="mdi mdi-logout menu-icon"></i>
          <span className="menu-title"><Trans>Log Out</Trans></span></a>
      </div>
    </li>
        </ul>
      </nav>
    );
  }

  isPathActive(path) {
    return this.props.location.pathname.startsWith(path);
  }

  componentDidMount() {
    this.onRouteChanged();
    // add className 'hover-open' to sidebar navitem while hover in sidebar-icon-only menu
    const body = document.querySelector('body');
    document.querySelectorAll('.sidebar .nav-item').forEach((el) => {
      
      el.addEventListener('mouseover', function() {
        if(body.classList.contains('sidebar-icon-only')) {
          el.classList.add('hover-open');
        }
      });
      el.addEventListener('mouseout', function() {
        if(body.classList.contains('sidebar-icon-only')) {
          el.classList.remove('hover-open');
        }
      });
    });
  }

}

export default withRouter(Sidebar);