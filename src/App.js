import { BrowserRouter as Router, Route, useParams } from "react-router-dom";

import MainPage from "./pages/main_page.js";
import TwoDice from "./pages/two_dice.js";

function App() {
  return (
    <div className="App">
      <Router>
        <Route exact path="/" component={MainPage} />
        <Route exact path="/2dice" component={TwoDice} />
      </Router>
    </div>
  );
}

export default App;
