import React, {useEffect, useState} from "react";
import {Button, Dropdown, Form, Modal} from "react-bootstrap";
import {Trans, useTranslation} from "react-i18next";
import {Link} from "react-router-dom";

import {toast} from "react-toastify";
import {
  BULK_REMINDER_EMAIL, CONTRACT_SIGN_REQUEST,
  CREATE_CONTRACT_PAYMENT,
  PROPERTY_CONTRACTS,
  SIGN_CONTRACT,
  TERMINATE_CONTRACT,
  CONTRACT_PDF_TEMPLATE
} from "../../../constants/api";
import api from "../../../api";
import {format} from "date-fns";
import usePermission from "../../hooks/usePermission";

export default function List() {
  /* translation hook */
  const {t} = useTranslation();

  const {is_superuser, is_landlord, is_tenant, permissions} = usePermission()

  /* Pagination stuff */
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  // modal stuff
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [contractToRemove, setContractToRemove] = useState(null);
  /* Payment modal */
  const [showPayment, setShowPayment] = useState(false);
  const handleClosePayment = () => setShowPayment(false);
  const handleShowPayment = () => setShowPayment(true);
  const [contractToPay, setContractToPay] = useState(null);
  /* Bulk mail modal */
  const [showMail, setShowMail] = useState(false);
  const handleCloseMail = () => setShowMail(false);
  const handleShowMail = () => setShowMail(true);

  /* Terminate contract modal */
  const [showTerminate, setShowTerminate] = useState(false);
  const handleCloseTerminate = () => setShowTerminate(false);
  const handleShowTerminate = () => setShowTerminate(true);
  const [contractToTerminate, setContractToTerminate] = useState(null);

  /*sign contract modal*/
  const [showSign, setShowSign] = useState(false);
  const handleCloseSign = () => setShowSign(false);
  const handleShowSign = () => setShowSign(true);
  const [contractToSign, setContractToSign] = useState("");

  /**
   * Fetch related contracts
   */
  const fetchContracts = async () => {
    setLoading(true);
    try {
      const response = await api.get(`${PROPERTY_CONTRACTS}`);
      setData(response.data);
      console.log(PROPERTY_CONTRACTS)
    } catch (error) {
      if (error?.response?.data?.detail) {
        toast.error(error?.response?.data?.detail)
      } else {
        toast.error(`Error signing contract `);
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Side effects
   */
  useEffect(() => {
    fetchContracts();
  }, []);

  /**
   * Pay for a contract
   */
  const payContract = async () => {
    try {
      await api.post(
        CREATE_CONTRACT_PAYMENT.replace("{contract_id}", contractToPay)
      );
      toast.success("Payment successful!");
    } catch (error) {
      if (error?.response?.data?.detail) {
        toast.error(error?.response?.data?.detail)
      } else {
        toast.error(`Error paying for contract `);
      }
    } finally {
      handleClosePayment();
    }
  };

  /**
   * Delete contract
   */
  const deleteContract = async () => {
    try {
      await api.delete(`${PROPERTY_CONTRACTS}${contractToRemove}/`);
      toast.success("User was deleted!");
      fetchContracts();
    } catch (error) {
      if (error?.response?.data?.detail) {
        toast.error(error?.response?.data?.detail)
      } else {
        toast.error(`Error deleting contract `);
      }
    } finally {
      handleClose();
      setContractToRemove(null);
    }
  };

  /**
   * Delete contract
   */
  const TerminateContract = async () => {
    try {
      await api.post(
        TERMINATE_CONTRACT.replace("{contract_id}", contractToTerminate)
      );
      toast.success("Contract has been terminated!");
      fetchContracts();
    } catch (error) {
      if (error?.response?.data?.detail) {
        toast.error(error?.response?.data?.detail)
      } else {
        toast.error(`Error terminating contract `);
      }
    } finally {
      handleCloseTerminate();
      setContractToTerminate(null);
    }
  };


  /**
   * Delete contract
   */
  const signContract = async () => {
    try {
      await api.post(
        CONTRACT_SIGN_REQUEST.replace("{contract_id}", contractToSign)
      );
      toast.success("A contract sign request has been sent and all parts of the contract has been notified!");
      await fetchContracts();
    } catch (error) {
      if (error?.response?.data?.detail) {
        toast.error(error?.response?.data?.detail)
      } else {
        toast.error(`Error signing contract `);
      }
    } finally {
      handleCloseSign();
      setContractToSign(null);
    }
  };

  const sendMassMail = async () => {
    try {
      await api.post(BULK_REMINDER_EMAIL);
      toast.success("Builk mail job has started");
    } catch (error) {
      if (error?.response?.data?.detail) {
        toast.error(error?.response?.data?.detail)
      } else {
        toast.error(`Error signing contract `);
      }
    } finally {
      handleCloseMail();
    }
  };

  /**
   * Contract card component
   * @TODO: mzekri move this to it's own component
   * @param {*} contract
   * @returns render
   */
  const ContractCard = (contract) => {
    return (
      <div className="card rounded shadow-none border">
        <div className="card-body">
          <div className="row  mb-3">
            <div className="col-md-4 d-inline-flex align-items-center ">
              <div className=" text-muted ">
                <i className="mdi mdi-file-outline icon-lg"/>
              </div>
              <div className="wrapper pl-sm-3">
                <div className="wrapper d-flex align-items-center mb-2 mr-2">
                  <h4 className="mb-0 font-weight-medium">
                    {contract?.tenant?.full_name}
                  </h4>
                </div>
                <div className="wrapper d-flex align-items-center font-weight-medium text-muted">
                  <i className="mdi mdi-map-marker-outline mr-2"/>
                  <p className="mb-0 text-muted">{contract?.address}</p>
                </div>
              </div>
            </div>
            <div className="col-sm-8 col-xl-2 d-flex align-items-center ">
              <p>
                <span className="text-muted">{t("Landlord")}</span> <br/>
                {contract.landlord.full_name}
              </p>
            </div>
            <div className="col-sm-8 col-xl-2   d-flex align-items-center ">
              <p>
                <span className="text-muted">{t("Start date")} </span> <br/>
                {format(new Date(contract.start_date), "MM/dd/yyyy")}
              </p>
            </div>
            <div className="col-sm-8 col-xl-2   d-flex align-items-center ">
              <p>
                <span className="text-muted">{t("End date")} </span> <br/>
                {format(new Date(contract.end_date), "MM/dd/yyyy")}
              </p>
            </div>
            <div className="col-sm-4 col-xl-2  align-self-center">
              <div className="wrapper d-flex justify-content-end">
                <Dropdown>
                  <Dropdown.Toggle variant="btn btn-primary">
                    <i className="mdi mdi-menu"/>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {is_landlord | is_tenant | permissions.includes("core.view_unitcontract") && (<Dropdown.Item
                      as={Link}
                      to={`/apartment-contracts/add/${contract.id}`}
                    >
                      {t("Details")}
                    </Dropdown.Item>)}
                    <Dropdown.Item
                      href={contract.document}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t("File")}
                    </Dropdown.Item>
                    <Dropdown.Item
                      href={CONTRACT_PDF_TEMPLATE.replace("{contract_id}", contract.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t("Contract")}
                    </Dropdown.Item>
                    {permissions.includes("core.change_unitcontract") && contract.state==="N" && (<><Dropdown.Item
                      onClick={() => {
                        setContractToSign(contract.id);
                        handleShowSign();
                      }}
                    >
                      {t("Sign")}
                    </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setContractToTerminate(contract.id);
                          handleShowTerminate();
                        }}
                      >
                        {t("Terminate")}
                      </Dropdown.Item></>)}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-3 col-lg-6 col-md-3 col-6">
              <div className="d-flex align-items-center justify-content-center flex-column flex-sm-row">
                {contract.state === "S" && (
                  <i className="mdi mdi-checkbox-marked-circle-outline text-primary mr-0 mr-sm-4 icon-lg mx-2"/>
                )}
                {contract.state === "N" && (
                  <i className="mdi mdi-checkbox-blank-circle-outline text-info mr-0 mr-sm-4 icon-lg mx-2"/>
                )}
                {contract.state === "T" && (
                  <i className="mdi mdi-pencil-off text-primary mr-0 mr-sm-4 icon-lg mx-2"/>
                )}
                <div className="wrapper text-center text-sm-left">
                  <p className="card-text mb-0 text-dark">{t("Status")}</p>
                  <div className="fluid-container">
                    <h3 className="mb-0 font-weight-medium text-dark">
                      {contract.state === "S" && t("Signed")}
                      {contract.state === "N" && t("Not signed")}
                      {contract.state === "T" && t("Terminated")}
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-lg-6 col-md-3 col-6">
              <div className="d-flex align-items-center justify-content-center flex-column flex-sm-row">
                <i className="mdi mdi-currency-usd text-primary mr-0 mr-sm-4 icon-lg mx-2"/>
                <div className="wrapper text-center text-sm-left">
                  <p className="card-text mb-0 text-dark">{t("Deposit")}</p>
                  <div className="fluid-container">
                    <h3 className="mb-0 font-weight-medium text-dark">
                      {contract.deposit}
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-lg-6 col-md-3 col-6">
              <div className="d-flex align-items-center justify-content-center flex-column flex-sm-row">
                <i className="mdi mdi-domain text-primary mr-0 mr-sm-4 icon-lg mx-2"/>
                <div className="wrapper text-center text-sm-left">
                  <p className="card-text mb-0 text-dark">
                    {t("Location price")}
                  </p>
                  <div className="fluid-container">
                    <h3 className="mb-0 font-weight-medium text-dark">
                      {contract.location_price}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>{t("Contract removal")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {t("Are you sure you want to delete this contract?")}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t("Close")}
          </Button>
          <Button variant="primary" onClick={deleteContract}>
            {t("Delete")}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Payment modal */}
      <Modal show={showPayment} onHide={handleClosePayment}>
        <Modal.Header>
          <Modal.Title>
            <Trans>Payment modal</Trans>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Modal.Body>
            {t(
              "Are you sure you want to create a new payment for this contract?"
            )}
          </Modal.Body>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosePayment}>
            <Trans>Cancel</Trans>
          </Button>
          <Button variant="primary" onClick={() => payContract()}>
            <Trans>Pay</Trans>
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Buld mail Modal */}
      <Modal show={showMail} onHide={handleCloseMail}>
        <Modal.Header>
          <Modal.Title>
            <Trans>Send mass email</Trans>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Modal.Body>
            {t(
              "Do you you want to send an email reminder for the users that did not pay their rent this month?"
            )}
          </Modal.Body>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseMail}>
            <Trans>Cancel</Trans>
          </Button>
          <Button onClick={() => sendMassMail()} variant="primary">
            <Trans>Send mass email</Trans>
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Terminate contract Modal */}
      <Modal show={showTerminate} onHide={handleCloseTerminate}>
        <Modal.Header>
          <Modal.Title>
            <Trans>Contract termination</Trans>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Modal.Body>
            {t("Are you sure you want to terminate this contract?")}
          </Modal.Body>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseTerminate}>
            <Trans>Cancel</Trans>
          </Button>
          <Button onClick={() => TerminateContract()} variant="primary">
            <Trans>Terminate</Trans>
          </Button>
        </Modal.Footer>
      </Modal>


      {/* Sign contract Modal */}
      <Modal show={showSign} onHide={handleCloseSign}>
        <Modal.Header>
          <Modal.Title>
            <Trans>Contract sign</Trans>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Modal.Body>
            {t("Are you sure you want to sign this contract?")}
          </Modal.Body>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseSign}>
            <Trans>Cancel</Trans>
          </Button>
          <Button onClick={signContract} variant="primary">
            <Trans>Sign</Trans>
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Title */}
      <div className="d-sm-flex justify-content-between align-items-start mb-3">
        <h2 className="text-dark font-weight-bold mb-2">{t("Contracts")}</h2>
        <div className="d-sm-flex justify-content-xl-between align-items-center mb-2">
          {permissions.includes("core.add_unitcontract") && (<><Button as={Link} to="/apartment-contracts/add"
                                                                       variant="primary">
            {t("Add new contract")}
          </Button></>)}
          {is_superuser && (<Button variant="danger" onClick={() => handleShowMail()}>
            {t("Send mass email")}
          </Button>)}
          <div className="ml-0 ml-md-3 mt-2 mt-lg-0">
            <Form.Control
              type="text"
              hidden
              className="form-control"
              placeholder="Search by user name"
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
            />
          </div>
        </div>
      </div>

      {/* Main card */}
      <div className="card">
        <div className="card-body">
          <div className="d-flex mb-4">
            <h5 className="mr-2 font-weight-semibold pr-2 mr-2"/>
          </div>
          <div className="row">
            {!loading ? (
              <>
                {data.map((contract) => {
                  return (
                    <div key={contract.id} className="col-md-12 mb-5 ">
                      {ContractCard(contract)}
                    </div>
                  );
                })}
              </>
            ) : (
              <div className="loader-demo-box">
                <div className="flip-square-loader mx-auto"/>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
