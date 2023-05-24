import { service } from '../..';
import { useEffect, useState } from "react";
import styles from './MainPage.module.css';
import PaginationTable from "../PaginationTable/PaginationTable";
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

const MainPage = ({ }) => {
  const translator = { main: useTranslation('main'), notif: useTranslation('notification') };
  const tmain = translator.main.t;
  const tnotif = translator.notif.t;
  const [listTeam, setListTeam] = useState([]);

  // Get all teams from backend
  // change country property to the country name
  // add new property totalPlayers
  useEffect(() => {
    service.createNotification('info', tnotif('info.fetchTeams'));
    service.team.getListTeam()
      .then(r => {
        service.createNotification('success', tnotif('success.fetchTeams'));
        const _listTeam = [];
        for (const team of r.data) {
          const _team = { ...team, "country": team.country.name, "totalPlayers": team.players.length };
          _listTeam.push(_team);
        }
        setListTeam([..._listTeam]);
      })
      .catch(e => {
        service.createNotification('error', `${e.code}: ${e?.response?.data?.detail}`);
      });
  }, []);

  return (
    <div className={styles['MainPage-component']}>
      <PaginationTable data={listTeam} sizePagination={10} atPage={0} />
    </div>
  );
}

export default MainPage;