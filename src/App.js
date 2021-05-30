import React, { useEffect, useState } from 'react';

import { ThreeIdConnect,  EthereumAuthProvider } from '@3id/connect';
import Web3 from 'web3';

// import provider detector
import detectEthereumProvider from '@metamask/detect-provider';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import './App.css';
import Home from './pages/Home';

function App(props) {
  const ceramic = props.ceramic;
  const [currentAccount, setCurrentAccount] = useState(null);
  const [did, setDid] = useState('');

  const [ethereum, setEthereum] = useState(null);
  const [web3, setWeb3] = useState(null);

  // checks that Metamask or an ethereum provider is installed
  // if installed, sets both bare Metamask provider and web3 object
  useEffect(() => {
    const detectProvider = async () => {
      const provider = await detectEthereumProvider();
      if (provider) {
        // the bare provider in window.ethereum provided by metamask
        setEthereum(provider);
        // the provider object wrapped in a web3 convenience library
        setWeb3(new Web3(provider));
        console.log('checked provider')
      }
    }
    
    detectProvider();
  }, [setWeb3, setEthereum]);

  // Authenticates DID with a DID provider instance in order to perform writes
  useEffect(() => {
    const authenticateDID = async () => {
      // request authentication from user's blockchain wallet
      const threeIdConnect = new ThreeIdConnect();
      const authProvider = new EthereumAuthProvider(ethereum, currentAccount);
      await threeIdConnect.connect(authProvider);

      // set DID instance on ceramic client
      const didProvider = threeIdConnect.getDidProvider();

      // not an optimal solution
      ceramic.did.setProvider(didProvider);
      
      // authenticate the DID (ceramic popup)
      // returns the did
      // THIS OPENS A POPUP ON EVERY REFRESH, TRY TO CONFIGURE SILENT LOGIN
      ceramic.did.authenticate()
        .then(setDid)
        .catch(console.error);
    }

    if (currentAccount) {
      authenticateDID();
    }
  }, [setDid, ceramic, currentAccount, ethereum]);

  return (
    <Router>
      <Switch>
        <Route exact path="/">
        {!did ? <Home web3={web3} ethereum={ethereum} setCurrentAccount={setCurrentAccount} did={did} /> : <Redirect push to="/dashboard" />}
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
