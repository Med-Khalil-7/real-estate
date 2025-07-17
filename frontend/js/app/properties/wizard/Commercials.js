import React, {useEffect} from "react";
import {useFieldArray} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {Typeahead} from "react-bootstrap-typeahead";
import {Button} from "react-bootstrap"

const Commercials = (
  {
    register,
    errors,
    reset,
    getValues,
    control,
    trigger,
    previousStep,
    nextStep,
    setValue,
    landlords,
    towers
  }
) => {
  const {fields, append, remove} = useFieldArray({
    control,
    keyName: "key",
    name: "commercials",
  });


  /* translation */
  const {t} = useTranslation();

  /* step input valid */
  const checkValidation = async () => {
    const result = await trigger(["commercials"]);
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
        commercial: {
          tower: null,
          has_electricity: false,
          commercial_type: null,
          number: null,
          area: null,
          room_count: null,
          has_parking: false,
          has_internet_connection: false,
          has_gas: false,
          has_airconditioning: false,
          pets_allowed: false,
        }

      });
  };

  useEffect(() => {
    const commercials = getValues("commercials")
    if (commercials.length === 0) {
      appendField()
    }
  }, []);

  return (
    <>
      <p className="card-description"> {t("Commercial stores")}</p>
      {fields.map((field, index) => (
        <div key={field.key}>
          {/*property details*/}
          <label itemID={`general-info-${index}`}>{t("Property info")}</label>
          <div id={`general-info-${index}`} className="form-row">
            {/* owner */}
            <div className="form-group col-md-4">
              <label>{t("Owner")}</label>
              <Typeahead
                id={`commercials.${index}.owner`}
                labelKey="full_name"
                placeholder="owner"
                onChange={(selected) => {
                  selected.length !== 0 ? setValue(`commercials.${index}.owner`, selected[0].id) : setValue(`commercials.${index}.owner`, null)
                }}
                options={landlords}
              />
            </div>
            {/* tower */}
            <div className="form-group col-md-4">
              <label>{t("Tower")}</label>
              <Typeahead
                id={`commercials.${index}.tower`}
                labelKey="name"
                valueKey="id"
                placeholder="tower"
                onChange={(selected) => {
                  selected.length !== 0 ? setValue(`commercials.${index}.tower`, selected[0].id) : setValue(`commercials.${index}.tower`, null)
                }}
                options={towers}
              />
            </div>
            {/* property name */}
            <div className="form-group col-md-4">
              <label>{t("Property name")}</label>
              <input
                name={`commercials.${index}.name`}
                {...register(`commercials.${index}.name`)}
                className={`form-control ${errors?.commercials && errors?.commercials[index]?.name ? "is-invalid" : ""}`}
              />
              <div className="invalid-feedback">
                {errors?.commercials && errors?.commercials[index]?.name?.message}
              </div>
            </div>
          </div>
          {/* commercial details */}
          <div className="form-row">
            {/*property number*/}
            <div className="form-group col-md-6">
              <label>{t("Number")}</label>
              <input
                name={`commercials.${index}.commercial.number`}
                type="number"
                {...register(`commercials.${index}.commercial.number`)}
                className={`form-control ${errors?.commercials && errors?.commercials[index]?.commercial?.number ? "is-invalid" : ""}`}
              />
              <div className="invalid-feedback">
                {errors?.commercials && errors?.commercials[index]?.commercial?.number?.message}
              </div>
            </div>
            {/* area size*/}
            <div className="form-group col-md-6">
              <label>{t("Area size m³")}</label>
              <input
                name={`commercials.${index}.commercial.area`}
                type="number"
                {...register(`commercials.${index}.commercial.area`)}
                className={`form-control ${errors?.commercials && errors?.commercials[index]?.commercial?.area ? "is-invalid" : ""}`}
              />
              <div className="invalid-feedback">
                {errors?.commercials && errors?.commercials[index]?.commercial?.area?.message}
              </div>
            </div>
          </div>
          {/* sizes and room counts */}
          <div className="form-row">
            {/* room count */}
            <div className="form-group col-md-6">
              <label>{t("Room count")}</label>
              <input
                name={`commercials.${index}.commercial.room_count`}
                type="number"
                {...register(`commercials.${index}.commercial.room_count`)}
                className={`form-control ${errors?.commercials && errors?.commercials[index]?.commercial?.room_count ? "is-invalid" : ""}`}
              />
              <div className="invalid-feedback">
                {errors?.commercials && errors?.commercials[index]?.commercial?.room_count?.message}
              </div>
            </div>
            {/* commercial type */}
            <div className="form-group col-md-6">
              <label>{t("Commercial type")}</label>
              <select
                name={`commercials.${index}.commercial.commercial_type`}
                {...register(`commercials.${index}.commercial.commercial_type`)}
                className={`form-control ${
                  errors?.commercials && errors?.commercials[index]?.commercial?.commercial_type
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
                {errors?.commercials && errors?.commercials[index]?.commercial?.commercial_type?.message}
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
                    name={`commercials.${index}.commercial.has_parking`}
                    id="has_parking"
                    {...register(`commercials.${index}.commercial.has_parking`)}
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
                    name={`commercials.${index}.commercial.has_internet_connection`}
                    id={`commercials.${index}.commercial.has_internet_connection`}
                    {...register(`commercials.${index}.commercial.has_internet_connection`)}
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
                    name={`commercials.${index}.commercial.has_gas`}
                    id="has_internet_connection"
                    {...register(`commercials.${index}.commercial.has_gas`)}
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
                    name={`commercials.${index}.commercial.has_electricity`}
                    id={`commercials.${index}.commercial.has_electricity`}
                    {...register(`commercials.${index}.commercial.has_electricity`)}
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
                    name={`commercials.${index}.commercial.has_airconditioning`}
                    id="has_internet_connection"
                    {...register(`commercials.${index}.commercial.has_airconditioning`)}
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
                    name={`commercials.${index}.commercial.pets_allowed`}
                    id={`commercials.${index}.commercial.pets_allowed`}
                    {...register(`commercials.${index}.commercial.pets_allowed`)}
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
                name={`commercials.${index}.address.city`}
                {...register(`commercials.${index}.address.city`)}
                className={`form-control ${errors?.commercials && errors?.commercials[index]?.address?.city ? "is-invalid" : ""}`}
              />
              <div className="invalid-feedback">
                {errors?.commercials && errors?.commercials[index]?.address?.city?.message}
              </div>
            </div>
            {/* state */}
            <div className="form-group col-md-4">
              <label>{t("State")}</label>
              <input
                name={`commercials.${index}.address.state`}
                {...register(`commercials.${index}.address.state`)}
                className={`form-control ${errors?.commercials && errors?.commercials[index]?.address?.state ? "is-invalid" : ""}`}
              />
              <div className="invalid-feedback">
                {errors?.commercials && errors?.commercials[index]?.address?.state?.message}
              </div>
            </div>
            {/* district */}
            <div className="form-group col-md-4">
              <label>{t("District")}</label>
              <input
                name={`commercials.${index}.address.district`}
                {...register(`commercials.${index}.address.district`)}
                className={`form-control ${errors?.commercials && errors?.commercials[index]?.address?.district ? "is-invalid" : ""}`}
              />
              <div className="invalid-feedback">
                {errors?.commercials && errors?.commercials[index]?.address?.district?.message}
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

export default Commercials;
