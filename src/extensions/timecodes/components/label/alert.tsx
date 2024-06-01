import React from 'react';


interface Props {
  text: string
}

export const GeneralInfoLabel: React.FC<Props> = ({ text }) => {
  return (
    <div className='alert size-sm is-info is-rounded section'>
      <div className='alert-text'>{ text }</div>
    </div>
  );
};
