import React from 'react';
import {Button, Col, Row, Table} from 'react-bootstrap';
import {useTranslation} from 'react-i18next';

export default function Summary({previousStep, getValues}) {
  const {t} = useTranslation();

  const {properties} = getValues();

  return (
    <>
      <Row>
        <Col md={6}>
          <div>
            <h3 className="mb-4">{t("Summary")}</h3>
            {properties && properties.length} {t("Apartment")}.
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
            {properties &&
              properties.map((property, index) => (
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
