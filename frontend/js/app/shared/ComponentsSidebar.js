import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

export class ComponentsSidebar extends Component {
  render() {
    return (
      <div>
        <div className="az-content-left az-content-left-components">
          <div className="component-item">
            <label>UI Elements</label>
            <nav className="nav flex-column">
              <Link
                className={
                  this.isPathActive('/ui-elements/buttons') ? 'nav-link active' : 'nav-link'
                }
                to="/ui-elements/buttons"
              >
                Buttons
              </Link>
              <Link
                className={
                  this.isPathActive('/ui-elements/dropdowns') ? 'nav-link active' : 'nav-link'
                }
                to="/ui-elements/dropdowns"
              >
                Dropdown
              </Link>
              <Link
                className={this.isPathActive('/ui-elements/icons') ? 'nav-link active' : 'nav-link'}
                to="/ui-elements/icons"
              >
                Icons
              </Link>
            </nav>

            <label>Forms</label>
            <nav className="nav flex-column">
              <Link
                className={
                  this.isPathActive('/form/form-elements') ? 'nav-link active' : 'nav-link'
                }
                to="/form/form-elements"
              >
                Form Elements
              </Link>
            </nav>

            <label>Charts</label>
            <nav className="nav flex-column">
              <Link
                className={this.isPathActive('/charts/chartjs') ? 'nav-link active' : 'nav-link'}
                to="/charts/chartjs"
              >
                ChartJS
              </Link>
            </nav>

            <label>Tables</label>
            <nav className="nav flex-column">
              <Link
                className={
                  this.isPathActive('/tables/basic-table') ? 'nav-link active' : 'nav-link'
                }
                to="/tables/basic-table"
              >
                Basic Tables
              </Link>
            </nav>
          </div>
          {/* component-item */}
        </div>
        {/* az-content-left */}
      </div>
    );
  }

  isPathActive(path) {
    return this.props.location.pathname.startsWith(path);
  }
}

export default withRouter(ComponentsSidebar);
