import { useEffect, useRef, useState } from "react";
import { Camera, ScanFace, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useI18n } from "@/lib/i18n";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (snapshot: string) => void;
  pending?: boolean;
};

export function FaceIdDialog({ open, onOpenChange, onConfirm, pending }: Props) {
  const { t } = useI18n();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [shot, setShot] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function start() {
      setError(false);
      setShot(null);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((tr) => tr.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
      } catch {
        if (!cancelled) setError(true);
      }
    }
    function stop() {
      streamRef.current?.getTracks().forEach((tr) => tr.stop());
      streamRef.current = null;
    }
    if (open) start();
    else stop();
    return () => {
      cancelled = true;
      stop();
    };
  }, [open]);

  function capture() {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 480;
    canvas.height = video.videoHeight || 640;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    setShot(canvas.toDataURL("image/jpeg", 0.7));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ScanFace className="size-5" />
            {t("faceId")}
          </DialogTitle>
          <DialogDescription>{t("faceHint")}</DialogDescription>
        </DialogHeader>

        <div className="overflow-hidden rounded-2xl border border-border bg-muted">
          {error ? (
            <p className="p-8 text-center text-sm text-muted-foreground">{t("cameraError")}</p>
          ) : shot ? (
            <img src={shot} alt="" className="aspect-3/4 w-full object-cover" />
          ) : (
            <video ref={videoRef} playsInline muted className="aspect-3/4 w-full object-cover" />
          )}
        </div>

        <p className="text-xs text-muted-foreground">{t("myidNote")}</p>

        <div className="flex gap-2">
          {shot ? (
            <>
              <Button variant="outline" className="flex-1" onClick={() => setShot(null)}>
                <RefreshCw className="size-4" />
                {t("retake")}
              </Button>
              <Button className="flex-1" disabled={pending} onClick={() => onConfirm(shot)}>
                {t("verifyFace")}
              </Button>
            </>
          ) : (
            <Button className="w-full" disabled={error} onClick={capture}>
              <Camera className="size-4" />
              {t("capture")}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
