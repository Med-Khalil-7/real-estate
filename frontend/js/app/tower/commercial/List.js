import React, {useEffect, useState} from 'react';
import api from "../../../api";
import {PROPERTY} from "../../../constants/api";
import {useTranslation} from "react-i18next"
import {toast} from "react-toastify"
import {Button, Card, Dropdown, Modal, Row} from "react-bootstrap"
import CommercialAdd from "./Add";
import usePermission from "../../hooks/usePermission";

import {Link} from "react-router-dom"
import CloseButton from 'react-bootstrap/CloseButton';
import "../../global.css";

const CommercialList = ({towerId}) => {
  const {t} = useTranslation()
  const [commercials, setCommercials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [commercialToDelete, setCommercialToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [propertyId, setPropertyId] = useState(null);
  const handleShowAdd = () => setShowAddModal(true);
  const handleShowDelete = () => setShowDeleteModal(true);
  const {permissions} = usePermission()

  /**
   * load commercials by tower id
   * @returns {Promise<void>}
   */
  const loadTowerCommercials = async () => {
    try {
      setLoading(true)
      const params = {
        commercial__tower_id: towerId
      }
      const {data} = await api.get(PROPERTY, {params})
      setCommercials(data)
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
    loadTowerCommercials()
  }, []);


  /**
   * delete commercial
   * @returns {Promise<void>}
   */
  const deleteCommercial = async () => {
    try {
      await api.delete(`${PROPERTY}${commercialToDelete}`)
      setShowDeleteModal(false)
      loadTowerCommercials()
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
   * commercial card component
   * @returns {JSX.Element}
   * @param property
   */
  const commercialCard = (property) => {
    return (
      <Card className="mr-3 mb-3" md={4} key={property.id} style={{width: '18rem'}}>
         {permissions.includes("core.delete_commercial") && (<CloseButton style={{position: "absolute",color:"white",left:"264px",borderRadius:"2px",background:"#6610f2",width:"24px",height:"24px"}} onClick={async () => {
          await setCommercialToDelete(property.id)
          handleShowDelete()
        }}/>)}
        <Link to="#" style={{ textDecoration: 'none' ,color: "#000"}} onClick={() => {
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


  return (
    <div>
      {deletionModal()}
      <Card className="property-card">
        <Card.Body className="pb-3 px-5">
          <CommercialAdd
            loadTowerCommercials={loadTowerCommercials}
            towerId={towerId}
            setShowAddModal={setShowAddModal}
            showAddModal={showAddModal}
            propertyId={propertyId}
            setPropertyId={setPropertyId}
          />
          <div className="d-flex justify-content-between align-items-center">
            <Card.Title>{t("Commercial stores")}</Card.Title>
            <Button className="btn btn-primary align-self-center" onClick={() =>{ setShowAddModal(true);setPropertyId(null)}} to="">
              {t("Add new commercial store")}
            </Button>
          </div>
          {/* Card grid */}
          {!loading ? (<Row className="mt-4">
            {commercials.map((property) => {
              return commercialCard(property)
            })}
          </Row>) : (<div className="loader-demo-box">
            <div className="flip-square-loader mx-auto"/>
          </div>)}
        </Card.Body>
      </Card>
    </div>
  )
    ;
};

export default CommercialList;
