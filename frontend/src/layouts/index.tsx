import React, {useEffect} from 'react';
import {useLocation} from 'umi';
import DashboardLayout from './dashboard';
import DefaultLayout from './default';
import {hotjar} from 'react-hotjar';

const IndexPage: React.FC = ({children}) => {
  const location = useLocation();
  const inDashboard = /^\/dashboard/.test(location.pathname);
  const Layout = inDashboard ? DashboardLayout : DefaultLayout;

  useEffect(() => {
    if (process.env.NODE_ENV === 'production' && process.env.HOTJAR_ID) {
      hotjar.initialize(Number(process.env.HOTJAR_ID), 6);
    }
  }, []);

  return <Layout>{children}</Layout>;
};

export default IndexPage;
