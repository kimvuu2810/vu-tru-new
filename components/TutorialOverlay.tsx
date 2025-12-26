import React, { useState, useEffect } from 'react';
import { Hand, ZoomIn, RotateCw, Move, Eye, X } from 'lucide-react';

interface TutorialOverlayProps {
  onClose?: () => void;
}

/**
 * Tutorial overlay hướng dẫn người dùng sử dụng app
 * Hiển thị các icons và hướng dẫn tương tác
 */
const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const tutorialSteps = [
    {
      icon: Hand,
      title: 'Hand Tracking',
      description: 'Di chuyển tay trước camera để điều khiển',
      detail: 'Camera sẽ tự động phát hiện bàn tay của bạn',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: ZoomIn,
      title: 'Pinch to Zoom',
      description: 'Chụm ngón cái và ngón trỏ lại để zoom',
      detail: 'Càng chụm gần nhau, càng zoom sâu vào lõi',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: RotateCw,
      title: 'Rotate View',
      description: 'Kéo để xoay camera quanh vật thể',
      detail: 'Sử dụng chuột hoặc touch để xoay góc nhìn',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Move,
      title: 'Move Visualizer',
      description: 'Kéo thả vòng tròn hand tracking',
      detail: 'Giữ và kéo để di chuyển đến vị trí mong muốn',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Eye,
      title: 'Settings',
      description: 'Tùy chỉnh hiển thị và hiệu suất',
      detail: 'Mở Settings để bật/tắt tutorial và các tính năng',
      color: 'from-violet-500 to-purple-500',
    },
  ];

  const currentTutorial = tutorialSteps[currentStep];
  const Icon = currentTutorial.icon;

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      setTimeout(() => onClose(), 300);
    }
  };

  useEffect(() => {
    // Auto advance after 5 seconds if user doesn't interact
    const timer = setTimeout(() => {
      if (currentStep < tutorialSteps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentStep]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-auto">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Tutorial Card */}
      <div className="relative max-w-md w-full mx-4">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute -top-12 right-0 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all group"
        >
          <X className="w-5 h-5 text-white/70 group-hover:text-white" />
        </button>

        {/* Main Card */}
        <div className="bg-gradient-to-br from-black/80 via-purple-900/20 to-black/80 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
          {/* Icon Header */}
          <div className={`bg-gradient-to-br ${currentTutorial.color} p-8 flex items-center justify-center`}>
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl animate-pulse" />
              <Icon className="w-16 h-16 text-white relative z-10" strokeWidth={1.5} />
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Title */}
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-light text-white tracking-wide">
                {currentTutorial.title}
              </h3>
              <p className="text-sm text-white/60">
                {currentTutorial.description}
              </p>
            </div>

            {/* Detail */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <p className="text-xs text-white/50 text-center leading-relaxed">
                {currentTutorial.detail}
              </p>
            </div>

            {/* Progress Dots */}
            <div className="flex justify-center gap-2">
              {tutorialSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? 'w-8 bg-white'
                      : 'w-1.5 bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="flex gap-3">
              {currentStep > 0 && (
                <button
                  onClick={handlePrev}
                  className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-sm transition-all"
                >
                  Previous
                </button>
              )}
              <button
                onClick={handleNext}
                className={`py-3 rounded-xl bg-gradient-to-r ${currentTutorial.color} text-white text-sm font-medium transition-all hover:shadow-lg ${
                  currentStep === 0 ? 'flex-1' : 'flex-1'
                }`}
              >
                {currentStep === tutorialSteps.length - 1 ? 'Get Started' : 'Next'}
              </button>
            </div>

            {/* Skip Button */}
            <button
              onClick={handleClose}
              className="w-full text-xs text-white/40 hover:text-white/60 transition-colors"
            >
              Skip Tutorial
            </button>
          </div>
        </div>

        {/* Step Counter */}
        <div className="mt-4 text-center">
          <p className="text-xs text-white/30 uppercase tracking-widest">
            Step {currentStep + 1} of {tutorialSteps.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TutorialOverlay;
