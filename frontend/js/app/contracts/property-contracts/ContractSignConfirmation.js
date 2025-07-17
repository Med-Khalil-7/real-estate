import React, {useState} from 'react';
import {Spinner} from 'react-bootstrap';
import {useHistory, useParams} from 'react-router';
import {toast} from 'react-toastify';
import LogoDark from '../../../assets/images/logo-dark.svg';
import {CONTRACT_SIGN_VALIDATION} from '../../../constants/api';
import api from '../../../api';

export default function ContractSignConfirmation() {
  // url parms
  const {uidb64, token, contract_id} = useParams();

  const history = useHistory();
  const [isBusy, setIsBusy] = useState(false);

  const handleConfirmation = () => {
    setIsBusy(true);
    api
      .get(CONTRACT_SIGN_VALIDATION, {
        params: {
          uidb64,
          token,
          contract_id
        },
      })
      .then(() => {
        toast.success('The contract has been approved by you part')
        history.push('/');
      })
      .catch((error) => {
        toast.error("Token is not valid!")
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
                <img src={LogoDark} alt="logo"/>
              </div>
              <h1>Welcome</h1>
              <h6>
                Would you like confirm the contract?
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
                  'Confirm'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
