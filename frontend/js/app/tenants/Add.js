import { yupResolver } from "@hookform/resolvers/yup";
import _ from "lodash";
import React, { useEffect, useState } from "react";

//  dates utility
import DatePicker from "react-datepicker";

import { Typeahead } from "react-bootstrap-typeahead";
import { useForm, Controller } from "react-hook-form";
import Form from "react-bootstrap/Form";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import StepWizard from "react-step-wizard";

import { GROUPS, TENANTS } from "../../constants/api";
import api from "../../api";
import TenantForm from "./steps/TenantForm";
import ContractForm from "./steps/ContractForm";
export default function Edit() {
  /* translation */
  const { t } = useTranslation();
  /* routing */
  const { id } = useParams();
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

  // @TODO: zied start and hiring date should be linked together (start date >> hiring date)
  const validationSchema = Yup.object().shape({
    tenant: Yup.object().shape({
      tenant_contracts: Yup.array().of(
        Yup.object().shape({
          apartment: Yup.object().required("apartment is required"),
          deposit: Yup.number().required("payment_amount is required"),
          location_price: Yup.number().required("Locatopn price is required"),
          start_date: Yup.date().required("start_date is required"),
          end_date: Yup.date().required("end_date is required"),
          rent_collection: Yup.string().required("rent_collection is required"),
          remarks: Yup.string().nullable(),
        })
      ),
    }),

    user: Yup.object().shape({
      first_name: Yup.string().required("first name is required"),
      last_name: Yup.string().required("last name is required"),
      address: Yup.object().shape({
        city: Yup.string().required("City is required"),
        state: Yup.string().required("State is required"),
        district: Yup.string().required("District is required"),
      }),

      email: Yup.string()
        .required("Email is required")
        .email("Email is invalid"),
      ...passwords,

      groups: Yup.array().default([]),

      is_active: Yup.bool().required().default(false),

      /* Why does the tenant have to be an employee */
      is_staff: Yup.bool().required().default(true),
    }),

    gender: Yup.string().required("Gender is required").default("M"),
  });

  const [groups, setGroups] = useState([]);
  const [isBusy, setIsBusy] = useState(false);

  const history = useHistory();
  // react-form-hooks stuff
  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      tenant: {},
    },
  });

  const loadData = async () => {
    /**
     * Load user groups
     */
    try {
      setIsBusy(true);
      if (id) {
        let { data } = await api.get(`${TENANTS}${id}/`);
        delete data["tenant"]["tenant_contracts"];

        fields.forEach((field) => {
          setValue(field, data[field]);
        });
      }
      const groupRes = await api.get(GROUPS);
      setGroups(groupRes.data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsBusy(false);
    }
  };

  // hook loaders
  useEffect(() => {
    loadData();
  }, []);

  /**
   * Form submit
   * @param {*} data
   */
  const onSubmit = (data) => {
    api
      .post(TENANTS, data)
      .then((res) => {
        toast.success("tenant added!");
        history.push("/tenants/list");
      })
      .catch((e) => toast.error(`Failed to add tenant ${e}`));
  };

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title">{t("Tenant management")}</h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="!#" onClick={(event) => event.preventDefault()}></a>
            </li>
          </ol>
        </nav>
      </div>
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">{t("Tenant add")}</h4>
              <form onSubmit={handleSubmit(onSubmit)}>
                <StepWizard>
                  <TenantForm
                    control={control}
                    register={register}
                    setValue={setValue}
                    errors={errors}
                    getValues={getValues}
                    trigger={trigger}
                  />
                  <ContractForm
                    control={control}
                    register={register}
                    setValue={setValue}
                    errors={errors}
                    getValues={getValues}
                    trigger={trigger}
                  />
                </StepWizard>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
