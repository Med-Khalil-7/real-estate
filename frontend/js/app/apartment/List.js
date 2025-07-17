import React, {useEffect, useState} from 'react';

import {toast} from "react-toastify"
import api from "../../api";
import {PROPERTY} from "../../constants/api";
import {Button, Card, Dropdown, Modal, Row} from "react-bootstrap"
import {useTranslation} from "react-i18next"
import {Link} from "react-router-dom"
import usePermission from "../hooks/usePermission";


import CloseButton from 'react-bootstrap/CloseButton';
import "../global.css";

const List = () => {
  const {t} = useTranslation()
  const {permissions} = usePermission()
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [apartmentToDelete, setApartmentToDelete] = useState(null);
  const handleShowDelete = () => setShowDeleteModal(true);


  /**
   * load apartments
   * @returns {Promise<void>}
   */
  const loadApartments = async () => {
    try {
      setLoading(true)
      const params = {
        is_apartment: true
      }
      const {data} = await api.get(PROPERTY, {params})
      setApartments(data)
    } catch (e) {

      toast.error(e.response.data.detail)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Side effects
   */
  useEffect(() => {
    loadApartments().then()
  }, []);


  const apartmentCard = (property) => {
    return (
      <Card className="mr-3 mb-3" md={4} key={property.id} style={{width: '18rem'}}>
        {permissions.includes("core.delete_apartment") && (<CloseButton style={{position: "absolute",color:"white",left:"264px",borderRadius:"2px",background:"#6610f2",width:"24px",height:"24px"}} onClick={async () => {
          await setApartmentToDelete(property.id)
          handleShowDelete()
        }}/>)}
        <Link style={{ textDecoration: 'none' ,color: "#000"}} to={`/apartment/add/${property.id}`}>
        <Card.Img
          style={{width: "100%",}}
          variant="top"
          src={require("../../assets/images/samples/1280x768/1.jpg")}
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

  /**
   * delete apartment
   * @returns {Promise<void>}
   */
  const deleteApartment = async () => {
    try {
      await api.delete(`${PROPERTY}${apartmentToDelete}`)
      setShowDeleteModal(false)
      await loadApartments()
    } catch (e) {
      if (e.response.data.detail) {
        toast.error(e.response.data.detail)
      } else {
        toast.error("Failed to remove apartment")
      }
    }
  }


  return (
    <div>
      {deletionModal()}
      <Card className="property-card">
        <Card.Body className="pb-3 px-5">

          <div className="d-flex justify-content-between align-items-center">
            <Card.Title>{t("Apartments")}</Card.Title>

            {permissions.includes("core.add_apartment") && (<div>
              <Button as={Link} to="/apartment/add" className="btn btn-primary align-self-center">
                {t("Add new apartment")}
              </Button>
              <Button as={Link} to="/apartment/bulk/add" className="btn btn-primary align-self-center">
                {t("Bulk add new apartments")}
              </Button>
            </div>)}
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

export default List;
