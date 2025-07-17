import { yupResolver } from '@hookform/resolvers/yup';
import _ from 'lodash';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import api from '../../../api';
import { EMPLOYEE_CONTRACTS } from '../../../constants/api';
import ContractSection from './contracts-forms/ContractSection';

export default function EmployeeContractAdd() {
  /* translation */
  const { t } = useTranslation();
  /* Routing */
  let history = useHistory();
  const { id } = useParams();

  /* Input validation */
  const validationSchema = Yup.object().shape({
    employee: Yup.number().required('Contract employee is required'),
    amount: Yup.number().required('Amount is required'),
    salary_payments: Yup.string().required('salary_payments is required'),
    start_date: Yup.date().required('start_date is required'),
    end_date: Yup.date()
      .required('end_date is required')
      .min(Yup.ref('start_date'), "end date can't be before start date"),
    remarks: Yup.string().required(),
  });

  /* react-form-hooks stuff */
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const loadContract = (id) => {
    /**
     * Load contract
     * @param {*} id
     */
    api
      .get(`${EMPLOYEE_CONTRACTS}${id}/`)
      .then(({ data }) => {
        const fields = [
          'employee',
          'amount',
          'salary_payments',
          'start_date',
          'end_date',
          'remarks',
        ];

        fields.forEach((field) => {
          setValue(field, data[field]);
        });

        // set Form data with useForm Hook
      })
      .catch((e) => toast.error(`Failed fetch contract! ${e}.`));
  };

  // hook loaders
  useEffect(() => {
    // load employee details
    if (id) {
      loadContract(id);
    }
  }, []);

  /**
   * Submit form
   *
   * @param {*} data
   */
  const onSubmit = async (data) => {
    try {
      if (id) {
        await api.put(`${EMPLOYEE_CONTRACTS}${id}/`, data);
        toast.success('Added contract.');
        history.push('/employees/contracts/list');
      } else {
        await api.post(EMPLOYEE_CONTRACTS, data);
        toast.success('Added contract.');
        history.push('/employees/contracts/list');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  /* TODO mzekri-madar typeahead does not work in the update */
  return (
    <div>
      <div className="page-header">
        <h3 className="page-title">{t('Contract management')}</h3>
      </div>
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">{t('Employee contract details')}</h4>
              <p className="card-description"> {t('Enter the contract information')}</p>
              <form onSubmit={handleSubmit(onSubmit)}>
                <ContractSection
                  register={register}
                  errors={errors}
                  setValue={setValue}
                  control={control}
                />
                <div className="form-group">
                  <button className="btn btn-primary" type="submit">
                    ADD
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
