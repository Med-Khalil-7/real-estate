import React, { useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router';
import { toast } from 'react-toastify';
import LogoDark from '../../assets/images/logo-dark.svg';
import { EMAIL_CONFIRMATION } from '../../constants/api';
import api from '../../api';

export default function EmailConfirmation() {
  // url parms
  const { uidb64, token } = useParams();

  const history = useHistory();
  const [isBusy, setIsBusy] = useState(false);

  const handleConfirmation = () => {
    setIsBusy(true);
    api
      .get(EMAIL_CONFIRMATION, {
        params: {
          uidb64,
          token,
        },
      })
      .then(() => {
        toast.success('Successfully activated! you can login now?');
        history.push('/user-pages/login-1');
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log('main error', error.response);
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
          toast.error(`Error logging in! ${error.response.data.detail}`);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          toast.error(`Error logging in! ${error.request}`);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
          toast.error(`Error logging in! ${error.message}`);
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
              <h1>Welcome</h1>
              <h6>
                We're excited to have you get started.
                <br /> First, you need to confirm your account.Just press the button below.
              </h6>
              <button
                className="btn btn-outline-primary btn-fw mt-3 mb-1"
                disabled={isBusy}
                onClick={handleConfirmation}
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
                  'Activate account'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
