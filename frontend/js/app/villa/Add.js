
import React, {useEffect, useState} from 'react';
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {useHistory, useParams} from "react-router-dom"
import * as Yup from "yup";
import {Button} from "react-bootstrap"
import {useTranslation} from "react-i18next"
import {toast} from "react-toastify"
import {Typeahead} from "react-bootstrap-typeahead";
import _ from "lodash"

import api from "../../api";
import {PROPERTY, USERS} from "../../constants/api";
import usePermission from "../hooks/usePermission";

/**
 *  f villa form
 * @returns {JSX.Element}
 * @constructor
 */
const Add = () => {
  /*New Select */
  const dataArray = [['has_parking','Parking lot'], ['has_internet_connection','Internet connection'],['has_gas','Gas installation'],['has_electricity','Electricity installation'],['has_airconditioning','Air conditioning'],['pets_allowed','pets allowed'],['has_swimming_pool','Pool'],['has_backyard','Backyard']];
  const initialState = dataArray.reduce((o, key) => ({ ...o, [key]: false}), {})
  const [checked, setChecked] = useState(initialState);
  const [checkedAll, setCheckedAll] = useState(false);

  /*User or SuperUser */
  const {is_superuser, permissions} = usePermission()

  const history = useHistory();
  const {propertyId} = useParams();
  const [landlords, setLandlords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [towers, setTowers] = useState([]);
  

  const {t} = useTranslation()
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Property name is required"),
    address: Yup.object().shape({
      city: Yup.string().required("City is required"),
      state: Yup.string().required("State is required"),
      district: Yup.string().required("District is required")
    }),
    owner: Yup.number().required("you must choose an owner").typeError('you must choose an owner'),
    villa: Yup.object().shape({
      has_electricity: Yup.bool().default(false),
      number: Yup.number().required("Name required").typeError('number is invalid'),
      area: Yup.number().required("Surface area is required").typeError('surface area is invalid'),
      room_count: Yup.number().required("Number of rooms is required").typeError('room count is invalid'),
      bedroom_count: Yup.number().required("Number of bedrooms is required").typeError('bedroom count is invalid'),
      has_parking: Yup.bool().default(false),
      has_internet_connection: Yup.bool().default(false),
      has_gas: Yup.bool().default(false),
      has_airconditioning: Yup.bool().default(false),
      pets_allowed: Yup.bool().default(false),
      has_backyard: Yup.bool().default(false),
      has_swimming_pool: Yup.bool().default(false),
      floor_count: Yup.number().typeError('floor count is invalid'),
    })
  });

  /**
   * form hooks
   */
  const {
    register, handleSubmit, getValues, setValue, formState: {errors}
  } = useForm({
    resolver: yupResolver(validationSchema), reValidateMode: "onChange"
  });


  /**
   * load landlords
   * @returns {Promise<void>}
   */
  const loadTypeaheads = async () => {
    try {
      const {data} = await api.get(`${USERS}`, {
        params: {is_landlord: true},
      });
      setLandlords(data)
    } catch (e) {
      toast.error(e.response.detail)
    }
  }


  /**
   * initialize form
   * @returns {Promise<void>}
   */
  const initForm = async () => {
    try {
      setIsLoading(true)
      await loadTypeaheads()
      if (propertyId) {
        const {data} = await api.get(`${PROPERTY}${propertyId}/`);
        const fields = Object.keys(data)
        fields.forEach((field) => {
          setValue(field, data[field]);
        });
      }
      for (const inputName in initialState) {
        const t=inputName.split(',');
        initialState[inputName]=getValues(`villa.${t[0]}`)}
      toggleCheckAll()
    } catch (error) {
      toast.error(error.response.data.details);
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * on component initialization
   */
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
      if (propertyId) {
        await api.put(`${PROPERTY}${propertyId}/`, data)
        toast.success("Villa is updated successfully")
        history.goBack()
      } else {
        await api.post(PROPERTY, data)
        toast.success("Villa is added successfully")
        history.goBack()
      }
    } catch (e) {
      toast.error(e.response.data.detail)
    }
  }

  /*New Select */
  const toggleCheckAll = () => {
    var p=0;
    for (const inputName in checked) {
      if(checked[inputName]==true){
        p++;
        }
    }
    if(p==Object.keys(checked).length){
      setCheckedAll(true)
    }
    else
    setCheckedAll(false)
  }

  useEffect(() => {
    toggleCheckAll()
  }, [checked]);

  const toggleCheck = (inputName) => {
    setChecked((prevState) => {
      const newState = { ...prevState };
      newState[inputName] = !prevState[inputName];
      register(`villa.${inputName[0]}`)
      
      return newState;

    });
  };
  const selectAll = (value) => {
    setCheckedAll(value);
    setChecked((prevState) => {
      const newState = { ...prevState };
      for (const inputName in newState) {
        newState[inputName] = value;
        const t=inputName.split(',')
        setValue(`villa.${t[0]}`,value)
      }
      return newState;
    });
  };
