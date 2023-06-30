import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { PackageForm } from './views/PackageForm';
import { PackagesView } from './views/PackagesView';
import { routePaths } from './routes';
import PackageDetails from './views/PackageDetails';
import PageLayout from './components/Layout/PageLayout';

const App = (): JSX.Element => {
  return (
    <Routes>
      <Route element={<PageLayout />}>
        <Route
          path={routePaths.packageList.generate()}
          element={<PackagesView />}
        />
        <Route
          path={routePaths.packageDetails.generate(':id')}
          element={<PackageDetails />}
        />
        <Route path={'/package'} element={<PackageForm />} />
      </Route>
    </Routes>
  );
};

export default App;
