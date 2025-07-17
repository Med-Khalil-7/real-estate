import {yupResolver} from "@hookform/resolvers/yup";
import React, {useEffect, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {useHistory, useParams} from "react-router-dom";
import {toast} from "react-toastify";
import * as Yup from "yup";
import {useTranslation} from "react-i18next";
import api from "../../../api";
import Form from "react-bootstrap/Form";
import DatePicker from "react-datepicker";
import {Typeahead} from "react-bootstrap-typeahead";
import {Button} from "react-bootstrap";
import {CONTRACT_PDF_TEMPLATE, PROPERTY, PROPERTY_CONTRACTS, TAX_RATE, USERS,} from "../../../constants/api";
import InvoiceList from "./accounting/InvoiceList";
import ClaimList from "./accounting/ClaimList";
import BillList from "./accounting/BillList";
import Profit from "./accounting/Profit";
import usePermission from "../../hooks/usePermission";
import _ from "lodash"

export default function Add() {
  /* translation */
  const {t} = useTranslation();
  /* Routing */
  let history = useHistory();
  const {id} = useParams();

  const validationSchema = Yup.object().shape({
    tenant: Yup.object().required("Tenant is required"),
    property: Yup.object().required("apartment is required"),
    deposit: Yup.number().min(0).required("payment_amount is required").typeError('deposit must be a number'),
    tax_rate: Yup.number().required("you must choose a tax rate").typeError('you must choose a tax rate'),
    location_price: Yup.number().min(1).required("Location price is required").typeError('location price must be a number'),
    start_date: Yup.date().required("start_date is required"),
    end_date: Yup.date()
      .required("end_date is required")
      .min(Yup.ref("start_date"), "end date must be greater than start date"),
    remarks: Yup.string().nullable(),
  });

  /*Document */
  const [document,setDocument] = useState("#");

  // react-form-hooks stuff
  const {
    register,
    handleSubmit,
    setValue,
    control,
    getValues,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  /**
   * load contract for edit forms
   */
  const loadApartmentContract = async () => {
    /*
    HACK: mzekri This is not optimal I had to do some fuckery to get the typahead working,
    if there is a better method please tell me
    */
    try {
      const {data} = await api.get(`${PROPERTY_CONTRACTS}${id}/`);
      /* TODO: @mzekri set AsyncTypeahead on load */
      const fields = [
        "deposit",
        "tenant",
        "landlord",
        "location_price",
        "property",
        "start_date",
        "end_date",
        "remarks",
        "state",
        "tax_rate",
      ];
      fields.forEach((field) => {
        setValue(field, data[field]);
      });
      setDocument(data["document"]);
    } catch (error) {
      toast.error(errors.message);
    }
  };

  /**
   * Side effects
   */
  useEffect(() => {
    loadTypeaheads();
    if (id) {
      loadApartmentContract().then();
    } else {
      setValue("state", "N");
    }
  }, []);

  const [tenantOptions, setTenantOptions] = useState([]);
  const [propertyOptions, setPropertyOptions] = useState([]);
  const [landlordOptions, setLandlordOptions] = useState([]);
  const [taxRates, setTaxRates] = useState([]);
  const [isBusy, setIsBusy] = useState(false);
  const {is_superuser, permissions} = usePermission()
  const loadTypeaheads = async () => {
    try {
      setIsBusy(true);
      const tenantsData = await api.get(`${USERS}`, {
        params: {is_tenant: true},
      });

      /* prepare list */
      const tenants = tenantsData.data.map((item) => {
        return {
          id: item.id,
          name: `${item?.full_name} `,
        };
      });
      setTenantOptions([...tenants]);

      const landlordsData = await api.get(`${USERS}`, {
        params: {is_landlord: true},
      });
      const landlords = landlordsData.data.map((item) => {
        return {
          id: item.id,
          name: `${item?.full_name}`,
        };
      });
      setLandlordOptions([...landlords]);

      const taxRates = await api.get(TAX_RATE)
      setTaxRates([...taxRates.data])
      const properties = await api.get(`${PROPERTY}`);
      setPropertyOptions([...properties.data]);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsBusy(false);
    }
  };


  /**
   * filter by landlords
   * @param landlord
   * @returns {Promise<void>}
   */
  const landlordChanged = async (landlord) => {
    try {
      await setValue("landlord", landlord); // Change selected landlord
      await setValue("property", null); // reset apartment
      const landlord_id = getValues("landlord.id");
      const properties = await api.get(`${PROPERTY}`, {
        params: {owner_id: landlord_id},
      }); //filter by owner
      setPropertyOptions([...properties.data]);
    } catch (error) {
      toast.error(error?.response?.detail);
    }
  };

  /**
   * submit data
   * @param data
   * @returns {Promise<void>}
   */
  const onSubmit = async (data) => {
    data = {
      ...data,
      property: data["property"].id,
      tenant: data["tenant"].id,
    };

    const formData = new FormData();
    // Object to form data for file upload
    Object.keys(data).forEach((key) => {
      if (key === "document") {
        if (data.document.length > 0) {
          formData.append(key, data[key][0]);
        }
      } else if ((key === "end_date") || (key === "start_date")) {
        formData.append(key, data[key].toISOString());
      } else {
        formData.append(key, data[key]);
      }
    });

    const config = {headers: {"content-type": "multipart/form-data"}};
    try {
      if (id) {
        await api.put(`${PROPERTY_CONTRACTS}${id}/`, formData, config);
        toast.success("Added contract.");
        /* This will change according to zied's modification of the routing */
        history.push("/apartment-contracts/list");
      } else {
        await api.post(PROPERTY_CONTRACTS, formData, config);
        toast.success("Added contract.");
        /* This will change according to zied's modification of the routing */
        history.push("/apartment-contracts/list");
      }
    } catch (error) {
      toast.error(error.response.data.detail);
    }
  };

  /**
   * Contract info form
   * @returns
   */
  const contractForm = () => {
    return (
      
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset disabled={!permissions.includes("core.change_unitcontract")}>
          <div className="form-row">
            <div className="form-group col-md-4">
              <label>{t("Tenant")}</label>
              <Typeahead
                disabled={id}
                name="tenant"
                id="tenant"
                multiple={false}
                labelKey="name"
                isInvalid={errors?.tenant}
                defaultSelected={_.filter(tenantOptions, {id: getValues("tenant.id")})}
                onChange={(selected) => {
                  setValue("tenant", selected[0]);
                }}
                options={tenantOptions}
              />
              <div className="invalid-feedback" style={{display: "block"}}>{errors.tenant?.message}</div>
            </div>


            <div className="form-group col-md-4">
              <label>{t("Landlord")}</label>
              <Typeahead
                disabled={id}
                id="landlord"
                labelKey="name"
                placeholder="Filter apartments with landlord"
                label="Filter apartments with landlord"
                defaultSelected={_.filter(landlordOptions, {id: getValues("landlord.id")})}
                onChange={(selected) => {
                  landlordChanged(selected[0]);
                }}
                options={landlordOptions}
              />
            </div>

            <div className="form-group col-md-4">
              <label>{t("Property")}</label>
              <Typeahead
                disabled={id}
                name="property"
                id="property"
                labelKey="name"
                isInvalid={errors?.property}
                defaultSelected={_.filter(propertyOptions, {id: getValues("property.id")})}
                onChange={(selected) => {
                  setValue("property", selected[0]);
                }}
                options={propertyOptions}
              />
              <div className="invalid-feedback" style={{display: "block"}}>{errors.property?.message}</div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-md-4">
              <label>{t("Location price")}</label>
              <input
                name="location_price"
                type="number"
                {...register("location_price")}
                className={`form-control ${
                  errors.location_price ? "is-invalid" : ""
                }`}
              />
              <div className="invalid-feedback">
                {errors.location_price?.message}
              </div>
              <div className="invalid-feedback">
                {errors?.date_signed?.message}
              </div>
            </div>

            <div className="form-group col-md-4">
              <label>{t("Start date")}</label>
              <Controller
                control={control}
                name="start_date"
                className="input"
                render={({field}) => (
                  <>
                    <DatePicker
                      placeholderText="Select date"
                      timeInputLabel="Time:"
                      showTimeInput
                      dateFormat="yyyy-MM-dd HH:mm"
                      className={`form-control ${
                        errors.start_date ? "is-invalid" : ""
                      }`}
                      onChange={(date) => field.onChange(date)}
                      selected={field.value ? new Date(field.value) : null}
                    />
                    <div
                      className="invalid-feedback"
                      style={errors?.start_date ? {display: "block"} : {}}
                    >
                      {errors?.start_date && errors.start_date?.message}
                    </div>
                  </>
                )}
              />
              <div className="invalid-feedback">{errors.start_date?.message}</div>
            </div>
            <div className="form-group col-md-4">
              <label>{t("End date")} </label>
              <Controller
                control={control}
                name="end_date"
                className="input"
                render={({field}) => (
                  <>
                    <DatePicker
                      dateFormat="yyyy-MM-dd HH:mm"
                      placeholderText="Select date"
                      timeInputLabel="Time:"
                      showTimeInput
                      className={`form-control ${
                        errors.end_date ? "is-invalid" : ""
                      }`}
                      onChange={(date) => field.onChange(date)}
                      selected={field.value ? new Date(field.value) : null}
                    />
                    <div
                      className="invalid-feedback"
                      style={errors?.end_date ? {display: "block"} : {}}
                    >
                      {errors?.end_date && errors.end_date?.message}
                    </div>

                  </>
                )}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-md-4">
              <label>{t("Deposit")}</label>
              <input
                name="deposit"
                type="number"
                {...register("deposit")}
                className={`form-control ${errors.deposit ? "is-invalid" : ""}`}
              />
              <div className="invalid-feedback">{errors.deposit?.message}</div>
            </div>

            <div className="form-group col-md-4">
              <label>{t("Contract type")}</label>
              <select
                name="contract_type"
                {...register("contract_type")}
                className={`form-control ${
                  errors?.payement_frequency ? "is-invalid" : ""
                }`}
              >
                <option value="RENT">{t("Rent")}</option>
                <option value="BUY">{t("Buy")}</option>
              </select>
              <div className="invalid-feedback">
                {errors?.contract_type?.message}
              </div>
            </div>
            <div className="form-group col-md-4">
              <label>{t("Tax rate")}</label>
              <select
                name="tax_rate"
                {...register("tax_rate")}
                className={`form-control ${
                  errors?.tax_rate ? "is-invalid" : ""
                }`}
              >
                {taxRates.map((rate) => (
                  <option key={rate.name} value={rate.id}>
                    {rate.name}
                  </option>
                ))}
              </select>
              <div className="invalid-feedback">
                {errors?.tax_rate?.message}
              </div>
            </div>
          </div>
          </fieldset>
          <Form.Group>
            <div className="input-group col-xs-12">
            {is_superuser &&
              <Form.Control
                type="file"
                {...register("document")}
                className="form-control file-upload-info"
                placeholder="Upload Image"
              />
            }
              {id && (
                 <span className="input-group-append ml-2">
              <Button
              href={document}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="align-self-center">
                {t("File")}
              </span>
              </Button>
                <Button
                  href={CONTRACT_PDF_TEMPLATE.replace("{contract_id}", id)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="align-self-center">
                    {t("Contract")}
                  </span>
                </Button>
              </span>)}
            </div>
          </Form.Group>
          <fieldset disabled={!permissions.includes("core.change_unitcontract")}>
          <div className="form-row">
            <div className="form-group col-md-12">
              <label>{t("Remarks")}</label>
              <textarea
                name="remarks"
                {...register("remarks")}
                className={`form-control ${errors.remarks ? "is-invalid" : ""}`}
              />
              <div className="invalid-feedback">{errors.remarks?.message}</div>
            </div>
          </div>

          <div className="form-group d-flex justify-content-between">
            {is_superuser ?
              (<button className="btn btn-primary " type="submit">
                {id ? t("Edit") : t("Add")}
              </button>) : ""
            }
          </div>
          </fieldset>
        </form>
    );
  };

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title">{t("Contract management")}</h3>
      </div>
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">{t("Contract")}</h4>
              {!isBusy ? (
                contractForm()
              ) : (
                <div className="loader-demo-box">
                  <div className="flip-square-loader mx-auto"/>
                </div>
              )}
            </div>
          </div>
        </div>
        {id ? (<>
            <Profit contractId={id}/>
            {/*<BillList contractId={id}/>/!*}/*feature is disabled for now do not remove*/}
            <InvoiceList contractId={id}/>
            <ClaimList contractId={id}/>
          </>
        ) : ""}
      </div>
    </div>
  );
}
