import { Link } from "react-router-dom";

import TwoDice from "./two_dice.js";
import TrainingClock from "./training_clock.js";

export const pages = [
    MainPage,
    TwoDice,
    TrainingClock,
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
