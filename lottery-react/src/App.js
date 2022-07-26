import { useEffect, useState } from 'react';
import lottery from './lottery';
import web3 from './web3';


function App() {
  const [manager, setManager] = useState('');
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState('');
  const [value, setValue] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => { 
    const fetchContractData = async () => {
      const lottery_managers = await lottery.methods.manager().call();
      const lottery_players = await lottery.methods.getPlayers().call();
      const lottery_balance = await web3.eth.getBalance(lottery.options.address);

      setManager(lottery_managers);
      setPlayers(lottery_players);
      setBalance(lottery_balance);
    }
    fetchContractData()
      .catch(console.error);
  });

  const onSubmit = async () => {
    const accounts = await web3.eth.getAccounts();

    setMessage('Waiting on transaction success...');

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(value, 'ether')
    });

    setMessage('You have been entered!');
  };

  const onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    setMessage('Waiting on transaction success...');

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    setMessage('A winner has been picked!');
  }

  return (
    <div className="App">
      <header className="App-header">
        <h2>Lottery Contract</h2>
        <p>
          This contract is managed by {manager}.
          There are currently {players.length} people entered competing to win {web3.utils.fromWei(balance, 'ether')} ether!
        </p>

        <hr />

        <form onSubmit={onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input
              value={value}
              onChange={event => setValue(event.target.value)}
            />
          </div>
          <button>Enter</button>
        </form>

        <hr />

        <h4>Ready to pick a winner?</h4>
        <button onClick={onClick}>Pick a winner!</button>

        <hr />

        <h1>{message}</h1>
      </header>
    </div>
  );
}

export default App;
