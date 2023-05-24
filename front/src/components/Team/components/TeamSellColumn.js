import { Col, Row, Button, Form, Card, Badge, ListGroup, Popover, OverlayTrigger } from "react-bootstrap";
import styles from '../Team.module.css';
import 'react-confirm-alert/src/react-confirm-alert.css';
import AnimatedNumber from "animated-number-react";
import Player from "../../Player/Player";
import { useTranslation } from 'react-i18next';
import i18n from "../../../i18n";
import { service } from "../../..";

const TeamSellColumn = ({
  resultIncome = 0,
  resultBalance = 0,
  teamObjectRemovedListTeam = {},
  isSending = false,
  handleChange = () => { },
  values = {},
  setListPlayersAvailable = () => { },
  listPlayersAvailable = [],
  errors = {},
  setFieldValue = () => { },
  setPlayersToSell = () => { },
  playersToSell = [],
  numCol = 1
}) => {
  const translator = { team: useTranslation('team'), notif: useTranslation('notification') };
  const tteam = translator.team.t;
  const tnotif = translator.notif.t;

  return (
    <Col className={styles.col}>
      {teamObjectRemovedListTeam &&
        <>
          <Row><Col><h2>{teamObjectRemovedListTeam.name}</h2></Col></Row>
          <Row>
            <Col>
              <ListGroup variant='flush'>
                <ListGroup.Item
                  as="li"
                  className={styles['li-item'] + " d-flex justify-content-between align-items-start"}
                >
                  <div className="ms-2 me-auto">
                    <div className="fw-bold">{tteam('detail.moneyBalance')} 📈</div>
                  </div>
                  <Badge bg="primary" pill>
                    <AnimatedNumber
                      value={teamObjectRemovedListTeam.moneyBalance}
                      formatValue={(value) => value.toFixed(2)}
                    />
                  </Badge>
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <ListGroup variant='flush'>
                <ListGroup.Item
                  as="li"
                  className={styles['li-item'] + " d-flex justify-content-between align-items-start"}
                >
                  <div className="ms-2 me-auto">
                    <div className="fw-bold">{tteam('sell.resultIncome')} 💰</div>
                  </div>
                  <Badge bg={resultIncome < 0 ? "danger" : (resultIncome > 0 ? "success" : "warning")} pill>
                    <AnimatedNumber
                      value={resultIncome}
                      formatValue={(value) => value.toFixed(2)}
                    />
                  </Badge>
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <ListGroup variant='flush'>
                <ListGroup.Item
                  as="li"
                  className={styles['li-item'] + " d-flex justify-content-between align-items-start"}
                >
                  <div className="ms-2 me-auto">
                    <div className="fw-bold">{tteam('sell.resultBalance')} 📈</div>
                  </div>
                  <Badge bg={resultBalance < 0 ? "danger" : (resultBalance > 0 ? "success" : "warning")} pill>
                    <AnimatedNumber
                      value={resultBalance}
                      formatValue={(value) => value.toFixed(2)}
                    />
                  </Badge>
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <ListGroup variant='flush'>
                <ListGroup.Item
                  as="li"
                  className={styles['li-item'] + " d-flex justify-content-between align-items-start"}
                >
                  <div className="ms-2 me-auto">
                    <div className="fw-bold">{tteam('sell.totalPlayersToSell')}</div>
                  </div>
                  <Badge bg={"primary"} pill>
                    <AnimatedNumber
                      value={values['playersToSell' + numCol].length}
                      formatValue={(value) => value.toFixed(0)}
                    />
                  </Badge>
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              {/* Input list players available */}
              <Form.Group className="mb-3" controlId="country">
                <Form.Label>{tteam('sell.form.group.playerToSell.label')}</Form.Label>
                <Form.Control
                  disabled={isSending}
                  name={"playerToSell" + numCol}
                  as="select"
                  onChange={handleChange("playerToSell" + numCol)}
                  value={values['playerToSell' + numCol]}
                >
                  {listPlayersAvailable.map((option, index) => {
                    return (
                      <option
                        key={`option-listPlayersAvailable-${option.id}`}
                        value={option.id}>
                        {option.label || option.value || option.name}
                      </option>
                    );
                  })}
                </Form.Control>
                <small className="text-danger">
                  {errors['playerToSell' + numCol]}
                </small>
              </Form.Group>
            </Col>
            <Col>
              {/* Input price */}
              <Form.Group className="mb-6">
                <Form.Label>{tteam('sell.form.group.price.label')}</Form.Label>
                <Form.Control
                  disabled={isSending}
                  name={"price" + numCol}
                  type="number"
                  min="0"
                  onChange={(e) => {
                    setFieldValue("price" + numCol, e.target.value);
                  }}
                  value={values['price' + numCol]}
                  isInvalid={!!errors['price' + numCol]}
                />
                <small className="text-danger">
                  {errors['price' + numCol]}
                </small>
              </Form.Group>
            </Col>
            <Col>
              {/* Add to sell button 1 */}
              <Form.Group className="mb-6">
                <Form.Label>&nbsp;</Form.Label>
                <Form.Control
                  disabled={values['playerToSell' + numCol] === "" || isSending}
                  type="button"
                  variant="success"
                  value={tteam('sell.form.group.buttonAdd')}
                  onClick={() => {
                    if (values['price' + numCol] < 0) {
                      service.createNotification('error', tnotif('error.selltTeamNegativePrice'));
                      return;
                    }
                    if (values['playerToSell' + numCol] !== "") {
                      const _player = { ...listPlayersAvailable.find(p => p.id === parseInt(values['playerToSell' + numCol])), price: parseFloat(values['price' + numCol]) };
                      const _players = [...playersToSell, _player];
                      values['playersToSell' + numCol] = _players;
                      setPlayersToSell(_players);
                      setListPlayersAvailable([...listPlayersAvailable].filter(p => p.id !== _player.id))
                      setFieldValue("playerToSell" + numCol, '');
                      setFieldValue("price" + numCol, 0);
                    }
                  }}
                />
              </Form.Group>
            </Col>
          </Row>
          <hr />
          <Row>
            {/* Players to sell 1 */}
            {playersToSell.map((data, i) => {
              return (
                <Row key={'playerToSell-' + data.id}>
                  <Col md={8}>
                    <Player player={data} />
                  </Col>
                  <Col md={4} style={{ paddingRight: "0", paddingLeft: "0" }}>
                    <Card style={{ marginTop: "25px", marginBottom: "25px" }}>
                      <Card.Body>
                        <Badge bg="success" pill>
                          <AnimatedNumber
                            value={data.price}
                            formatValue={(value) => value.toFixed(2)}
                          />
                        </Badge>
                        {!isSending && <span className={styles['delete-cross']} onClick={() => {
                          delete data.price;
                          const tmp = [...listPlayersAvailable, data];
                          tmp.sort((a, b) => a.id - b.id);
                          values['playersToSell' + numCol] = values['playersToSell' + numCol].filter(p => p.id !== data.id);
                          setListPlayersAvailable(tmp);
                          setPlayersToSell(values['playersToSell' + numCol]);
                        }}>❌</span>}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              )
            })}
          </Row>
        </>
      }
    </Col >
  );
}
export default TeamSellColumn;