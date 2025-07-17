import React from 'react';
import {Button, Col, Row, Table} from 'react-bootstrap';
import {useTranslation} from 'react-i18next';

export default function Summary({previousStep, getValues}) {
  const {t} = useTranslation();
  const {apartments} = getValues();
  const {commercials} = getValues();
  const {villas} = getValues();

  return (
    <>
      <h3 className="mb-4">{t("Summary")}</h3>
      {(apartments && apartments.length > 0) ? (
        <Row className="border-top ">
          <Col className="mt-4" md={6}>
            <div>
              {apartments.length} {t("Apartments")}<br/>
            </div>
          </Col>
          <Col md={6} className="mt-4">
            <Table>
              <thead>
              <tr>
                <th>{t('Property name')}</th>
                <th>{t('Name')}</th>
                <th>{t('Surface area')}</th>
                <th className="text-right">{t('Number of rooms')}</th>
              </tr>
              </thead>
              <tbody>
              {apartments.map((property, index) => (
                <tr key={index}>
                  <td>{property.name}</td>
                  <td>{property.apartment.number}</td>
                  <td>{property.apartment.area}</td>
                  <td className="text-right">{property.apartment.room_count}</td>
                </tr>
              ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      ) : ""}
      {(commercials && commercials.length > 0) ? (
        <Row className="border-top ">
          <Col className="mt-4" md={6}>
            <div>
              {commercials.length} {t("Commercial store")}<br/>
            </div>
          </Col>
          <Col md={6} className="mt-4">
            <Table>
              <thead>
              <tr>
                <th>{t('Property name')}</th>
                <th>{t('Number')}</th>
                <th>{t('Surface area')}</th>
                <th className="text-right">{t('Number of rooms')}</th>
              </tr>
              </thead>
              <tbody>
              {commercials.map((property, index) => (
                <tr key={index}>
                  <td>{property.name}</td>
                  <td>{property.commercial.number}</td>
                  <td>{property.commercial.area}</td>
                  <td className="text-right">{property.commercial.room_count}</td>
                </tr>
              ))}
              </tbody>
            </Table>
          </Col>
        </Row>) : ""}
      {(villas && villas.length > 0) ? (
        <Row className="border-top ">
          <Col className="mt-4" md={6}>
            <div>
              {villas.length} {t("Villas")}<br/>
            </div>
          </Col>
          <Col md={6} className="mt-4">
            <Table>
              <thead>
              <tr>
                <th>{t('Property name')}</th>
                <th>{t('Number')}</th>
                <th>{t('Surface area')}</th>
                <th className="text-right">{t('Number of rooms')}</th>
              </tr>
              </thead>
              <tbody>
              {villas.map((property, index) => (
                <tr key={index}>
                  <td>{property.name}</td>
                  <td>{property?.villa?.number}</td>
                  <td>{property?.villa?.area}</td>
                  <td className="text-right">{property?.villa?.room_count}</td>
                </tr>
              ))}
              </tbody>
            </Table>
          </Col>
        </Row>) : ""}
      <div className="mt-5 d-flex justify-content-between">
        <Button className="btn btn-primary " onClick={previousStep}>
          {t('Previous')}
        </Button>
        <Button className="btn btn-primary " type="submit">
          {t('Submit')}
        </Button>

      </div>
    </>
  );
}
