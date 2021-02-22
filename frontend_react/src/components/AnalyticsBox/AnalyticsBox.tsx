import React from 'react';
import styles from './AnalyticsBox.module.css';
import { Card, Image } from 'react-bootstrap';

type AnalyticsBox = {
    numberValue: string,
    textValue: string, 
    icon: string
}

const AnalyticsBox = (props: AnalyticsBox) => {

    return (
        <React.Fragment>
            <Card className={styles.card + " " + styles.mainWrapper}>
                <div className={styles.textWrapper}>
                    <div>
                        <span className={styles.totalNumber}>{props.numberValue}</span>
                    </div>
                    <div>
                        <span className={styles.totalText}>{props.textValue}</span>
                    </div>
                </div>
                <Image className={styles.icon} src={props.icon} />
            </Card>
        </React.Fragment>
    )
}

export default AnalyticsBox;