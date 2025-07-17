import React, {useEffect, useState} from 'react';
import { useFieldArray } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Typeahead } from "react-bootstrap-typeahead";
import { Button } from "react-bootstrap";

const Apartments = ({
  register,
  errors,
  control,
  trigger,
  nextStep,
  getValues,
  setValue,
  landlords,
  towers
}) => {
  /*New Select */
  const dataArray = [
    ["has_parking", "Parking lot"],
    ["has_internet_connection", "Internet connection"],
    ["has_gas", "Gas installation"],
    ["has_electricity", "Electricity installation"],
    ["has_airconditioning", "Air conditioning"],
    ["pets_allowed", "pets allowed"]
  ];
  const initialState = dataArray.reduce(
    (o, key) => ({ ...o, [key]: false }),
    {}
  );
  const [checked, setChecked] = useState(initialState);
  const [checkedAll, setCheckedAll] = useState(false);

  const { fields, append, remove } = useFieldArray({
    control,
    keyName: "key",
    name: "properties"
  });

  /* translation */
  const { t } = useTranslation();

  /* step input valid */
  const checkValidation = async () => {
    const result = await trigger(["properties"]);
    if (!result) return;
    nextStep();
  };

  /**
   * append to form array
   */
  const appendField = () => {
    append({
      name: null,
      address: {
        city: null,
        state: null,
        district: null
      },
      owner: "",
      apartment: {
        tower: null,
        has_electricity: false,
        number: null,
        area: null,
        room_count: null,
        bedroom_count: null,
        has_parking: false,
        has_internet_connection: false,
        has_gas: false,
        has_airconditioning: false,
        pets_allowed: false
      }
    });
  };

  useEffect(() => {
    appendField();
  }, []);

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

  const toggleCheck = (inputName,index) => {
    setChecked((prevState) => {
      const newState = { ...prevState };
      newState[inputName] = !prevState[inputName];
      register(`properties.${index}.apartment.${inputName[0]}`)
      
      return newState;

    });
  };
  const selectAll = (value,index) => {
    setCheckedAll(value);
    setChecked((prevState) => {
      const newState = { ...prevState };
      for (const inputName in newState) {
        newState[inputName] = value;
        const t=inputName.split(',')
        setValue(`properties.${index}.apartment.${t[0]}`,value)
      }
      return newState;
    });
  };
/* */

  return (
    <>
      <p className="card-description"> {t("Enter Apartment information")}</p>
      {fields.map((field, index) => (
        <div key={field.key}>
          {/*property details*/}
          <label itemID={`general-info-${index}`}>{t("Property info")}</label>
          <div id={`general-info-${index}`} className="form-row">
            {/* owner */}
            <div className="form-group col-md-4">
              <label>{t("Owner")}</label>
              <Typeahead
                id={`properties.${index}.owner`}
                labelKey="full_name"
                placeholder="owner"
                isInvalid={
                  errors?.properties && errors?.properties[index]?.owner
                }
                onChange={selected => {
                  selected.length !== 0
                    ? setValue(`properties.${index}.owner`, selected[0].id)
                    : setValue(`properties.${index}.owner`, null);
                }}
                options={landlords}
              />
              <div className="invalid-feedback" style={{ display: "block" }}>
                {errors?.properties &&
                  errors?.properties[index]?.owner?.message}
              </div>
            </div>
            {/* tower */}
            <div className="form-group col-md-4">
              <label>{t("Tower")}</label>
              <Typeahead
                id={`properties.${index}.tower`}
                labelKey="name"
                valueKey="id"
                placeholder="tower"
                onChange={selected => {
                  selected.length !== 0
                    ? setValue(`properties.${index}.tower`, selected[0].id)
                    : setValue(`properties.${index}.tower`, null);
                }}
                options={towers}
              />
            </div>
            {/* property name */}
            <div className="form-group col-md-4">
              <label>{t("Property name")}</label>
              <input
                name={`properties.${index}.name`}
                {...register(`properties.${index}.name`)}
                className={`form-control ${
                  errors?.properties && errors?.properties[index]?.name
                    ? "is-invalid"
                    : ""
                }`}
              />
              <div className="invalid-feedback">
                {errors?.properties && errors?.properties[index]?.name?.message}
              </div>
            </div>
          </div>
          {/* apartment details */}
          <div className="form-row">
            {/*property number*/}
            <div className="form-group col-md-6">
              <label>{t("Apartment number")}</label>
              <input
                name={`properties.${index}.apartment.number`}
                type="number"
                {...register(`properties.${index}.apartment.number`)}
                className={`form-control ${
                  errors?.properties &&
                  errors?.properties[index]?.apartment?.number
                    ? "is-invalid"
                    : ""
                }`}
              />
              <div className="invalid-feedback">
                {errors?.properties &&
                  errors?.properties[index]?.apartment?.number?.message}
              </div>
            </div>
            {/* area size*/}
            <div className="form-group col-md-6">
              <label>{t("Area size m³")}</label>
              <input
                name={`properties.${index}.apartment.area`}
                type="number"
                {...register(`properties.${index}.apartment.area`)}
                className={`form-control ${
                  errors?.properties &&
                  errors?.properties[index]?.apartment?.area
                    ? "is-invalid"
                    : ""
                }`}
              />
              <div className="invalid-feedback">
                {errors?.properties &&
                  errors?.properties[index]?.apartment?.area?.message}
              </div>
            </div>
          </div>
          {/* sizes and room counts */}
          <div className="form-row">
            {/* room count */}
            <div className="form-group col-md-6">
              <label>{t("Room count")}</label>
              <input
                name={`properties.${index}.apartment.room_count`}
                type="number"
                {...register(`properties.${index}.apartment.room_count`)}
                className={`form-control ${
                  errors?.properties &&
                  errors?.properties[index]?.apartment?.room_count
                    ? "is-invalid"
                    : ""
                }`}
              />
              <div className="invalid-feedback">
                {errors?.properties &&
                  errors?.properties[index]?.apartment?.room_count?.message}
              </div>
            </div>
            {/* bed room count */}
            <div className="form-group col-md-6">
              <label>{t("Bedroom count")}</label>
              <input
                name={`properties.${index}.apartment.bedroom_count`}
                type="number"
                {...register(`properties.${index}.apartment.bedroom_count`)}
                className={`form-control ${
                  errors?.properties &&
                  errors?.properties[index]?.apartment?.bedroom_count
                    ? "is-invalid"
                    : ""
                }`}
              />
              <div className="invalid-feedback">
                {errors?.properties &&
                  errors?.properties[index]?.apartment?.bedroom_count?.message}
              </div>
            </div>
          </div>
          {/* commodities */}
          <label itemID={`commodities-${index}`}>{t("Amenities")}</label>
          <div className="form-row" id="commodities">
                  <div className="form-group col-md-2">
                    <div className="form-check">

                    <label className="form-check-label">
                    <input
                    type="checkbox"
                    key={`properties.${index}.all`}
                    id={`properties.${index}.all`}
                    onChange={(event) => selectAll(event.target.checked,index)}
                  />
                        <i className="input-helper"/>
                        {t("All")}
                      </label>
                    </div>
                  </div>
                  </div>
          <div className="form-row justify-content-between" id="commodities">
          {dataArray.map(data => (
                  <div className="form-group col-md-2">
                    <div className="form-check">
                      <label className="form-check-label">
                        <input
                          type="checkbox"
                          name={`properties.${index}.apartment.${data[0]}`}
                          id={`properties.${index}.apartment.${data[0]}`}
                          {...register(`properties.${index}.apartment.${data[0]}`)}
                          className="form-check-input"
                          onChange={() => toggleCheck(data,index)}
                        />
                        <i className="input-helper"/>
                        {t(data[1])}
                      </label>
                    </div>
                  </div>))}
          </div>
          {/* address */}
          <label itemID={`address-${index}`}>{t("Address")}</label>
          <div className="form-row" id={`address-${index}`}>
            {/*city*/}
            <div className="form-group col-md-4">
              <label>{t("City")}</label>
              <input
                name={`properties.${index}.address.city`}
                {...register(`properties.${index}.address.city`)}
                className={`form-control ${
                  errors?.properties && errors?.properties[index]?.address?.city
                    ? "is-invalid"
                    : ""
                }`}
              />
              <div className="invalid-feedback">
                {errors?.properties &&
                  errors?.properties[index]?.address?.city?.message}
              </div>
            </div>
            {/* state */}
            <div className="form-group col-md-4">
              <label>{t("State")}</label>
              <input
                name={`properties.${index}.address.state`}
                {...register(`properties.${index}.address.state`)}
                className={`form-control ${
                  errors?.properties &&
                  errors?.properties[index]?.address?.state
                    ? "is-invalid"
                    : ""
                }`}
              />
              <div className="invalid-feedback">
                {errors?.properties &&
                  errors?.properties[index]?.address?.state?.message}
              </div>
            </div>
            {/* district */}
            <div className="form-group col-md-4">
              <label>{t("District")}</label>
              <input
                name={`properties.${index}.address.district`}
                {...register(`properties.${index}.address.district`)}
                className={`form-control ${
                  errors?.properties &&
                  errors?.properties[index]?.address?.district
                    ? "is-invalid"
                    : ""
                }`}
              />
              <div className="invalid-feedback">
                {errors?.properties &&
                  errors?.properties[index]?.address?.district?.message}
              </div>
            </div>
          </div>
          <div className="mb-3">
            <Button variant="danger" onClick={() => remove(index)}>
              <i className="mdi mdi-delete-forever" />
            </Button>
          </div>
        </div>
      ))}
      <Button variant="primary" onClick={appendField}>
        <i className="mdi mdi-pencil" />
      </Button>
      <div className="mt-5 d-flex justify-content-between">
        {fields.length !== 0 && (
          <button
            className="btn btn-primary "
            onClick={e => {
              e.preventDefault();
              checkValidation();
            }}
          >
            {t("Next")}
          </button>
        )}
      </div>
    </>
  );
};

export default Apartments;
