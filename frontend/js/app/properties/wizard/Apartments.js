import React, {useEffect} from "react";
import {useFieldArray} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {Typeahead} from "react-bootstrap-typeahead";
import {Button} from "react-bootstrap"

const Apartments = (
  {
    register,
    reset,
    errors,
    control,
    trigger,
    nextStep,
    previousStep,
    getValues,
    setValue,
    landlords,
    towers
  }
) => {
  const {fields, append, remove} = useFieldArray({
    control,
    keyName: "key",
    name: "apartments",
  });


  /* translation */
  const {t} = useTranslation();

  /* step input valid */
  const checkValidation = async () => {
    const result = await trigger(["apartments"]);
    if (!result) return;
    nextStep();
  };

  /**
   * append to form array
   */
  const appendField = () => {
    append(
      {
        name: null,
        address: {
          city: null,
          state: null,
          district: null,
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
          pets_allowed: false,
        }
      });
  };


  useEffect(() => {
    const apartments = getValues("apartments")
    if (apartments.length === 0) appendField()
  }, []);

  return (
    <>
      <p className="card-description"> {t("Apartments")}</p>
      {fields.map((field, index) => (
        <div key={field.key}>
          {/*property details*/}
          <label itemID={`general-info-${index}`}>{t("Property info")}</label>
          <div id={`general-info-${index}`} className="form-row">
            {/* owner */}
            <div className="form-group col-md-4">
              <label>{t("Owner")}</label>
              <Typeahead
                id={`apartments.${index}.owner`}
                labelKey="full_name"
                placeholder="owner"
                onChange={(selected) => {
                  selected.length !== 0 ? setValue(`apartments.${index}.owner`, selected[0].id) : setValue(`apartments.${index}.owner`, null)
                }}
                options={landlords}
              />
            </div>
            {/* tower */}
            <div className="form-group col-md-4">
              <label>{t("Tower")}</label>
              <Typeahead
                id={`apartments.${index}.tower`}
                labelKey="name"
                valueKey="id"
                placeholder="tower"
                onChange={(selected) => {
                  selected.length !== 0 ? setValue(`apartments.${index}.tower`, selected[0].id) : setValue(`apartments.${index}.tower`, null)
                }}
                options={towers}
              />
            </div>
            {/* property name */}
            <div className="form-group col-md-4">
              <label>{t("Property name")}</label>
              <input
                name={`apartments.${index}.name`}
                {...register(`apartments.${index}.name`)}
                className={`form-control ${errors?.apartments && errors?.apartments[index]?.name ? "is-invalid" : ""}`}
              />
              <div className="invalid-feedback">
                {errors?.apartments && errors?.apartments[index]?.name?.message}
              </div>
            </div>
          </div>
          {/* apartment details */}
          <div className="form-row">
            {/*property number*/}
            <div className="form-group col-md-6">
              <label>{t("Apartment number")}</label>
              <input
                name={`apartments.${index}.apartment.number`}
                type="number"
                {...register(`apartments.${index}.apartment.number`)}
                className={`form-control ${errors?.apartments && errors?.apartments[index]?.apartment?.number ? "is-invalid" : ""}`}
              />
              <div className="invalid-feedback">
                {errors?.apartments && errors?.apartments[index]?.apartment?.number?.message}
              </div>
            </div>
            {/* area size*/}
            <div className="form-group col-md-6">
              <label>{t("Area size m³")}</label>
              <input
                name={`apartments.${index}.apartment.area`}
                type="number"
                {...register(`apartments.${index}.apartment.area`)}
                className={`form-control ${errors?.apartments && errors?.apartments[index]?.apartment?.area ? "is-invalid" : ""}`}
              />
              <div className="invalid-feedback">
                {errors?.apartments && errors?.apartments[index]?.apartment?.area?.message}
              </div>
            </div>
          </div>
          {/* sizes and room counts */}
          <div className="form-row">
            {/* room count */}
            <div className="form-group col-md-6">
              <label>{t("Room count")}</label>
              <input
                name={`apartments.${index}.apartment.room_count`}
                type="number"
                {...register(`apartments.${index}.apartment.room_count`)}
                className={`form-control ${errors?.apartments && errors?.apartments[index]?.apartment?.room_count ? "is-invalid" : ""}`}
              />
              <div className="invalid-feedback">
                {errors?.apartments && errors?.apartments[index]?.apartment?.room_count?.message}
              </div>
            </div>
            {/* bedroom count */}
            <div className="form-group col-md-6">
              <label>{t("Bedroom count")}</label>
              <input
                name={`apartments.${index}.apartment.bedroom_count`}
                type="number"
                {...register(`apartments.${index}.apartment.bedroom_count`)}
                className={`form-control ${errors?.apartments && errors?.apartments[index]?.apartment?.bedroom_count ? "is-invalid" : ""}`}
              />
              <div className="invalid-feedback">
                {errors?.apartments && errors?.apartments[index]?.apartment?.bedroom_count?.message}
              </div>
            </div>

          </div>
          {/* commodities */}
          <label itemID={`commodities-${index}`}>{t("Amenities")}</label>
          <div className="form-row d-flex justify-content-between" id="commodities">
            <div className="form-group col-md-2">
              <div className="form-check">
                <label className="form-check-label">
                  <input
                    type="checkbox"
                    name={`apartments.${index}.apartment.has_parking`}
                    id="has_parking"
                    {...register(`apartments.${index}.apartment.has_parking`)}
                    className="form-check-input"
                  />
                  <i className="input-helper"/>
                  {t("Parking lot")}
                </label>
              </div>
            </div>
            <div className="form-group col-md-2">
              <div className="form-check">
                <label className="form-check-label">
                  <input
                    type="checkbox"
                    name={`apartments.${index}.apartment.has_internet_connection`}
                    id={`apartments.${index}.apartment.has_internet_connection`}
                    {...register(`apartments.${index}.apartment.has_internet_connection`)}
                    className="form-check-input"
                  />
                  <i className="input-helper"/>
                  {t("Internet connection")}
                </label>
              </div>
            </div>
            <div className="form-group col-md-2">
              <div className="form-check">
                <label className="form-check-label">
                  <input
                    type="checkbox"
                    name={`apartments.${index}.apartment.has_gas`}
                    id="has_internet_connection"
                    {...register(`apartments.${index}.apartment.has_gas`)}
                    className="form-check-input"
                  />
                  <i className="input-helper"/>
                  {t("Gas installation")}
                </label>
              </div>
            </div>
            <div className="form-group col-md-2">
              <div className="form-check">
                <label className="form-check-label">
                  <input
                    type="checkbox"
                    name={`apartments.${index}.apartment.has_electricity`}
                    id={`apartments.${index}.apartment.has_electricity`}
                    {...register(`apartments.${index}.apartment.has_electricity`)}
                    className="form-check-input"
                  />
                  <i className="input-helper"/>
                  {t("Electricity installation")}
                </label>
              </div>
            </div>
            <div className="form-group col-md-2">
              <div className="form-check">
                <label className="form-check-label">
                  <input
                    type="checkbox"
                    name={`apartments.${index}.apartment.has_airconditioning`}
                    id="has_internet_connection"
                    {...register(`apartments.${index}.apartment.has_airconditioning`)}
                    className="form-check-input"
                  />
                  <i className="input-helper"/>
                  {t("Air conditioning")}
                </label>
              </div>
            </div>
            <div className="form-group col-md-2">
              <div className="form-check">
                <label className="form-check-label">
                  <input
                    type="checkbox"
                    name={`apartments.${index}.apartment.pets_allowed`}
                    id={`apartments.${index}.apartment.pets_allowed`}
                    {...register(`apartments.${index}.apartment.pets_allowed`)}
                    className="form-check-input"
                  />
                  <i className="input-helper"/>
                  {t("pets allowed")}
                </label>
              </div>
            </div>
          </div>
          {/* address */}
          <label itemID={`address-${index}`}>{t("Address")}</label>
          <div className="form-row" id={`address-${index}`}>
            {/*city*/}
            <div className="form-group col-md-4">
              <label>{t("City")}</label>
              <input
                name={`apartments.${index}.address.city`}
                {...register(`apartments.${index}.address.city`)}
                className={`form-control ${errors?.apartments && errors?.apartments[index]?.address?.city ? "is-invalid" : ""}`}
              />
              <div className="invalid-feedback">
                {errors?.apartments && errors?.apartments[index]?.address?.city?.message}
              </div>
            </div>
            {/* state */}
            <div className="form-group col-md-4">
              <label>{t("State")}</label>
              <input
                name={`apartments.${index}.address.state`}
                {...register(`apartments.${index}.address.state`)}
                className={`form-control ${errors?.apartments && errors?.apartments[index]?.address?.state ? "is-invalid" : ""}`}
              />
              <div className="invalid-feedback">
                {errors?.apartments && errors?.apartments[index]?.address?.state?.message}
              </div>
            </div>
            {/* district */}
            <div className="form-group col-md-4">
              <label>{t("District")}</label>
              <input
                name={`apartments.${index}.address.district`}
                {...register(`apartments.${index}.address.district`)}
                className={`form-control ${errors?.apartments && errors?.apartments[index]?.address?.district ? "is-invalid" : ""}`}
              />
              <div className="invalid-feedback">
                {errors?.apartments && errors?.apartments[index]?.address?.district?.message}
              </div>
            </div>

          </div>
          <div className="mb-3">
            <Button variant="danger" onClick={() => remove(index)}>
              <i className="mdi mdi-delete-forever"/>
            </Button>
          </div>
        </div>))}
      <Button variant="primary" onClick={appendField}>
        <i className="mdi mdi-pencil"/>
      </Button>
      <div className="mt-5 d-flex justify-content-between">
        <Button className="btn btn-primary " onClick={() => {
          previousStep()
          reset()
        }}>
          {t('Previous')}
        </Button>
        <button
          className="btn btn-primary "
          onClick={(e) => {
            e.preventDefault();
            checkValidation();
          }}
        >
          {t("Next")}
        </button>
      </div>
    </>
  );
};

export default Apartments;
