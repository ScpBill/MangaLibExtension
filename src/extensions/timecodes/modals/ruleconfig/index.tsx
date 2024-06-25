import React, { MouseEventHandler, useState } from 'react';
import { AdvanceTimecodeInRule } from './timecode';
import { AdvanceTimelineInRule } from './timeline';
import CrossSVG from '../../../../assets/svgs/cross.svg';
import AddSVG from '../../../../assets/svgs/add.svg';
import SaveSVG from '../../../../assets/svgs/save.svg';
import TrashSVG from '../../../../assets/svgs/trash.svg';


interface Props {
  anime_slug_url: string,
  data: ExtensionRuleConfig,
  onupdate: (value: ExtensionRuleConfig) => void,
  onremove: () => void,
  onclose: () => void,
  onleave: () => void,
}

export const RuleConfigModalPopup: React.FC<Props> = ({ anime_slug_url, data, onupdate, onremove, onclose, onleave }) => {

  const [ hover, setHover ] = useState(false);
  const [ name, setName ] = useState(data.display.name ?? '');
  const [ image, setImage ] = useState(data.display.img?.url);
  const [ gif, setGif ] = useState(data.display.gif?.url);
  const [ local, setLocal ] = useState(!!data.onlyOnTitle);
  const [ insertions, setInsertions ] = useState(data.insertions);
  const [ overrides, setOverrides ] = useState(data.overrides);

  const handleSaveEvent: MouseEventHandler<HTMLButtonElement> = () => {
    onupdate({
      display: {
        name,
        img: image ? { url: image } : null,
        gif: gif ? { url: gif } : null,
      },
      insertions,
      overrides,
      onlyOnTitle: local ? anime_slug_url : null,
      titles: data.titles,
    });
    onclose();
  };

  const handleRemoveEvent: MouseEventHandler<HTMLButtonElement> = () => {
    onremove();
    onclose();
  }

  function spanGenerate (insertion: ExtensionRuleConfig['insertions'][0]) {
    const vars = (a: string, b: string) => insertion.position === 'before' ? a : b;
    switch (insertion.regarding) {
      case 'start':
        return vars('До начала', 'В начале');
      case 'end':
        return vars('В конце', 'После конца');
      case 'opening':
        return vars('Перед опенингом', 'После опенинга');
      case 'ending':
        return vars('Перед эндингом', 'После эндинга');
      case 'ost':
        return vars('Перед OSTом', 'После OSTа');
      case 'compilation':
        return vars('Перед компиляцией', 'После компиляции');
      case 'splashScreen':
        return vars('Перед заставкой', 'После заставки');
    }
  }

  function getPositionAndRegardingFromTimeline(index: number): { position: 'after' | 'before', regarding: 'start' | 'end' | 'opening' | 'ost' | 'ending' } {
    switch (index) {
      case 0:
        return { position: 'after', regarding: 'start' };
      case 1:
        return { position: 'before', regarding: 'opening' };
      case 2:
        return { position: 'after', regarding: 'opening' };
      case 3:
        return { position: 'before', regarding: 'ost' };
      case 4:
        return { position: 'after', regarding: 'ost' };
      case 5:
        return { position: 'before', regarding: 'ending' };
      case 6:
        return { position: 'after', regarding: 'ending' };
      case 7:
        return { position: 'before', regarding: 'end' };
      default:
        return { position: 'after', regarding: 'end' };
    }
  }

  function insertionAddEventHandler (index: number) {
    const { position, regarding } = getPositionAndRegardingFromTimeline(index);
    setInsertions(([{ type: 'splashScreen', duration: 0, shift: 0, position, regarding }] as ExtensionRuleConfig['insertions']).concat(insertions))
  }

  function insertionChangeHandler (this: number, value: ExtensionRuleConfig['insertions'][0]) {
    setInsertions(insertions.map((v, i) => i === this ? value : v));
  }
  function insertionRemoveHandler (this: number) {
    setInsertions(insertions.filter((_, i) => i !== this));
  }

  function renderTimecodes () {
    return insertions.map((insertion, index) => (
      <div className='form-group' style={({ paddingTop: '12px' })}>
        <div className='form-label'>
          <span>{ spanGenerate(insertion) }</span>
        </div>
        <AdvanceTimecodeInRule data={ insertion } onchange={ insertionChangeHandler.bind(index) } onremove={ insertionRemoveHandler.bind(index) }/>
      </div>
    ));
  }

  return (
    <>
      <div className='popup-overlay'/>
      <div className='popup__inner' onClick={ () => !hover && onleave() }>
        <div className='popup__content scrollable' role='dialog' aria-modal='true' tabIndex={-1} onMouseEnter={ () => setHover(true) } onMouseLeave={ () => setHover(false) }>
          <button className='btn is-plain is-icon is-rounded size-sm popup-close' type='button' onClick={ onclose }>
            <CrossSVG/>
          </button>
          <div className='popup-header'>
            <div className='popup-header__title'>
              Настройка правила
            </div>
          </div>
          <div className='popup-body'>
            <div className='form-group _offset border-bottom'>
              <div className='form-label'>
                <span>Отображение</span>
              </div>
              <div className='form-input'>
                <input className='form-input__field' type='text' placeholder='Название правила' value={ name } onChange={ (event) => setName(event.target.value) }/>
              </div>
              <div className='team-cards-grid' style={({ padding: '12px 0', gap: '12px' })}>
                <div className='rule-card-item' style={({ padding: '0' })}>
                  <div className='cover _shadow'>
                    <div className='cover__wrap rule-card-cover'>
                      { image
                        ? <img src={ image } className='cover__img _loaded cover-options' loading='lazy'/>
                        : <div className='cover__img rule-card-cover _loaded card-new-style'><AddSVG/><span>Загрузить картинку</span></div> }
                    </div>
                  </div>
                </div>
                <div className='rule-card-item' style={({ padding: '0' })}>
                  <div className='cover _shadow'>
                    <div className='cover__wrap rule-card-cover'>
                      { gif
                        ? <img src={ gif } className='cover__img _loaded cover-options' loading='lazy'/>
                        : <div className='cover__img rule-card-cover _loaded card-new-style'><AddSVG/><span>Загрузить гифку</span></div> }
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='form-group _offset dual-pad-spacing border-bottom'>
              <label className='form-switcher'>
                <div className='form-switcher-text'>
                  <div className='form-switcher-text__main'>Только для этого тайтла</div>
                  <div className='form-switcher-text__label'>Не будет отображаться в других тайтлах</div>
                </div>
                <div className='switcher-input'>
                  <input type='checkbox' className='switcher-input__box' true-value='true' false-value='false' value={ `${local}` } onChange={ (event) => setLocal(event.target.value === 'true' ? true : false) }/>
                  <span className='switcher-input__slider'/>
                </div>
              </label>
            </div>
            <div className='form-group dual-pad-spacing'>
              <div className='form-label'>
                <span>Выберете точку на таймлайне</span>
              </div>
              <AdvanceTimelineInRule onpointclick={ insertionAddEventHandler } onlineclick={ () => {} }/>
            </div>
            { renderTimecodes() }
            <div className='btns _stretch save-form-group'>
              <button className='btn variant-success' type='button' onClick={ handleSaveEvent }>
                <SaveSVG/><span>Сохранить</span>
              </button>
              <button className='btn is-icon variant-danger' type='button' onClick={ handleRemoveEvent }>
                <TrashSVG/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
