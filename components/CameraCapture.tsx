'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Icon from '@/components/Icon';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  onCancel: () => void;
  onUpload: () => void;
}

const CAMERA_ERRORS: Record<string, string> = {
  NotAllowedError: 'Camera access is blocked. Click the camera icon in the address bar, allow it, then try again.',
  SecurityError: 'Camera access is blocked. Click the camera icon in the address bar, allow it, then try again.',
  NotFoundError: 'No camera found on this device. You can upload a photo instead.',
  OverconstrainedError: 'No camera found on this device. You can upload a photo instead.',
  NotReadableError: 'The camera is being used by another app. Close it and try again.',
  insecure: 'The camera only works on localhost or an https:// address. You can upload a photo instead.',
};

// Live camera inside the app: preview, receipt guide, shutter
export default function CameraCapture({ onCapture, onCancel, onUpload }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [camIndex, setCamIndex] = useState(-1);
  const [flash, setFlash] = useState(false);

  const stop = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
  };

  const start = useCallback(async (deviceId?: string) => {
    stop();
    setReady(false);
    setError(null);
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
      setError(CAMERA_ERRORS.insecure);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          ...(deviceId ? { deviceId: { exact: deviceId } } : { facingMode: { ideal: 'environment' } }),
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      // Device labels are only available after permission is granted
      const all = (await navigator.mediaDevices.enumerateDevices()).filter(d => d.kind === 'videoinput');
      setCameras(all);
      const activeId = stream.getVideoTracks()[0]?.getSettings().deviceId;
      setCamIndex(Math.max(0, all.findIndex(d => d.deviceId === activeId)));
      setReady(true);
    } catch (e) {
      setError(CAMERA_ERRORS[(e as Error).name] || 'Could not open the camera. You can upload a photo instead.');
    }
  }, []);

  useEffect(() => {
    start();
    return stop;
  }, [start]);

  const switchCamera = () => {
    if (cameras.length < 2) return;
    const next = (camIndex + 1) % cameras.length;
    setCamIndex(next);
    start(cameras[next].deviceId);
  };

  const capture = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')!.drawImage(video, 0, 0);
    setFlash(true);
    canvas.toBlob(
      blob => {
        if (!blob) return;
        stop();
        onCapture(new File([blob], `receipt-${Date.now()}.jpg`, { type: 'image/jpeg' }));
      },
      'image/jpeg',
      0.92,
    );
  };

  return (
    <div>
      <div className="camera">
        <video ref={videoRef} playsInline muted autoPlay aria-label="Camera preview" />
        {ready && (
          <div className="camera-guide" aria-hidden="true">
            <i /><i /><i /><i />
          </div>
        )}
        {flash && <div className="camera-flash" />}
        {!ready && !error && (
          <div className="camera-msg">
            <Icon name="camera" className="w-7 h-7" />
            <p className="mt-2 text-sm">Opening camera… allow access if your browser asks.</p>
          </div>
        )}
        {error && (
          <div className="camera-msg">
            <Icon name="camera" className="w-7 h-7" />
            <p className="mt-2 text-sm max-w-xs">{error}</p>
            <div className="flex gap-2 mt-4">
              <button type="button" className="pill sm" onClick={() => start()}>Try again</button>
              <button type="button" className="pill sm plus" onClick={onUpload}>Upload photo</button>
            </div>
          </div>
        )}
        {ready && <p className="camera-hint">Fit the whole receipt inside the frame</p>}
      </div>

      <div className="flex items-center justify-between mt-4">
        <button type="button" className="pill" onClick={() => { stop(); onCancel(); }}>Cancel</button>
        <button type="button" className="shutter" onClick={capture} disabled={!ready} aria-label="Take photo of receipt">
          <span />
        </button>
        <button
          type="button"
          className="pill"
          onClick={cameras.length > 1 ? switchCamera : onUpload}
          aria-label={cameras.length > 1 ? 'Switch camera' : 'Upload a photo instead'}
        >
          <Icon name={cameras.length > 1 ? 'switch-camera' : 'image'} className="w-4 h-4" />
          {cameras.length > 1 ? 'Flip' : 'Upload'}
        </button>
      </div>
    </div>
  );
}
