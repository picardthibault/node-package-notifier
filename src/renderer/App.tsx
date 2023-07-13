import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { PackageCreation } from './views/PackageCreation';
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
          path={routePaths.packageCreation.generate()}
          element={<PackageCreation />}
        />
        <Route
          path={routePaths.packageDetails.generate(':id')}
          element={<PackageDetails />}
        />
      </Route>
    </Routes>
  );
};

export default App;
