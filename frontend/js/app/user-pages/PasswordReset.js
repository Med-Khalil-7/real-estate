import LogoDark from "../../assets/images/logo.png";
import {yupResolver} from "@hookform/resolvers/yup";
import React,{useState} from "react";
import {useForm} from "react-hook-form";
import { useHistory} from "react-router-dom";
import {toast} from "react-toastify";
import * as Yup from "yup";

import {NEW_PASSWORD_UPDATE, TOKEN_OBTAIN} from "../../constants/api";
import api from "../../api";
import {useTranslation} from "react-i18next";

import { Trans } from 'react-i18next';
import { Dropdown } from 'react-bootstrap'
import i18next from "i18next";


export default function PasswordReset() {
  const validationSchema = Yup.object().shape({
    password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(40, 'Password must not exceed 40 characters'),
    confirmPassword: Yup.string()
      .required("Confirm Password is required")
      .oneOf(
        [Yup.ref("password"), null],
        "Confirm Password does not match"
      ),
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

  const [L,setL]=useState(window.location.hash.split('/'));
  setValue('uidb64',L[3])
  setValue('token',L[4])
  /**
   * Form submit
   * @param data
   */
  const onSubmit = async (data) => {
    delete data.confirmPassword
    try {
      await api.post(NEW_PASSWORD_UPDATE, data);
      toast.success('Password Successfully Reset!');
      history.push('/user-pages/login-1');
    } catch (error) {
      toast.error('Invalid token try again');
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
              <h4>{t("New Password")}</h4>
              <h6 className="font-weight-light">
                {t("Please type your new password.")}{" "}
              </h6>
              <form onSubmit={handleSubmit(onSubmit)} className="pt-3">
              <div className="form-group">
                  <label>{t('Password')}</label>
                  <input
                    name="password"
                    {...register('password')}
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    placeholder={t("Enter your password")}
                    type="password"
                  />
                  <div className="invalid-feedback">{errors.password?.message}</div>
                </div>
                <div className="form-group">
                  <label>{t('Confirm Password')}</label>
                  <input
                    name="confirmPassword"
                    {...register('confirmPassword')}
                    className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                    placeholder={t("Confirm your password")}
                    type="password"
                  />
                  <div className="invalid-feedback">{errors.confirmPassword?.message}</div>
                </div>
                
                <div className="mt-3">
                  <button
                    className="btn  btn-primary btn-lg font-weight-medium auth-form-btn"
                    type="submit"
                  >
                    {t('CHANGE PASSWORD')}
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
