import { yupResolver } from '@hookform/resolvers/yup';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';

import { Typeahead } from 'react-bootstrap-typeahead';
import { useForm, Controller } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';

import { GROUPS, LANDLORDS } from '../../constants/api';
import api from '../..//api';

export default function Add() {
  /* translation */
  const { t } = useTranslation();
  /* routing */
  const { id } = useParams();
  // Schema validator
  const passwords = !id
    ? {
        password: Yup.string()
          .required('Password is required')
          .min(6, 'Password must be at least 6 characters')
          .max(40, 'Password must not exceed 40 characters'),
        confirmPassword: Yup.string()
          .required('Confirm Password is required')
          .oneOf([Yup.ref('password'), null], 'Confirm Password does not match'),
      }
    : {};

  // @TODO: zied start and hiring date should be linked together (start date >> hiring date)
  const validationSchema = Yup.object().shape({
    landlord: Yup.object().shape({}),

    user: Yup.object().shape({
      first_name: Yup.string().required('first name is required'),

      last_name: Yup.string().required('last name is required'),

      email: Yup.string()
        .required('Email is required')
        .email('Email is invalid'),
      ...passwords,

      groups: Yup.array().default([]),
      address: Yup.object().shape({
        city: Yup.string().required('City is required'),
        state: Yup.string().required('State is required'),
        district: Yup.string().required('District is required'),
      }),
      is_active: Yup.bool()
        .required()
        .default(false),

      /* Why does the landlord have to be an employee */
      is_staff: Yup.bool()
        .required()
        .default(false),
    }),

    gender: Yup.string()
      .required('Gender is required')
      .default('M'),
  });

  const [groups, setGroups] = useState([]);
  const [isBusy, setIsBusy] = useState(false);

  const history = useHistory();
  // react-form-hooks stuff
  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      landlord: {},
    },
  });

  /**
   * Use effect hook
   */
  const loadLandlord = (id) => {
    /**
     * Load Landlord
     * @param {*} id
     */
    api
      .get(`${LANDLORDS}${id}/`)
      .then(({ data }) => {
        const fields = ['landlord', 'user', 'gender'];

        fields.forEach((field) => {
          setValue(field, data[field]);
        });

        // set Form data with useForm Hook
      })
      .catch((e) => toast.error(`Failed fetch landlord! ${e}.`));
  };

  const loadGroups = () => {
    /**
     * Load user groups
     */
    api
      .get(GROUPS)
      .then((res) => {
        setGroups(res.data);
      })
      .catch((e) => toast.error(`Failed fetch groups ${e}`));
  };

  const loadData = async () => {
    /**
     * Load user groups
     */
    try {
      setIsBusy(true);
      if (id) {
        const { data } = await api.get(`${LANDLORDS}${id}/`);
        const fields = ['landlord', 'user', 'gender'];
        fields.forEach((field) => {
          setValue(field, data[field]);
        });
      }
      const groupRes = await api.get(GROUPS);
      setGroups(groupRes.data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsBusy(false);
    }
  };

  // hook loaders
  useEffect(() => {
    loadData();
  }, []);

  // hook loaders
  useEffect(() => {
    loadData();
  }, []);

  /**
   * Form submit
   * @param {*} data
   */
  const onSubmit = (data) => {
    if (id) {
      api
        .put(`${LANDLORDS}${id}/`, data)
        .then((res) => {
          toast.success('landlord updated!');
          history.push('/landlords/list');
        })
        .catch((e) => toast.error(`Failed to add landlord ${e}`));
    } else {
      api
        .post(LANDLORDS, data)
        .then((res) => {
          toast.success('landlord added!');
          history.push('/landlords/list');
        })
        .catch((e) => toast.error(`Failed to add landlord ${e}`));
    }
  };

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title">{t('Landlord management')}</h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="!#" onClick={(event) => event.preventDefault()}></a>
            </li>
          </ol>
        </nav>
      </div>
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">{id ? t('Landlord edit') : t('Landlord add')}</h4>
              <p className="card-description"> {t('Enter the informations')}</p>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label> {t('First name')} </label>
                    <input
                      name="user.first_name"
                      type="text"
                      {...register('user.first_name')}
                      className={`form-control ${errors.user?.first_name ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.user?.first_name?.message}</div>
                  </div>
                  <div className="form-group col-md-6">
                    <label>{t('Last name')}</label>
                    <input
                      name="user.last_name"
                      type="text"
                      {...register('user.last_name')}
                      className={`form-control ${errors.user?.last_name ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.user?.last_name?.message}</div>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label>{t('E-mail')}</label>
                    <input
                      name="user.email"
                      type="text"
                      {...register('user.email')}
                      className={`form-control ${errors.user?.email ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.user?.email?.message}</div>
                  </div>

                  <div className="form-group col-md-6">
                    <label>{t('Gender')}</label>
                    <select
                      name="gender"
                      type="text"
                      {...register('gender')}
                      className={`form-control ${errors.gender ? 'is-invalid' : ''}`}
                    >
                      {['M', 'F'].map((gender, index) => (
                        <option key={'gender' + index} value={gender}>
                          {gender}
                        </option>
                      ))}
                    </select>
                    <div className="invalid-feedback">{errors.gender?.message}</div>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-md-4">
                    <label>{t('State')}</label>
                    <input
                      name="user.address.state"
                      type="text"
                      {...register('user.address.state')}
                      className={`form-control ${errors?.user?.address?.state ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors?.user?.address?.state?.message}</div>
                  </div>

                  <div className="form-group col-md-4">
                    <label>{t('City')}</label>
                    <input
                      name="user.address.city"
                      type="text"
                      {...register('user.address.city')}
                      className={`form-control ${errors?.user?.address?.city ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors?.user?.address?.city?.message}</div>
                  </div>

                  <div className="form-group col-md-4">
                    <label>{t('District')}</label>
                    <input
                      name="user.address.district"
                      type="text"
                      {...register('user.address.district')}
                      className={`form-control ${
                        errors?.user?.address?.district ? 'is-invalid' : ''
                      }`}
                    />
                    <div className="invalid-feedback">
                      {errors?.user?.address?.district?.message}
                    </div>
                  </div>
                </div>
                {!id && (
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label>{t('Password')}</label>
                      <input
                        name="user.password"
                        type="password"
                        {...register('user.password')}
                        className={`form-control ${errors.user?.password ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.user?.password?.message}</div>
                    </div>
                    <div className="form-group col-md-6">
                      <label>{t('Confirm Password')}</label>
                      <input
                        name="user.confirmPassword"
                        type="password"
                        {...register('user.confirmPassword')}
                        className={`form-control ${
                          errors.user?.confirmPassword ? 'is-invalid' : ''
                        }`}
                      />
                      <div className="invalid-feedback">
                        {errors.user?.confirmPassword?.message}
                      </div>
                    </div>
                  </div>
                )}

                <div className="form-row">
                  <div className="form-group col-md-12">
                    <label htmlFor="groups">{t('Groups')}</label>
                    <Controller
                      control={control}
                      name="user.groups"
                      render={({ field }) => (
                        <Typeahead
                          {...field}
                          id="user.groups"
                          labelKey="name"
                          multiple
                          options={groups}
                          selected={groups.filter((item) =>
                            /* This is shite need to be replaced */
                            _.find(getValues('user.groups'), (id) => id === item.id)
                          )}
                          onChange={(selected) => {
                            const ids = _.map(selected, 'id');
                            if (!ids) return;
                            setValue('user.groups', ids);
                          }}
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md-6">
                    <div className="form-check">
                      <label className="form-check-label">
                        <input
                          type="checkbox"
                          name="user.is_staff"
                          id="user.is_staff"
                          {...register('user.is_staff')}
                          className="form-check-input"
                        />
                        <i className="input-helper"></i>
                        {t('Is staff')}
                      </label>
                    </div>
                  </div>

                  <div className="form-group col-md-6">
                    <div className="form-check">
                      <label className="form-check-label">
                        <input
                          type="checkbox"
                          name="user.is_active"
                          id="user.is_active"
                          {...register('user.is_active')}
                          className="form-check-input"
                        />
                        <i className="input-helper"></i>
                        {t('Is active')}
                      </label>
                    </div>
                  </div>
                </div>

                <div className="form-group mt-5">
                  <button className="btn btn-primary" type="submit">
                    {id ? t('Edit') : t('Add')}
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
