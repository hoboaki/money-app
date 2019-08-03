import ClassNames from 'classnames';
import * as React from 'react';

import Balance from './Balance';
import * as Styles from './Body.css';
import Calendar from './Calendar';

class Body extends React.Component<any, any> {
  public render() {
    const rootClass = ClassNames(
      Styles.Root,
    );
    return (
      <div className={rootClass}>
        <Calendar />
        <Balance />
      </div>
    );
  }

}

export default Body;
