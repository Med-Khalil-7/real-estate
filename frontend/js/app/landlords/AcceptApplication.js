import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import LogoDark from '../../assets/images/logo-dark.svg';

import { APPLICATION_ACCEPT, USERS } from '../../constants/api';
import api from '../..//api';

export default function AcceptApplication() {
  const [isBusy, setIsBusy] = useState(false);
  const history = useHistory();
  // react-form-hooks stuff
  const {
    register,
    setValue,
    formState: { errors },
  } = useForm();

  const { id } = useParams();

  /**
   * life cycle hooks
   */
  useEffect(() => {
    loadUser(id);
  }, []);

  /**
   * Load user
   * @param {*} id
   */
  const loadUser = (id) => {
    api
      .get(`${USERS}${id}/`)
      .then(({ data }) => {
        const fields = ['first_name', 'last_name', 'email'];
        fields.forEach((field) => setValue(field, data[field]));
      })
      .catch((e) => toast.error(`Failed fetch user! ${e}.`));
  };

  const handleAccept = (accept) => {
    console.log(accept, id);
    setIsBusy(true);
    api
      .get(APPLICATION_ACCEPT, {
        params: {
          user_id: id,
          accept,
        },
      })
      .then(() => {
        if (accept) {
          toast.success(`Application has been accepted.`);
        } else {
          toast.success(`Application has been refused.`);
        }
        history.push('/');
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log('main error', error.response);
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
          toast.error(`Error! ${error.response.data.detail}`);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          toast.error(`Error! ${error.request}`);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
          toast.error(`Error! ${error.message}`);
        }
        console.log(error.config);
      })
      .finally(() => {
        setIsBusy(false);
      });
  };

  return (
    <div>
      <div className="d-flex align-items-center auth px-0">
        <div className="row w-100 mx-0">
          <div className="col-lg-4 mx-auto">
            <div className="auth-form-light text-left py-5 px-4 px-sm-5">
              <div className="brand-logo">
                <img src={LogoDark} alt="logo" />
              </div>
              <h4>User application</h4>
              <h6 className="font-weight-light mb-3">Accept or refuse the user application</h6>

              <form>
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label>First Name</label>
                    <input
                      disabled
                      name="first_name"
                      type="text"
                      {...register('first_name')}
                      className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.first_name?.message}</div>
                  </div>
                  <div className="form-group col-md-6">
                    <label>Last Name</label>
                    <input
                      disabled
                      name="last_name"
                      type="text"
                      {...register('last_name')}
                      className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.last_name?.message}</div>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-md-12">
                    <label>Email</label>
                    <input
                      disabled
                      name="email"
                      type="text"
                      {...register('email')}
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.email?.message}</div>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <button
                      className="btn btn-outline-primary btn-fw col-md-12"
                      disabled={isBusy}
                      onClick={() => handleAccept(true)}
                    >
                      {isBusy ? (
                        <Spinner
                          animation="border"
                          aria-hidden="true"
                          as="span"
                          role="status"
                          size="sm"
                        />
                      ) : (
                        'Accept'
                      )}
                    </button>
                  </div>
                  <div className="form-group col-md-6">
                    <button
                      className="btn btn-outline-danger btn-fw col-md-12"
                      disabled={isBusy}
                      onClick={() => handleAccept(false)}
                    >
                      {isBusy ? (
                        <Spinner
                          animation="border"
                          aria-hidden="true"
                          as="span"
                          role="status"
                          size="sm"
                        />
                      ) : (
                        'Refuse'
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
