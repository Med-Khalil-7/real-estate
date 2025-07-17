import {yupResolver} from "@hookform/resolvers/yup";
import _ from "lodash";
import React, {useEffect, useState} from "react";

//  dates utility
import DatePicker from "react-datepicker";

import {Typeahead} from "react-bootstrap-typeahead";
import {Controller, useForm} from "react-hook-form";

import {useHistory, useParams} from "react-router-dom";
import {toast} from "react-toastify";
import * as Yup from "yup";
import {useTranslation} from "react-i18next";

import {DEPARTMENTS, GROUPS, USERS} from "../../constants/api";
import api from "../../api";

export default function UsersAdd(props) {
  const {t} = useTranslation();
  const {id} = useParams();
  // Schema validator
  const passwords = !id
    ? {
      password: Yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters")
        .max(40, "Password must not exceed 40 characters"),
      confirmPassword: Yup.string()
        .required("Confirm Password is required")
        .oneOf(
          [Yup.ref("password"), null],
          "Confirm Password does not match"
        ),
    }
    : {};

  const validationSchema = Yup.object().shape({
    /* Employee related shit should be validated only if is_employee enabled */
    id_type: Yup.string().required("An ID type is required."),
    id_number: Yup.number().required("An ID number is required.").typeError('id number is invalid'),
    phone_number: Yup.string().required("A phone number is required."),
    title: Yup.string()
      .when("is_employee", {
        is: true,
        then: Yup.string().required("Employee title is required"),
      })
      .nullable(),
    department: Yup.string()
      .when("is_employee", {
        is: true,
        then: Yup.string().required("Employee department is required"),
      })
      .nullable(),
    hire_date: Yup.date()
      .when("is_employee", {
        is: true,
        then: Yup.date().required("Employee hiring date is required"),
      })
      .nullable(),
    start_date: Yup.date()
      .when("is_employee", {
        is: true,
        then: Yup.date().required("Employee start date is required"),
      })
      .min(Yup.ref("hire_date"), "end date must be greater than start date")
      .nullable(),
    first_name: Yup.string().required("first name is required"),
    last_name: Yup.string().required("last name is required"),
    email: Yup.string().required("Email is required").email("Email is invalid"),
    ...passwords,
    groups: Yup.array().default([]),
    address: Yup.object().shape({
      city: Yup.string().required("City is required"),
      state: Yup.string().required("State is required"),
      district: Yup.string().required("District is required"),
    }),
    is_superuser: Yup.bool().required().default(false),
    is_tenant: Yup.bool().required().default(false),
    is_landlord: Yup.bool().required().default(false),
    is_active: Yup.bool().required().default(false),
    is_staff: Yup.bool().required().default(true),
    gender: Yup.string().required("Gender is required").default("M"),
  });

  const [groups, setGroups] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isBusy, setIsBusy] = useState(false);

  const history = useHistory();
  // react-form-hooks stuff
  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      is_active: false,
      is_staff: false,
    },
  });

  const loadData = async () => {
    /**
     * Load user groups
     */
    try {
      setIsBusy(true);
      if (id) {
        const {data} = await api.get(`${USERS}${id}/`);
        const fields = [
          "title",
          "department",
          "is_employee",
          "hire_date",
          "start_date",
          "first_name",
          "last_name",
          "email",
          "groups",
          "address",
          "is_superuser",
          "is_tenant",
          "is_landlord",
          "is_active",
          "is_staff",
          "phone_number",
          "id_type",
          "id_number",
          "gender",
        ];
        fields.forEach((field) => {
          setValue(field, data[field]);
        });
      }
      const groupRes = await api.get(GROUPS);
      setGroups(groupRes.data);
      const departmentRes = await api.get(DEPARTMENTS);
      setDepartments(departmentRes.data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsBusy(false);
    }
  };

  // hook loaders
  useEffect(() => {
    loadData().then();
  }, []);

  /**
   * Form submit
   * @param {*} data
   */
  const onSubmit = async (data) => {
    if (id) {
      api
        .put(`${USERS}${id}/`, data)
        .then((res) => {
          toast.success("User updated!");
          history.push("/users/list");
        })
        .catch((e) => toast.error(` ${e?.response?.data?.detail}`));
    } else {
      api
        .post(USERS, data)
        .then((res) => {
          toast.success("User added!");
          history.push("/users/list");
        })
        .catch((e) => {
          toast.error(`Failed to add user ${e?.response?.data?.detail}`);
        });
    }
  };

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title">{t("User management")}</h3>
      </div>
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">
                {id ? t("User edit") : t("User add")}
              </h4>
              <p className="card-description">
                {" "}
                {t("Enter the user information")}
              </p>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label> {t("First name")}</label>
                    <input
                      name="first_name"
                      type="text"
                      {...register("first_name")}
                      className={`form-control ${
                        errors?.first_name ? "is-invalid" : ""
                      }`}
                    />
                    <div className="invalid-feedback">
                      {errors?.first_name?.message}
                    </div>
                  </div>
                  <div className="form-group col-md-6">
                    <label>{t("Last name")}</label>
                    <input
                      name="last_name"
                      type="text"
                      {...register("last_name")}
                      className={`form-control ${
                        errors?.last_name ? "is-invalid" : ""
                      }`}
                    />
                    <div className="invalid-feedback">
                      {errors?.last_name?.message}
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label> {t("ID type")}</label>
                    <select
                      name="id_type"
                      {...register("id_type")}
                      className={`form-control ${
                        errors?.id_type ? "is-invalid" : ""
                      }`}
                    >
                      <option value="NA">{t("National")}</option>
                      <option value="IK">{t("Ikama")}</option>
                      <option value="PA">{t("Passport")}</option>
                    </select>
                    <div className="invalid-feedback">
                      {errors?.id_type?.message}
                    </div>
                  </div>
                  <div className="form-group col-md-6">
                    <label>{t("ID number")}</label>
                    <input
                      name="id_number"
                      type="number"
                      {...register("id_number")}
                      className={`form-control ${
                        errors?.id_number ? "is-invalid" : ""
                      }`}
                    />
                    <div className="invalid-feedback">
                      {errors?.id_number?.message}
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label>{t("Email")}</label>
                    <input
                      name="email"
                      type="text"
                      {...register("email")}
                      className={`form-control ${
                        errors?.email ? "is-invalid" : ""
                      }`}
                    />
                    <div className="invalid-feedback">
                      {errors?.email?.message}
                    </div>
                  </div>

                  <div className="form-group col-md-6">
                    <label> {t("Phone number")} </label>
                    <input
                      name="phone_number"
                      type="text"
                      {...register("phone_number")}
                      className={`form-control ${
                        errors?.phone_number ? "is-invalid" : ""
                      }`}
                    />
                    <div className="invalid-feedback">
                      {errors?.phone_number?.message}
                    </div>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label> {t("Gender")} </label>
                    <select
                      name="gender"
                      type="text"
                      {...register("gender")}
                      className={`form-control ${
                        errors?.gender ? "is-invalid" : ""
                      }`}
                    >
                      {["M", "F"].map((gender, index) => (
                        <option key={"gender" + index} value={gender}>
                          {gender}
                        </option>
                      ))}
                    </select>
                    <div className="invalid-feedback">
                      {errors?.gender?.message}
                    </div>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-md-4">
                    <label>{t("State")}</label>
                    <input
                      name="address.state"
                      type="text"
                      {...register("address.state")}
                      className={`form-control ${
                        errors?.address?.state ? "is-invalid" : ""
                      }`}
                    />
                    <div className="invalid-feedback">
                      {errors?.address?.state?.message}
                    </div>
                  </div>

                  <div className="form-group col-md-4">
                    <label>{t("City")}</label>
                    <input
                      name="address.city"
                      type="text"
                      {...register("address.city")}
                      className={`form-control ${
                        errors?.address?.city ? "is-invalid" : ""
                      }`}
                    />
                    <div className="invalid-feedback">
                      {errors?.address?.city?.message}
                    </div>
                  </div>

                  <div className="form-group col-md-4">
                    <label>{t("District")}</label>
                    <input
                      name="address.district"
                      type="text"
                      {...register("address.district")}
                      className={`form-control ${
                        errors?.address?.district ? "is-invalid" : ""
                      }`}
                    />
                    <div className="invalid-feedback">
                      {errors?.address?.district?.message}
                    </div>
                  </div>
                </div>

                {!id && (
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label>{t("Password")}</label>
                      <input
                        name="password"
                        type="password"
                        {...register("password")}
                        className={`form-control ${
                          errors?.password ? "is-invalid" : ""
                        }`}
                      />
                      <div className="invalid-feedback">
                        {errors?.password?.message}
                      </div>
                    </div>
                    <div className="form-group col-md-6">
                      <label>{t("Confirm Password")}</label>
                      <input
                        name="confirmPassword"
                        type="password"
                        {...register("confirmPassword")}
                        className={`form-control ${
                          errors?.confirmPassword ? "is-invalid" : ""
                        }`}
                      />
                      <div className="invalid-feedback">
                        {errors?.confirmPassword?.message}
                      </div>
                    </div>
                  </div>
                )}
                {!isBusy && (
                  <div className="form-row">
                    <div className="form-group col-md-12">
                      <label htmlFor="groups">{t("Groups")}</label>
                      <Controller
                        control={control}
                        name="groups"
                        render={({field}) => (
                          <Typeahead
                            {...field}
                            id="groups"
                            labelKey="name"
                            multiple
                            options={groups}
                            selected={groups.filter((item) =>
                              /* This is shite need to be replaced */
                              _.find(
                                getValues("groups"),
                                (id) => id === item.id
                              )
                            )}
                            onChange={(selected) => {
                              const ids = _.map(selected, "id");
                              if (!ids) return;
                              setValue("groups", ids);
                            }}
                          />
                        )}
                      />
                    </div>
                  </div>
                )}

                <div className="form-row">
                  <div className="form-group col-md-4">
                    <div className="form-check">
                      <label className="form-check-label">
                        <input
                          type="checkbox"
                          name="is_superuser"
                          id="is_superuser"
                          {...register("is_superuser")}
                          className="form-check-input"
                        />
                        <i className="input-helper"></i>
                        {t("Superuser")}
                      </label>
                    </div>
                  </div>
                  <div className="form-group col-md-4">
                    <div className="form-check">
                      <label className="form-check-label">
                        <input
                          type="checkbox"
                          name="is_staff"
                          id="is_staff"
                          {...register("is_staff")}
                          className="form-check-input"
                        />
                        <i className="input-helper"></i>
                        {t("Staff")}
                      </label>
                    </div>
                  </div>
                  <div className="form-group col-md-4">
                    <div className="form-check">
                      <label className="form-check-label">
                        <input
                          type="checkbox"
                          name="is_active"
                          id="is_active"
                          {...register("is_active")}
                          className="form-check-input"
                        />
                        <i className="input-helper"></i>
                        {t("Active")}
                      </label>
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md-4">
                    <div className="form-check">
                      <label className="form-check-label">
                        <input
                          type="checkbox"
                          name="is_tenant"
                          id="is_tenant"
                          {...register("is_tenant")}
                          className="form-check-input"
                        />
                        <i className="input-helper"></i>
                        {t("Tenant")}
                      </label>
                    </div>
                  </div>
                  <div className="form-group col-md-4">
                    <div className="form-check">
                      <label className="form-check-label">
                        <input
                          type="checkbox"
                          name="is_landlord"
                          id="is_landlord"
                          {...register("is_landlord")}
                          className="form-check-input"
                        />
                        <i className="input-helper"></i>
                        {t("Landlord")}
                      </label>
                    </div>
                  </div>
                  <div className="form-group col-md-4">
                    <div className="form-check">
                      <label className="form-check-label">
                        <input
                          type="checkbox"
                          name="is_employee"
                          id="is_employee"
                          {...register("is_employee")}
                          className="form-check-input"
                        />
                        <i className="input-helper"></i>
                        {t("Employee")}
                      </label>
                    </div>
                  </div>
                </div>

                {
                  /* employee form */
                  watch("is_employee") && (
                    <div className="form-row">
                      <div className="form-group col-md-12">
                        <h4>{t("Employee details")}</h4>
                      </div>

                      <div className="form-group col-md-12">
                        <label> {t("Title")} </label>
                        <input
                          name="title"
                          type="text"
                          {...register("title")}
                          className={`form-control ${
                            errors?.employee?.title ? "is-invalid" : ""
                          }`}
                        />
                      </div>

                      {!isBusy && (
                        <div className="form-group col-md-4">
                          <label>{t("Department")}</label>
                          <select
                            name="department"
                            type="text"
                            {...register("department")}
                            className={`form-control ${
                              errors?.employee?.department ? "is-invalid" : ""
                            }`}
                          >
                            {departments.map((department, index) => (
                              <option
                                key={"department" + index}
                                value={department.name}
                              >
                                {department.name}
                              </option>
                            ))}
                          </select>
                          <div className="invalid-feedback">
                            {errors?.department?.message}
                          </div>
                        </div>
                      )}
                      <div className="form-group col-md-4">
                        <label>{t("Hiring date")}</label>
                        <Controller
                          control={control}
                          name="hire_date"
                          className="input"
                          render={({field}) => (
                            <DatePicker
                              placeholderText="Select date"
                              className={`form-control ${
                                errors?.hire_date ? "is-invalid" : ""
                              }`}
                              onChange={(date) => field.onChange(date)}
                              selected={
                                field.value ? new Date(field.value) : null
                              }
                              dateFormat="yyyy-MM-dd"
                            />
                          )}
                        />
                        <div
                          className="invalid-feedback"
                          style={errors?.hire_date ? {display: "block"} : {}}
                        >
                          {errors?.hire_date && errors.hire_date?.message}
                        </div>
                      </div>

                      <div className="form-group col-md-4">
                        <label>{t("Start date")}</label>
                        <Controller
                          control={control}
                          name="start_date"
                          className="input"
                          render={({field}) => (
                            <DatePicker
                              placeholderText="Select date"
                              className={`form-control ${
                                errors?.start_date ? "is-invalid" : ""
                              }`}
                              onChange={(date) => field.onChange(date)}
                              selected={
                                field.value ? new Date(field.value) : null
                              }
                              dateFormat="yyyy-MM-dd"
                            />
                          )}

                        />
                        <div
                          className="invalid-feedback"
                          style={errors?.start_date ? {display: "block"} : {}}
                        >
                          {errors?.start_date && errors.start_date?.message}
                        </div>
                      </div>
                    </div>
                  )
                }

                <div className="form-group mt-5">
                  <button className="btn btn-primary" type="submit">
                    {id ? t("Edit") : t("Add")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
