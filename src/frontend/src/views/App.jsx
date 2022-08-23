import React, { useState, createContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Profile from './Profile';
import SignUp from './SignUp';
import SignIn from './SignIn';
import PageNotFound from './PageNotFound';
// eslint-disable-next-line import/no-cycle
import Header from '../components/Header';
import Home from './Home';
import PrivateRoute from '../components/PrivateRoute';
import Cart from './Cart';
// eslint-disable-next-line import/no-cycle
import Product from './Product';

export const AppContext = createContext();

function App() {
  const [cartUpdateFlag, setCartUpdateFlag] = useState(false);
  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const appContextValue = { cartUpdateFlag, setCartUpdateFlag };
  return (
    <AppContext.Provider value={appContextValue}>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/category/:catalog" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/product">
            <Route path=":id" element={<Product />} />
          </Route>
          <Route
            path="/profile"
            element={(
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
          )}
          />
          <Route path="/cart" element={<Cart />} />
          <Route path="/" element={<Home />} />
          <Route path="/*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
