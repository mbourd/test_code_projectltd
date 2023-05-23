import styles from './Team.module.css';
import { Badge, Card, Col, ListGroup, Row } from "react-bootstrap";
import { service } from '../..';
import { useLocation, useParams } from 'react-router';
import { useContext, useEffect, useState } from 'react';
import Player from '../Player/Player';
import AnimatedNumber from "animated-number-react";

const TeamDetail = ({ }) => {
  const { id } = useParams();
  const location = useLocation();
  const [team, setTeam] = useState({});
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    if (location.state === null) {
      service.team.getTeam(id)
        .then(r => {
          setTeam({ ...r.data, "country": r.data.country.name });
          setPlayers([...r.data.players]);
        })
        .catch(e => {
          service.createNotification('error', `${e.code}: ${e?.response?.data?.detail}`);
        });
    } else {
      setTeam(location.state);
      setPlayers(location.state.players);
    }
  }, []);

  return (
    <div className={styles['TeamDetail-component']}>
      <Row>
        <Col className={styles.col}>
          <Row><h3>{team.name}</h3></Row>
          <Row>
            <ListGroup variant='flush'>
              <ListGroup.Item
                as="li"
                className={styles['li-item'] + " d-flex justify-content-between align-items-start"}
              >
                <div className="ms-2 me-auto">
                  <div className="fw-bold">Total players ⚽</div>
                </div>
                <Badge bg="primary" pill>
                  <AnimatedNumber value={players.length}
                    formatValue={(value) => value.toFixed(0)} />
                </Badge>
              </ListGroup.Item>
              <ListGroup.Item
                as="li"
                className={styles['li-item'] + " d-flex justify-content-between align-items-start"}
              >
                <div className="ms-2 me-auto">
                  <div className="fw-bold">Money balance 📈</div>
                </div>
                <Badge bg="primary" pill>
                  <AnimatedNumber value={team.moneyBalance}
                    formatValue={(value) => value.toFixed(2)} />
                </Badge>
              </ListGroup.Item>
              <ListGroup.Item
                as="li"
                className={styles['li-item'] + " d-flex justify-content-between align-items-start"}
              >
                <div className="ms-2 me-auto">
                  <div className="fw-bold">Country 🌎</div>
                  {team.country}
                </div>
              </ListGroup.Item>
            </ListGroup>
          </Row>
        </Col>
        <Col>
          <Row><h3>Team players</h3></Row>
          <Row>
            {players.map((player, i) => {
              return <Player key={'player-' + player.id} player={player} />
            })}
          </Row>
        </Col>
      </Row>
    </div>
  )
}

export default TeamDetail;