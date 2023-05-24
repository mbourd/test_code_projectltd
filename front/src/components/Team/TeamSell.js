import { Col, Row, Button, Form, Card, Badge, ListGroup } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import styles from './Team.module.css';
import { createRef, useContext, useEffect, useState } from "react";
import { service } from "../..";
import 'react-confirm-alert/src/react-confirm-alert.css';
import TeamSellColumn from "./components/TeamSellColumn";
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import { useLocation } from "react-router";

const TeamSell = ({ }) => {
  const translator = { team: useTranslation('team'), notif: useTranslation('notification') };
  const tteam = translator.team.t;
  const tnotif = translator.notif.t;
  const location = useLocation();
  const refForm = createRef();
  const [playersToSell1, setPlayersToSell1] = useState([]);
  const [playersToSell2, setPlayersToSell2] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [listTeams1, setListTeams1] = useState([{ id: "", name: tteam('sell.form.input.select.defaultOptionLabel') }]);
  const [listTeams2, setListTeams2] = useState([{ id: "", name: tteam('sell.form.input.select.defaultOptionLabel') }]);
  const [selectedIdTeam1, setSelectedIdTeam1] = useState("");
  const [selectedIdTeam2, setSelectedIdTeam2] = useState("");
  const [teamObjectRemovedListTeam1, setTeamObjectRemovedListTeam1] = useState(null);
  const [teamObjectRemovedListTeam2, setTeamObjectRemovedListTeam2] = useState(null);
  const [listPlayersAvailable1, setListPlayersAvailable1] = useState([]);
  const [listPlayersAvailable2, setListPlayersAvailable2] = useState([]);
  const [resultIncome1, setResultIncome1] = useState(0);
  const [resultIncome2, setResultIncome2] = useState(0);
  const [resultBalance1, setResultBalance1] = useState(0);
  const [resultBalance2, setResultBalance2] = useState(0);

  useEffect(() => {
    service.team.getListTeam()
      .then(r => {
        setListTeams1([{ id: "", name: tteam('sell.form.input.select.defaultOptionLabel') }, ...r.data]);
        setListTeams2([{ id: "", name: tteam('sell.form.input.select.defaultOptionLabel') }, ...r.data]);
        if (location.state?.team?.id) {
          setSelectedIdTeam1(location.state.team.id);
        }
      })
      .catch(e => {
        service.createNotification('error', `${e.code}: ${e?.response?.data?.detail}`);
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
      setListPlayersAvailable1([{ id: "", name: tteam('sell.form.input.select.defaultOptionLabel') }, ...tmpTeam1.players]);
      const index = tmp.indexOf(tmpTeam1);
      tmp.splice(index, 1);
      setListTeams2(tmp);
    }

    setPlayersToSell1([]);
    refForm.current.setFieldValue('playersToSell1', []);
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
      setListPlayersAvailable2([{ id: "", name: tteam('sell.form.input.select.defaultOptionLabel') }, ...tmpTeam2.players]);
      const index = tmp.indexOf(tmpTeam2);
      tmp.splice(index, 1);
      setListTeams1(tmp);
    }

    setPlayersToSell2([]);
    refForm.current.setFieldValue('playersToSell2', []);
  }, [selectedIdTeam2]);

  useEffect(() => {
    const income1 = playersToSell1.reduce((income, player) => income + player.price, 0)
      - playersToSell2.reduce((invest, player) => invest + player.price, 0);
    setResultIncome1(income1);
    setResultBalance1(teamObjectRemovedListTeam2?.moneyBalance + income1);

    const income2 = playersToSell2.reduce((income, player) => income + player.price, 0)
      - playersToSell1.reduce((invest, player) => invest + player.price, 0);
    setResultIncome2(income2);
    setResultBalance2(teamObjectRemovedListTeam1?.moneyBalance + income2);
  }, [playersToSell1, playersToSell2]);

  return (
    <div className={styles['TeamSell-component']}>
      <Row>
        <Col><h3>{tteam('sell.title')}</h3></Col>
      </Row>
      <Row>
        <div className="">
          <Formik
            innerRef={refForm}
            initialValues={{
              idTeam1: location.state?.team?.id ? location.state.team.id : selectedIdTeam1,
              idTeam2: selectedIdTeam2,
              playersToSell1: playersToSell1,
              playersToSell2: playersToSell2,
              playerToSell1: "",
              playerToSell2: "",
              price1: 0,
              price2: 0,
            }}
            validationSchema={() => Yup.object().shape({
              idTeam1: Yup.string().required(tteam('sell.form.validationSchema.idTeam1')),
              idTeam2: Yup.string().required(tteam('sell.form.validationSchema.idTeam2')),
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
            onSubmit={(values, { resetForm, setFieldValue }) => {
              const _values = { ...values, idTeam1: parseInt(values.idTeam1), idTeam2: parseInt(values.idTeam2) };

              if (resultBalance1 < 0) {
                service.createNotification("error", tnotif('error.sellTeamNegativeBalance').replace('{{teamName}}', teamObjectRemovedListTeam2.name));
                return;
              }
              if (resultBalance2 < 0) {
                service.createNotification("error", tnotif('error.sellTeamNegativeBalance').replace('{{teamName}}', teamObjectRemovedListTeam1.name));
                return;
              }
              if (_values.idTeam1 === _values.idTeam2) {
                service.createNotification("error", tnotif('error.sellTeamSameNotAllowed'));
                return;
              }
              if (_values.playersToSell1.length === 0 && _values.playersToSell2.length === 0) {
                service.createNotification("error", tnotif('error.sellTeamNoPlayers'));
                return;
              }

              delete _values.price1;
              delete _values.price2;
              delete _values.playerToSell1;
              delete _values.playerToSell2;

              setIsSending(true);
              service.confirmAlert(
                tteam('sell.confirmAlert.confirmSell.title'), tteam('sell.confirmAlert.confirmSell.message'),
                {
                  onYes: () => {
                    service.createNotification('info', tnotif('info.sendingData'));
                    service.team.teamProceedSells(_values)
                      .then(r => {
                        const _team1 = { ...r.data[0] };
                        const _team2 = { ...r.data[1] };
                        const _listTeams1 = listTeams1.filter(t => t.id !== _team1.id);
                        const _listTeams2 = listTeams2.filter(t => t.id !== _team2.id);
                        _listTeams1.push(_team1);
                        _listTeams1.sort((a, b) => a.id - b.id);
                        _listTeams2.push(_team2);
                        _listTeams2.sort((a, b) => a.id - b.id);
                        setFieldValue('playersToSell1', []);
                        setFieldValue('playersToSell2', []);
                        setPlayersToSell1([]);
                        setPlayersToSell2([]);
                        setListTeams1(_listTeams1);
                        setListTeams2(_listTeams2);
                        setTeamObjectRemovedListTeam2(_team1);
                        setTeamObjectRemovedListTeam1(_team2);
                        setListPlayersAvailable1([...listPlayersAvailable1.filter(p => p.id === ""), ..._team1.players]);
                        setListPlayersAvailable2([...listPlayersAvailable2.filter(p => p.id === ""), ..._team2.players]);
                        service.createNotification('success', tnotif('success.sellTeamPlayers'));
                        setIsSending(false);
                      })
                      .catch(e => {
                        service.createNotification('error', `${e.code}: ${e?.response?.data?.detail}`);
                        setIsSending(false);
                      });
                  },
                  onNo: () => {
                    setIsSending(false);
                  },
                  onClickOutside: () => {
                    setIsSending(false);
                  },
                  onKeypressEscape: () => {
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
                        <Form.Label>{tteam('sell.form.group.idTeam1.label')}</Form.Label>
                        <Form.Control
                          disabled={isSending}
                          name="idTeam1"
                          as="select"
                          onChange={(e) => {
                            const value = e.target.value;
                            if (values.playersToSell1.length) {
                              service.confirmAlert(
                                tteam('sell.confirmAlert.confirmChange.title'), tteam('sell.confirmAlert.confirmChange.message'),
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
                        <Form.Label>{tteam('sell.form.group.idTeam2.label')}</Form.Label>
                        <Form.Control
                          disabled={isSending}
                          name="idTeam2"
                          as="select"
                          onChange={(e) => {
                            const value = e.target.value;
                            if (values.playersToSell2.length) {
                              service.confirmAlert(
                                tteam('sell.confirmAlert.confirmChange.title'), tteam('sell.confirmAlert.confirmChange.message'),
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
                    resultIncome={resultIncome1}
                    resultBalance={resultBalance1}
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
                    resultIncome={resultIncome2}
                    resultBalance={resultBalance2}
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
                  >💵⚽ {tteam('sell.form.input.submit.label')} ⚽💵</Button>
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