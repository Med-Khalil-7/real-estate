import React, { useState, useEffect } from "react";
import { Button, Modal, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { PROPERTIES } from "../../constants/api";
import api from "../../api";
import {  useTranslation } from "react-i18next";

export default function List() {
  /* Translation hook */
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [filtredBuildings, setFiltredBuildings] = useState([]);
  const [loading, setLoading] = useState([]);
  const fetchBuildings = async () => {
    setLoading(true);

    try {
      const response = await api.get(`${PROPERTIES}`);
      setData([...response.data]);
      setFiltredBuildings([...response.data]);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuildings();
  }, []);

  /**
   * Delete building
   */
  const deleteBuilding = async () => {
    try {
      await api.delete(`${PROPERTIES}${buildingToRemove}/`);
      fetchBuildings();
      toast.success("Building deleted!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setShow(false);
    }
  };

  /**
   * Modal
   */
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [buildingToRemove, setBuildingToRemove] = useState(null);

  /**
   * Handle Delete
   * @param {*} row
   */
  const handleDelete = (id) => {
    setBuildingToRemove(id);
    handleShow();
  };

  const filterBuildings = (text) => {
    const res = data.filter((building) => building.name.includes(text));
    setFiltredBuildings([...res]);
  };

  const BuildingCard = (building) => {
    return (
      <Card md={3} key={building.id} className="property-card">
        <Card.Img
        rounded

          style={{ width: "100%", height: "10vw", objectFit: "cover" }}
          variant="top"
          src={require("../../assets/images/samples/1280x768/1.jpg")}
        />
        <Card.Body>
          <Card.Title>
            {building.name}
            <Card.Subtitle>{building.property_type}</Card.Subtitle>{" "}
          </Card.Title>
          <span>
            <i className="mdi mdi-account mx-2"></i>
            {building.owner_name}
          </span>
          <br />
            <span>
              <i className="mdi mdi-home-map-marker mx-2 "></i>
              {building.address.city} {building.address.state}{" "}
              {building.address.district}
            </span>
        </Card.Body>
        <Card.Footer className="d-flex justify-content-between">
          <span>
            <Link to={`/buildings/add/${building.id}`}>
              <Button size="sm">
                <i className="mdi mdi-grease-pencil mx-2" /> {t("Edit")}
              </Button>
            </Link>
          </span>
          <span>
            <Button
              size="sm"
              variant="danger"
              onClick={() => handleDelete(building.id)}
            >
              <i className="mdi mdi-delete" /> {t("Delete")}
            </Button>
          </span>
        </Card.Footer>
      </Card>
    );
  };

  return (
    <div>
      {/* Modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t("Building removal")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {t("Are you sure you want to delete this building?")}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t("Close")}
          </Button>
          <Button variant="primary" onClick={deleteBuilding}>
            {t("Delete")}
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="col-lg-12 grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <h4 className="card-title">{t("Users list")}</h4>
              <Button className="btn btn-primary" as={Link} to="/properties/add">
                {t("Add new property")}
              </Button>
            </div>
            <p className="card-description"></p>
            {/* Card */}
            <div className="row mt-4">
              {/* Buildings */}
              {filtredBuildings.map((building) => {
                return BuildingCard(building);
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
