import React, { useState } from 'react';


interface Props {
  onpointclick: (index: number) => void,
  onlineclick: (type: Timecode['type']) => void,
};

export const AdvanceTimelineInRule: React.FC<Props> = ({ onpointclick, onlineclick }) => {
  const [ mouseHover, setMouseHover ] = useState<number | null>(null);
  return (
    <div className='rule-timeline-container'>
      <div className='rule-timeline'>
        <div className='rule-timeline-item'></div>
        <div className='my-btn rule-timeline-item _opening' onClick={ () => onlineclick('opening') }></div>
        <div className='rule-timeline-item'></div>
        <div className='my-btn rule-timeline-item _ost' onClick={ () => onlineclick('ost') }></div>
        <div className='rule-timeline-item'></div>
        <div className='my-btn rule-timeline-item _ending' onClick={ () => onlineclick('ending') }></div>
        <div className='rule-timeline-item'></div>
      </div>
      <div className='rule-pointline'>
        <div className='my-btn rule-label _opening' style={({ left: '20.8%' })} onClick={ () => onlineclick('opening') }>OP</div>
        <div className='my-btn rule-label _ost' style={({ left: '48.6%' })} onClick={ () => onlineclick('ost') }>OST</div>
        <div className='my-btn rule-label _ending' style={({ left: '78.7%' })} onClick={ () => onlineclick('ending') }>ED</div>
      </div>
      <div className='rule-pointline'>
        <div className={ (mouseHover !== 0 ? 'invisible-point ' : '') + 'rule-point'          } style={({ left: '0%'      })}></div>
        <div className={ (mouseHover !== 1 ? 'invisible-point ' : '') + 'rule-point _opening' } style={({ left: '14.286%' })}></div>
        <div className={ (mouseHover !== 2 ? 'invisible-point ' : '') + 'rule-point _opening' } style={({ left: '28.571%' })}></div>
        <div className={ (mouseHover !== 3 ? 'invisible-point ' : '') + 'rule-point _ost'     } style={({ left: '42.857%' })}></div>
        <div className={ (mouseHover !== 4 ? 'invisible-point ' : '') + 'rule-point _ost'     } style={({ left: '57.143%' })}></div>
        <div className={ (mouseHover !== 5 ? 'invisible-point ' : '') + 'rule-point _ending'  } style={({ left: '71.429%' })}></div>
        <div className={ (mouseHover !== 6 ? 'invisible-point ' : '') + 'rule-point _ending'  } style={({ left: '85.714%' })}></div>
        <div className={ (mouseHover !== 7 ? 'invisible-point ' : '') + 'rule-point'          } style={({ left: '100%'    })}></div>
      </div>
      <div className='rule-pointline'>
        <div className='my-btn frame-rule-point' onMouseEnter={ () => setMouseHover(0) } onMouseLeave={ () => setMouseHover(null) } onClick={ () => onpointclick(0) } style={({ left: '0%' })}></div>
        <div className='my-btn frame-rule-point' onMouseEnter={ () => setMouseHover(1) } onMouseLeave={ () => setMouseHover(null) } onClick={ () => onpointclick(1) } style={({ left: '14.286%' })}></div>
        <div className='my-btn frame-rule-point' onMouseEnter={ () => setMouseHover(2) } onMouseLeave={ () => setMouseHover(null) } onClick={ () => onpointclick(2) } style={({ left: '28.571%' })}></div>
        <div className='my-btn frame-rule-point' onMouseEnter={ () => setMouseHover(3) } onMouseLeave={ () => setMouseHover(null) } onClick={ () => onpointclick(3) } style={({ left: '42.857%' })}></div>
        <div className='my-btn frame-rule-point' onMouseEnter={ () => setMouseHover(4) } onMouseLeave={ () => setMouseHover(null) } onClick={ () => onpointclick(4) } style={({ left: '57.143%' })}></div>
        <div className='my-btn frame-rule-point' onMouseEnter={ () => setMouseHover(5) } onMouseLeave={ () => setMouseHover(null) } onClick={ () => onpointclick(5) } style={({ left: '71.429%' })}></div>
        <div className='my-btn frame-rule-point' onMouseEnter={ () => setMouseHover(6) } onMouseLeave={ () => setMouseHover(null) } onClick={ () => onpointclick(6) } style={({ left: '85.714%' })}></div>
        <div className='my-btn frame-rule-point' onMouseEnter={ () => setMouseHover(7) } onMouseLeave={ () => setMouseHover(null) } onClick={ () => onpointclick(7) } style={({ left: '100%' })}></div>
      </div>
    </div>
  );
};
