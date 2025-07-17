import React, { useState, useEffect } from 'react';
import { Button, Modal, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { GROUPS } from '../../constants/api';
import api from '../../api';
import { Trans, useTranslation } from 'react-i18next';
import DataTable from 'react-data-table-component';

export default function GroupList() {
  /* Datatable + pagination hooks */
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [groupToRemove, setGroupToRemove] = useState(null);
  /* Pagination stuff */
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);

  /* TODO: mzekri-madar replce <Trans> with the t hook */
  /* Translation hook */
  const { t } = useTranslation();

  /* Table cols */
  const columns = [
    {
      selector: (row) => row.id,

      name: 'id',
      sortable: true,
    },
    {
      selector: (row) => row.name,
      name: t('Group name'),
      sortable: true,
    },

    {
      name: 'Actions',
      cell: (row) => {
        return (
          <div className="d-flex justify-content-center">
            <Link className="mt-auto p-2" to={`/groups/add/${row.id}`}>
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

  const fetchGroups = async (page) => {
    setLoading(true);

    try {
      const response = await api.get(`${GROUPS}`);
      setData(response.data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  /**
   * Handle Delete
   * @param {*} row
   */
  const handleDelete = (row) => {
    setGroupToRemove(row);
    handleShow();
  };

  const deleteGroup = async () => {
    try {
      await api.delete(`${GROUPS}${groupToRemove}/`);
      toast.success('Group was deleted!');
      fetchGroups();
    } catch (error) {
      toast.error(`Error deleting group ${error}`);
    } finally {
      handleClose();
      setGroupToRemove(null);
    }
  };

  return (
    <div>
      {/* Modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t('Group removal')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{t('Are you sure you want to delete this group?')}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t('Close')}
          </Button>
          <Button variant="primary" onClick={deleteGroup}>
            {t('Delete')}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Card */}
      <div className="col-lg-12 grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">
              <Trans>Group list</Trans>
            </h4>
            <p className="card-description"></p>

            <div className="d-flex align-items-end flex-column">
              <Link className="mt-auto p-2" to="/groups/add">
                <Button variant="primary">
                  <i className="mdi mdi-account-multiple-plus" /> Add new group
                </Button>
              </Link>
            </div>
            <DataTable
              columns={columns}
              data={data}
              progressPending={loading}
              pagination
              progressComponent={<Spinner animation="grow" size="lg" />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
