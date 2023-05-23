// import logo from './logo.svg';
import './App.css';
import styles from './App.module.css';
import { Container, Row, Col } from "react-bootstrap";
import PublicRoutes from './config/route/PublicRoutes';
import { NotificationContainer } from 'react-notifications';
import { createContext, useEffect } from 'react';
import Menu from './components/Menu/Menu';

export const AppContext = createContext();

const App = ({ }) => {
  return (
    <AppContext.Provider value={{ }}>
      <div className="App">
        <header>
        </header>
        <Container id={styles['App-container']}>
          <Row>
            <Menu />
          </Row>
          <Row>
            <PublicRoutes />
          </Row>
        </Container>
        <footer>
        </footer>
        <NotificationContainer />
      </div>
    </AppContext.Provider>
  );
};

export default App;
