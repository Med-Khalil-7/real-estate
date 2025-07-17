import LogoDark from "../../assets/images/logo.png";
import {yupResolver} from "@hookform/resolvers/yup";
import React from "react";
import {useForm} from "react-hook-form";
import {Link, useHistory} from "react-router-dom";
import {toast} from "react-toastify";
import * as Yup from "yup";

import {CURRENT_USER, TOKEN_OBTAIN} from "../../constants/api";
import TokenService from "../../services/TokenService";
import api from "../../api";
import {useTranslation} from "react-i18next";

import { Trans } from 'react-i18next';
import { Dropdown } from 'react-bootstrap'
import i18next from "i18next";

export default function Login() {
  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email is required").email("Email is invalid"),
    password: Yup.string().required("Password is required"),
  });
  // react-form-hooks stuff
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  // Translation hook
  const {t, i18n} = useTranslation();

  // useHistory hook
  const history = useHistory();

  /**
   * Fetch current use after login and push it to local storage
   *
   * @export
   * @returns
   */
  const fetchCurrentUser = async () => {
    try {
      const res = await api.get(CURRENT_USER);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (error) {
      toast.error("Error retreiving the current user!");
    }
  };

  /**
   * Form submit
   * @param login
   */
  const onSubmit = async (login) => {
    try {
      const {data} = await api.post(TOKEN_OBTAIN, login)
      await TokenService.setToken(data)
      await fetchCurrentUser()
      TokenService.setLocked(false);
      toast.success("Successfully logged in!!")
      history.push("/")

    } catch (error) {
      if (error.response.data.detail) {
        toast.error('Wrong email or password')
      } else {
        toast.error("Unexpected error!")
      }
    }

  };

  const changeLanguageHandler = lang => {
    i18next.changeLanguage(lang);
    const body = document.querySelector("body");
    if (i18next.language === "ar") {
      body.classList.add("rtl");
    } else {
      body.classList.remove("rtl");
    }
  };


  return (
    <div>
      <div className="d-flex align-items-center auth px-0">
        <div className="row w-100 mx-0">
          <div className="col-lg-4 mx-auto">
            <div className="auth-form-light text-left py-5 px-4 px-sm-5">
              <div style={{display:"flex"}}>
              <div className="brand-logo" >
                <img src={LogoDark} alt="logo"/>
              </div>
              
              
                </div>
              <h4>{t("Hello! let's get started")}</h4>
              <h6 className="font-weight-light">
                {t("Sign in to continue.")}{" "}
              </h6>
              <form onSubmit={handleSubmit(onSubmit)} className="pt-3">
                <div className="form-group">
                  <label>{t("Email")}</label>
                  <input
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    name="email"
                    type="text"
                    {...register("email")}
                    placeholder={t("Enter your email")}
                  />
                  <div className="invalid-feedback">
                    {errors.email?.message}
                  </div>
                </div>
                <div className="form-group">
                  <label>{t("Password")}</label>
                  <input
                    className={`form-control ${
                      errors.password ? "is-invalid" : ""
                    }`}
                    name="password"
                    type="password"
                    {...register("password")}
                    placeholder={t("Enter your password")}
                  />
                  <div className="invalid-feedback">
                    {errors.password?.message}
                  </div>
                </div>
                <div className="mt-3">
                  <button
                    className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                    type="submit"
                  >
                    {t("SIGN IN")}
                  </button>
                </div>
                <div className="my-2 d-flex justify-content-between align-items-center">
                  <div className="form-check">
                    <label className="form-check-label text-muted">
                      <input type="checkbox" className="form-check-input"/>
                      <i className="input-helper"/>
                      {t("Keep me signed in")}
                    </label>
                  </div>
                  <a
                    href="!#"
                    onClick={(event) => event.preventDefault()}
                    className="auth-link text-black"
                  >
                    <Link to="/user-pages/resetpasswordcheck" className="text-primary">
                    {t("Forgot password?")}
                  </Link>
                  </a>
                </div>

                <div className="text-center mt-4 font-weight-light">
                  {t("Don't have an account?")}{" "}
                  <Link to="/user-pages/register-1" className="text-primary">
                    {t("Create")}
                  </Link>
                </div>
                
              </form>
              <Dropdown alignRight >
                  <Dropdown.Toggle className="nav-link count-indicator"style={{display:"flex"}} >
                    <div className="nav-language-icon">
                      <i
                        className={
                          i18next.language === "ar"
                            ? "flag-icon flag-icon-sa"
                            : "flag-icon flag-icon-gb"
                        }
                      />
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
            </div>
            
          </div>
          
        </div>
      </div>
    </div>
  );
}