/* */
  return (
    <div>
      <div className="page-header">
        <h3 className="page-title">{t("Villas")}</h3>
      </div>
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            {isLoading ? (<div className="loader-demo-box">
              <div className="flip-square-loader mx-auto"/>
            </div>) : (<form onSubmit={handleSubmit(onSubmit)}>

              <div className="card-body">
              <fieldset disabled={!permissions.includes("core.view_villa")}>
                <h4 className="card-title">
                  {t("Add new villa")}
                </h4>

                {/*property details*/}
                <label itemID="general-info">{t("Property info")}</label>
                <div id="general-info" className="form-row">
                  {/* owner */}
                  <div className="form-group col-md-6">
                    <label>{t("Owner")}</label>
                    <Typeahead
                      id="owner"
                      labelKey="full_name"
                      placeholder="owner"
                      isInvalid={errors.owner}
                      defaultSelected={_.filter(landlords, {id: getValues("owner")})}
                      onChange={(selected) => {
                        selected.length !== 0 ? setValue("owner", selected[0].id) : setValue("owner", null);
                      }}
                      shouldSelect
                      options={landlords}
                    />
                    <div className="invalid-feedback" style={{display: "block"}}>{errors.owner?.message}</div>
                  </div>
                  {/* tower */}

                  {/* property name */}
                  <div className="form-group col-md-6">
                    <label>{t("Property name")}</label>
                    <input
                      name={`name`}
                      {...register(`name`)}
                      className={`form-control ${errors && errors?.name ? "is-invalid" : ""}`}
                    />
                    <div className="invalid-feedback">
                      {errors && errors?.name?.message}
                    </div>
                  </div>
                </div>
                {/* villa details */}
                <div className="form-row">
                  {/*property number*/}
                  <div className="form-group col-md-6">
                    <label>{t("Number")}</label>
                    <input
                      name={`villa.number`}
                      type="number"
                      {...register(`villa.number`)}
                      className={`form-control ${errors && errors?.villa?.number ? "is-invalid" : ""}`}
                    />
                    <div className="invalid-feedback">
                      {errors && errors?.villa?.number?.message}
                    </div>
                  </div>
                  {/* area size*/}
                  <div className="form-group col-md-6">
                    <label>{t("Area size m³")}</label>
                    <input
                      name={`villa.area`}
                      type="number"
                      {...register(`villa.area`)}
                      className={`form-control ${errors && errors?.villa?.area ? "is-invalid" : ""}`}
                    />
                    <div className="invalid-feedback">
                      {errors && errors?.villa?.area?.message}
                    </div>
                  </div>
                </div>
                {/* sizes and room counts */}
                <div className="form-row">
                  {/* floor count */}
                  <div className="form-group col-md-4">
                    <label>{t("Floor count")}</label>
                    <input
                      name={`villa.floor_count`}
                      type="number"
                      {...register(`villa.floor_count`)}
                      className={`form-control ${errors && errors?.villa?.floor_count ? "is-invalid" : ""}`}
                    />
                    <div className="invalid-feedback">
                      {errors && errors?.villa?.floor_count?.message}
                    </div>
                  </div>
                  {/* room count */}
                  <div className="form-group col-md-4">
                    <label>{t("Room count")}</label>
                    <input
                      name={`villa.room_count`}
                      type="number"
                      {...register(`villa.room_count`)}
                      className={`form-control ${errors && errors?.villa?.room_count ? "is-invalid" : ""}`}
                    />
                    <div className="invalid-feedback">
                      {errors && errors?.villa?.room_count?.message}
                    </div>
                  </div>
                  {/* bed room count */}
                  <div className="form-group col-md-4">
                    <label>{t("Bedroom count")}</label>
                    <input
                      name={`villa.bedroom_count`}
                      type="number"
                      {...register(`villa.bedroom_count`)}
                      className={`form-control ${errors && errors?.villa?.bedroom_count ? "is-invalid" : ""}`}
                    />
                    <div className="invalid-feedback">
                      {errors && errors?.villa?.bedroom_count?.message}
                    </div>
                  </div>

                </div>
                {/* commodities */}
                <label itemID="commodities">{t("Amenities")}</label>
                <div className="form-row" id="commodities">
                  <div className="form-group col-md-2">
                    <div className="form-check">

                    <label className="form-check-label">
                    <input
                    type="checkbox"
                    id="all"
                    onChange={(event) => selectAll(event.target.checked)}
                    checked={checkedAll}
                  />
                        <i className="input-helper"/>
                        {t("All")}
                      </label>
                    </div>
                  </div>
                </div>
                <div className="form-row" id="commodities">
                  {dataArray.map(data => (
                  <div className="form-group col-md-2">
                    <div className="form-check">
                      <label className="form-check-label">
                        <input
                          type="checkbox"
                          name={`villa.${data[0]}`}
                          id={data[0]}
                          {...register(`villa.${data[0]}`)}
                          className="form-check-input"
                          onChange={() => toggleCheck(data)}
                          checked={checked[data]}
                        />
                        <i className="input-helper"/>
                        {t(data[1])}
                      </label>
                    </div>
                  </div>))}
                </div>
                {/* address */}
                <label itemID="address">{t("Address")}</label>
                <div className="form-row" id="address">
                  {/*city*/}
                  <div className="form-group col-md-4">
                    <label>{t("City")}</label>
                    <input
                      name={`address.city`}
                      {...register(`address.city`)}
                      className={`form-control ${errors && errors?.address?.city ? "is-invalid" : ""}`}
                    />
                    <div className="invalid-feedback">
                      {errors && errors?.address?.city?.message}
                    </div>
                  </div>
                  {/* state */}
                  <div className="form-group col-md-4">
                    <label>{t("State")}</label>
                    <input
                      name={`address.state`}
                      {...register(`address.state`)}
                      className={`form-control ${errors && errors?.address?.state ? "is-invalid" : ""}`}
                    />
                    <div className="invalid-feedback">
                      {errors && errors?.address?.state?.message}
                    </div>
                  </div>
                  {/* district */}
                  <div className="form-group col-md-4">
                    <label>{t("District")}</label>
                    <input
                      name={`address.district`}
                      {...register(`address.district`)}
                      className={`form-control ${errors && errors?.address?.district ? "is-invalid" : ""}`}
                    />
                    <div className="invalid-feedback">
                      {errors && errors?.address?.district?.message}
                    </div>
                  </div>
                </div>
                </fieldset>
                <Button variant="secondary" onClick={history.goBack}>
                  {t("Return")}
                </Button>
                {is_superuser &&<Button type="submit" variant="primary">
                  {t("Submit")}
                </Button>}
              </div>
            </form>)}
          </div>
        </div>
      </div>
    </div>
  )
};

export default Add;
