'use client';

import { Button } from '@/components/ui/button';
import { Mic } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface AudioRecorderProps {
  onRecord: (file: File) => void;
  onError?: (error: Error) => void;
  mimeType?: string;
}

export function AudioRecorder({
  onRecord,
  onError,
  mimeType = 'audio/webm',
}: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const cleanup = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    recorderRef.current = null;
    streamRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      cleanup();
      recorderRef.current?.stop();
    };
  }, [cleanup]);

  const startRecording = useCallback(async () => {
    try {
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        throw new Error(`Codec ${mimeType} not supported by this browser`);
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream, { mimeType });
      recorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const file = new File([blob], `recording.${mimeType.split('/')[1]}`, {
          type: mimeType,
        });
        onRecord(file);
        cleanup();
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error('Recording failed:', error);
      onError?.(error);
      cleanup();
    }
  }, [mimeType, onRecord, onError, cleanup]);

  const stopRecording = useCallback(() => {
    recorderRef.current?.stop();
    setIsRecording(false);
  }, []);

  return (
    <Button onClick={isRecording ? stopRecording : startRecording} variant="secondary">
      {isRecording ? (
        <>
          <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
          Stop Recording
        </>
      ) : (
        <>
          <HugeiconsIcon icon={Mic} />
          Record
        </>
      )}
    </Button>
  );
}
