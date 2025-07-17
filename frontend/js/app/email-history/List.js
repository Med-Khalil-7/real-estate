import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import api from '../../api';
import { EMAIL_HISTORY } from '../../constants/api';
import { toast } from 'react-toastify';
import DataTable from 'react-data-table-component';
import { Spinner, Button, Modal } from 'react-bootstrap';

export default function List() {
  /* translation hook */
  const { t } = useTranslation();
  /* Pagination stuff */
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);

  const [data, setData] = useState([]);


  /* pagination handling */

  const fetchData = async (page) => {
    setLoading(true);

    try {
      const response = await api.get(`${EMAIL_HISTORY}`, {
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
    fetchData(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setLoading(true);

    try {
      const response = await api.get(`${EMAIL_HISTORY}`, {
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
    fetchData(0);
  }, []);


  /* Columns */
  const columns = [

    {
      selector: (row) => row.created,
      name: t('Date'),
      sortable: true,
    },
    {
      selector: (row) => row.sender.email,
      name: t('Sender'),
      sortable: true,
    },
    {
      selector: (row) => row.receiver.email,
      name: t('Receiver'),
      sortable: true,
      },
    {
      selector: (row) => t(row.delivery_state),
      name: t('Status'),
    },

  ];

  return (
    <>

      <Card>
        <Card.Body>
          <Card.Title>
            {t('Email history')}
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
