import { BrowserRouter as Router, Route, useParams } from "react-router-dom";

import { pages } from "./pages/main_page.js";

function App() {
  return (
    <div className="App">
      <Router>
        {pages.map(page =>
          <Route key={`route_${page.path}`} exact path={`/${page.path}`} component={page} />)}
      </Router>
    </div>
  );
}

export default App;
