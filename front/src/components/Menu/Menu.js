import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import styles from './Menu.module.css';
import { Fragment } from "react";

const Menu = ({ }) => {
  return (
    <div className={styles['Menu-component']}>
      <Row>
        <Col><Link to='/'>🏠 Index</Link></Col>
        <Col><Link to='/team/create'>🔰 Create Team</Link></Col>
        <Col><Link to='/team/sell'>💲 Sell players between teams</Link></Col>
      </Row>
    </div>
  );
}

export default Menu;