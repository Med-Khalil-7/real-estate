import React, {useEffect, useState} from 'react';
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {Button, Card, Modal} from "react-bootstrap"
import {useTranslation} from "react-i18next"
import {toast} from "react-toastify"
import {Typeahead} from "react-bootstrap-typeahead";
import _ from "lodash"

import api from "../../../api";
import {PROPERTY, USERS} from "../../../constants/api";

import usePermission from "../../hooks/usePermission";
/**
 * apartment form component
 * @param towerId
 * @param propertyId
 * @param showAddModal
 * @param setShowAddModal
 * @param loadTowerApartments
 * @param setPropertyId
 * @returns {JSX.Element}
 * @constructor
 */
const ApartmentAdd = ({towerId, propertyId, showAddModal, setShowAddModal, loadTowerApartments, setPropertyId}) => {
  /*New Select */
  const dataArray = [['has_parking','Parking lot'], ['has_internet_connection','Internet connection'],['has_gas','Gas installation'],['has_electricity','Electricity installation'],['has_airconditioning','Air conditioning'],['pets_allowed','pets allowed']];
  const initialState = dataArray.reduce((o, key) => ({ ...o, [key]: false}), {})
  const [checked, setChecked] = useState(initialState);
  const [checkedAll, setCheckedAll] = useState(false);
  
  /*User or SuperUser */
  const {is_superuser, permissions} = usePermission()
  const [landlords, setLandlords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const {t} = useTranslation()
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Property name is required"),
    address: Yup.object().shape({
      city: Yup.string().required("City is required"),
      state: Yup.string().required("State is required"),
      district: Yup.string().required("District is required")
    }),
    owner: Yup.number().required("owner is required").typeError('owner is required'),
    apartment: Yup.object().shape({
      tower: Yup.number().nullable(),
      has_electricity: Yup.bool().default(false),
      number: Yup.number().required("property number is required").typeError('must be a number'),
      area: Yup.number().required("surface area is required").typeError('surface area  must be a number'),
      room_count: Yup.number()
        .min(Yup.ref("bedroom_count"), "room count cannot be less than room count.")
        .required("Number of rooms is required")
        .typeError('room count area  must be a number')
      ,
      bedroom_count: Yup.number().required("Number of bedrooms is required").typeError('bedroom count must be a number'),
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
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: {errors}
  } = useForm({
    defaultValues: {apartment: {tower: towerId}},
    resolver: yupResolver(validationSchema),
    reValidateMode: "onChange"
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
        for (const inputName in initialState) {
          const t=inputName.split(',');
          console.log(getValues(`apartment.${t[0]}`))
          initialState[inputName]=getValues(`apartment.${t[0]}`)}
          setChecked(initialState)
      }
      toggleCheckAll()
    } catch (error) {
      if (error.response.data.detail) {
        toast.error(error.response.data.detail);
      } else {
        toast.error("Failed to retrieve apartment information")
      }
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
   * handle proprtyId prop change
   */
  useEffect(() => {
    if (propertyId) {
      
      initForm().then()
    }
    else{
      reset()
      for (const inputName in initialState) {
        initialState[inputName]=false
        setChecked(initialState)}
    }
  }, [propertyId]);


  /**
   * submit data
   * @param data
   * @returns {Promise<void>}
   */
  const onSubmit = async data => {
    try {
      if (propertyId) {
        await api.put(`${PROPERTY}${propertyId}/`, data) // update tower id
        toast.success("Apartment is updated successfully")
      } else {
        await api.post(PROPERTY, data) // add tower id
        toast.success("Apartment is added successfully")
      }
      setShowAddModal(false) // reload
      reset()
      setPropertyId(null)
      loadTowerApartments()
    } catch (error) {
      if (error.response.data.detail) {
        toast.error(error.response.data.detail);
      } else {
        toast.error("Failed to submit data!")
      }
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
    register(`apartment.${inputName[0]}`)
    
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
      setValue(`apartment.${t[0]}`,value)
    }
    return newState;
  });
};
/* */

  return (
    <Modal
      size="xl"
      centered={true}
      show={showAddModal}
      onClose={() => {
        reset()
        setPropertyId(null)
        setShowAddModal(false)
      }}
      onHide={() => {
        reset()
        setPropertyId(null)
        setShowAddModal(false)
      }}>
      <Card>
        {isLoading ? (<div className="loader-demo-box">
          <div className="flip-square-loader mx-auto"/>
        </div>) : (<form onSubmit={handleSubmit(onSubmit)}>
        <fieldset disabled={!permissions.includes("core.view_apartment")}>
          <Modal.Header closeButton={false}>
            <Modal.Title>
              {t("Add new apartment")}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="pb-0 px-4">
            {/*property details*/}
            <label itemID="general-info">{t("Property info")}</label>
            <div className="form-row" id="general-info">
              {/* owner */}
              <div className="form-group col-md-6">
                <label>{t("Owner")}</label>
                <Typeahead
                  id="owner"
                  labelKey="full_name"
                  placeholder="owner"
                  isInvalid={errors.owner}
                  defaultSelected={_.filter(landlords, {id: propertyId && getValues("owner")})}
                  onChange={(selected) => {
                    selected.length !== 0 ? setValue("owner", selected[0].id) : setValue("owner", null);
                  }}
                  shouldSelect
                  options={landlords}
                />
                <div className="invalid-feedback" style={{display: "block"}}>{errors.owner?.message}</div>
              </div>
              {/* property name */}
              <div className="form-group col-md-6">
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
            {/* apartment details */}
            <div className="form-row">
              {/*property number*/}
              <div className="form-group col-md-6">
                <label>{t("Apartment number")}</label>
                <input
                  name={`apartment.number`}
                  type="number"
                  {...register(`apartment.number`)}
                  className={`form-control ${
                    errors && errors?.apartment?.number
                      ? "is-invalid"
                      : ""
                  }`}
                />
                <div className="invalid-feedback">
                  {errors && errors?.apartment?.number?.message}
                </div>
              </div>
              {/* area size*/}
              <div className="form-group col-md-6">
                <label>{t("Area size m³")}</label>
                <input
                  name={`apartment.area`}
                  type="number"
                  {...register(`apartment.area`)}
                  className={`form-control ${
                    errors && errors?.apartment?.area
                      ? "is-invalid"
                      : ""
                  }`}
                />
                <div className="invalid-feedback">
                  {errors && errors?.apartment?.area?.message}
                </div>
              </div>
            </div>
            {/* sizes and room counts */}
            <div className="form-row">
              {/* room count */}
              <div className="form-group col-md-6">
                <label>{t("Room count")}</label>
                <input
                  name={`apartment.room_count`}
                  type="number"
                  {...register(`apartment.room_count`)}
                  className={`form-control ${
                    errors && errors?.apartment?.room_count
                      ? "is-invalid"
                      : ""
                  }`}
                />
                <div className="invalid-feedback">
                  {errors && errors?.apartment?.room_count?.message}
                </div>
              </div>
              {/* bed room count */}
              <div className="form-group col-md-6">
                <label>{t("Bedroom count")}</label>
                <input
                  name={`apartment.bedroom_count`}
                  type="number"
                  {...register(`apartment.bedroom_count`)}
                  className={`form-control ${
                    errors && errors?.apartment?.bedroom_count
                      ? "is-invalid"
                      : ""
                  }`}
                />
                <div className="invalid-feedback">
                  {errors && errors?.apartment?.bedroom_count?.message}
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
                          name={`apartment.${data[0]}`}
                          id={`apartment.${data[0]}`}
                          {...register(`apartment.${data[0]}`)}
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
          </Modal.Body>
          </fieldset>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => {
              setShowAddModal(false)
            }}>
              {t("Cancel")}
            </Button>
            {is_superuser &&<Button type="submit" variant="primary">
              {t("Submit")}
            </Button>}
          </Modal.Footer>
        </form>)}

      </Card>
    </Modal>
  )
};

export default ApartmentAdd;
