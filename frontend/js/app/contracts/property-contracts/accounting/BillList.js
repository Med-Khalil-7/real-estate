import React, {useEffect, useState} from "react";
import {Button, Modal} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import {toast} from "react-toastify";
import {Link} from "react-router-dom";
import api from "../../../../api";
import {BILL, PAY_BILL} from "../../../../constants/api";
import DataTable from "react-data-table-component";
import usePermission from "../../../hooks/usePermission";


function BillList({contractId}) {
  const {t} = useTranslation();
  const {is_tenant, is_landlord, permissions} = usePermission();


  /* Datatable */
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [billToPay, setBillToPay] = useState(null);
  /* Payment modal */
  const [showPayment, setShowPayment] = useState(false);
  const handleClosePayment = () => setShowPayment(false);
  const handleShowPayment = () => setShowPayment(true);
  /* Columns */
  const columns = [
    {
      selector: row => row.number,
      name: t("Number"),
      sortable: true
    },
    {
      selector: row => row.total_incl_tax,
      name: t("Total including tax"),
      sortable: true
    },
    {
      selector: row => row.total_excl_tax,
      name: t("Total including tax"),
      sortable: true
    },
    {
      selector: row => row.date_issued,
      name: t("Date issued "),
      sortable: true
    },
    {
      selector: row => row.date_dued,
      name: t("Date dued "),
      sortable: true
    },
    {
      name: t("Actions"),
      cell: row => {
        return (
          <div className="d-flex justify-content-between">
            <Link

              to={`/accounting/bill/add/${contractId}/${row.id}/`}
            >
              {is_tenant | is_landlord | permissions.includes("core.view_bill") && (<Button variant="btn" size="sm">
                {t("View")}
              </Button>)}
            </Link>
            {
              row.is_fully_paid ? (
                  <Button
                    disabled variant="btn btn-success" size="sm">
                    {t("Payed")}
                  </Button>
                ) :
                (
                  <Button
                    disabled={!permissions.includes("core.add_payment")}
                    onClick={() => {
                      setBillToPay(row.id);
                      handleShowPayment()
                    }} variant="btn btn-danger" size="sm">
                    Unpaid
                  </Button>
                )
            }
          </div>
        );
      },
      minWidth: "150px",
      ignoreRowClick: true,
      allowOverflow: true,
      button: true
    }
  ];


  /**
   * Pay for a bill
   */
  const payBill = async () => {
    try {
      await api.post(
        PAY_BILL.replace("{bill_id}", billToPay)
      );
      await fetchData(page)
      toast.success("Payment successful!");

    } catch (error) {
      toast.error(error?.response?.data?.detail);
    } finally {
      handleClosePayment();
    }
  };

  const handlePageChange = (page) => {
    fetchData(page).then();
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setLoading(true);

    try {
      const {data} = await api.get(`${BILL}`, {
        params: {
          contract_id: contractId,
          limit: newPerPage,
          offset: page,
        },
      });

      setData(data.results);
      setPage(page)
      setPerPage(newPerPage);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };


  /**
   * Load data
   */
  const fetchData = async (page) => {
    try {
      setLoading(true);
      const params = {
        contract_id: contractId,
        limit: perPage,
        offset: page,
      }
      const {data} = await api.get(BILL, {params});
      setData([...data.results]);
      setTotalRows(data.count);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchData(0).then()
  }, []);


  return (<>
      <Modal show={showPayment} onHide={handleClosePayment}>
        <Modal.Header>
          <Modal.Title>
            {t('Bill payment')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Modal.Body>
            {t(
              "Are you sure you want to create a payment for this bill?"
            )}
          </Modal.Body>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosePayment}>
            {t("Cancel")}
          </Button>
          <Button variant="primary" onClick={() => payBill()}>
            {t("Pay")}
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="col-lg-12 grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <h4 className="card-title">{t("Bills")}</h4>
              <div>
                {permissions.includes("core.add_bill") &&
                  (<Button
                    as={Link} to={`/accounting/bill/add/${contractId}/`}
                    className="btn btn-primary align-self-center">
                    {t("Add new bill")}
                  </Button>)}
              </div>
            </div>
            <DataTable
              columns={columns}
              data={data}
              progressPending={loading}
              pagination
              paginationServer
              paginationTotalRows={totalRows}
              onChangeRowsPerPage={handlePerRowsChange}
              onChangePage={handlePageChange}
              progressComponent={(<div className="loader-demo-box">
                <div className="flip-square-loader mx-auto"/>
              </div>)}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default BillList;
