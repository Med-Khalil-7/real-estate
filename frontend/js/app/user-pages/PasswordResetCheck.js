import LogoDark from "../../assets/images/logo.png";
import {yupResolver} from "@hookform/resolvers/yup";
import React,{useState} from "react";
import {useForm} from "react-hook-form";
import {Link, useHistory} from "react-router-dom";
import {toast} from "react-toastify";
import * as Yup from "yup";

import {REST_PASSWORD, TOKEN_OBTAIN} from "../../constants/api";
import TokenService from "../../services/TokenService";
import api from "../../api";
import {useTranslation} from "react-i18next";

import { Trans } from 'react-i18next';
import { Dropdown } from 'react-bootstrap'
import i18next from "i18next";


export default function PasswordResetCheck() {
  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email is required").email("Email is invalid"),
  });
  // react-form-hooks stuff
  const {
    register,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  // Translation hook
  const {t, i18n} = useTranslation();

  // useHistory hook
  const history = useHistory();


  setValue('redirect_url','http://'+window.location.host);
  /**
   * Form submit
   * @param data
   */
  const onSubmit = async (data) => {
    try {
      const response =await api.post(REST_PASSWORD, data);
      toast.success(response.data.success)
      history.push('/user-pages/login-1');
    } catch (error) {
      toast.error(error.response.data.error);

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
              <div className="brand-logo">
                <img src={LogoDark} alt="logo"/>
              </div>
              <h4>{t("Reset Your Account Password")}</h4>
              <h6 className="font-weight-light">
                {t("Please enter your email address to reset for your account passwords.")}{" "}
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
                <div className="mt-3">
                  <button
                    className="btn  btn-primary btn-lg font-weight-medium auth-form-btn"
                    type="submit"
                  >
                    {t("RESET PASSWORD")}
                  </button>
                  <button
                    className="btn btn-lg font-weight-medium auth-form-btn"
                    onClick={() =>history.push("/user-pages/login-1")}
                  >
                    {t("Cancel")}
                  </button>
                </div>
              </form>
              <div className="text-center mt-4 font-weight-light">
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
    </div>
  );
}


