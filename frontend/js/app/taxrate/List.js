import React, {useEffect, useState} from "react";
import {Button, Modal} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import {toast} from "react-toastify";
import {Link} from "react-router-dom";
import api from "../../api";
import {TAX_RATE} from "../../constants/api";
import DataTable from "react-data-table-component";


function List() {
  const {t} = useTranslation();
  /* Datatable */
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taxToDelete, setTaxToDelete] = useState(null);
  const handleShowDelete = () => setShowDeleteModal(true);


  /**
   * Handle Delete
   * @param {*} row
   */
  const handleDelete = (row) => {
    setTaxToDelete(row);
    handleShowDelete();
  };

  /* Columns */
  const columns = [
    {
      selector: row => row.name,
      name: t("Tax name"),
      sortable: true
    },
    {
      selector: row => row.rate,
      name: t("Tax rate"),
      sortable: true
    },
    {
      name: t("Actions"),
      cell: row => {
        return (
          <div className="d-flex justify-content-center">
            <Link
              className="mt-auto p-2"
              to={`/books/taxrates/add/${row.id}`}
            >
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
      button: true
    }
  ];


  /**
   * Load data
   */
  const fetchData = async () => {
    try {
      setLoading(true);
      const {data} = await api.get(TAX_RATE);
      setData([...data]);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData().then()
  }, []);


  /**
   * delete villa
   * @returns {Promise<void>}
   */
  const deleteTaxRate = async () => {
    try {
      await api.delete(`${TAX_RATE}${taxToDelete}`)
      setShowDeleteModal(false)
      await fetchData()
    } catch (e) {
      if (e.response.data.detail) {
        toast.error(e.response.data.detail)
      } else {
        toast.error("Failed to delete tax rate")
      }
    }
  }


  /**
   * deletion modal component
   * @returns {JSX.Element}
   */
  const deletionModal = () => {
    return (
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header>
          {t("Tax rate deletion")}
        </Modal.Header>
        <Modal.Body>
          {t("Are you sure you want to delete this tax rate?")}
        </Modal.Body>
        <Modal.Footer className="justify-content-end">
          <Button onClick={() => setShowDeleteModal(false)}>{t("Cancel")}</Button>
          <Button variant="danger" onClick={() => deleteTaxRate()}>{t("Delete")}</Button>
        </Modal.Footer>
      </Modal>
    )
  }

  return (
    <div>
      {deletionModal()}
      <div className="col-lg-12 grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <h4 className="card-title">{t("Tax rates")}</h4>
              <div>
                <Button as={Link} to="/books/taxrates/add" className="btn btn-primary align-self-center">
                  {t("Add new tax rate")}
                </Button>
              </div>
            </div>
            <DataTable
              columns={columns}
              data={data}
              progressPending={loading}
              progressComponent={(<div className="loader-demo-box">
                <div className="flip-square-loader mx-auto"/>
              </div>)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default List;
