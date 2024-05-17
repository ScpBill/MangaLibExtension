import React from 'react';


interface Props {
  onclick: () => void,
  text: string,
  icon?: React.ReactNode,
  variant?: 'primary' | 'success' | 'danger',
  light?: boolean,
}
const FullWidthButton: React.FC<Props> = ({ onclick: onsave, text, icon, variant, light }) => {
  return <button className={ `btn is-full-width ${variant ? `variant-${variant}`: ''} ${light ? 'is-filled' : ''}` } type='button' onClick={ onsave }>
    { icon }
    <span>{ text }</span>
  </button>;
};


export default FullWidthButton;
