import { BrowserRouter as Router, Route, useParams } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';

import { pages } from "./pages/main_page.js";

const useStyles = makeStyles((theme) => ({
  root: {
    // marginTop: "18px",
    // display: "flex",
    // maxHeight: "100%",
    height: "100%",
  },
}));

function App() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Router>
        {pages.map(page =>
          <Route key={`route_${page.path}`} exact path={`/${page.path}`} component={page} />)}
      </Router>
    </div>
  );
}

export default App;
