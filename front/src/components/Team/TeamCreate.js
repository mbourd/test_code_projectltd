import { Col, Row, Button, Form, Card } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import styles from './Team.module.css';
import { createRef, useContext, useEffect, useState } from "react";
import { service } from "../..";
import Player from '../Player/Player';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

const TeamCreate = () => {
  const translator = { team: useTranslation('team'), notif: useTranslation('notification') };
  const tteam = translator.team.t;
  const tnotif = translator.notif.t;
  const [listCountry, setListCountry] = useState([{ id: "", name: tteam('create.form.input.select.defaultOptionLabel') }]);
  const [input1HasError, setInput1HasError] = useState(false);
  const [input2HasError, setInput2HasError] = useState(false);
  const [isSending, setIsSending] = useState(false); // used to disable inputs while sending

  const refForm = createRef();

  useEffect(() => {
    service.country.getListCountry()
      .then(r => {
        setListCountry([{ id: "", name: tteam('create.form.input.select.defaultOptionLabel') }, ...r.data]);
      })
      .catch(e => {
        service.createNotification('error', `${e.code}: ${e?.response?.data?.detail}`);
      });
  }, []);

  const removeNewPlayer = (player) => {
    const index = refForm.current.values.players.indexOf(player);
    const tmp = [...refForm.current.values.players];
    if (index > -1) {
      tmp.splice(index, 1);
    }
    refForm.current.setFieldValue('players', [...tmp]);
  }

  const submitForm = (team, resetForm) => {
    service.team.createTeam(team)
      .then(r => {
        resetForm();
        service.createNotification('success', tnotif('success.createTeam'));
        setIsSending(false);
      })
      .catch(e => {
        service.createNotification('error', `${e.code}: ${e?.response?.data?.detail}`);
        setIsSending(false);
      });
  }

  return (
    <div className={styles['TeamCreate-component']}>
      <Row>
        <Col><h3>{tteam('create.title')}</h3></Col>
      </Row>
      <Row>
        <div className="">
          <Formik
            innerRef={refForm}

            // Initial values for each inputs
            initialValues={{
              name: "",
              country: "",
              moneyBalance: 0,
              players: [],
              playerName: "",
              playerSurname: "",
            }}

            // Rules to validate inputs
            validationSchema={() => Yup.object().shape({
              name: Yup.string().required(tteam('create.form.validationSchema.name')),
              country: Yup.string().required(tteam('create.form.validationSchema.country')),
              moneyBalance: Yup.number().positive().min(0).required(tteam('create.form.validationSchema.moneyBalance')),
              players: Yup.array().of(Yup.object().shape({
                name: Yup.string().required(tteam('create.form.validationSchema.players.name')),
                surname: Yup.string().required(tteam('create.form.validationSchema.players.surname')),
              })),
              playerName: Yup.string(),
              playerSurname: Yup.string(),
            })}

            // When submitting
            onSubmit={(values, { resetForm }) => {
              const _dataToSend = { ...values, country: parseInt(values.country) };

              if (input1HasError) {
                service.createNotification('error', tnotif('error.createTeamMissingName'));
              }
              if (input2HasError) {
                service.createNotification('error', tnotif('error.createTeamMissingSurname'));
              }
              if (input1HasError || input2HasError) return;

              delete _dataToSend.playerName;
              delete _dataToSend.playerSurname;

              setIsSending(true);
              // show a confirm modal
              service.confirmAlert(
                tteam('create.confirmAlert.confirmCreate.title'), tteam('create.confirmAlert.confirmCreate.message'),
                {
                  onYes: () => {
                    service.createNotification('info', tnotif('info.sendingData'));
                    submitForm(_dataToSend, resetForm);
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
                });
            }}
          >
            {({ values, handleSubmit, handleChange, errors, touched, setFieldValue, setErrors }) => (
              <Form>
                <Row>
                  <Col className={styles['col-form']}>
                    <Row><Col md={12}><h5>&nbsp;</h5></Col></Row>
                    <Row>
                      {/* Input team name */}
                      <Form.Group className="mb-6">
                        <Form.Label>{tteam('create.form.group.name.label')}</Form.Label>
                        <Form.Control
                          disabled={isSending}
                          name="name"
                          type="text"
                          placeholder=""
                          onChange={(e) => {
                            setFieldValue("name", e.target.value);
                          }}
                          value={values.name}
                          isInvalid={!!errors.name}
                        />
                        <small className="text-danger">
                          {errors.name}
                        </small>
                      </Form.Group>
                    </Row>
                  </Col>
                  <Col className={styles['col-form']}>
                    <Row><Col md={12}><h5>&nbsp;</h5></Col></Row>

                    {/* Input money balance */}
                    <Row>
                      <Form.Group className="mb-6">
                        <Form.Label>{tteam('create.form.group.moneyBalance.label')}</Form.Label>
                        <Form.Control
                          disabled={isSending}
                          name="moneyBalance"
                          type="number"
                          min="0"
                          onChange={(e) => {
                            setFieldValue("moneyBalance", e.target.value);
                          }}
                          value={values.moneyBalance}
                          isInvalid={!!errors.moneyBalance}
                        />
                        <small className="text-danger">
                          {errors.moneyBalance}
                        </small>
                      </Form.Group>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Col className={styles['col-form']}>
                    <Row><Col md={12}><h5>&nbsp;</h5></Col></Row>

                    {/* Input list country */}
                    <Row>
                      <Form.Group className="mb-3" controlId="country">
                        <Form.Label>{tteam('create.form.group.country.label')}</Form.Label>
                        <Form.Control
                          disabled={isSending}
                          name="country"
                          as="select"
                          onChange={handleChange("country")}
                          value={values.country}
                        >
                          {listCountry.map((option, index) => {
                            return (
                              <option
                                key={`option-country-${option.id}`}
                                value={option.id}>
                                {option.label || option.value || option.name}
                              </option>
                            );
                          })}
                        </Form.Control>
                        <small className="text-danger">
                          {errors.country}
                        </small>
                      </Form.Group>
                    </Row>
                  </Col>
                  <Col className={styles['col-form']}>
                    <Row><Col md={12}><h5>{tteam('create.form.group.player.label')}</h5></Col></Row>
                    <Row>
                      <Col>
                        {/* Input player name */}
                        <Form.Group className="mb-6">
                          <Form.Label>{tteam('create.form.group.player.name.label')}</Form.Label>
                          <Form.Control
                            disabled={isSending}
                            name="playerName"
                            type="text"
                            placeholder=""
                            onChange={(e) => {
                              const value = e.target.value;
                              setFieldValue("playerName", value);

                              // Check each name/surname values
                              if (value !== "" && values.playerSurname === "") {
                                setInput1HasError(false);
                                setInput2HasError(true);
                              }
                              if (value === "" && values.playerSurname !== "") {
                                setInput1HasError(true);
                                setInput2HasError(false);
                              }

                              // No in error name/surname inputs are empty or filled
                              if (value === "" && values.playerSurname === ""
                                || value !== "" && values.playerSurname !== "") {
                                setInput1HasError(false);
                                setInput2HasError(false);
                              }
                            }}
                            value={values.playerName}
                            isInvalid={errors.playerName}
                          />
                          <small className="text-danger">
                            {input1HasError && "Type the player name"}
                          </small>
                        </Form.Group>
                      </Col>
                      <Col>
                        {/* Input player surname */}
                        <Form.Group className="mb-6">
                          <Form.Label>{tteam('create.form.group.player.surname.label')}</Form.Label>
                          <Form.Control
                            disabled={isSending}
                            name="playerSurname"
                            type="text"
                            placeholder=""
                            onChange={(e) => {
                              const value = e.target.value;
                              setFieldValue("playerSurname", value);

                              // Check each name/surname values
                              if (values.playerName !== "" && value === "") {
                                setInput1HasError(false);
                                setInput2HasError(true);
                              }
                              if (values.playerName === "" && value !== "") {
                                setInput1HasError(true);
                                setInput2HasError(false);
                              }

                              // No in error name/surname inputs are empty or filled
                              if (values.playerName === "" && value === ""
                                || values.playerName !== "" && value !== "") {
                                setInput1HasError(false);
                                setInput2HasError(false);
                              }
                            }}
                            value={values.playerSurname}
                            isInvalid={!!errors.playerSurname}
                          />
                          <small className="text-danger">
                            {input2HasError && "Type the player surname"}
                          </small>
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group className="mb-6">
                          <Form.Label>&nbsp;</Form.Label>
                          <Form.Control
                            disabled={input1HasError || input2HasError || (values.playerSurname === "" && values.playerName === "") || isSending}
                            type="button"
                            variant="success"
                            value={tteam('create.form.group.player.button.add')}
                            onClick={() => {
                              if (input1HasError) {
                                service.createNotification('error', tnotif('error.createTeamMissingName'));
                              }
                              if (input2HasError) {
                                service.createNotification('error', tnotif('error.createTeamMissingSurname'));
                              }
                              // Must have a name & surname
                              // Add the new player to the players list
                              if (values.playerSurname !== "" && values.playerName !== "") {
                                const _players = [...values.players, { name: values.playerName, surname: values.playerSurname }];
                                setFieldValue('players', [..._players]);
                                setFieldValue("playerSurname", '');
                                setFieldValue("playerName", '');
                              }
                            }}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <hr />
                {/* List of new players */}
                <Row>
                  {values.players.map((player, index) => {
                    return (
                      <Col md={4} key={"form-new-player-" + index}>
                        <Card className={styles['create-new-player']}>
                          <Card.Body>
                            <Player player={player} />
                            <span onClick={() => removeNewPlayer(player)} className={styles['delete-cross']}>❌</span>
                          </Card.Body>
                        </Card>
                      </Col>
                    );
                  })}
                </Row>

                {/* Button to submit */}
                <Row>
                  <Button
                    disabled={isSending}
                    type="submit"
                    variant="info"
                    onClick={handleSubmit}
                  >🏆⚽ {tteam('create.form.input.submit.label')} ⚽🏆</Button>
                </Row>
              </Form>
            )}
          </Formik>
        </div>
      </Row>
    </div>
  )
}

export default TeamCreate;