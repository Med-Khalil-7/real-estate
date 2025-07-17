import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import api from '../../api';
import { REVISIONS } from '../../constants/api';
import { toast } from 'react-toastify';
import DataTable from 'react-data-table-component';
import { Spinner, Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function List() {
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
  const [revisionToRemove, setRevisionToRemove] = useState(null);

  /* pagination handling */

  const fetchRevisions = async (page) => {
    setLoading(true);

    try {
      const response = await api.get(`${REVISIONS}`, {
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
    fetchRevisions(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setLoading(true);

    try {
      const response = await api.get(`${REVISIONS}`, {
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
    fetchRevisions(0);
  }, []);

  /**
   * Handle Delete
   * @param {*} row
   */
  const handleDelete = (row) => {
    setRevisionToRemove(row);
    handleShow();
  };

  const deleteRevision = async () => {
    try {
      await api.delete(`${REVISIONS}${revisionToRemove}/`);
      toast.success('Revision was deleted!');
      fetchRevisions();
    } catch (error) {
      toast.error(`Error deleting revision ${error}`);
    } finally {
      handleClose();
      setRevisionToRemove(null);
    }
  };

  /* Columns */
  const columns = [
    {
      selector: (row) => row.id,
      name: t('Id'),
      sortable: true,
    },
    {
      selector: (row) => row.rent,
      name: t('Amount'),
      sortable: true,
    },
    {
      selector: (row) => row.rent,
      name: t('Rent'),
      sortable: true,
    },
    {
      selector: (row) => row.provision,
      name: t('Provision'),
      sortable: true,
    },
    {
      selector: (row) => row.start_date,
      name: t('Start date'),
      sortable: true,
    },
    {
      selector: (row) => row.end_date,
      name: t('End date'),
      sortable: true,
    },
    {
      selector: (row) => row.contract.contract_type,
      name: t('Contract type'),
      sortable: true,
    },
    {
      name: t('Actions'),
      cell: (row) => {
        return (
          <div className="d-flex justify-content-center">
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

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t('Revison removal')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{t('Are you sure you want to delete this revision?')}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t('Close')}
          </Button>
          <Button variant="primary" onClick={deleteRevision}>
            {t('Delete')}
          </Button>
        </Modal.Footer>
      </Modal>
      <Card>
        <Card.Body>
          <Card.Title>
            {t('Revisions')}
            {/*      <div className="d-flex align-items-end flex-column">
              <Link className="mt-auto p-2" to="/revision/add">
                <Button variant="primary">{t('Add new revisons')} </Button>
              </Link>
            </div> */}
          </Card.Title>

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
        </Card.Body>
      </Card>
    </>
  );
}
