import React from "react";
import Web3 from "web3";
import ABI from "./contracts-api/abi.json";
import "./App.css";
import "./global.js"

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eth: "",
      nameLand: "",
      price: 0,
      landIndex: 0,
      stateSelected: false,
    };
  }

  setStateSelected = () => {
    this.setState({ stateSelected: true });
  };

  closeStateSelected = () => {
    this.setState({ stateSelected: false });
  };

  componentDidMount = () => {
    //test need to remove
    const web3 = new Web3(Web3.givenProvider);
    web3.eth.defaultAccount = web3.eth.accounts[0];
    const accounts = window.ethereum.enable();
    console.log("account", accounts);
  };

  render() {
    const { nameLand, price, landIndex } = this.state;
    const web3 = new Web3(Web3.givenProvider);

    web3.eth.defaultAccount = web3.eth.accounts[0];

    const RemixContract = new web3.eth.Contract(
      ABI,
      "0x124925456f69a8e114caf67182c6c42d906bdf7e"
    );

    const setNewEstate = async (e) => {
      e.preventDefault();
      const accounts = await window.ethereum.enable();
      const account = accounts[0];

      const gas = await RemixContract.methods
        .addLand(nameLand, price)
        .estimateGas({ from: account }, function (gasAmount) {
          console.log(gasAmount);
        });

      const result = await RemixContract.methods
        .addLand(nameLand, price)
        .send({ from: account, gas: gas });
      console.log(result);
    };

    const getLand = async (e) => {
      const accounts = await window.ethereum.enable();
      const account = accounts[0];
      const gas = await RemixContract.methods
        .addLand(nameLand, price)
        .estimateGas({ from: account }, function (gasAmount) {
          console.log(gasAmount);
        });
        
      RemixContract.methods
        .getLand(account, landIndex)
        .call()
        .then(console.log("success"));
    };

    return (
      <div className="home-wrapper">
        <form onSubmit={setNewEstate}>
          <div className="create-form">
              <input
                type="text"
                name="nameLand"
                value={nameLand}
                placeholder="Set Name of the house"
                className="inputCreate"
                onChange={(e) => this.setState({ nameLand: e.target.value })}
              />
              <input
                type="number"
                name="price"
                placeholder=" Set the price of the house"
                className="inputCreate"
                onChange={(e) => this.setState({ price: e.target.value })}
              />
            <button type="submit" className="btnInputCreate">Create</button>
          </div>
        </form>
        <form onSubmit={getLand}>
          <input
            type="number"
            name="index"
            value={landIndex}
            onChange={(e) => this.setState({ landIndex: e.target.value })}
          />
          <input type="submit" value="Chercher" />
        </form>
      </div>

      // <Router>
      //   <Switch>
      //     <Route path="/addHome">
      //       Add Home
      //     </Route>
      //     <Route path="/viewHome">
      //       View home
      //     </Route>
      //   </Switch>
      // </Router>
    );
  }
}
