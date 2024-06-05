import React, { useState } from 'react';
import AudioReactRecorder, { RecordState } from 'audio-react-recorder';

const Audio = () => {
  const [recordState, setRecordState] = useState(null);
  const [audioURL, setAudioURL] = useState('');

  const start = () => {
    setRecordState(RecordState.START);
  };

  const stop = () => {
    setRecordState(RecordState.STOP);
  };

  const onStop = (audioData) => {
    console.log('audioData', audioData);
    const audioBlob = new Blob([audioData.blob], { type: 'audio/wav' });
    const audioURL = URL.createObjectURL(audioBlob);
    setAudioURL(audioURL);
  };

  return (
    <div>
      <AudioReactRecorder state={recordState} onStop={onStop} />

      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
      
      {audioURL && (
        <a href={audioURL} download="recording.wav" >
          Download Recording
        </a>
      )}
    </div>
  );
};

export default Audio;
