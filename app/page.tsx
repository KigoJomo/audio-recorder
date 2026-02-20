'use client';

import { useState, useRef } from 'react';
import { AudioRecorder } from '@/components/audio-recorder';
import { Button } from '@/components/ui/button';
import { Undo2 } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

export default function Page() {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const prevUrlRef = useRef<string | null>(null);

  const handleRecord = (file: File) => {
    if (prevUrlRef.current) {
      URL.revokeObjectURL(prevUrlRef.current);
    }
    const url = URL.createObjectURL(file);
    prevUrlRef.current = url;
    setAudioUrl(url);
  };

  const clearFile = () => {
    if (prevUrlRef.current) {
      URL.revokeObjectURL(prevUrlRef.current);
      prevUrlRef.current = null;
    }
    setAudioUrl(null);
  };

  return (
    <>
      <section className="h-screen w-screen flex flex-col items-center justify-center gap-6">
        <h1 className="text-4xl">Audio Recording Test</h1>

        <AudioRecorder onRecord={handleRecord} />

        {audioUrl && (
          <div className="flex items-center gap-6">
            <audio controls src={audioUrl} />

            <Button variant="destructive" size="icon" onClick={clearFile}>
              <HugeiconsIcon icon={Undo2} />
            </Button>
          </div>
        )}
      </section>
    </>
  );
}
