import React from 'react';
import LogoDark from '../../assets/images/logo.png';
import {yupResolver} from '@hookform/resolvers/yup';
import {useForm} from 'react-hook-form';
import {Link, useHistory} from 'react-router-dom';
import {toast} from 'react-toastify';
import * as Yup from 'yup';
import {SIGNUP} from '../../constants/api';
import api from '../../api';
import {useTranslation} from 'react-i18next';

import { Trans } from 'react-i18next';
import { Dropdown } from 'react-bootstrap'
import i18next from "i18next";

export default function Register() {
  /**
   * Form schema
   */
  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required('first_name is required'),
    last_name: Yup.string().required('first_name is required'),
    is_landlord: Yup.bool(),
    is_tenant: Yup.bool(),
    email: Yup.string()
      .required('Email is required')
      .email('Email is invalid'),
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

  /**
   * Form Hooks
   */
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  // Translation hook
  const {t} = useTranslation();

  /**
   * Use history hook
   */
  const history = useHistory();

  /**
   * Submit form data
   * @param {*} data
   */
  const onSubmit = async (data) => {
    delete data.confirmPassword
    try {
      await api.post(SIGNUP, data);
      toast.success('Successfully registred wait for admins to confirm you account!');
      history.push('/user-pages/login-1');
    } catch (error) {
      toast.error(error.message);
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
              <h4>{t('New here?')}</h4>
              <h6 className="font-weight-light">
                {t('Signing up is easy. It only takes a few steps')}
              </h6>
              <form onSubmit={handleSubmit(onSubmit)} className="pt-3">
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label>{t('First name')}</label>
                    <input
                      name="first_name"
                      {...register('first_name')}
                      className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
                      placeholder={t("Enter your firstname")}
                      type="text"
                    />
                    <div className="invalid-feedback">{errors.first_name?.message}</div>
                  </div>
                  <div className="form-group col-md-6">
                    <label> {t('Last name')}</label>
                    <input
                      name="last_name"
                      {...register('last_name')}
                      className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}
                      placeholder={t("Enter your lastname")}
                      type="text"
                    />
                    <div className="invalid-feedback">{errors.last_name?.message}</div>
                  </div>
                </div>
                {/* form-group */}
                <div className="form-group">
                  <label>{t('Email')}</label>
                  <input
                    name="email"
                    {...register('email')}
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    placeholder={t("Enter your email")}
                    type="text"
                  />
                  <div className="invalid-feedback">{errors.email?.message}</div>
                </div>
                {/*  */}
                <div className="form-row d-flex justify-content-between">
                  <div className="form-group col-md-4">
                    <div className="form-check">
                      <label className="form-check-label">
                        <input
                          type="checkbox"
                          name="is_landlord"
                          id=""
                          {...register('is_landlord')}
                          className="form-check-input"
                        />
                        <i className="input-helper"></i>
                        {t('Landlord')}
                      </label>
                    </div>
                  </div>

                  <div className="form-group col-md-4">
                    <div className="form-check">
                      <label className="form-check-label">
                        <input
                          type="checkbox"
                          name="is_tenant"
                          id=""
                          {...register('is_tenant')}
                          className="form-check-input"
                        />
                        <i className="input-helper"></i>
                        {t('Tenant')}
                      </label>
                    </div>
                  </div>
                </div>
                {/*  */}
                {/* form-group */}
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
                {/* form-group */}
                <div className="mt-3">
                  <button
                    type="submit"
                    className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                  >
                    {t('SIGN UP')}
                  </button>
                </div>
                <div className="text-center mt-4 font-weight-light">
                  {t('Already have an account?')} {" "}
                  <Link to="/user-pages/login-1" className="text-primary">
                    {t('Login')}
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
