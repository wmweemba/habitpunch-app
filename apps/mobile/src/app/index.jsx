import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { isOnboardingComplete } from "../utils/habitStorage";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [onboardingDone, setOnboardingDone] = useState(false);

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    const done = await isOnboardingComplete();
    setOnboardingDone(done);
    setLoading(false);
  };

  if (loading) {
    return null;
  }

  if (onboardingDone) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/onboarding" />;
}
