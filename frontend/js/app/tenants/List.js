import React, {useEffect, useState} from "react";
import {Button, Modal} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import {Link} from "react-router-dom";
import {toast} from "react-toastify";
import {Trans, useTranslation} from "react-i18next";
import {USERS} from "../../constants/api";
import api from "../../api";
import {Avatar} from "@material-ui/core";
import {format} from "date-fns";
import usePermission from "../hooks/usePermission";

export default function TenantList() {
  /* translation hook */
  const {t} = useTranslation();
  /* Pagination stuff */
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState([]);
  // modal stuff
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [tenantToRemove, setTenantToRemove] = useState(null);
  const [filtredTenants, setFiltredTenants] = useState([]);
  const {permissions} = usePermission()
  /* pagination handling */

  const fetchTenant = async () => {
    setLoading(true);

    try {
      const response = await api.get(`${USERS}`, {
        params: {is_tenant: true},
      });
      setData([...response.data]);
      setFiltredTenants([...response.data]);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenant();
  }, []);

  /**
   * Handle Delete
   * @param {*} row
   */
  const handleDelete = (row) => {
    setTenantToRemove(row);
    handleShow();
  };

  const deleteTenant = async () => {
    try {
      await api.delete(`${USERS}${tenantToRemove}/`);
      toast.success("Tenant was deleted!");
      fetchTenant();
    } catch (error) {
      toast.error(`Error deleting tenant ${error}`);
    } finally {
      handleClose();
      setTenantToRemove(null);
    }
  };

  const filterTenant = (text) => {
    const res = data.filter((tenant) => {
      return tenant.name.includes(text);
    });
    console.warn(res);
    setFiltredTenants([...res]);
  };

  return (
    <>
      {/* Modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            <Trans>Tenant removal</Trans>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Trans>Are you sure you want to delete this tenant?</Trans>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            <Trans>Close</Trans>
          </Button>
          <Button variant="primary" onClick={deleteTenant}>
            <Trans>Delete</Trans>
          </Button>
        </Modal.Footer>
      </Modal>

      {/* card */}
      <div className="row">
        <div className="col-lg-12 mt-3 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title d-flex justify-content-between">
                <Trans>Tenant list</Trans>
              </h4>

              <div className="d-flex justify-content-between row mb-3">
                <div className="col-md-3">
                  <Form.Control
                    type="text"
                    placeholder={t("Search")}
                    onChange={(e) => filterTenant(e.target.value)}
                  />

                </div>
                {permissions.includes("core.add_user") && (<Button as={Link} to="/tenants/add">
                  {t("Add new tenant")}
                </Button>)}
              </div>


              {/* Tenant card */}
              {filtredTenants.map((user) => {
                return (
                  <div key={`tenant-${user.id}`}>
                    <div className="tickets-card row mx-0">
                      <div className="ticket-float col-lg-3  pr-0">
                        <Avatar>{user.first_name.charAt(0)}</Avatar>
                        <span className="mx-2">
                          {user.first_name} {user.last_name}
                        </span>
                      </div>
                      <div className="tickets-details col-lg-3">
                        {/* I know there is to much tenant */}
                        {user?.tenant_contracts.length === 0 ? (
                          <span>{t("Tenant has no contracts")}</span>
                        ) : (
                          ""
                        )}
                        {user?.tenant_contracts.map((contract) => {
                          return (
                            <div key={`contract-${contract.id}`}>
                              <div className="wrapper">
                                {t("Contract")} #{contract.id}
                              </div>
                              <div className="wrapper d-none d-md-block">
                                <span>
                                  {t("From")}{" "}
                                  {format(
                                    new Date(contract.start_date),
                                    "MM/dd/yyyy"
                                  )}{" "}
                                  {t("To")}{" "}
                                  {format(
                                    new Date(contract.end_date),
                                    "MM/dd/yyyy"
                                  )}{" "}
                                </span>
                              </div>

                              <div className="wrapper d-none d-md-block">
                                {t("property: ")}
                                {contract?.property?.name}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="tickets-details col-lg-3">
                        {/* I know there is to much tenant */}
                        <div className="form-check">
                          <label className="form-check-label">
                            <input
                              type="checkbox"
                              checked={user.is_active}
                              className="form-check-input"
                              disabled
                            />
                            <i className="input-helper"/>
                            {t("Active")}
                          </label>
                        </div>
                      </div>
                      <div className="d-flex justify-content-center">
                        {permissions.includes("core.change_user") && (<Link to={`/tenants/add/${user.id}`}>
                          <Button variant="btn-icon">
                            <i className="mdi mdi-grease-pencil"/>
                          </Button>
                        </Link>)}
                        {permissions.includes("core.delete_user") && (<Button
                          variant="btn-icon"
                          onClick={() => handleDelete(user.id)}
                        >
                          <i className="mdi mdi-delete"/>
                        </Button>)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
