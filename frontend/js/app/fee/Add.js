import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import api from '../../api';
import { FEES } from '../../constants/api';
import { toast } from 'react-toastify';
import { Breadcrumb, Button, Row, Col } from 'reactstrap';
import { Form } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useHistory, useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';

export default function Add() {
  const { t } = useTranslation();
  const history = useHistory();

  /* Schema validation */
  const validationSchema = Yup.object().shape({
    contract_id: Yup.number().required('Contract id is required'),
    amount: Yup.number().required('Amount is required'),
    date: Yup.date().required('Date is required'),
    description: Yup.string().nullable(),
  });
  /* react-form-hooks stuff */
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    try {
      data['date'] = new Date(data['date']).toISOString().slice(0, 10); // Remove the time zone
      await api.post(`${FEES}`, data);
      toast.success('Contract payment added!');
      history.push('/fee/list');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title">{t('fees')}</h3>
      </div>
      <Card>
        <Card.Body>
          <Card.Title>{t('Fee')}</Card.Title>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="contract_id">
                <Form.Label>{t('Contract')}</Form.Label>
                <Form.Control
                  isInvalid={errors.contract_id}
                  {...register('contract_id')}
                  type="number"
                  placeholder="Enter contract ID"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.contract_id?.message}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} controlId="amount">
                <Form.Label>{t('Amount')}</Form.Label>
                <Form.Control
                  isInvalid={errors.amount}
                  {...register('amount')}
                  type="number"
                  placeholder="Enter payment amount"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.amount?.message}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} controlId="date">
                <Form.Label>{t('Date')}</Form.Label>
                <Controller
                  control={control}
                  name="date"
                  render={({ field }) => (
                    <>
                      <DatePicker
                        placeholderText="Select date"
                        className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                        onChange={(date) => field.onChange(date)}
                        selected={field.value ? new Date(field.value) : null}
                        isClearable
                        dateFormat="yyyy-MM-dd"
                      />
                    </>
                  )}
                />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Col} controlId="descriptipn">
                <Form.Label>{t('Description')}</Form.Label>
                <Form.Control
                  isInvalid={errors.description}
                  {...register('description')}
                  as="textarea"
                  placeholder="Enter description"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.amount?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Button variant="primary" type="submit">
              {t('Add')}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
