import React from 'react';
import { useLocation } from 'umi';
import DashboardLayout from './dashboard';
import DefaultLayout from './default';

const IndexPage: React.FC = ({ children }) => {
  const location = useLocation()
  const inDashboard = /^\/dashboard/.test(location.pathname)
  const Layout = inDashboard ? DashboardLayout : DefaultLayout

  return (
    <Layout>
      { children }
    </Layout>
  )
}

export default IndexPage
