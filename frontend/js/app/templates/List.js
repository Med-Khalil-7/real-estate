import React, { useEffect, useState } from "react";
import { Button, Spinner, Modal } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { Trans, useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import api from "../../api";
import { HTML_TEMPLATES } from "../../constants/api";

export default function List() {
  /* Translation */
  const { t } = useTranslation();
  /* Datatable */
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  /* Columns */
  const columns = [
    {
      selector: row => row.name,
      name: t("Template name"),
      sortable: true
    },
    {
      selector: row => row.template_type,
      name: t("Template type"),
      sortable: true
    },
    {
      name: t("Actions"),
      cell: row => {
        return (
          <div className="d-flex justify-content-center">
            <Link
              className="mt-auto p-2"
              to={`/settings/templates/edit/${row.id}`}
            >
              <Button variant="btn-icon" size="sm">
                <i className="mdi mdi-grease-pencil" />
              </Button>
            </Link>
            <Button
              variant="btn-icon"
              size="sm"
              onClick={() => handleDelete(row.id)}
            >
              <i className="mdi mdi-delete" />
            </Button>
          </div>
        );
      },
      ignoreRowClick: true,
      allowOverflow: true,
      button: true
    }
  ];

  // modal stuff
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [templateToRemove, setTemplateToRemove] = useState(null);

  /**
   * Load data
   */
  const fetchData = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(HTML_TEMPLATES);
      setData([...data]);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* Side effects */
  useEffect(() => {
    fetchData();
  }, []);


  /**
   * Handle Delete
   * @param {*} row
   */
  const handleDelete = row => {
    setTemplateToRemove(row);
    handleShow();
  };

  const deleteLandlord = async () => {
    try {
      await api.delete(`${HTML_TEMPLATES}/${templateToRemove}/`);
      toast.success("Template was deleted!");
      fetchData();
    } catch (error) {
      toast.error(`Error deleting Template ${error}`);
    } finally {
      handleClose();
      setTemplateToRemove(null);
    }
  };

  return (
    <div>
      {/* Modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            <Trans>Template removal</Trans>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Trans>Are you sure you want to delete this Template?</Trans>
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
      <div className="col-lg-12 grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <div className="d-sm-flex justify-content-between align-items-start mb-3">
              <h2 className="card-title">{t("Reporting templates")}</h2>
              <div className="d-sm-flex justify-content-xl-between align-items-center mb-2">
                <Button
                  as={Link}
                  to="/settings/templates/add"
                  variant="primary"
                  href="/"
                  disabled={data.length >= 3}
                >
                  {t("Add new template")}
                </Button>
              </div>
            </div>
            <p className="card-description" />
            <div className="d-flex align-items-end flex-column" />
            <DataTable
              columns={columns}
              data={data}
              progressPending={loading}
              progressComponent={<Spinner animation="grow" size="lg" />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
