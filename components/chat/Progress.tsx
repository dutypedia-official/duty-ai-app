import { useEffect, useState } from "react";
import { ProgressBar } from "react-native-paper";
import { useThemeColor } from "../../components/Themed";

const ChatProgress = ({ isLoading }: { isLoading: boolean }) => {
  const [progress, setProgress] = useState(0);
  const primaryColor = useThemeColor({}, "primary");

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const updateProgress = async () => {
    if (!isLoading) return;
    const speed1 = 10 + Math.random() * 50;
    const speed2 = 50 + Math.random() * 100;
    for (let i = 0; i <= 0.4; i += 0.005) {
      await delay(speed1);
      setProgress(i);
    }
    for (let i = 0.4; i <= 0.8; i += 0.01) {
      await delay(speed2);
      setProgress(i);
    }
    await delay(2000);
    for (let i = 0.8; i <= 1; i += 0.002) {
      await delay(10);
      setProgress(i);
    }
  };

  useEffect(() => {
    if (isLoading) {
      updateProgress();
    }
  }, [isLoading]);

  if (!isLoading || !progress) return null;

  return <ProgressBar progress={progress} color={primaryColor} />;
};

export default ChatProgress;
