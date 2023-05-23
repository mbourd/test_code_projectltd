import { Col, Row, Button, Form, Card, Badge, ListGroup } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import styles from './Team.module.css';
import { createRef, useContext, useEffect, useState } from "react";
import { service } from "../..";
import Player from '../Player/Player';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useLocation } from "react-router";
import AnimatedNumber from "animated-number-react";
import TeamSellColumn from "./components/TeamSellColumn";

const TeamSell = ({ }) => {
  const refForm = createRef();
  const location = useLocation();
  const state = location.state;
  const [playersToSell1, setPlayersToSell1] = useState([]);
  const [playersToSell2, setPlayersToSell2] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [listTeams1, setListTeams1] = useState([{ id: "", name: "-- Choose --" }]);
  const [listTeams2, setListTeams2] = useState([{ id: "", name: "-- Choose --" }]);
  const [selectedIdTeam1, setSelectedIdTeam1] = useState("");
  const [selectedIdTeam2, setSelectedIdTeam2] = useState("");
  const [teamObjectRemovedListTeam1, setTeamObjectRemovedListTeam1] = useState(null);
  const [teamObjectRemovedListTeam2, setTeamObjectRemovedListTeam2] = useState(null);
  const [listPlayersAvailable1, setListPlayersAvailable1] = useState([]);
  const [listPlayersAvailable2, setListPlayersAvailable2] = useState([]);

  useEffect(() => {
    service.createNotification('info', 'Fetching teams list...');

    service.team.getListTeam()
      .then(r => {
        service.createNotification('success', 'Retrieved all teams');
        setListTeams1([{ id: "", name: "-- Choose --" }, ...r.data]);
        setListTeams2([{ id: "", name: "-- Choose --" }, ...r.data]);
      })
      .catch(e => {
        service.createNotification('error', 'Interval server error');
      });
  }, []);

  useEffect(() => {
    const tmp = [...listTeams2];

    if (teamObjectRemovedListTeam2 !== null) {
      tmp.push(teamObjectRemovedListTeam2);
      tmp.sort((a, b) => a.id - b.id);
      setListTeams2(tmp);
      setTeamObjectRemovedListTeam2(null);
    }

    if (selectedIdTeam1 !== "") {
      const tmpTeam1 = listTeams1.find(o => o.id === parseInt(selectedIdTeam1));
      setTeamObjectRemovedListTeam2(tmpTeam1);
      setListPlayersAvailable1([{ id: "", name: "-- Choose --" }, ...tmpTeam1.players]);
      const index = tmp.indexOf(tmpTeam1);
      tmp.splice(index, 1);
      setListTeams2(tmp);
    }

    setPlayersToSell1([]);
    refForm.current.values.playersToSell1 = [];
  }, [selectedIdTeam1]);

  useEffect(() => {
    const tmp = [...listTeams1];

    if (teamObjectRemovedListTeam1 !== null) {
      tmp.push(teamObjectRemovedListTeam1);
      tmp.sort((a, b) => a.id - b.id);
      setListTeams1(tmp);
      setTeamObjectRemovedListTeam1(null);
    }

    if (selectedIdTeam2 !== "") {
      const tmpTeam2 = listTeams2.find(o => o.id === parseInt(selectedIdTeam2));
      setTeamObjectRemovedListTeam1(tmpTeam2);
      setListPlayersAvailable2([{ id: "", name: "-- Choose --" }, ...tmpTeam2.players]);
      const index = tmp.indexOf(tmpTeam2);
      tmp.splice(index, 1);
      setListTeams1(tmp);
    }

    setPlayersToSell2([]);
    refForm.current.values.playersToSell2 = [];
  }, [selectedIdTeam2]);

  return (
    <div className={styles['TeamSell-component']}>
      <Row>
        <Col><h3>Team sell</h3></Col>
      </Row>
      <Row>
        <div className="">
          <Formik
            innerRef={refForm}
            initialValues={{
              idTeam1: selectedIdTeam1,
              idTeam2: selectedIdTeam2,
              playersToSell1: playersToSell1,
              playersToSell2: playersToSell2,
              playerToSell1: "",
              playerToSell2: "",
              price1: 0,
              price2: 0,
            }}
            validationSchema={() => Yup.object().shape({
              idTeam1: Yup.string().required("Please select a team"),
              idTeam2: Yup.string().required("Please select a team"),
              playersToSell1: Yup.array().of(
                Yup.object().shape({
                  id: Yup.number().required(),
                  price: Yup.number().positive().min(0).required(),
                  name: Yup.string().required(),
                  surname: Yup.string().required()
                })
              ),
              playersToSell2: Yup.array().of(
                Yup.object().shape({
                  id: Yup.number().required(),
                  price: Yup.number().positive().min(0).required(),
                  name: Yup.string().required(),
                  surname: Yup.string().required()
                })
              ),
            })}
            onSubmit={(values, { resetForm }) => {
              console.log(values.playersToSell1);
              console.log(values.playersToSell2);

              setIsSending(true);
              service.confirmAlert("Confirm to proceed sells ?", {
                onYes: () => {
                  service.createNotification('info', 'Sellings...');

                },
                onNo: () => {
                  setIsSending(true);
                },
                afterClose: () => {
                  setIsSending(false);
                }
              })
            }}
          >
            {({ values, handleSubmit, handleChange, errors, touched, setFieldValue, setErrors }) => (
              <Form>
                <Row>
                  <Col className={styles['col-form']}>
                    <Row><Col md={12}><h5>&nbsp;</h5></Col></Row>
                    <Row>
                      {/* Select team 1 */}
                      <Form.Group className="mb-6">
                        <Form.Label>Select a team</Form.Label>
                        <Form.Control
                          disabled={isSending}
                          name="idTeam1"
                          as="select"
                          onChange={(e) => {
                            const value = e.target.value;
                            if (values.playersToSell1.length) {
                              service.confirmAlert(
                                "The form contains players, confirm to change ?",
                                {
                                  onYes: () => {
                                    setFieldValue("idTeam1", value);
                                    setSelectedIdTeam1(value);
                                  },
                                }
                              );
                            } else {
                              setFieldValue("idTeam1", value);
                              setSelectedIdTeam1(value);
                            }
                          }}
                          value={values.idTeam1}
                        >
                          {listTeams1.map((option, index) => {
                            return (
                              <option
                                key={`option-idTeam1-${option.id}`}
                                value={option.id}>
                                {option.label || option.value || option.name}
                              </option>
                            );
                          })}
                        </Form.Control>
                        <small className="text-danger">
                          {errors.idTeam1}
                        </small>
                      </Form.Group>
                    </Row>
                  </Col>
                  <Col className={styles['col-form']}>
                    <Row><Col md={12}><h5>&nbsp;</h5></Col></Row>
                    <Row>
                      {/* Select team 2 */}
                      <Form.Group className="mb-6">
                        <Form.Label>Select a team</Form.Label>
                        <Form.Control
                          disabled={isSending}
                          name="idTeam2"
                          as="select"
                          onChange={(e) => {
                            const value = e.target.value;
                            if (values.playersToSell2.length) {
                              service.confirmAlert(
                                "The form contains players, confirm to change ?",
                                {
                                  onYes: () => {
                                    setFieldValue("idTeam2", value);
                                    setSelectedIdTeam2(value);
                                  },
                                }
                              );
                            } else {
                              setFieldValue("idTeam2", value);
                              setSelectedIdTeam2(value);
                            }
                          }}
                          value={values.idTeam2}
                        >
                          {listTeams2.map((option, index) => {
                            return (
                              <option
                                key={`option-idTeam2-${option.id}`}
                                value={option.id}>
                                {option.label || option.value || option.name}
                              </option>
                            );
                          })}
                        </Form.Control>
                        <small className="text-danger">
                          {errors.idTeam2}
                        </small>
                      </Form.Group>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <TeamSellColumn
                    teamObjectRemovedListTeam={teamObjectRemovedListTeam2}
                    isSending={isSending}
                    handleChange={handleChange}
                    values={values}
                    setListPlayersAvailable={setListPlayersAvailable1}
                    listPlayersAvailable={listPlayersAvailable1}
                    errors={errors}
                    setFieldValue={setFieldValue}
                    setPlayersToSell={setPlayersToSell1}
                    playersToSell={playersToSell1}
                    numCol={1}
                  />
                  <TeamSellColumn
                    teamObjectRemovedListTeam={teamObjectRemovedListTeam1}
                    isSending={isSending}
                    handleChange={handleChange}
                    values={values}
                    setListPlayersAvailable={setListPlayersAvailable2}
                    listPlayersAvailable={listPlayersAvailable2}
                    errors={errors}
                    setFieldValue={setFieldValue}
                    setPlayersToSell={setPlayersToSell2}
                    playersToSell={playersToSell2}
                    numCol={2}
                  />
                </Row>
                <Row>
                  <Button
                    disabled={isSending}
                    type="submit"
                    variant="info"
                    onClick={handleSubmit}
                  >🏆⚽ Proceed sells ⚽🏆</Button>
                </Row>
              </Form>
            )}
          </Formik>
        </div>
      </Row>
    </div>
  )
}

export default TeamSell;