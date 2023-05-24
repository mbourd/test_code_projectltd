import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import styles from './Menu.module.css';
import { Fragment } from "react";
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

const Menu = ({ }) => {
  const { t } = useTranslation('menu');

  return (
    <div className={styles['Menu-component']}>
      <Row>
        <Col><Link to='/'>🏠 {t('mainPage')}</Link></Col>
        <Col><Link to='/team/create'>🔰 {t('teamCreate')}</Link></Col>
        <Col><Link to='/team/sell'>💲 {t('teamSell')}</Link></Col>
      </Row>
    </div>
  );
}

export default Menu;