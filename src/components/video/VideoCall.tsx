import React, { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import { Button } from '@/components/ui/Button';
import { Video, VideoOff, Mic, MicOff, X, Copy, Phone } from 'lucide-react';

interface VideoCallProps {
  sessionId: string;
  userName: string;
  onClose: () => void;
}

export function VideoCall({ sessionId, userName, onClose }: VideoCallProps) {
  const [peer, setPeer] = useState<Peer | null>(null);
  const [myPeerId, setMyPeerId] = useState('');
  const [remotePeerId, setRemotePeerId] = useState('');
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [copied, setCopied] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    initializePeer();
    return () => {
      localStreamRef.current?.getTracks().forEach(track => track.stop());
      peer?.destroy();
    };
  }, []);

  const initializePeer = async () => {
    try {
      // Get local media stream
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Initialize peer with session-based ID
      const newPeer = new Peer(`decisionhub-${sessionId}-${Date.now()}`, {
        host: 'peerjs.com',
        port: 443,
        secure: true,
        path: '/',
      });

      newPeer.on('open', (id) => {
        setMyPeerId(id);
        console.log('My peer ID:', id);
      });

      // Handle incoming calls
      newPeer.on('call', (call) => {
        console.log('Incoming call from:', call.peer);
        call.answer(localStreamRef.current!);
        
        call.on('stream', (remoteStream) => {
          console.log('Received remote stream');
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
          setIsConnected(true);
        });
      });

      newPeer.on('error', (error) => {
        console.error('Peer error:', error);
      });

      setPeer(newPeer);
    } catch (error) {
      console.error('Failed to get media:', error);
      alert('Failed to access camera/microphone. Please allow permissions.');
    }
  };

  const callPeer = () => {
    if (!peer || !remotePeerId || !localStreamRef.current) {
      alert('Please enter a valid peer ID');
      return;
    }

    console.log('Calling peer:', remotePeerId);
    const call = peer.call(remotePeerId, localStreamRef.current);
    
    call.on('stream', (remoteStream) => {
      console.log('Call connected, received stream');
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
      setIsConnected(true);
    });

    call.on('error', (error) => {
      console.error('Call error:', error);
      alert('Failed to connect. Check if the peer ID is correct.');
    });
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoOn;
        setIsVideoOn(!isVideoOn);
      }
    }
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioOn;
        setIsAudioOn(!isAudioOn);
      }
    }
  };

  const copyPeerId = () => {
    navigator.clipboard.writeText(myPeerId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Video Call - {userName}</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          <X size={20} />
        </Button>
      </div>

      {/* Video Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 overflow-hidden">
        {/* Local Video */}
        <div className="relative bg-black rounded-lg overflow-hidden shadow-xl">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 px-3 py-1.5 rounded-lg text-white text-sm font-medium">
            You {!isVideoOn && '(Video Off)'}
          </div>
        </div>

        {/* Remote Video */}
        <div className="relative bg-gray-800 rounded-lg overflow-hidden shadow-xl flex items-center justify-center">
          {isConnected ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center p-8">
              <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Video size={48} className="text-gray-500" />
              </div>
              <p className="text-gray-400 text-lg mb-2">Waiting for connection...</p>
              <p className="text-gray-500 text-sm">Share your Peer ID below</p>
            </div>
          )}
          {isConnected && (
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 px-3 py-1.5 rounded-lg text-white text-sm font-medium">
              Remote User
            </div>
          )}
        </div>
      </div>

      {/* Connection Panel */}
      {!isConnected && (
        <div className="bg-gray-800 p-6 border-t border-gray-700">
          <div className="max-w-3xl mx-auto space-y-4">
            {/* My Peer ID */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Your Peer ID (Share this with others)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={myPeerId}
                  readOnly
                  className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg font-mono text-sm"
                  placeholder="Generating..."
                />
                <Button 
                  size="sm" 
                  onClick={copyPeerId}
                  className="px-4 py-3"
                >
                  {copied ? '✓ Copied!' : <><Copy size={16} className="mr-2" /> Copy</>}
                </Button>
              </div>
            </div>

            {/* Connect to Peer */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Connect to someone (Enter their Peer ID)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={remotePeerId}
                  onChange={(e) => setRemotePeerId(e.target.value)}
                  className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg font-mono text-sm"
                  placeholder="Paste peer ID here..."
                />
                <Button 
                  onClick={callPeer} 
                  disabled={!remotePeerId || !myPeerId}
                  className="px-6 py-3"
                >
                  <Phone size={16} className="mr-2" /> Call
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="bg-gray-800 border-t border-gray-700 p-6">
        <div className="flex items-center justify-center space-x-4">
          <Button
            variant={isVideoOn ? 'secondary' : 'danger'}
            size="lg"
            onClick={toggleVideo}
            className="rounded-full w-14 h-14 flex items-center justify-center"
            title={isVideoOn ? 'Turn off video' : 'Turn on video'}
          >
            {isVideoOn ? <Video size={24} /> : <VideoOff size={24} />}
          </Button>

          <Button
            variant={isAudioOn ? 'secondary' : 'danger'}
            size="lg"
            onClick={toggleAudio}
            className="rounded-full w-14 h-14 flex items-center justify-center"
            title={isAudioOn ? 'Mute' : 'Unmute'}
          >
            {isAudioOn ? <Mic size={24} /> : <MicOff size={24} />}
          </Button>

          <Button
            variant="danger"
            size="lg"
            onClick={onClose}
            className="rounded-full w-14 h-14 flex items-center justify-center"
            title="Leave call"
          >
            <Phone size={24} className="rotate-135" />
          </Button>
        </div>
      </div>
    </div>
  );
}
