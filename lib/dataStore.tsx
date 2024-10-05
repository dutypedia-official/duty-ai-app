import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const pastelColors = [
  "#B0D2C0",
  "#FFE885",
  "#D9E4F0",
  "#F3B3C3",
  "#D3C3E8",
  "#BBAD90",
];

const discoverData = [
  {
    category: "Popular",
    icon: "star-outline",
    data: [
      {
        title: "Bangladesh stock prediction",
        subTitle: "Advanced stock analysis with Al",
        icon: (
          <FontAwesome6 name="wand-magic-sparkles" size={24} color="#5e87c8" />
        ),
        template: "finance",
        bgColor: "#142D4C",
        iconBgColor: "#051640",
      },
      {
        title: "Stock overview",
        subTitle: "Monitor All stock overview and view chart",
        icon: <FontAwesome name="line-chart" size={24} color="#73faa9" />,
        template: "chart",
        bgColor: "#222831",
        iconBgColor: "#000",
        link: "/main/discover/chart/",
      },
      {
        title: "Forex & Crypto",
        subTitle: "Forex & Crypto Analysis Using Al",
        icon: (
          <MaterialCommunityIcons
            name="currency-eur"
            size={24}
            color="#73faa9"
          />
        ),
        template: "forex",
        bgColor: "#240041",
        iconBgColor: "#281e58",
      },
    ],
  },
];

const discoverDataBn = [
  {
    category: "Popular",
    icon: "star-outline",
    data: [
      {
        title: "বাংলাদেশ শেয়ার বাজার পূর্বাভাস",
        subTitle: "এআই দিয়ে সঠিক শেয়ার এনালাইসিস করুন",
        icon: (
          <FontAwesome6 name="wand-magic-sparkles" size={24} color="#5e87c8" />
        ),
        template: "finance",
        bgColor: "#142D4C",
        iconBgColor: "#051640",
      },
      {
        title: "স্টক ওভারভিউ",
        subTitle: "আপনার প্রিয় শেয়ার পর্যবেক্ষণ করুন",
        icon: <FontAwesome name="line-chart" size={24} color="#73faa9" />,
        template: "chart",
        bgColor: "#222831",
        iconBgColor: "#000",
        link: "/main/discover/chart/",
      },
      {
        title: "ফরেক্স এবং ক্রিপ্টো",
        subTitle: "এআই দিয়ে দিয়ে এনালাইসিস করুন",
        icon: (
          <MaterialCommunityIcons
            name="currency-eur"
            size={24}
            color="#73faa9"
          />
        ),
        template: "forex",
        bgColor: "#240041",
        iconBgColor: "#281e58",
      },
    ],
  },
];

export { discoverData, discoverDataBn, pastelColors };
