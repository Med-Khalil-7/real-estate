import React, {useEffect} from 'react';
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {useHistory, useParams} from "react-router-dom"
import * as Yup from "yup";
import {useTranslation} from "react-i18next"
import {Button} from "react-bootstrap"
import {toast} from "react-toastify"
import api from "../../api";
import {TAX_RATE} from "../../constants/api";

const Add = () => {
  const history = useHistory();
  const {taxId} = useParams();
  const {t} = useTranslation()
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Tax name is required"),
    rate: Yup.number().required("Tax rate is required")
  })
  /**
   * form hooks
   */
  const {
    register, handleSubmit, setValue, formState: {errors}
  } = useForm({
    resolver: yupResolver(validationSchema), reValidateMode: "onChange"
  });

  /**
   * initialize form
   * @returns {Promise<void>}
   */
  const initForm = async () => {
    try {
      if (taxId) {
        const {data} = await api.get(`${TAX_RATE}${taxId}/`);
        const fields = Object.keys(data)
        fields.forEach((field) => {
          setValue(field, data[field]);
        });
      }
    } catch (error) {
      toast.error(error.response.data.details);
    } finally {
    }
  }

  useEffect(() => {
    initForm().then()
  }, []);

  /**
   * submit data
   * @param data
   * @returns {Promise<void>}
   */
  const onSubmit = async data => {
    try {
      if (taxId) {
        await api.put(`${TAX_RATE}${taxId}/`, data)
        toast.success("Tax rate is updated successfully")
        history.goBack()
      } else {
        await api.post(`${TAX_RATE}`, data)
        toast.success("Tax rat is added successfully")
        history.goBack()
      }
    } catch (e) {
      toast.error(e.response.data.detail)
    }
  }

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title">{t("Tax rates")}</h3>
      </div>
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="card-body">
                <h4 className="card-title">
                  {t("Add new tax rate")}
                </h4>
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label>{t("Tax name")}</label>
                    <input
                      name={`name`}
                      {...register(`name`)}
                      className={`form-control ${errors && errors?.name ? "is-invalid" : ""}`}
                    />
                    <div className="invalid-feedback">
                      {errors && errors?.name?.message}
                    </div>
                  </div>
                  <div className="form-group col-md-6">
                    <label>{t("Tax rate")}</label>
                    <input
                      name={`rate`}
                      {...register(`rate`)}
                      className={`form-control ${errors && errors?.name ? "is-invalid" : ""}`}
                    />
                    <div className="invalid-feedback">
                      {errors && errors?.rate?.message}
                    </div>

                  </div>
                </div>
                <Button variant="secondary" onClick={history.goBack}>
                  {t("Return")}
                </Button>
                <Button type="submit" variant="primary">
                  {t("Submit")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
};
export default Add;
