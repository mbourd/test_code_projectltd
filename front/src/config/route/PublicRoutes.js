import React from 'react';
import { Route, Routes } from 'react-router';
import TeamDetail from '../../components/Team/TeamDetail';
import MainPage from '../../components/MainPage/MainPage';
import TeamCreate from '../../components/Team/TeamCreate';
import TeamSell from '../../components/Team/TeamSell';

const routes = [
  { path: "/", component: MainPage },
  { path: "/team/show/:id", component: TeamDetail },
  { path: "/team/create", component: TeamCreate },
  { path: "/team/sell", component: TeamSell },
  { path: "*", component: MainPage }, // or 404 page
];

const PublicRoutes = ({ }) => {
  return (
    <>
      <Routes>
        {routes.map((route, index) => {
          return <Route path={route.path} key={index} element={<route.component />} />
        })}
      </Routes>
    </>
  );
};

export default PublicRoutes;