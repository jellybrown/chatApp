import './App.css';
import { useHistory, Switch, Route } from 'react-router-dom';
import ChatPage from './components/ChatPage/chatPage';
import LoginPage from './components/LoginPage/loginPage';
import RegisterPage from './components/RegisterPage/registerPage';
import { useEffect } from 'react';
import firebase from './firebase';
import { saveUser } from './redux/actions/user_action';
import { useDispatch, useSelector } from 'react-redux';

function App() {
  const history = useHistory();
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.user.isLoading);
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log(user);
        history.push('/');
        dispatch(saveUser(user));
      } else {
        history.push('/login');
      }
    });
  }, [dispatch, history]);

  if (isLoading) {
    return <div>loading중...</div>;
  } else {
    return (
      <Switch>
        <Route exact path="/" component={ChatPage} />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/register" component={RegisterPage} />
      </Switch>
    );
  }
}

export default App;
