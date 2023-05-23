import { Card, Row, Col } from "react-bootstrap";
import styles from './Player.module.css';

const Player = ({ player }) => {
  return (
    <div className={styles['Player-component']}>
      <Card border="primary" className={styles['card']}>
        <Card.Body>
          {player.name} {player.surname}
        </Card.Body>
      </Card>
    </div>
  )
}

export default Player;