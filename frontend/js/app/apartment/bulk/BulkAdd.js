import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom"
import * as Yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {toast} from "react-toastify"
import {useTranslation} from "react-i18next"
import {useForm} from "react-hook-form"
import api from "../../../api";
import {PROPERTY_BULK, TOWER, USERS} from "../../../constants/api";
import StepWizard from "react-step-wizard";
import Apartments from "./Apartments";
import Summary from "./Summary";

const BulkAdd = () => {

  const [isLoading, setLoading] = useState(true);
  const [towers, setTowers] = useState([]);
  const [landlords, setLandlords] = useState([]);
  const {t} = useTranslation();
  const history = useHistory()
  const validationSchema = Yup.object().shape({
    properties: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required("Property name is required"),
        address: Yup.object().shape({
          city: Yup.string().required("city is required").typeError('city is required'),
          state: Yup.string().required("state is required").typeError('state is required'),
          district: Yup.string().required("district is required").typeError('district is required')
        }),
        owner: Yup.number().required('owner is required').typeError('owner is required'),
        apartment: Yup.object().shape({
          tower: Yup.number().nullable(),
          has_electricity: Yup.bool().default(false),
          number: Yup.number().required("number required").typeError('number is invalid'),
          area: Yup.number().required("surface area is required").typeError('surface area is invalid'),
          room_count: Yup.number().required("number of rooms is required")
            .min(Yup.ref("bedroom_count"), "room count cannot be less than room count.")
            .typeError('number of rooms is invalid'),
          bedroom_count: Yup.number().required("number of bedrooms is required").typeError('number of rooms is invalid'),
          has_parking: Yup.bool().default(false),
          has_internet_connection: Yup.bool().default(false),
          has_gas: Yup.bool().default(false),
          has_airconditioning: Yup.bool().default(false),
          pets_allowed: Yup.bool().default(false)
        })
      }))
  })

  /**
   * form hooks
   * */
  const {
    register, trigger, handleSubmit, control, getValues, setValue, formState: {errors}
  } = useForm({
    resolver: yupResolver(validationSchema), reValidateMode: "onChange"
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
      const {properties} = data
      await api.post(PROPERTY_BULK, [...properties])
      toast.success("Apartment added!");
      history.goBack()
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title">
          {t("Apartments")}
        </h3>
      </div>
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">
                {t("Add")}
              </h4>
              {!isLoading ? (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <StepWizard>
                    <Apartments
                      register={register}
                      errors={errors}
                      setValue={setValue}
                      getValues={getValues}
                      towers={towers}
                      landlords={landlords}
                      control={control}
                      trigger={trigger}
                    />
                    <Summary getValues={getValues}/>
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
  )
};

export default BulkAdd;
