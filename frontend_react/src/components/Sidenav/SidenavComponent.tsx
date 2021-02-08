import React from 'react';
import AnalyticsBox from '../../components/analyticsBox';
import styles from './Sidenav.module.css';

const logo = require("../../assets/mindfuel-logo.png")

const data = [
  {
    "numberValue": "56",
    "textValue": "Total Users",
    "icon": require("../../assets/users.svg")
  },
  {
    "numberValue": "3",
    "textValue": "Countries",
    "icon": require("../../assets/flag.svg")
  },
  {
    "numberValue": "16",
    "textValue": "Cities",
    "icon": require("../../assets/location.svg")
  }
]

const Sidenav = () => {
  const boxes = data.map(box => {
    return <AnalyticsBox numberValue={box.numberValue} textValue={box.textValue} icon={box.icon}></AnalyticsBox>
  })

  return (
    <div className={styles.sideNav}>
      <div className={styles.logoContainer}>
        <img className={styles.logo} src={logo} />
      </div>
      <div className={styles.analyticboxes}>
        {boxes}
      </div>
    </div>
  )
}

export default Sidenav;