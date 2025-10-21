import React from 'react';
import { Button } from '@/components/ui/Button';
import { X } from 'lucide-react';

interface VideoCallProps {
  sessionId: string;
  userName: string;
  onClose: () => void;
}

export function VideoCall({ sessionId, userName, onClose }: VideoCallProps) {
  // Use Jitsi's free public instance
  const roomName = `DecisionHub-${sessionId}`;
  const jitsiUrl = `https://meet.jit.si/${roomName}#config.prejoinPageEnabled=false&userInfo.displayName="${encodeURIComponent(userName)}"`;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 px-6 py-4 flex items-center justify-between border-b border-gray-800">
        <div>
          <h2 className="text-xl font-bold text-white">Video Call</h2>
          <p className="text-sm text-gray-400 mt-1">
            Room: {roomName}
          </p>
        </div>
        <Button
          variant="danger"
          size="sm"
          onClick={onClose}
          className="rounded-full w-10 h-10 flex items-center justify-center"
        >
          <X size={20} />
        </Button>
      </div>

      {/* Jitsi Iframe */}
      <iframe
        src={jitsiUrl}
        allow="camera; microphone; fullscreen; speaker; display-capture"
        style={{
          width: '100%',
          height: 'calc(100vh - 73px)',
          border: 'none',
          backgroundColor: '#000',
        }}
      />
    </div>
  );
}
