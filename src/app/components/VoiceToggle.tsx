'use client'

import { useChatStore } from '@/app/store/chat';

export const VoiceToggle = () => {
  const { voice, setVoice } = useChatStore();

  return (
    <div className="flex items-center gap-4 mb-4">
      <label>
        <input
          type="radio"
          name="voice"
          value="nova"
          checked={voice === 'nova'}
          onChange={() => setVoice('nova')}
          className="mr-0.5"
        />
        Nova
      </label>
      <label>
        <input
          type="radio"
          name="voice"
          value="onyx"
          checked={voice === 'onyx'}
          onChange={() => setVoice('onyx')}
          className="mr-0.5"
        />
        Onyx
      </label>
    </div>
  );
}