import {Route, Switch} from 'react-router-dom'
import LogIn from './components/LogIn'
import Home from './components/Home'
import MyProfile from './components/MyProfile'
import UserProfile from './components/UserProfile'
import NotFound from './components/NotFound'
import './App.css'

const App = () => (
  <>
    <Switch>
      <Route exact path="/login" component={LogIn} />
      <Route exact path="/" component={Home} />
      <Route exact path="/my-profile" component={MyProfile} />
      <Route exact path="/users/:id" component={UserProfile} />
      <Route component={NotFound} />
    </Switch>
  </>
)

export default App
