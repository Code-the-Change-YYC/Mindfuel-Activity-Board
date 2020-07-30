import * as React from 'react';
import styles from './Home.module.css';
interface HomeProps {
    name: string,
}


const Home: React.FunctionComponent<HomeProps> = (props) => {
    return (
        <div>
            <h4>Hello, {props.name}</h4>
            <div className={styles.homeInfo} >
            <li><b>src/api -</b> holds all the functions related to API calls and its helpers </li>
            <li><b>src/components -</b> Shared components that are being used in the app more than once or are not on a screen </li>
            <li><b>src/res -</b> Resource path where we can place all our assets, colors, constants, dimens, env-config, themes and so on</li>
            <li><b>src/store -</b> Redux data that is shared in most or all screens (optional - depending on whether we have redux pattern)</li>
            <li><b>src/utils -</b> Helpers and utils that are used in multiple screens and components</li>
            <li><b>src/views -</b> All important screens/views in the project, each screen/view can have their own tests, hooks, store paths related to that the screen/view mainly, as well as, their own routes.ts, helpers.ts and styles.ts files. The idea here is having multiple sections under specific screens like tabs or steps (if applicable). If those tabs/steps have its own "sections", they may be a good fit to have its own space under views path. That way, we can keep the structure organised and prevent too deep and complex nested hierarchy</li>

            <p><b>Note: </b> application uses TypeScript and CSS modules. For demo, I have created home.tsx which uses TypeScript and home.module.css as CSS modules!</p>
            </div>
        </div>
    );
}

export default Home;