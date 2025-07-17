import React, {useEffect, useState} from "react";
import {Button, Modal, Spinner} from "react-bootstrap";
import {Link} from "react-router-dom";
import {toast} from "react-toastify";
import {useTranslation} from "react-i18next";
import {USERS} from "../../constants/api";
import api from "../../api";
import DataTable from "react-data-table-component";

export default function UsersList() {
  /* translation hook */
  const {t} = useTranslation();
  /* Pagination stuff */
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);

  const [data, setData] = useState([]);
  // modal stuff
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [userToRemove, setUserToRemove] = useState(null);

  /* Columns */
  const columns = [
    {
      selector: (row) => row.full_name,
      name: t("Name"),
      sortable: true,
    },
    {
      selector: (row) => row.email,
      name: t("E-mail"),
      sortable: true,
    },
    {
      name: t("Superuser"),
      sortable: true,
      cell: (row) => (
        <input type="checkbox" checked={row.is_superuser} disabled/>
      ),
    },
    {
      name: t("Landlord"),
      sortable: true,
      cell: (row) => (
        <input type="checkbox" checked={row.is_landlord} disabled/>
      ),
    },
    {
      name: t("Employee"),
      sortable: true,
      cell: (row) => (
        <input type="checkbox" checked={row.is_employee} disabled/>
      ),
    },
    {
      name: t("Tenant"),
      sortable: true,
      cell: (row) => <input type="checkbox" checked={row.is_tenant} disabled/>,
    },
    {
      name: t("Active"),
      sortable: true,
      cell: (row) => <input type="checkbox" checked={row.is_active} disabled/>,
    },

    {
      name: "Actions",
      cell: (row) => {
        return (
          <div className="d-flex justify-content-center">
            <Link className="mt-auto p-2" to={`/users/add/${row.id}`}>
              <Button variant="btn-icon" size="sm">
                <i className="mdi mdi-grease-pencil"/>
              </Button>
            </Link>
            <Button
              variant="btn-icon"
              size="sm"
              onClick={() => handleDelete(row.id)}
            >
              <i className="mdi mdi-delete"/>
            </Button>
          </div>
        );
      },
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  /* pagination handling */

  const fetchUsers = async (page) => {
    setLoading(true);

    try {
      const response = await api.get(`${USERS}`, {
        params: {
          limit: perPage,
          offset: page,
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
    fetchUsers(page);
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
    fetchUsers(0);
  }, []);

  /**
   * Handle Delete
   * @param {*} row
   */
  const handleDelete = (row) => {
    setUserToRemove(row);
    handleShow();
  };

  const deleteUser = async () => {
    try {
      await api.delete(`${USERS}${userToRemove}/`);
      toast.success("User was deleted!");
      fetchUsers();
    } catch (error) {
      console.log(error.response.data);
      toast.error(`Error deleting user ${error.response.data.detail}`);
    } finally {
      handleClose();
      setUserToRemove(null);
    }
  };

  return (
    <div>
      {/* Modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t("User removal")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {t("Are you sure you want to delete this user?")}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t("Close")}
          </Button>
          <Button variant="primary" onClick={deleteUser}>
            {t("Delete")}
          </Button>
        </Modal.Footer>
      </Modal>
      {/* card */}
      <div className="col-lg-12 grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">{t("Users list")}</h4>
            <p className="card-description"></p>

            <div className="d-flex align-items-end flex-column">
              <Link className="mt-auto p-2" to="/users/add">
                <Button variant="primary">
                  <i className="mdi mdi-account-multiple-plus"/>{" "}
                  {t("Add new user")}
                </Button>
              </Link>
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
