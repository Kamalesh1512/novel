'use client'

interface LoadingScreenProps {
  description?: string;
}

export const LoadingScreen = ({ description }: LoadingScreenProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 overflow-hidden">
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        src="/videos/loading.mp4"
      />
      {description && (
        <div className="relative z-10 text-white text-lg font-medium">
          {}
        </div>
      )}
    </div>
  );
};

export default LoadingScreen;

