import React from "react";
import { Card } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import api from "../../api";
import { REVISIONS } from "../../constants/api";
import { toast } from "react-toastify";
import { Form, Row, Col, Button } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useHistory } from "react-router-dom";
import DatePicker from "react-datepicker";

export default function Add() {
  const { t } = useTranslation();
  const history = useHistory();

  /* Schema validation */
  const validationSchema = Yup.object().shape({
    contract_id: Yup.number().required("Contract id is required"),
    rent: Yup.number().required("Rent is required"),
    provision: Yup.number().required("Provision is required"),
    end_date: Yup.date()
      .required("end_date is required")
      .min(Yup.ref("start_date"), "end date can't be before start date"),
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
      data["start_date"] = new Date(data["start_date"])
        .toISOString()
        .slice(0, 10); // Remove the time zone
      data["end_date"] = new Date(data["start_date"])
        .toISOString()
        .slice(0, 10); // Remove the time zone
      await api.post(`${REVISIONS}`, data);
      toast.success("Contract revision added!");
      history.push("/revision/list");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>Revision</Card.Title>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="contract_id">
              <Form.Label>Contract</Form.Label>
              <Form.Control
                isInvalid={errors.contract_id}
                {...register("contract_id")}
                type="number"
                placeholder="Enter contract ID"
              />
              <Form.Control.Feedback type="invalid">
                {errors.contract_id?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} controlId="rent">
              <Form.Label>Rent</Form.Label>
              <Form.Control
                isInvalid={errors.rent}
                {...register("rent")}
                type="number"
                placeholder="Enter Rent"
              />
              <Form.Control.Feedback type="invalid">
                {errors.amount?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} controlId="provision">
              <Form.Label>Provision</Form.Label>
              <Form.Control
                isInvalid={errors.provision}
                {...register("provision")}
                type="number"
                placeholder="Enter provision"
              />
              <Form.Control.Feedback type="invalid">
                {errors.provision?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row>
            <Form.Group as={Col} controlId="start_date">
              <Form.Label>Start date</Form.Label>
              <Controller
                control={control}
                name="start_date"
                render={({ field }) => (
                  <>
                    <DatePicker
                      placeholderText="Select date"
                      className={`form-control ${
                        errors.start_date ? "is-invalid" : ""
                      }`}
                      onChange={(date) => field.onChange(date)}
                      selected={field.value ? new Date(field.value) : null}
                      isClearable
                      dateFormat="yyyy-MM-dd"
                    />
                  </>
                )}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="end_date">
              <Form.Label>End date</Form.Label>
              <Controller
                control={control}
                name="end_date"
                render={({ field }) => (
                  <>
                    <DatePicker
                      placeholderText="Select date"
                      className={`form-control ${
                        errors.end_date ? "is-invalid" : ""
                      }`}
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

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
