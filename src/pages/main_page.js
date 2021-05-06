import { Link } from "react-router-dom";

import TwoDice from "./two_dice.js";
import TrainingClock from "./training_clock.js";
import WhensMyTurn from "./whens_my_turn.js";
import VariableEditor from "./variable_editor.js";

export const pages = [
    MainPage,
    TwoDice,
    TrainingClock,
    WhensMyTurn,
    VariableEditor,
]

function MainPage() {
    return <div>
        {pages.map(page =>
            <div key={`link_${page.path}`}><Link to={`${page.path}`}>{page.title}</Link></div>
        )}
    </div >
}
MainPage.path = "";
MainPage.title = "Top";
export default MainPage;
