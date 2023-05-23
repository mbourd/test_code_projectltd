import { service } from '../..';
import { useEffect, useState } from "react";
import styles from './MainPage.module.css';
import PaginationTable from "../PaginationTable/PaginationTable";


const MainPage = ({ }) => {
  const [listTeam, setListTeam] = useState([]);

  useEffect(() => {
    service.createNotification('info', 'Fetching teams list...');
    service.team.getListTeam()
      .then(r => {
        service.createNotification('success', 'Retrieved all teams');
        const _listTeam = [];
        for (const team of r.data) {
          const _team = { ...team, "country": team.country.name, "totalPlayers": team.players.length };
          _listTeam.push(_team);
        }
        setListTeam([..._listTeam]);
      })
      .catch(e => {
        service.createNotification('error', 'Interval server error: ' + e.message);
      });
  }, []);

  return (
    <div className={styles['MainPage-component']}>
      <PaginationTable data={listTeam} sizePagination={10} atPage={0} />
    </div>
  );
}

export default MainPage;