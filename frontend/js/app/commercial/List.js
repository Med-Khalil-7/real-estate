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
  const [commercials, setCommercials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commercialToDelete, setCommercialToDelete] = useState(null);
  const handleShowDelete = () => setShowDeleteModal(true);
  const {permissions} = usePermission()


  /**
   * load commercials
   * @returns {Promise<void>}
   */
  const loadCommercials = async () => {
    try {
      setLoading(true)
      const params = {
        is_commercial: true
      }
      const {data} = await api.get(PROPERTY, {params})
      setCommercials(data)
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
    loadCommercials().then()
  }, []);


  const commercialCard = (property) => {
    return (
      <Card className="mr-3 mb-3" md={4} key={property.id} style={{width: '18rem'}}>
                {permissions.includes("core.delete_commercial") && (<CloseButton style={{position: "absolute",color:"white",left:"264px",borderRadius:"2px",background:"#6610f2",width:"24px",height:"24px"}} onClick={async () => {
          await setCommercialToDelete(property.id)
          handleShowDelete()
        }}/>)}
        <Link style={{ textDecoration: 'none' ,color: "#000"}} to={`/commercial/add/${property.id}`}>
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
          {t("Commercial store deletion")}
        </Modal.Header>
        <Modal.Body>
          {t("Are you sure you want to delete this commercial store?")}
        </Modal.Body>
        <Modal.Footer className="justify-content-end">
          <Button onClick={() => setShowDeleteModal(false)}>{t("Cancel")}</Button>
          <Button variant="danger" onClick={() => deleteCommercial()}>{t("Delete")}</Button>
        </Modal.Footer>
      </Modal>
    )
  }

  /**
   * delete commercial
   * @returns {Promise<void>}
   */
  const deleteCommercial = async () => {
    try {
      await api.delete(`${PROPERTY}${commercialToDelete}`)
      setShowDeleteModal(false)
      await loadCommercials()
    } catch (e) {
      if (e.response.data.detail) {
        toast.error(e.response.data.detail)
      } else {
        toast.error("Failed to remove commercial")
      }
    }
  }


  return (
    <div>
      {deletionModal()}
      <Card className="property-card">
        <Card.Body className="pb-3 px-5">

          <div className="d-flex justify-content-between align-items-center">
            <Card.Title>{t("Commercial stores")}</Card.Title>
            {permissions.includes("core.add_commercial") && (<div>
              <Button as={Link} to="/commercial/add" className="btn btn-primary align-self-center">
                {t("Add new commercial store")}
              </Button>
              <Button as={Link} to="/commercial/bulk/add" className="btn btn-primary align-self-center">
                {t("Bulk add new commercial stores")}
              </Button>
            </div>)}
          </div>
          {/* Card grid */}
          {!loading ? (
            <Row className="mt-4">
              {commercials.map((property) => {
                return commercialCard(property)
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
