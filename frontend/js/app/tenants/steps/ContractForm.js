import { yupResolver } from '@hookform/resolvers/yup';
import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useFieldArray } from 'react-hook-form';
import { useTranslation, Trans } from 'react-i18next';
import api from '../../../api';
import DatePicker from 'react-datepicker';
import { Typeahead } from 'react-bootstrap-typeahead';
import { Spinner, Button } from 'react-bootstrap';
import { Controller } from 'react-hook-form';
import {
  TENANT_PROFILES,
  APARTMENTS,
  LANDLORD_PROFILES,
  PROPERTY_CONTRACTS,
  LANDLORDS,
} from '../../../constants/api';

export default function ContractForm({ previousStep, control, register, setValue, errors }) {
  /* translation */
  const { t } = useTranslation();
  /* Routing */

  /**
   * Side effects
   */
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tenant.tenant_contracts',
  });

  const appendField = () => {
    append({
      contract: {
        apartment: '',
        deposit: '',
        location_price: '',
        start_date: '',
        end_date: '',
        rent_collection: '',
        remarks: '',
      },
    });
  };

  const removeField = (index) => {
    remove(index);
  };

  useEffect(() => {
    loadTypeaheads();
  }, []);

  const [apartmentOptions, setApartmentOptions] = useState([]);
  const [landlordOptions, setLandlordOptions] = useState([]);
  const [isBusy, SetIsBusy] = useState(false);
  /**
   *
   * @param {*} query
   */
  const loadTypeaheads = async () => {
    try {
      SetIsBusy(true);
      const landlords = await api.get(`${LANDLORD_PROFILES}`);
      setLandlordOptions([...landlords.data]);
      const apartments = await api.get(`${APARTMENTS}`);
      setApartmentOptions([...apartments.data]);
    } catch (error) {
      toast.error(error.message);
    } finally {
      SetIsBusy(false);
    }
  };

  return (
    <div>
      <p className="card-description"> {t('Enter the contract informations')}</p>

      {!isBusy ? (
        <>
          {fields.map((_, index) => (
            <div key={index}>
              {/* Section 1 */}
              <div className="form-row">
                <div className="form-group col-md-6">
                  <label>{t('Landlord')}</label>
                  <Typeahead
                    id="landlord"
                    labelKey="name"
                    onChange={(selected) =>
                      setValue(`tenant.tenant_contracts.${index}.landlord`, selected[0])
                    }
                    options={landlordOptions}
                  />
                </div>
                <div className="form-group col-md-6">
                  <label>{t('Apartment')}</label>
                  <Typeahead
                    name={`tenant.tenant_contracts.${index}.apartment`}
                    id="apartment"
                    labelKey="number"
                    onChange={(selected) =>
                      setValue(`tenant.tenant_contracts.${index}.apartment`, selected[0])
                    }
                    options={apartmentOptions}
                  />
                  <div className="invalid-feedback">
                    {errors?.contracts && errors?.contracts[index]?.apartment?.message}
                  </div>
                </div>
              </div>

              {/* Section 2 */}
              <div className="form-row">
                <div className="form-group col-md-4">
                  <label>{t('Location price')}</label>
                  <input
                    name={`tenant.tenant_contracts.${index}.location_price`}
                    type="number"
                    {...register(`tenant.tenant_contracts.${index}.location_price`)}
                    className={`form-control ${
                      errors?.tenant?.tenant_contracts &&
                      errors?.tenant?.tenant_contracts[index]?.location_price
                        ? 'is-invalid'
                        : ''
                    }`}
                  />
                  <div className="invalid-feedback">
                    {errors?.tenant?.tenant_contracts &&
                      errors?.tenant?.tenant_contracts[index]?.location_price?.message}
                  </div>
                  <div className="invalid-feedback">
                    {errors?.tenant?.tenant_contracts &&
                      errors?.tenant?.tenant_contracts[index]?.date_signed?.message}
                  </div>
                </div>

                <div className="form-group col-md-4">
                  <label>{t('Start date')}</label>
                  <Controller
                    control={control}
                    name={`tenant.tenant_contracts.${index}.start_date`}
                    className="input"
                    render={({ field }) => (
                      <DatePicker
                        placeholderText="Select date"
                        className={`form-control ${
                          errors?.tenant?.tenant_contracts &&
                          errors?.tenant?.tenant_contracts[index]?.start_date
                            ? 'is-invalid'
                            : ''
                        }`}
                        onChange={(date) => field.onChange(date)}
                        selected={field.value ? new Date(field.value) : null}
                      />
                    )}
                  />
                  <div className="invalid-feedback">
                    {errors?.tenant?.tenant_contracts &&
                      errors?.tenant?.tenant_contracts[index]?.start_date?.message}
                  </div>
                </div>
                <div className="form-group col-md-4">
                  <label>{t('End date')} </label>
                  <Controller
                    control={control}
                    name={`tenant.tenant_contracts.${index}.end_date`}
                    className="input"
                    render={({ field }) => (
                      <DatePicker
                        placeholderText="Select date"
                        className={`form-control ${
                          errors?.tenant?.tenant_contracts &&
                          errors?.tenant?.tenant_contracts[index]?.end_date
                            ? 'is-invalid'
                            : ''
                        }`}
                        onChange={(date) => field.onChange(date)}
                        selected={field.value ? new Date(field.value) : null}
                      />
                    )}
                  />
                  <div className="invalid-feedback">
                    {errors?.tenant?.tenant_contracts &&
                      errors?.tenant?.tenant_contracts[index]?.end_date?.message}
                  </div>
                </div>
              </div>

              {/* section 3 */}
              <div className="form-row">
                <div className="form-group col-md-4">
                  <label>{t('Rent collection')}</label>
                  <select
                    name={`tenant.tenant_contracts.${index}.rent_collection`}
                    type="text"
                    {...register(`tenant.tenant_contracts.${index}.rent_collection`)}
                    className={`form-control ${
                      errors?.tenant?.tenant_contracts?.rent_collection ? 'is-invalid' : ''
                    }`}
                  >
                    <option value="month">Every Month</option>
                    <option value="2months">Every Two Months</option>
                    <option value="3months">Every Three Months</option>
                    <option value="6months">Every Six Months</option>
                  </select>
                  <div className="invalid-feedback">
                    {errors?.tenant?.tenant_contracts &&
                      errors?.tenant?.tenant_contracts[index]?.rent_collection?.message}
                  </div>
                </div>

                <div className="form-group col-md-4">
                  <label>{t('Deposit')}</label>
                  <input
                    name={`tenant.tenant_contracts.${index}.deposit`}
                    type="number"
                    {...register(`tenant.tenant_contracts.${index}.deposit`)}
                    className={`form-control ${
                      errors?.tenant?.tenant_contracts &&
                      errors?.tenant?.tenant_contracts[index]?.deposit
                        ? 'is-invalid'
                        : ''
                    }`}
                  />
                  <div className="invalid-feedback">
                    {errors?.tenant?.tenant_contracts &&
                      errors?.tenant?.tenant_contracts[index]?.deposit?.message}
                  </div>
                </div>

                <div className="form-group col-md-4">
                  <label>{t('Contract type')}</label>
                  <select
                    name={`tenant.tenant_contracts.${index}.contract_type`}
                    type="text"
                    {...register(`tenant.tenant_contracts.${index}.contract_type`)}
                    className={`form-control ${
                      errors?.tenant?.tenant_contracts &&
                      errors?.tenant?.tenant_contracts[index]?.contract_type
                        ? 'is-invalid'
                        : ''
                    }`}
                  >
                    <option value="RENT">Rent</option>
                    <option value="BUY">Buy</option>
                  </select>
                  <div className="invalid-feedback">
                    {errors?.tenant?.tenant_contracts &&
                      errors?.tenant?.tenant_contracts[index]?.contract_type?.message}
                  </div>
                </div>
              </div>

              {/* Section 4 */}
              <div className="form-row">
                <div className="form-group col-md-12">
                  <label>{t('Remarks')}</label>
                  <textarea
                    name={`tenant.tenant_contracts.${index}.remarks`}
                    type="textarea"
                    {...register(`tenant.tenant_contracts.${index}.remarks`)}
                    className={`form-control ${
                      errors?.tenant?.tenant_contracts &&
                      errors?.tenant?.tenant_contracts[index]?.remarks
                        ? 'is-invalid'
                        : ''
                    }`}
                  />
                  <div className="invalid-feedback">
                    {errors?.tenant?.tenant_contracts &&
                      errors?.tenant?.tenant_contracts[index]?.remarks?.message}
                  </div>
                </div>
              </div>

              {/* Append button */}
              <div className="d-flex justify-content-end">
                <Button variant="danger" onClick={removeField}>
                  <i className="mdi mdi-minus" />
                </Button>
              </div>
            </div>
          ))}

          {/* Append button */}
          <Button variant="primary" onClick={appendField}>
            <i className="mdi mdi-plus" />
          </Button>
          {/* Step button */}
          <div className="mt-5 d-flex justify-content-between">
            <Button className="btn btn-primary " onClick={previousStep}>
              {t('Previous')}
            </Button>
            <Button className="btn btn-primary " type="submit">
              {t('Submit')}
            </Button>
          </div>
        </>
      ) : (
        <Spinner animation="border" aria-hidden="true" as="span" role="status" size="sm" />
      )}
    </div>
  );
}
