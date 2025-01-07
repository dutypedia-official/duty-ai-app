import TermsAndConditions from "@/components-jp/terms";
import { useLocalSearchParams } from "expo-router";
import React from "react";

export default function terms() {
  const params = useLocalSearchParams();
  return <TermsAndConditions market={params.market} />;
}
