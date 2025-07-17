import React, {useEffect, useState} from 'react';
import api from "../../../api";
import {PROPERTY} from "../../../constants/api";
import {useTranslation} from "react-i18next"
import {toast} from "react-toastify"
import {Button, Card, Dropdown, Modal, Row} from "react-bootstrap"
import ApartmentAdd from "./Add";

import {Link} from "react-router-dom"
import usePermission from "../../hooks/usePermission";
import CloseButton from 'react-bootstrap/CloseButton';
import "../../global.css";

const ApartmentList = ({towerId}) => {
  const {t} = useTranslation()
  const {permissions} = usePermission()
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [apartmentToDelete, setApartmentToDelete] = useState(null);
  const [propertyId, setPropertyId] = useState(null);
  const handleShowAdd = () => setShowAddModal(true);
  const handleShowDelete = () => setShowDeleteModal(true);

  /**
   * load apartments by tower id
   * @returns {Promise<void>}
   */
  const loadTowerApartments = async () => {
    try {
      setLoading(true)
      const params = {
        apartment__tower_id: towerId
      }
      const {data} = await api.get(PROPERTY, {params})
      setApartments(data)
    } catch (e) {
      toast.error(e.response.detail)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Side effects
   */
  useEffect(() => {
    loadTowerApartments().then()
  }, []);


  /**
   * apartment card component
   * @returns {JSX.Element}
   * @param property
   */
  const apartmentCard = (property) => {
    return (
      <Card className="mr-3 mb-3" md={4} key={property.id} style={{width: '18rem'}}>
        {permissions.includes("core.delete_apartment") && (<CloseButton style={{position: "absolute",color:"white",left:"264px",borderRadius:"2px",background:"#6610f2",width:"24px",height:"24px"}} onClick={async () => {
          await setApartmentToDelete(property.id)
          handleShowDelete()
        }}/>)}
        <Link to="#"style={{ textDecoration: 'none' ,color: "#000"}} onClick={() => {
                      setPropertyId(property.id)
                      handleShowAdd()
                    }}>
        <Card.Img
          style={{width: "100%",}}
          variant="top"
          src={require("../../../assets/images/samples/1280x768/1.jpg")}
        />
        <Card.Body className="pb-0 px-3">
          <Card.Title> {property.name}</Card.Title>
          <Card.Subtitle >ID {property.id}</Card.Subtitle>
          <Card.Text>
            <i className="mdi mdi-home-map-marker mx-2 "/>
            {property?.address?.city} {property?.address?.state} {property?.address?.district}
            <br/>
            <i className="mdi mdi-account mx-2"/>
            {property?.owner_name}
          </Card.Text>
          <div className="d-flex align-items-center justify-content-end text-muted border-top pb-5 pt-2"/>
        </Card.Body>
        </Link>
      </Card>
    )
  }

  /**
   * delete apartment
   * @returns {Promise<void>}
   */
  const deleteApartment = async () => {
    try {
      await api.delete(`${PROPERTY}${apartmentToDelete}`)
      setShowDeleteModal(false)
      loadTowerApartments()
    } catch (e) {
      toast.error(e.response.detail)
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
          {t("Apartment deletion")}
        </Modal.Header>
        <Modal.Body>
          {t("Are you sure you want to delete this apartment?")}
        </Modal.Body>
        <Modal.Footer className="justify-content-end">
          <Button onClick={() => setShowDeleteModal(false)}>{t("Cancel")}</Button>
          <Button variant="danger" onClick={() => deleteApartment()}>{t("Delete")}</Button>
        </Modal.Footer>
      </Modal>
    )
  }

  return (
    <div>
      {deletionModal()}
      <Card className="property-card">
        <Card.Body className="pb-3 px-5">
          <ApartmentAdd
            loadTowerApartments={loadTowerApartments}
            propertyId={propertyId} towerId={towerId}
            setShowAddModal={setShowAddModal}
            showAddModal={showAddModal}
            setPropertyId={setPropertyId}
          />
          <div className="d-flex justify-content-between align-items-center">
            <Card.Title>{t("Apartments")}</Card.Title>
            <Button className="btn btn-primary align-self-center"
                    onClick={() => {
                      setShowAddModal(true)
                      setPropertyId(null)
                    }}>
              {t("Add new apartment")}
            </Button>
          </div>
          {/* Card grid */}
          {!loading ? (
            <Row className="mt-4">
              {apartments.map((property) => {
                return apartmentCard(property)
              })}
            </Row>
          ) : (
            <div className="loader-demo-box">
              <div className="flip-square-loader mx-auto"/>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default ApartmentList;
