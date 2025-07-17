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
            {properties && properties.length} {t("Commercial stores")}.
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
            {properties &&
              properties.map((property, index) => (
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
      </Row>
      <div className="mt-5 d-flex justify-content-between">
        <Button className="btn btn-primary " type="submit">
          {t('Submit')}
        </Button>
        <Button className="btn btn-primary " onClick={previousStep}>
          {t('Previous')}
        </Button>
      </div>
    </>
  );
}
