import _ from 'lodash';
import React, { useState } from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import api from '../../../../api';
import { EMPLOYEE_SEARCH } from '../../../../constants/api';
import { toast } from 'react-toastify';
import { Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { useTranslation } from 'react-i18next';
export default function ContractSection({ register, errors, setValue, control }) {
  const { t } = useTranslation();

  const [emplyeesIsLoading, setEmplyeesIsLoading] = useState(false);
  const [employeesOptions, setEmployeesOptions] = useState([]);

  const employeeSearch = async (query) => {
    setEmplyeesIsLoading(true);
    try {
      const { data } = await api.get(`${EMPLOYEE_SEARCH}${query}`);
      const options = data.map((i) => {
        return {
          id: i.employee.id,
          name: i.user.first_name,
        };
      });
      setEmployeesOptions(options);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setEmplyeesIsLoading(false);
    }
  };

  return (
    <>
      <div className="form-row">
        <div className="form-group col-md-12">
          <label>{t('Employee')}</label>
          <Controller
            control={control}
            name="employee"
            id="employee"
            render={({ field }) => (
              <AsyncTypeahead
                {...field}
                filterBy={() => true}
                clearButton
                minLength={2}
                name="employee"
                id="employee"
                isLoading={emplyeesIsLoading}
                onChange={(selected) => selected && setValue('employee', selected[0].id)}
                labelKey="name"
                onSearch={employeeSearch}
                options={employeesOptions}
              />
            )}
          />

          <div className="invalid-feedback">{errors.employee?.message}</div>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group col-md-6">
          <label>{t('Salary payments')}</label>
          <select
            name="salary_payments"
            type="text"
            {...register('salary_payments')}
            className={`form-control ${errors.salary_payments ? 'is-invalid' : ''}`}
          >
            <option value="month">Every Month</option>
            <option value="2months">Every Two Months</option>
            <option value="3months">Every Three Months</option>
            <option value="6months">Every Six Months</option>
          </select>
          <div className="invalid-feedback">{errors.salary_payments?.message}</div>
        </div>

        <div className="form-group col-md-6">
          <label>{t('Amount')}</label>
          <input
            name="amount"
            type="number"
            {...register('amount')}
            className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.amount?.message}</div>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group col-md-6">
          <label>{t('Start date')}</label>
          <Controller
            control={control}
            name="start_date"
            className="input"
            render={({ field }) => (
              <DatePicker
                placeholderText="Select date"
                className={`form-control ${errors.start_date ? 'is-invalid' : ''}`}
                onChange={(date) => field.onChange(date)}
                selected={field.value ? new Date(field.value) : null}
              />
            )}
          />
          <div className="invalid-feedback">{errors.start_date?.message}</div>
        </div>
        <div className="form-group col-md-6">
          <label>{t('End date')}</label>
          <Controller
            control={control}
            name="end_date"
            className="input"
            render={({ field }) => (
              <DatePicker
                placeholderText="Select date"
                className={`form-control ${errors.end_date ? 'is-invalid' : ''}`}
                onChange={(date) => field.onChange(date)}
                selected={field.value ? new Date(field.value) : null}
              />
            )}
          />
          <div className="invalid-feedback">{errors.end_date?.message}</div>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group col-md-12">
          <label>{t('Remarks')}</label>
          <textarea
            name="remarks"
            type="textarea"
            {...register('remarks')}
            className={`form-control ${errors.remarks ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.remarks?.message}</div>
        </div>
      </div>
    </>
  );
}
