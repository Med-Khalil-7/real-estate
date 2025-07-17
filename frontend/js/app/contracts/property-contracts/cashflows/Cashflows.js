import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../../../api";
import { format } from "date-fns";

import {
  CONTRACT_CASHFLOWS,
  CREATE_CONTRACT_DISCOUNT,
  CREATE_CONTRACT_FEE,
  CREATE_CONTRACT_PAYMENT,
  CREATE_CONTRACT_REFUND,
  CREATE_CONTRACT_REVISION,
} from "../../../../constants/api";
import DatePicker from "react-datepicker";

import { Row, Col, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm, Controller } from "react-hook-form";

export default function Cashflows({ contract_id }) {
  const { t } = useTranslation();
  const [cashflows, setCashflows] = useState([]);

  /* transaction form hooks */
  const transacionSchema = Yup.object().shape({
    transaction_type: Yup.string().required("Amount is required"),
    amount: Yup.number().required("Amount is required"),
    date: Yup.date().required("Date is required"),
    description: Yup.string().required("Description is required"),
  });

  const today = new Date();
  const current_date = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    today.getHours(),
    today.getMinutes(),
    0,
    0
  );
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(transacionSchema),
    defaultValues: { date: current_date },
  });
  /* Default date */
  const [date, setDate] = useState(new Date());

  /* transaction form hooks */
  const revisionSchema = Yup.object().shape({
    rent: Yup.number().required("Rent is required"),
    provision: Yup.number().required("Amount is required"),
    description: Yup.string().required("Description is required"),
  });

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    reset: reset2,
    formState: { errors: errors2 },
  } = useForm({
    resolver: yupResolver(revisionSchema),
  });

  /**
   * Maps transaction url with it api url
   */
  const transactionApi = {
    discount: CREATE_CONTRACT_DISCOUNT,
    fee: CREATE_CONTRACT_FEE,
    payment: CREATE_CONTRACT_PAYMENT,
    refund: CREATE_CONTRACT_REFUND,
  };

  /**
   * Fetch contract cashflow
   */
  const fetchCashFlows = async () => {
    try {
      const res = await api.get(
        CONTRACT_CASHFLOWS.replace("{contract_id}", contract_id)
      );
      setCashflows([...res.data]);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchCashFlows();
  }, []);

  /**
   * Submit new transaction
   * @param {*} data
   */
  const onSubmitTransaction = async (data) => {
    try {
      data["date"] = data["date"].toISOString();
      const transaction_type = data.transaction_type;
      delete data.transaction_type;
      const url = transactionApi[transaction_type].replace(
        "{contract_id}",
        contract_id
      );
      await api.post(url, data);
      fetchCashFlows();
      toast.success("Transaction is successfull");
      reset();
    } catch (error) {
      toast.error(error?.response?.data?.detail);
    }
  };

  /**
   * Submit new revision
   * @param {*} data
   */
  const onSubmitRevision = async (data) => {
    try {
      const url = CREATE_CONTRACT_REVISION.replace(
        "{contract_id}",
        contract_id
      );
      await api.post(url, data);
      fetchCashFlows();
      toast.success("Revision is successfull");
      reset2();
    } catch (error) {
      toast.error(error?.response?.data?.detail);
    }
  };

  /**
   * Render new transaction type form card
   * @returns
   */
  const transactionCard = () => {
    return (
      <div className="card grid-margin">
        <div className="card-body">
          <h4 className="card-title">{t("New transaction")}</h4>
          <Form onSubmit={handleSubmit(onSubmitTransaction)}>
            <Row>
              <Form.Group as={Col} controlId="transaction_type">
                <Form.Label>{t("Type")}</Form.Label>
                <Form.Control
                  as="select"
                  isInvalid={errors.transaction_type}
                  {...register("transaction_type")}
                >
                  <option value="discount">{t("discount")}</option>
                  <option value="fee">{t("fee")}</option>
                  <option value="payment">{t("payment")}</option>
                  <option value="refund">{t("refund")}</option>
                </Form.Control>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Col} controlId="date">
                <Form.Label>{t("Date")}</Form.Label>
                <Controller
                  control={control}
                  name="date"
                  render={({ field }) => (
                    <>
                      <DatePicker
                        placeholderText="Select date"
                        timeInputLabel="Time:"
                        showTimeInput
                        dateFormat="yyyy-MM-dd HH:mm"
                        className={`form-control ${
                          errors.date ? "is-invalid" : ""
                        }`}
                        onChange={(date) => field.onChange(date)}
                        selected={field.value ? new Date(field.value) : null}
                      />
                      <div
                        className="invalid-feedback"
                        style={errors?.date ? { display: "block" } : {}}
                      >
                        {errors?.date && errors.date?.message}
                      </div>
                    </>
                  )}
                />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Col} controlId="amount">
                <Form.Label>{t("Amount")}</Form.Label>
                <Form.Control
                  isInvalid={errors.amount}
                  {...register("amount")}
                  type="number"
                  placeholder="Enter payment amount"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.amount?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Col} controlId="descriptipn">
                <Form.Label>{t("Description")}</Form.Label>
                <Form.Control
                  isInvalid={errors.description}
                  {...register("description")}
                  as="textarea"
                  placeholder="Enter description"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.description?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Button className="btn btn-primary btn-lg btn-block" type="submit">
              {t("Add")}
            </Button>
          </Form>
        </div>
      </div>
    );
  };

  /**
   * Render new transaction type form card
   * @returns
   */
  const revisionCard = () => {
    return (
      <div className="card grid-margin">
        <div className="card-body">
          <h4 className="card-title">{t("New revision")}</h4>
          <Form onSubmit={handleSubmit2(onSubmitRevision)}>
            <Row>
              <Form.Group as={Col} controlId="amount">
                <Form.Label>{t("Rent")}</Form.Label>
                <Form.Control
                  isInvalid={errors2.rent}
                  {...register2("rent")}
                  type="number"
                  placeholder="Enter payment rent"
                />
                <Form.Control.Feedback type="invalid">
                  {errors2.rent?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Col} controlId="amount">
                <Form.Label>{t("Provision")}</Form.Label>
                <Form.Control
                  isInvalid={errors2.provision}
                  {...register2("provision")}
                  type="number"
                  placeholder="Enter payment provision"
                />
                <Form.Control.Feedback type="invalid">
                  {errors2.provision?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Col} controlId="descriptipn">
                <Form.Label>{t("Description")}</Form.Label>
                <Form.Control
                  isInvalid={errors2.description}
                  {...register2("description")}
                  as="textarea"
                  placeholder="Enter description"
                />
                <Form.Control.Feedback type="invalid">
                  {errors2.description?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Button className="btn btn-primary btn-lg btn-block" type="submit">
              {t("Add")}
            </Button>
          </Form>
        </div>
      </div>
    );
  };

  const timeLineCard = () => {
    return (
      <div className="card">
        <div className="card-body ">
          <h4 className="card-title">{t("Cashflows")}</h4>
          <ul
            className="bullet-line-list"
            style={{ maxHeight: "51.5rem", overflowY: "auto" }}
          >
            {cashflows.map((flow, index) => (
              <li key={`flow-${index}`}>
                <h5 className="text-dark">{t(flow.description)}</h5>
                <dl className="row mb-1">
                  <dd className="col-sm-2 text-muted">{t("Amount")}: </dd>
                  <dd className="col-sm-3  ">{t(flow.amount)}</dd>
                </dl>
                <dl className="row mb-0">
                  <dd className="col-sm-2 text-muted">{t("Balance")}: </dd>
                  <dd className="col-sm-3">{flow.balance}</dd>
                </dl>
                <p className="text-muted">
                  <i className="mdi mdi-clock"></i> {flow.date}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };
  return (
    <>
      <div className="col-md-8 lg-8 sm-12 grid-margin">{timeLineCard()}</div>
      <div className="col-md-4 mg-4  xs-12 sm-12 ">
        {transactionCard()}
        {revisionCard()}
      </div>
    </>
  );
}
