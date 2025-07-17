import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import TokenService from "../../services/TokenService";
import {toast} from "react-toastify";
import {useHistory,useNavigate} from "react-router-dom";
import api from "../../api";
import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {useTranslation} from "react-i18next";
import {TOKEN_OBTAIN} from "../../constants/api";

export default function LockScreen () {
  const user = JSON.parse(localStorage.getItem("user"));
  const history = useHistory();
  const handleLogout = async () => {
    TokenService.setLocked(false);
    localStorage.clear();
    try {
      await api.post(TOKEN_BLACKLIST, {refresh_token: localStorage.getItem("refresh_token")})
      toast.success("Succesfully logged out!");
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



  const validationSchema = Yup.object().shape({
    password: Yup.string().required("Password is required"),
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

  setValue('email',user?.email)
  /**
   * Form submit
   * @param lockscreen
   */
  const onSubmit = async (lockscreen) => {
    
    try {
      const {data} = await api.post(TOKEN_OBTAIN, lockscreen)
      await TokenService.setToken(data)
      TokenService.setLocked(false)
      toast.success("Successfully Unlocked!!");
      history.push("/");
    } catch (error) {
      if (error.response.data.detail) {
        toast.error('Wrong password')
      } else {
        toast.error("Unexpected error!")
      }
      // history.push('/user-pages/login-1');
    }

  };

    return (
      <div>
        <div className="content-wrapper d-flex align-items-center auth lock-full-bg h-100">
          <div className="row w-100 align-items-center">
            <div className="col-lg-4 mx-auto">
              <div className="auth-form-transparent text-left p-5 text-center">
                <img src={require("../../assets/images/faces/face28.png")} className="lock-profile-img" alt="img" />
                <form onSubmit={handleSubmit(onSubmit)} className="pt-3">
                  <h2>{user?.full_name}</h2>
                  <div className="form-group">
                  <label>{t("Password to unlock")}</label>
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
                    {t("Unlock")}
                  </button>
                </div>
                  {/* <div className="mt-5">
                    <Link className="btn btn-block btn-success btn-lg font-weight-medium" to="/dashboard" onClick={()=>  TokenService.Locked= false}>Unlock</Link>
                  </div> */}
                  <div className="mt-3 text-center">
                    <Link to="/user-pages/login-1" className="text-primary" onClick={handleLogout}>{t("Sign in using a different account")}</Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
