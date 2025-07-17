/**
 * TODO: @mzekri-madar
 * - [x] tower cards
 * - [x] add new tower modal
 * - [] delete modal
 */

import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom"
import {useTranslation} from "react-i18next"
import {toast} from "react-toastify"
import {Button, Card, Col, Dropdown, Modal, Row} from "react-bootstrap"
import {TOWER} from "../../constants/api";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as Yup from "yup";

import api from "../../api";
import usePermission from "../hooks/usePermission";

import CloseButton from 'react-bootstrap/CloseButton';
import "../global.css";

const List = () => {
  const [towers, setTowers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [towerToDelete, setTowerToDelete] = useState(null);
  const handleShowDelete = () => setShowDeleteModal(true);
  const {t} = useTranslation()
  const {permissions} = usePermission()
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Building name is required"),
  })

  const {
    register,
    handleSubmit,
    formState: {errors}
  } = useForm({
    resolver: yupResolver(validationSchema),
    reValidateMode: "onChange"
  });

  /**
   * load towers
   * @returns {Promise<void>}
   */
  const loadTowers = async () => {
    try {
      setLoading(true)
      const {data} = await api.get(TOWER)
      setTowers(data)
    } catch (e) {
      toast.error(e.response.detail)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async data => {
    try {
      await api.post(TOWER, data)
      toast.success("Tower added")
      loadTowers().then()
      setShowAddModal(false)
    } catch (e) {
      toast.error(e.response.detail)
    }
  }

  /**
   * side effects
   */
  useEffect(() => {
    loadTowers().then()
  }, []);


  /**
   * tower card
   * @param tower
   */
  const towerCard = (tower) => {
    return (
      <Card className="mr-3 mb-3" md={3} key={tower.id} style={{width: '18rem'}}>
        {permissions.includes("core.delete_tower") && (<CloseButton style={{position: "absolute",color:"white",left:"264px",borderRadius:"2px",background:"#6610f2",width:"24px",height:"24px"}} onClick={async () => {
          await setTowerToDelete(tower.id)
          handleShowDelete()
        }}/>)}
        <Link style={{ textDecoration: 'none' ,color: "#000"}} to={`/tower/details/${tower.id}`}>
        <Card.Img
          style={{width: "100%", height: "10vw", objectFit: "cover"}}
          variant="top"
          src={require("../../assets/images/samples/1280x768/1.jpg")}
        />
        <Card.Body className="pb-0 px-3">
          <Card.Title> {tower.name}</Card.Title>
          <Card.Subtitle >ID {tower.id}</Card.Subtitle>
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
  const deleteTower = async () => {
    try {
      await api.delete(`${TOWER}${towerToDelete}`)
      setShowDeleteModal(false)
      await loadTowers()
    } catch (e) {
      if (e.response.data.detail) {
        toast.error(e.response.data.detail)
      } else {
        toast.error("Failed to remove apartment")
      }
    } finally {
      setShowDeleteModal(false)
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
          {t("Building deletion")}
        </Modal.Header>
        <Modal.Body>
          {t("Are you sure you want to delete this building?")}
        </Modal.Body>
        <Modal.Footer className="justify-content-end">
          <Button onClick={() => setShowDeleteModal(false)}>{t("Cancel")}</Button>
          <Button variant="danger" onClick={() => deleteTower()}>{t("Delete")}</Button>
        </Modal.Footer>
      </Modal>
    )
  }


  const addModal = () => {
    return (<Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <form onSubmit={handleSubmit(onSubmit)}>

          <Modal.Header closeButton={false}>
            <Modal.Title>
              {t("Add new tower")}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-row">
              <div className="form-group col-md-12">
                <label>{t("Name")}</label>
                <input
                  name="name"
                  type="text"
                  {...register("name")}
                  className={`form-control ${errors?.name ? "is-invalid" : ""}`}
                />
                <div className="invalid-feedback">{errors?.name?.message}</div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              {t("Cancel")}
            </Button>
            <Button type="submit" variant="primary">
              {t("Submit")}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    )
  }

  return (<>
    {/* Add Modal */}
    {addModal()}
    {deletionModal()}
    <Col className="grid-margin stretch-card" lg={12}>
      <Card className="property-card">
        <Card.Body className="pb-3 px-5">
          <div className="d-flex justify-content-between align-items-center">
            <Card.Title className="align-self-center">
              {t("Buildings list")}
            </Card.Title>
            {permissions.includes("core.add_tower") && (
              <Button className="btn btn-primary align-self-center" onClick={() => setShowAddModal(true)} to="">
                {t("Add new building")}
              </Button>)}
          </div>
          {/* Card grid */}
          {!loading ? (<Row className="mt-4">
            {towers.map((tower) => {
              return towerCard(tower)
            })}
          </Row>) : (<div className="loader-demo-box">
            <div className="flip-square-loader mx-auto"/>
          </div>)}
        </Card.Body>
      </Card>
    </Col>
  </>)
    ;
};

export default List;

