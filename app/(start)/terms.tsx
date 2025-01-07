import TermsAndConditions from "@/components/terms";
import { useLocalSearchParams } from "expo-router";
import React from "react";

export default function terms() {
  const params = useLocalSearchParams();
  return <TermsAndConditions market={params.market} />;
}
