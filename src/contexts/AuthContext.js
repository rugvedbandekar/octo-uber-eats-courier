import { Auth, DataStore } from 'aws-amplify';
import { createContext, useContext, useEffect, useState } from 'react';
import { Courier } from '../models';

const AuthContext = createContext({});

const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [dbCourier, setDbCourier] = useState(null);
  const sub = authUser?.attributes.sub;
  useEffect(() => {
    Auth.currentAuthenticatedUser({ bypassCache: true }).then(setAuthUser);
  }, []);

  useEffect(() => {
    DataStore.query(Courier, courier => courier.sub('eq', sub)).then(couriers =>
      setDbCourier(couriers[0]),
    );
  }, [sub]);
  const subUser = authUser?.attributes?.sub;
  return (
    <AuthContext.Provider value={{ authUser, dbCourier, subUser, setDbCourier }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;

export const useAuthContext = () => useContext(AuthContext);
