import {yupResolver} from '@hookform/resolvers/yup';
import _ from 'lodash';
import React, {useEffect, useState} from 'react';
import {Typeahead} from 'react-bootstrap-typeahead';
import {Controller, useForm} from 'react-hook-form';
import {useHistory, useParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import * as Yup from 'yup';
import {Trans} from 'react-i18next';

import {GROUPS, PERMISSIONS} from '../../constants/api';
import api from '../../api';

export default function GroupAdd() {
  const {id} = useParams();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Permission name is required'),
  });

  const [permissions, setPermissions] = useState([]);
  const history = useHistory();

  /**
   * Use effect hook
   */
  useEffect(() => {
    loadPermissions();

    if (id) {
      loadGroup(id);
    }
  }, []);

  // react-form-hooks stuff
  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const loadGroup = (id) => {
    api
      .get(`${GROUPS}${id}/`)
      .then(({data}) => {
        const fields = ['name', 'permissions'];
        fields.forEach((field) => setValue(field, data[field]));
      })
      .catch((e) => toast.error(`Failed fetch group! ${e}.`));
  };

  /**
   * Load permissions
   */
  const loadPermissions = async () => {
    try {
      const {data} = await api.get(PERMISSIONS)
      console.log(PERMISSIONS)
      console.log(data)
      setPermissions(data)
    } catch (error) {
      if (error.response.data.detail) {
        toast.error(error.response.data.detail)
      } else {
        toast.error(`Unknown error`)
      }

    }
  };

  /**
   * Form submit
   * @param {*} data
   */
  const onSubmit = (data) => {
    if (id) {
      api
        .patch(`${GROUPS}${id}/`, data)
        .then((res) => {
          toast.success('Group updated!');
          history.push('/groups/list');
        })
        .catch((e) => toast.error(`Failed to add groups ${e}`));
    } else {
      api
        .post(GROUPS, data)
        .then((res) => {
          toast.success('Group added!');
          history.push('/groups/list');
        })
        .catch((e) => toast.error(`Failed to add group ${e}`));
    }
  };
  return (
    <div>
      <div className="page-header">
        <h3 className="page-title">
          <Trans>Group management</Trans>
        </h3>
      </div>
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">{<Trans>{id ? 'Group edit' : 'Group add'}</Trans>}</h4>
              <p className="card-description">
                {' '}
                <Trans>Enter the group information</Trans>
              </p>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-row">
                  <div className="form-group col-md-12">
                    <label>
                      <Trans>Group name</Trans>
                    </label>
                    <input
                      name="name"
                      type="text"
                      {...register('name')}
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.name?.message}</div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md-12">
                    <label htmlFor="permissions">
                      <Trans>Permissions</Trans>
                    </label>
                    <Controller
                      control={control}
                      name="permissions"
                      render={({field}) => (
                        <Typeahead
                          {...field}
                          id="permissions"
                          labelKey="name"
                          multiple
                          options={permissions}
                          selected={permissions.filter((item) =>
                            _.find(getValues('permissions'), (id) => id === item.id)
                          )}
                          onChange={(selected) => {
                            const ids = _.map(selected, 'id');
                            setValue('permissions', ids);
                          }}
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <button className="btn btn-primary" type="submit">
                    <Trans>{id ? 'Edit' : 'Add'}</Trans>
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
