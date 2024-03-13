import React, {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { Mutation, useQuery } from 'react-apollo';
import { GET_BALANCE, UPDATE_BALANCE } from '../../queries';
import Error from '../Error';
import Spinner from '../Spinner';
import CurrencyInput from '../UI/CurrencyInput';
import ReloadButton from '../UI/ReloadButton';

const initialState = {
  increment: '',
};

const BankBalance = forwardRef(({ session }, ref) => {
  // Track input value
  const [state, setState] = useState({ ...initialState });
  const { increment } = state;

  // Allow query to be refetched on launch
  const { data, loading, error, refetch } = useQuery(GET_BALANCE, {
    fetchPolicy: 'no-cache',
  });

  const reloadButton = useRef(null);

  const triggerReload = () => {
    try {
      refetch().catch(error => {
        console.log('Error', JSON.stringify(error, null, 2));
      });
    } catch (err) {
      console.log('No Refetch', err);
    }
  };

  useImperativeHandle(ref, () => ({
    triggerReload,
  }));

  const clearState = () => {
    setState({ ...initialState });
  };

  const handleChange = event => {
    const { name, value } = event.target;

    setState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleBalanceUpdate = (event, updateBalance) => {
    event.preventDefault();

    let inc = parseFloat(state.increment);

    if (inc === 0) return;

    if (
      !window.confirm(
        `${session.getCurrentUser.username}, ${
          event.target.name
        } £${inc.toFixed(2)}?`
      )
    ) {
      clearState();
      return;
    }

    if (event.target.name === 'subtract') {
      inc *= -1;
    }

    updateBalance({
      variables: {
        username: session.getCurrentUser.username,
        increment: inc,
      },
    })
      .then(() => {
        clearState();
      })
      .catch(error => {
        console.log('Error', JSON.stringify(error, null, 2));
      });
  };

  const handleClear = event => {
    clearState();
  };

  const handleReload = event => {
    triggerReload();
    reloadButton.current?.animate();
  };

  return (
    <div className="bank-balance">
      {loading && <Spinner />}
      {error && <Error error={error} />}
      <h4>{session && session.getCurrentUser && 'Luca’s '}Pocket Money</h4>
      <div className="balance-display">
        <h1 className="balance-lg">£{data && data.getBalance.toFixed(2)}</h1>

        <ReloadButton ref={reloadButton} onClick={handleReload} />
      </div>
      {session && session.getCurrentUser && (
        <div className="mt-3">
          <form className="update-balance">
            <CurrencyInput
              value={increment}
              handleChange={handleChange}
              handleClear={handleClear}
            />
            <Mutation
              mutation={UPDATE_BALANCE}
              refetchQueries={[{ query: GET_BALANCE }]}
            >
              {(updateBalance, { data, loading, error }) => (
                <div className="buttons">
                  <button
                    name="add"
                    className="btn btn-primary btn-lg ms-1"
                    onClick={event => handleBalanceUpdate(event, updateBalance)}
                    disabled={increment === '' || parseFloat(increment) === 0}
                  >
                    +
                  </button>
                  <button
                    name="subtract"
                    className="btn btn-primary btn-lg ms-1"
                    onClick={event => handleBalanceUpdate(event, updateBalance)}
                    disabled={increment === '' || parseFloat(increment) === 0}
                  >
                    -
                  </button>
                </div>
              )}
            </Mutation>
          </form>
        </div>
      )}
    </div>
  );
});

export default BankBalance;
