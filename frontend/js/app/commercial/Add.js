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
import {PROPERTY, TOWER, USERS} from "../../constants/api";
import usePermission from "../hooks/usePermission";

/**
 *  add commercial form
 * @returns {JSX.Element}
 * @constructor
 */
const Add = () => {
  /*New Select */
  const dataArray = [['has_parking','Parking lot'], ['has_internet_connection','Internet connection'],['has_gas','Gas installation'],['has_electricity','Electricity installation'],['has_airconditioning','Air conditioning'],['pets_allowed','pets allowed']];
  const initialState = dataArray.reduce((o, key) => ({ ...o, [key]: false}), {})
  const [checked, setChecked] = useState(initialState);
  const [checkedAll, setCheckedAll] = useState(false);

   /*User or SuperUser */
   const {is_superuser, permissions} = usePermission()

  const history = useHistory();
  const {propertyId} = useParams();
  const [landlords, setLandlords] = useState([]);
  const [towers, setTowers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const {t} = useTranslation()
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Property name is required"),
    address: Yup.object().shape({
      city: Yup.string().required("City is required"),
      state: Yup.string().required("State is required"),
      district: Yup.string().required("District is required")
    }),
    owner: Yup.number().required('owner is required').typeError('owner is required'),
    commercial: Yup.object().shape({
      tower: Yup.number().nullable(),
      commercial_type: Yup.string().required("Choose a commercial type"),
      has_electricity: Yup.bool().default(false),
      number: Yup.number().required("number required").typeError('number is invalid'),
      area: Yup.number().required("surface area is required").typeError('surface area is invalid'),
      room_count: Yup.number().required("number of rooms is required").typeError('number of rooms is invalid'),
      has_parking: Yup.bool().default(false),
      has_internet_connection: Yup.bool().default(false),
      has_gas: Yup.bool().default(false),
      has_airconditioning: Yup.bool().default(false),
      pets_allowed: Yup.bool().default(false)
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
      const towerData = await api.get(`${TOWER}`);
      setTowers(towerData.data)
    } catch (error) {
      toast.error(error.response.detail)
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
        initialState[inputName]=getValues(`commercial.${t[0]}`)}
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
        toast.success("Commercial is updated successfully")
        history.goBack()
      } else {
        await api.post(PROPERTY, data)
        toast.success("Commercial is added successfully")
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
      register(`commercial.${inputName[0]}`)
      
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
        setValue(`commercial.${t[0]}`,value)
      }
      return newState;
    });
  };
/* */

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title">{t("Commercial stores")}</h3>
      </div>
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            {isLoading ? (<div className="loader-demo-box">
              <div className="flip-square-loader mx-auto"/>
            </div>) : (<form onSubmit={handleSubmit(onSubmit)}>
              <div className="card-body">
              <fieldset disabled={!permissions.includes("core.view_commercial")}>
                <h4 className="card-title">
                  {t("Add new commercial store")}
                </h4>
                {/*property details*/}
                <label itemID="general-info">{t("Property info")}</label>
                <div className="form-row" id="general-info">
                  {/* owner */}
                  <div className="form-group col-md-4">
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
                  <div className="form-group col-md-4">
                    <label>{t("Tower")}</label>
                    <Typeahead
                      id="tower"
                      labelKey="name"
                      valueKey="id"
                      placeholder="tower"
                      defaultSelected={_.filter(towers, {id: getValues("commercial.tower")})}
                      onChange={(selected) => {
                        selected.length !== 0 ? setValue("commercial.tower", selected[0].id) : setValue("commercial.tower", null);
                      }}
                      options={towers}
                    />
                  </div>
                  {/* property name */}
                  <div className="form-group col-md-4">
                    <label>{t("Property name")}</label>
                    <input
                      name={`name`}
                      {...register(`name`)}
                      className={`form-control ${
                        errors && errors?.name
                          ? "is-invalid"
                          : ""
                      }`}
                    />
                    <div className="invalid-feedback">
                      {errors && errors?.name?.message}
                    </div>
                  </div>
                </div>
                {/* commercial details */}
                <div className="form-row">
                  {/*property number*/}
                  <div className="form-group col-md-6">
                    <label>{t("Number")}</label>
                    <input
                      name={`commercial.number`}
                      type="number"
                      {...register(`commercial.number`)}
                      className={`form-control ${
                        errors && errors?.commercial?.number
                          ? "is-invalid"
                          : ""
                      }`}
                    />
                    <div className="invalid-feedback">
                      {errors && errors?.commercial?.number?.message}
                    </div>
                  </div>
                  {/* area size*/}
                  <div className="form-group col-md-6">
                    <label>{t("Area size m³")}</label>
                    <input
                      name={`commercial.area`}
                      type="number"
                      {...register(`commercial.area`)}
                      className={`form-control ${
                        errors && errors?.commercial?.area
                          ? "is-invalid"
                          : ""
                      }`}
                    />
                    <div className="invalid-feedback">
                      {errors && errors?.commercial?.area?.message}
                    </div>
                  </div>
                </div>
                {/* sizes and room counts */}
                <div className="form-row">
                  {/* room count */}
                  <div className="form-group col-md-6">
                    <label>{t("Room count")}</label>
                    <input
                      name={`commercial.room_count`}
                      type="number"
                      {...register(`commercial.room_count`)}
                      className={`form-control ${
                        errors && errors?.commercial?.room_count
                          ? "is-invalid"
                          : ""
                      }`}
                    />
                    <div className="invalid-feedback">
                      {errors && errors?.commercial?.room_count?.message}
                    </div>
                  </div>
                  {/* commercial type */}
                  <div className="form-group col-md-6">
                    <label>{t("Commercial type")}</label>
                    <select
                      name={`commercial.commercial_type`}
                      {...register(`commercial.commercial_type`)}
                      className={`form-control ${
                        errors && errors?.commercial?.commercial_type
                          ? "is-invalid"
                          : ""
                      }`}
                    >
                      <option value="ST">{t("Store")}</option>
                      <option value="OF">{t("Office")}</option>
                      <option value="GS">{t("Gas station")}</option>
                      <option value="RS">{t("Restaurant")}</option>
                      <option value="CF">{t("Coffee shop")}</option>
                      <option value="KS">{t("Kiosk")}</option>
                    </select>
                    <div className="invalid-feedback">
                      {errors && errors?.commercial?.commercial_type?.message}
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
                          name={`commercial.${data[0]}`}
                          id={`commercial.${data[0]}`}
                          {...register(`commercial.${data[0]}`)}
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
                      className={`form-control ${
                        errors && errors?.address?.city
                          ? "is-invalid"
                          : ""
                      }`}
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
                      className={`form-control ${
                        errors && errors?.address?.state
                          ? "is-invalid"
                          : ""
                      }`}
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
                      className={`form-control ${
                        errors && errors?.address?.district
                          ? "is-invalid"
                          : ""
                      }`}
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
