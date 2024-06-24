import React from 'react';
import DangerSVG from '../../../../assets/svgs/danger.svg';
import PrimarySVG from '../../../../assets/svgs/primary.svg';


interface Props {
  type: string,
  message: string,
}

export const Toast: React.FC<Props> = ({ type, message }) => {
  function className () {
    switch (type) {
      case 'error':
        return 'toast-icon-danger';
      case 'info':
        return 'toast-icon-primary';
      default:
        return '';
    }
  }
  function icon () {
    switch (type) {
      case 'error':
        return <DangerSVG/>;
      case 'info':
        return <PrimarySVG/>
      default:
        return;
    }
  }
  return (
    <div className='toast-layout'>
      <div className='toast-lable'>
        <div className={`toast-icon ${className()}`}>
          { icon() }
        </div>
        <div>{ message }</div>
      </div>
    </div>
  )
}
