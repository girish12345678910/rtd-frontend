import React, { useState } from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { Button } from '@/components/ui/Button';
import { X } from 'lucide-react';

interface VideoCallProps {
  sessionId: string;
  userName: string;
  onClose: () => void;
}

export function VideoCall({ sessionId, userName, onClose }: VideoCallProps) {
  const [apiReady, setApiReady] = useState(false);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Close Button */}
      <div className="absolute top-4 right-4 z-50">
        <Button
          variant="danger"
          size="sm"
          onClick={onClose}
          className="rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
        >
          <X size={24} />
        </Button>
      </div>

      {/* Jitsi Meeting */}
      <JitsiMeeting
        domain="meet.jit.si"
        roomName={`DecisionHub-${sessionId}`}
        configOverwrite={{
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          disableModeratorIndicator: false,
          enableWelcomePage: false,
          prejoinPageEnabled: false,
          enableClosePage: false,
        }}
        interfaceConfigOverwrite={{
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          TOOLBAR_BUTTONS: [
            'microphone',
            'camera',
            'closedcaptions',
            'desktop',
            'fullscreen',
            'hangup',
            'chat',
            'recording',
            'settings',
            'raisehand',
            'videoquality',
            'filmstrip',
            'stats',
            'shortcuts',
            'tileview',
          ],
        }}
        userInfo={{
          displayName: userName,
        }}
        onApiReady={() => setApiReady(true)}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.height = '100vh';
          iframeRef.style.width = '100%';
        }}
      />
    </div>
  );
}
