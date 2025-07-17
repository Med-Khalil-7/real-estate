import {yupResolver} from "@hookform/resolvers/yup";
import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {useHistory} from "react-router-dom";
import {toast} from "react-toastify";
import * as Yup from "yup";
import api from "../../api";
import {Trans} from "react-i18next";
import StepWizard from "react-step-wizard";
import {PROPERTY_WIZARD, TOWER, USERS} from "../../constants/api";
import Apartments from "./wizard/Apartments";
import Initial from "./wizard/Initial";
import Villas from "./wizard/Villas";
import Commercials from "./wizard/Commercials";
import Summary from "./wizard/Summary"

export default function Add() {
  /* router hooks */
  let history = useHistory();
  const [loading, setLoading] = useState(true);
  const [towers, setTowers] = useState([]);
  const [landlords, setLandlords] = useState([]);

  const validationSchema = Yup.object().shape({
    property_type: Yup.string(),
    apartments: Yup.array().when("property_type", {
      is: "apartments",
      then: Yup.array().of(Yup.object().shape({
        name: Yup.string().required("Property name is required"),
        address: Yup.object().shape({
          city: Yup.string().required("City is required"),
          state: Yup.string().required("State is required"),
          district: Yup.string().required("District is required")
        }),
        owner: Yup.number().nullable(),
        apartment: Yup.object().shape({
          tower: Yup.number().nullable(),
          has_electricity: Yup.bool().default(false),
          number: Yup.number().required("Name required"),
          area: Yup.number().required("Surface area is required"),
          room_count: Yup.number().required("Number of rooms is required"),
          bedroom_count: Yup.number().required("Number of bedrooms is required"),
          has_parking: Yup.bool().default(false),
          has_internet_connection: Yup.bool().default(false),
          has_gas: Yup.bool().default(false),
          has_airconditioning: Yup.bool().default(false),
          pets_allowed: Yup.bool().default(false)
        })
      }))
    }),


    villas: Yup.array().when("property_type", {
      is: "villas",
      then: Yup.array().of(Yup.object().shape({
        name: Yup.string().required("Property name is required"),
        address: Yup.object().shape({
          city: Yup.string().required("City is required"),
          state: Yup.string().required("State is required"),
          district: Yup.string().required("District is required")
        }),
        owner: Yup.number().nullable(),
        villa: Yup.object().shape({
          tower: Yup.number().nullable(),
          has_electricity: Yup.bool().default(false),
          number: Yup.number().required("Name required"),
          area: Yup.number().required("Surface area is required"),
          room_count: Yup.number().required("Number of rooms is required"),
          bedroom_count: Yup.number().required("Number of bedrooms is required"),
          has_parking: Yup.bool().default(false),
          has_internet_connection: Yup.bool().default(false),
          has_gas: Yup.bool().default(false),
          has_airconditioning: Yup.bool().default(false),
          pets_allowed: Yup.bool().default(false),
          has_backyard: Yup.bool().default(false),
          has_swimming_pool: Yup.bool().default(false),
          floor_count: Yup.number(),
        })
      }))
    }),


    commercials: Yup.array().when("property_type", {
      is: "commercials",
      then: Yup.array().of(Yup.object().shape({
        name: Yup.string().required("Property name is required"),
        address: Yup.object().shape({
          city: Yup.string().required("City is required"),
          state: Yup.string().required("State is required"),
          district: Yup.string().required("District is required")
        }),
        owner: Yup.number().nullable(),
        commercial: Yup.object().shape({
          tower: Yup.number().nullable(),
          commercial_type: Yup.string().required("Choose a commercial type"),
          has_electricity: Yup.bool().default(false),
          number: Yup.number().required("Name required"),
          area: Yup.number().required("Surface area is required"),
          room_count: Yup.number().required("Number of rooms is required"),
          has_parking: Yup.bool().default(false),
          has_internet_connection: Yup.bool().default(false),
          has_gas: Yup.bool().default(false),
          has_airconditioning: Yup.bool().default(false),
          pets_allowed: Yup.bool().default(false)
        })
      }))
    }),
  });

  // react-form-hooks stuff
  const {
    getValues,
    setValue,
    register,
    handleSubmit,
    control,
    trigger,
    watch,
    reset,
    formState: {errors}
  } = useForm({
    resolver: yupResolver(validationSchema),
    reValidateMode: "onChange",
    defaultValues: {property_type: "apartments"}
  });

  /**
   * load typeahead data
   * @returns {Promise<void>}
   */
  const init = async () => {
    try {
      setLoading(true)
      const landlordData = await api.get(`${USERS}`, {
        params: {is_landlord: true},
      });
      setLandlords(landlordData.data)
      const towerData = await api.get(`${TOWER}`);
      setTowers(towerData.data)
    } catch (e) {
      toast.error(e.response.detail)
    } finally {
      setLoading(false)
    }
  }

  /**
   * side effects
   */
  useEffect(() => {
    init().then()
  }, []);


  /**
   * Handle submit
   * @param {*} data
   */
  const onSubmit = async data => {
    try {
      delete data.property_type
      await api.post(PROPERTY_WIZARD, data)
      toast.success("Operation is successful!")
      history.goBack()
    } catch (error) {
      toast.error(error.message);
    }
  };



  return (
    <div>
      <div className="page-header">
        <h3 className="page-title">
          <Trans>Building management</Trans>
        </h3>
      </div>
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              {!loading ? (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <StepWizard isLazyMount={true}>
                    <Initial
                      register={register}
                      setValue={setValue}
                      getValues={getValues}
                      errors={errors}
                    />
                    {{
                      "apartments": (<Apartments
                        reset={reset}
                        register={register}
                        errors={errors}
                        setValue={setValue}
                        getValues={getValues}
                        towers={towers}
                        landlords={landlords}
                        control={control}
                        trigger={trigger}
                      />),
                      "commercials": (<Commercials
                        reset={reset}
                        register={register}
                        errors={errors}
                        setValue={setValue}
                        getValues={getValues}
                        towers={towers}
                        landlords={landlords}
                        control={control}
                        trigger={trigger}
                      />),
                      "villas": (<Villas
                        reset={reset}
                        register={register}
                        errors={errors}
                        setValue={setValue}
                        getValues={getValues}
                        towers={towers}
                        landlords={landlords}
                        control={control}
                        trigger={trigger}
                      />)
                    }[watch("property_type")]}
                    <Summary
                      errors={errors}
                      setValue={setValue}
                      getValues={getValues}
                    />
                  </StepWizard>
                </form>
              ) : (
                <div className="loader-demo-box">
                  <div className="flip-square-loader mx-auto"/>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
