import React, {useEffect, useState} from "react";
import {Button, Modal, Spinner} from "react-bootstrap";
import {Link} from "react-router-dom";
import {toast} from "react-toastify";
import {Trans, useTranslation} from "react-i18next";
import {USERS} from "../../constants/api";
import api from "../..//api";
import DataTable from "react-data-table-component";
import usePermission from "../hooks/usePermission";

export default function List() {
  /* translation hook */
  const {t} = useTranslation();
  const {permissions} = usePermission()
  /* Pagination stuff */
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);

  const [data, setData] = useState([]);
  // modal stuff
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [landlordToRemove, setLandlordToRemove] = useState(null);

  /* Columns */
  const columns = [
    {
      selector: (row) => row.first_name,
      name: t("First name"),
      sortable: true,
    },
    {
      selector: (row) => row.last_name,
      name: t("Last name"),
      sortable: true,
    },
    {
      selector: (row) => row.email,
      name: t("E-mail"),
      sortable: true,
    },
    {
      name: t("Is active"),
      sortable: true,
      cell: (row) => <input type="checkbox" checked={row.is_active} disabled/>,
    },
    {
      name: t("Is staff"),
      sortable: true,
      cell: (row) => <input type="checkbox" checked={row.is_staff} disabled/>,
    },
    {
      cell: (row) => row.last_login,
      name: t("Last login"),
      sortable: true,
    },
    {
      name: t("Actions"),
      cell: (row) => {
        return (
          <div className="d-flex justify-content-center">
            <Link className="mt-auto p-2" to={`/landlords/add/${row.id}`}>
              {permissions.includes("core.change_user") && (<Button variant="btn-icon" size="sm">
                <i className="mdi mdi-grease-pencil"/>
              </Button>)}
            </Link>
            {permissions.includes("core.delete_user") && (<Button
              variant="btn-icon"
              size="sm"
              onClick={() => handleDelete(row.id)}
            >
              <i className="mdi mdi-delete"/>
            </Button>)}
          </div>
        );
      },
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  /* pagination handling */

  const fetchLandlord = async (page) => {
    setLoading(true);

    try {
      const response = await api.get(`${USERS}`, {
        params: {
          limit: perPage,
          offset: page,
          is_landlord: true,
        },
      });
      setData(response.data.results);
      setTotalRows(response.data.count);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    fetchLandlord(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setLoading(true);

    try {
      const response = await api.get(`${USERS}`, {
        params: {
          limit: newPerPage,
          offset: page,
        },
      });

      setData(response.data.results);
      setPerPage(newPerPage);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLandlord(0);
  }, []);

  /**
   * Handle Delete
   * @param {*} row
   */
  const handleDelete = (row) => {
    setLandlordToRemove(row);
    handleShow();
  };

  const deleteLandlord = async () => {
    try {
      await api.delete(`${USERS}${landlordToRemove}/`);
      toast.success("Landlord was deleted!");
      fetchLandlord();
    } catch (error) {
      toast.error(`Error deleting landlord ${error}`);
    } finally {
      handleClose();
      setLandlordToRemove(null);
    }
  };

  return (
    <div>
      {/* Modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            <Trans>Landlord removal</Trans>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Trans>Are you sure you want to delete this landlord?</Trans>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            <Trans>Close</Trans>
          </Button>
          <Button variant="primary" onClick={deleteLandlord}>
            <Trans>Delete</Trans>
          </Button>
        </Modal.Footer>
      </Modal>
      {/* card */}
      <div className="col-lg-12 grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">
              <Trans>Landlord list</Trans>
            </h4>
            <p className="card-description"></p>

            <div className="d-flex align-items-end flex-column">
              {permissions.includes("core.add_user") && (<Link className="mt-auto p-2" to="/landlords/add">
                <Button variant="primary">{t("Add new user")}</Button>
              </Link>)}
            </div>
            <DataTable
              columns={columns}
              data={data}
              progressPending={loading}
              pagination
              paginationServer
              paginationTotalRows={totalRows}
              onChangeRowsPerPage={handlePerRowsChange}
              progressComponent={<Spinner animation="grow" size="lg"/>}
              onChangePage={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
