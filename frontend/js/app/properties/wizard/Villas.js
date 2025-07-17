import React, {useEffect} from "react";
import {useFieldArray} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {Typeahead} from "react-bootstrap-typeahead";
import {Button} from "react-bootstrap"

const Villas = (
  {
    register,
    errors,
    reset,
    getValues,
    control,
    trigger,
    nextStep,
    previousStep,
    setValue,
    landlords,
    towers
  }
) => {
  const {fields, append, remove} = useFieldArray({
    control,
    keyName: "key",
    name: "villas",
  });


  /* translation */
  const {t} = useTranslation();

  /* step input valid */
  const checkValidation = async () => {
    const result = await trigger(["villas"]);
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
        villa: {
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
          has_swimming_pool: false,
          floor_count: null,
          has_backyard: false
        }
      });
  };


  useEffect(() => {
    const villas = getValues("villas")
    if (villas.length === 0) appendField()
  }, []);

  return (
    <>
      <p className="card-description"> {t("Villas")}</p>
      {fields.map((field, index) => (
        <div key={field.key}>
          {/*property details*/}
          <label itemID={`general-info-${index}`}>{t("Property info")}</label>
          <div id={`general-info-${index}`} className="form-row">
            {/* owner */}
            <div className="form-group col-md-4">
              <label>{t("Owner")}</label>
              <Typeahead
                id={`villas.${index}.owner`}
                labelKey="full_name"
                placeholder="owner"
                onChange={(selected) => {
                  selected.length !== 0 ? setValue(`villas.${index}.owner`, selected[0].id) : setValue(`villas.${index}.owner`, null)
                }}
                options={landlords}
              />
            </div>
            {/* tower */}
            <div className="form-group col-md-4">
              <label>{t("Tower")}</label>
              <Typeahead
                id={`villas.${index}.tower`}
                labelKey="name"
                valueKey="id"
                placeholder="tower"
                onChange={(selected) => {
                  selected.length !== 0 ? setValue(`villas.${index}.tower`, selected[0].id) : setValue(`villas.${index}.tower`, null)
                }}
                options={towers}
              />
            </div>
            {/* property name */}
            <div className="form-group col-md-4">
              <label>{t("Property name")}</label>
              <input
                name={`villas.${index}.name`}
                {...register(`villas.${index}.name`)}
                className={`form-control ${errors?.villas && errors?.villas[index]?.name ? "is-invalid" : ""}`}
              />
              <div className="invalid-feedback">
                {errors?.villas && errors?.villas[index]?.name?.message}
              </div>
            </div>
          </div>
          {/* villa details */}
          <div className="form-row">
            {/*property number*/}
            <div className="form-group col-md-6">
              <label>{t("Number")}</label>
              <input
                name={`villas.${index}.villa.number`}
                type="number"
                {...register(`villas.${index}.villa.number`)}
                className={`form-control ${errors?.villas && errors?.villas[index]?.villa?.number ? "is-invalid" : ""}`}
              />
              <div className="invalid-feedback">
                {errors?.villas && errors?.villas[index]?.villa?.number?.message}
              </div>
            </div>
            {/* area size*/}
            <div className="form-group col-md-6">
              <label>{t("Area size m³")}</label>
              <input
                name={`villas.${index}.villa.area`}
                type="number"
                {...register(`villas.${index}.villa.area`)}
                className={`form-control ${errors?.villas && errors?.villas[index]?.villa?.area ? "is-invalid" : ""}`}
              />
              <div className="invalid-feedback">
                {errors?.villas && errors?.villas[index]?.villa?.area?.message}
              </div>
            </div>
          </div>
          {/* sizes and room counts */}
          <div className="form-row">
            {/* room count */}
            <div className="form-group col-md-4">
              <label>{t("Room count")}</label>
              <input
                name={`villas.${index}.villa.room_count`}
                type="number"
                {...register(`villas.${index}.villa.room_count`)}
                className={`form-control ${errors?.villas && errors?.villas[index]?.villa?.room_count ? "is-invalid" : ""}`}
              />
              <div className="invalid-feedback">
                {errors?.villas && errors?.villas[index]?.villa?.room_count?.message}
              </div>
            </div>
            {/* bed room count */}
            <div className="form-group col-md-4">
              <label>{t("Bedroom count")}</label>
              <input
                name={`villas.${index}.villa.bedroom_count`}
                type="number"
                {...register(`villas.${index}.villa.bedroom_count`)}
                className={`form-control ${errors?.villas && errors?.villas[index]?.villa?.bedroom_count ? "is-invalid" : ""}`}
              />
              <div className="invalid-feedback">
                {errors?.villas && errors?.villas[index]?.villa?.bedroom_count?.message}
              </div>
            </div>
            {/* floor count */}
            <div className="form-group col-md-4">
              <label>{t("Floor count")}</label>
              <input
                name={`villas.${index}.villa.floor_count`}
                type="number"
                {...register(`villas.${index}.villa.floor_count`)}
                className={`form-control ${errors?.villas && errors?.villas[index]?.villa?.floor_count ? "is-invalid" : ""}`}
              />
              <div className="invalid-feedback">
                {errors?.villas && errors?.villas[index]?.villa?.floor_count?.message}
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
                    name={`villas.${index}.villa.has_parking`}
                    id="has_parking"
                    {...register(`villas.${index}.villa.has_parking`)}
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
                    name={`villas.${index}.villa.has_internet_connection`}
                    id={`villas.${index}.villa.has_internet_connection`}
                    {...register(`villas.${index}.villa.has_internet_connection`)}
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
                    name={`villas.${index}.villa.has_gas`}
                    id="has_internet_connection"
                    {...register(`villas.${index}.villa.has_gas`)}
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
                    name={`villas.${index}.villa.has_electricity`}
                    id={`villas.${index}.villa.has_electricity`}
                    {...register(`villas.${index}.villa.has_electricity`)}
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
                    name={`villas.${index}.villa.has_airconditioning`}
                    id="has_internet_connection"
                    {...register(`villas.${index}.villa.has_airconditioning`)}
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
                    name={`villas.${index}.villa.pets_allowed`}
                    id={`villas.${index}.villa.pets_allowed`}
                    {...register(`villas.${index}.villa.pets_allowed`)}
                    className="form-check-input"
                  />
                  <i className="input-helper"/>
                  {t("pets allowed")}
                </label>
              </div>
            </div>
            <div className="form-group col-md-2">
              <div className="form-check">
                <label className="form-check-label">
                  <input
                    type="checkbox"
                    name={`villas.${index}.villa.has_swimming_pool`}
                    id={`villas.${index}.villa.has_swimming_pool`}
                    {...register(`villas.${index}.villa.has_swimming_pool`)}
                    className="form-check-input"
                  />
                  <i className="input-helper"/>
                  {t("Pool")}
                </label>
              </div>
            </div>
            <div className="form-group col-md-2">
              <div className="form-check">
                <label className="form-check-label">
                  <input
                    type="checkbox"
                    name={`villas.${index}.villa.has_backyard`}
                    id={`villas.${index}.villa.has_backyard`}
                    {...register(`villas.${index}.villa.has_backyard`)}
                    className="form-check-input"
                  />
                  <i className="input-helper"/>
                  {t("Backyard")}
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
                name={`villas.${index}.address.city`}
                {...register(`villas.${index}.address.city`)}
                className={`form-control ${errors?.villas && errors?.villas[index]?.address?.city ? "is-invalid" : ""}`}
              />
              <div className="invalid-feedback">
                {errors?.villas && errors?.villas[index]?.address?.city?.message}
              </div>
            </div>
            {/* state */}
            <div className="form-group col-md-4">
              <label>{t("State")}</label>
              <input
                name={`villas.${index}.address.state`}
                {...register(`villas.${index}.address.state`)}
                className={`form-control ${errors?.villas && errors?.villas[index]?.address?.state ? "is-invalid" : ""}`}
              />
              <div className="invalid-feedback">
                {errors?.villas && errors?.villas[index]?.address?.state?.message}
              </div>
            </div>
            {/* district */}
            <div className="form-group col-md-4">
              <label>{t("District")}</label>
              <input
                name={`villas.${index}.address.district`}
                {...register(`villas.${index}.address.district`)}
                className={`form-control ${errors?.villas && errors?.villas[index]?.address?.district ? "is-invalid" : ""}`}
              />
              <div className="invalid-feedback">
                {errors?.villas && errors?.villas[index]?.address?.district?.message}
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
            checkValidation().then();
          }}
        >
          {t("Next")}
        </button>

      </div>
    </>
  );
};

export default Villas;
