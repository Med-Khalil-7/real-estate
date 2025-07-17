import React, { useState, useEffect } from 'react';
import { Button, Modal, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { EMPLOYEE_CONTRACTS } from '../../../constants/api';
import { Trans } from 'react-i18next';
import api from '../../../api';
import DataTable from 'react-data-table-component';

export default function EmployeeContractList() {
  /* translation hook */
  const { t } = useTranslation();
  /* Pagination stuff */
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);

  const [data, setData] = useState([]);
  // modal stuff
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [contractToRemove, setContractToRemove] = useState(null);

  /* Columns */
  const columns = [
    {
      selector: (row) => row.name,
      name: t('Employee name'),
      sortable: true,
    },
    {
      selector: (row) => row.salary_payments,
      name: t('Salary payments'),
      sortable: true,
    },
    {
      cell: (row) => row.amount,
      name: t('Amount'),
      sortable: true,
    },
    {
      name: t('Actions'),
      cell: (row) => {
        return (
          <div className="d-flex justify-content-center">
            <Link className="mt-auto p-2" to={`/employees/contracts/add/${row.id}`}>
              <Button variant="btn-icon" size="sm">
                <i className="mdi mdi-grease-pencil" />
              </Button>
            </Link>
            <Button variant="btn-icon" size="sm" onClick={() => handleDelete(row.id)}>
              <i className="mdi mdi-delete" />
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

  const fetchContracts = async (page) => {
    setLoading(true);

    try {
      const response = await api.get(`${EMPLOYEE_CONTRACTS}`, {
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
    fetchContracts(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setLoading(true);

    try {
      const response = await api.get(`${EMPLOYEE_CONTRACTS}`, {
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
    fetchContracts(0);
  }, []);

  /**
   * Handle Delete
   * @param {*} row
   */
  const handleDelete = (row) => {
    setContractToRemove(row);
    handleShow();
  };

  const deleteContract = async () => {
    try {
      await api.delete(`${EMPLOYEE_CONTRACTS}${contractToRemove}/`);
      toast.success('User was deleted!');
      fetchContracts();
    } catch (error) {
      toast.error(`Error deleting user ${error}`);
    } finally {
      handleClose();
      setContractToRemove(null);
    }
  };

  return (
    <div>
      {/* Modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            <Trans>Contract removal</Trans>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Trans>Are you sure you want to delete this contract?</Trans>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            <Trans>Close</Trans>
          </Button>
          <Button variant="primary" onClick={deleteContract}>
            <Trans>Delete</Trans>
          </Button>
        </Modal.Footer>
      </Modal>
      {/* card */}
      <div className="col-lg-12 grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">{t('Contract list')}</h4>
            <p className="card-description"></p>

            <div className="d-flex align-items-end flex-column">
              <Link className="mt-auto p-2" to="/employees/contracts/add">
                <Button variant="primary">{t('Add new contract')}</Button>
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
              progressComponent={<Spinner animation="grow" size="lg" />}
              onChangePage={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
