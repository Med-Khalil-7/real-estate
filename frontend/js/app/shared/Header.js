import i18next from "i18next";
import React, {useEffect} from "react";
import {Dropdown} from "react-bootstrap";
import {Link, withRouter} from "react-router-dom";
import {Trans} from "react-i18next";
import api from "../../api";
import {TOKEN_BLACKLIST} from "../../constants/api";
import {toast} from "react-toastify";
import usePermission from "../hooks/usePermission";
import TokenService from "../../services/TokenService";


function Header({location, history}) {

  const {permissions, is_superuser, is_landlord, is_tenant} = usePermission()
  const user = JSON.parse(localStorage.getItem("user"));
  const handleLogout = async () => {
    localStorage.clear();
    try {
      await api.post(TOKEN_BLACKLIST, {refresh_token: localStorage.getItem("refresh_token")})
      toast.success("Succesfully logged out!");
      history.push("/user-pages/login-1");
    } catch (error) {
      if (error.response.data.detail) {
        toast.error(error.response.data.detail)
      } else {
        toast.error("Unexpected error!")
      }
    } finally {
      TokenService.clearToken();
      history.push("/user-pages/login-1");
    }
  }


  const changeLanguageHandler = lang => {
    i18next.changeLanguage(lang);
    const body = document.querySelector("body");
    if (i18next.language === "ar") {
      body.classList.add("rtl");
    } else {
      body.classList.remove("rtl");
    }
  };


  const toggleBottomMenu = () => {
    document.querySelector(".bottom-navbar").classList.toggle("header-toggled");
  }

  const toggleRightSidebar = () => {
    document.querySelector(".right-sidebar").classList.toggle("open");
  }


  useEffect(() => {
    // Horizontal menu fixed when scrolling
    window.addEventListener("scroll", function () {
      let navbar = document.querySelector(".horizontal-menu");
      let body = document.querySelector("body");
      if (window.scrollY >= 70) {
        navbar.classList.add("fixed-on-scroll");
        body.classList.add("horizontal-menu-fixed-on-scroll");
      } else {
        navbar.classList.remove("fixed-on-scroll");
        body.classList.remove("horizontal-menu-fixed-on-scroll");
      }
    });

    // Horizontal menu navigation in mobile menu on click
    let navItemClicked = document.querySelectorAll(
      ".horizontal-menu .page-navigation >.nav-item"
    );
    navItemClicked.forEach(function (el) {
      el.addEventListener("click", function () {
        var result = [],
          node = this.parentNode.firstChild;
        while (node) {
          if (node !== this) result.push(node);
          node = node.nextElementSibling || node.nextSibling;
        }
        result.forEach(el => el.classList.remove("show-submenu"));
        this.classList.toggle("show-submenu");
      });
    });
  }, []);

  const isPathActive = (path) => {
    return location.pathname.startsWith(path);
  }

  return (
    <div className="horizontal-menu">
      <nav className="navbar top-navbar default-layout-navbar col-lg-12 col-12 p-0 d-flex flex-row">
        <div className="container">
          <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
            <Link className="navbar-brand brand-logo" to="/">
              <img src={require("../../assets/images/logo3.png")} alt="logo"/>
            </Link>
            {/* <Link className="navbar-brand brand-logo-mini" to="/"><img src={require('../../assets/images/logo-mini.svg').default} alt="logo" /></Link> */}
          </div>
          <div className="navbar-menu-wrapper d-flex align-items-stretch justify-content-end">
            <div className="search-field d-none d-md-block">
              <form
                className="d-flex align-items-center h-100"
                action="#"
              />
            </div>
            <ul className="navbar-nav navbar-nav-right">
              <li className="nav-item nav-profile nav-language d-none d-lg-flex">
                <Dropdown alignRight>
                  <Dropdown.Toggle className="nav-link count-indicator">
                    <div className="nav-language-icon">
                      <i
                        className={
                          i18next.language === "ar"
                            ? "flag-icon flag-icon-sa"
                            : "flag-icon flag-icon-gb"
                        }
                      />
                    </div>
                    <div className="nav-language-text mx-2">
                      <p className="mt-3 text-black">
                        {i18next.language === "ar" ? <Trans>Arabic</Trans> : "English"}
                      </p>
                    </div>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="preview-list navbar-dropdown">
                    <Dropdown.Item
                      className="dropdown-item d-flex align-items-center"
                      onClick={() => changeLanguageHandler("ar")}
                    >
                      <div className="nav-language-icon mr-2">
                        <i
                          className="flag-icon flag-icon-sa"
                          title="sa"
                          id="sa"
                        />
                      </div>
                      <div className="nav-language-text">
                        <p className="mb-1 text-black">
                          <Trans>Arabic</Trans>
                        </p>
                      </div>
                    </Dropdown.Item>
                    <div className="dropdown-divider"/>
                    <Dropdown.Item
                      className="dropdown-item d-flex align-items-center"
                      onClick={() => changeLanguageHandler("en")}
                    >
                      <div className="nav-language-icon mr-2">
                        <i
                          className="flag-icon flag-icon-gb"
                          title="GB"
                          id="gb"
                        />
                      </div>
                      <div className="nav-language-text">
                        <p className="mb-1 text-black">
                          <Trans>English</Trans>
                        </p>
                      </div>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </li>

              <li className="nav-item nav-profile nav-language  d-none d-lg-flex">
                <Dropdown alignRight>
                  <Dropdown.Toggle className="nav-link count-indicator">
                    <div className="nav-profile-img">
                      <img
                        src={require("../../assets/images/faces/face28.png")}
                        alt="profile"
                      />
                    </div>
                    <div className="nav-profile-text">
                      <p className="mb-1 text-black">
                        {user?.full_name}
                      </p>
                    </div>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="preview-list navbar-dropdown">
                    <div className="p-3 text-center bg-primary">
                      <img
                        className="img-avatar img-avatar48 img-avatar-thumb"
                        src={require("../../assets/images/faces/face28.png")}
                        alt=""
                      />
                    </div>
                    <div className="p-2">
                      <h5 className="dropdown-header text-uppercase pl-2 text-dark">
                        <Trans>User Options</Trans>
                      </h5>
                      <Dropdown.Item
                        className="dropdown-item d-flex align-items-center justify-content-between"
                        href="!#"
                        onClick={evt => evt.preventDefault()}
                      >
                          <span>
                            <Trans>Profile</Trans>
                          </span>
                        <span className="p-0">
                            <i className="mdi mdi-account-outline ml-1"/>
                          </span>
                      </Dropdown.Item>
                      <div
                        role="separator"
                        className="dropdown-divider"
                      />
                      <h5 className="dropdown-header text-uppercase  pl-2 text-dark mt-2">
                        <Trans>Actions</Trans>
                      </h5>
                      {/* Lock screen */}
                      <Dropdown.Item
                        className="dropdown-item d-flex align-items-center justify-content-between"
                        as={Link}
                        to="/user-pages/lockscreen"
                        onClick={()=>  {TokenService.setLocked(true)}}
                      >
                          <span>
                            <Trans>Lock Account</Trans>
                          </span>
                        <i className="mdi mdi-lock ml-1"/>
                      </Dropdown.Item>
                      <Dropdown.Item
                        className="dropdown-item d-flex align-items-center justify-content-between"
                        onClick={handleLogout}
                      >
                          <span>
                            <Trans>Log Out</Trans>
                          </span>
                        <i className="mdi mdi-logout ml-1"/>
                      </Dropdown.Item>
                    </div>
                  </Dropdown.Menu>
                </Dropdown>
              </li>
              {is_superuser ? (
                <li className="nav-item">
                  <Dropdown alignRight>
                    <Dropdown.Toggle className="nav-link count-indicator hide-carret">
                      <i className="mdi mdi-settings-outline"/>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="dropdown-menu navbar-dropdown preview-list">
                      <h6 className="p-3 mb-0  py-4">
                        <Trans>Settings</Trans>
                      </h6>
                      <div className="dropdown-divider"/>
                      <Dropdown.Item
                        as={Link}
                        to="/users/list"
                        className="dropdown-item preview-item"
                      >
                        <Trans>Manage users</Trans>
                      </Dropdown.Item>
                      <div className="dropdown-divider"/>
                      <Dropdown.Item
                        as={Link}
                        to="/groups/list"
                        className="dropdown-item preview-item"
                      >
                        <Trans>Manage groups</Trans>
                      </Dropdown.Item>
                      <div className="dropdown-divider"/>
                      <Dropdown.Item
                        as={Link}
                        to="/settings/templates"
                        className="dropdown-item preview-item"
                      >
                        <Trans>Reporting templates</Trans>
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={Link}
                        to="/books/taxrates"
                        className="dropdown-item preview-item"
                      >
                        <Trans>Tax rates</Trans>
                      </Dropdown.Item>
                      <div className="dropdown-divider"/>
                      <Dropdown.Item
                        as={Link}
                        to="/email/history"
                        className="dropdown-item preview-item"
                      >
                        <Trans>Email history</Trans>
                      </Dropdown.Item>
                      <div className="dropdown-divider"/>
                    </Dropdown.Menu>
                  </Dropdown>
                </li>
              ) : (
                ""
              )}
            </ul>
            <button
              className="navbar-toggler navbar-toggler-right d-lg-none align-self-center"
              type="button"
              onClick={toggleBottomMenu}
            >
              <span className="mdi mdi-menu"/>
            </button>
          </div>
        </div>
      </nav>
      <nav className="bottom-navbar">
        <div className="container">
          <ul className="nav page-navigation">
            <li
              className={
                isPathActive("/dashboard")
                  ? "nav-item active"
                  : "nav-item"
              }
            >
              <Link className="nav-link" to="/dashboard">
                <i className="mdi mdi-home menu-icon"/>
                <span className="menu-title">
                    <Trans>Dashboard</Trans>
                  </span>
              </Link>
            </li>

            {/* properties */}
            {is_landlord || is_tenant || permissions.includes("core.view_tower") ?
              (<li
                className={
                  isPathActive("/tower")
                    ? "nav-item active"
                    : "nav-item"
                }
              >
                <Link className="nav-link" to="/tower/list">
                  <i className="mdi mdi-domain menu-icon"/>
                  <span className="menu-title">
                    <Trans>Buildings</Trans>
                  </span>
                </Link>
              </li>) : ""
            }

            {/* properties */}
            {
              is_landlord | is_tenant | permissions.includes("core.view_property") &&
              (<li
                className={isPathActive('/properties') ? 'nav-item active' : isPathActive('/properties') ? 'nav-item active' : 'nav-item'}>
                <div className="nav-link">
                  <i className="mdi mdi-home menu-icon"/>
                  <span className="menu-title"><Trans>Properties</Trans></span>
                  <i className="menu-arrow"/></div>
                <div className="submenu">
                  <ul className="submenu-item">
                    <li className="nav-item"><Link
                      className={isPathActive('/commercials') ? 'nav-link active' : 'nav-link'}
                      to="/commercial/list"><Trans><Trans>Commercial stores</Trans></Trans></Link></li>
                    <li className="nav-item"><Link
                      className={isPathActive('/villas') ? 'nav-link active' : 'nav-link'}
                      to="/villa/list"><Trans>Villa</Trans></Link></li>
                    <li className="nav-item"><Link
                      className={isPathActive('/apartments') ? 'nav-link active' : 'nav-link'}
                      to="/apartment/list"><Trans>Apartments</Trans></Link></li>
                  </ul>
                </div>
              </li>)
            }
            {/* Contracts */}
            {is_landlord | is_tenant | permissions.includes("core.view_unitcontract") && (<li
              className={
                isPathActive("//apartment-contracts/list")
                  ? "nav-item active"
                  : "nav-item"
              }
            >
              <Link className="nav-link" to="/apartment-contracts/list">
                <i className="mdi mdi-file-document-edit  menu-icon"/>
                <span className="menu-title">
                    <Trans>Contracts</Trans>
                  </span>
              </Link>
            </li>)}

            {/* Employees */}
            {permissions.includes("core.view_employee") ? (
              <li
                className={
                  isPathActive("/employees")
                    ? "nav-item active"
                    : isPathActive("/employees")
                      ? "nav-item active"
                      : isPathActive("/code-editor")
                        ? "nav-item active"
                        : "nav-item"
                }
              >
                <div className="nav-link">
                  <i className="mdi mdi-account menu-icon"/>
                  <span className="menu-title">
                      <Trans>Employees</Trans>
                    </span>
                  <i className="menu-arrow"/>
                </div>
                <div className="submenu">
                  <ul className="submenu-item">
                    {permissions.includes("core.view_employee") ? (
                      <li className="nav-item">
                        {" "}
                        <Link
                          className={
                            isPathActive("/employees/list")
                              ? "nav-link active"
                              : "nav-link"
                          }
                          to="/employees/list"
                        >
                          <Trans>List</Trans>
                        </Link>
                      </li>
                    ) : (
                      ""
                    )}
                    {permissions.includes("core.view_employeecontract") ? (
                      <li className="nav-item">
                        <Link
                          className={
                            isPathActive("/employees/contracts/list")
                              ? "nav-link active"
                              : "nav-link"
                          }
                          to="/employees/contracts/list"
                        >
                          <Trans>Contracts</Trans>
                        </Link>
                      </li>
                    ) : (
                      ""
                    )}
                  </ul>
                </div>
              </li>
            ) : (
              ""
            )}

            {/* Landlord */}
            {permissions.includes("core.view_user") ? (
              <li
                className={
                  isPathActive("/landlords/list")
                    ? "nav-item active"
                    : "nav-item"
                }
              >
                <Link className="nav-link" to="/landlords/list">
                  <i className="mdi mdi-account-tie menu-icon"/>
                  <span className="menu-title">
                      <Trans>Landlord</Trans>
                    </span>
                </Link>
              </li>
            ) : (
              ""
            )}

            {/* Tenant */}
            {permissions.includes("core.view_user") ? (
              <li
                className={
                  isPathActive("/tenants/list")
                    ? "nav-item active"
                    : "nav-item"
                }
              >
                <Link className="nav-link" to="/tenants/list">
                  <i className="mdi mdi-account-key menu-icon"/>
                  <span className="menu-title">
                      <Trans>Tenants</Trans>
                    </span>
                </Link>
              </li>
            ) : (
              ""
            )}

            {/* kanban */}
            {is_landlord | is_tenant | permissions.includes("core.view_board") ? (
              <li
                className={
                  isPathActive("/boards")
                    ? "nav-item active"
                    : "nav-item"
                }
              >
                <Link className="nav-link" to="/boards">
                  <i className="mdi mdi-trello menu-icon"/>
                  <span className="menu-title">
                      <Trans>Kanban board</Trans>
                    </span>
                </Link>
              </li>
            ) : (
              ""
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default withRouter(Header);


