import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

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
        title: "Social media",
        subTitle: "Write post for social media",
        icon: <AntDesign name="like2" size={24} color="black" />,
      },
      {
        title: "Essay",
        subTitle: "Cratt a well-structured essay",
        icon: <MaterialCommunityIcons name="text" size={24} color="black" />,
      },
      {
        title: "Resume",
        subTitle: "Craft a professional resume for job",
        icon: (
          <MaterialCommunityIcons
            name="text-box-outline"
            size={24}
            color="black"
          />
        ),
      },
      {
        title: "Human",
        subTitle: "Interact with Al like with a human",
        icon: <FontAwesome5 name="robot" size={24} color="black" />,
      },
      {
        title: "Business ideas",
        subTitle: "Receive cost-tree pusiness ideas",
        icon: (
          <MaterialCommunityIcons name="lightbulb-on" size={24} color="black" />
        ),
      },
      {
        title: "Grammar and spelling",
        subTitle: "Check grammar and spelling",
        icon: <FontAwesome5 name="spell-check" size={24} color="black" />,
      },
      {
        title: "Song lyrics",
        subTitle: "Create song lyrics on any subject matter",
        icon: <FontAwesome name="music" size={24} color="black" />,
      },
      {
        title: "Finalize ideas",
        subTitle: "Finalize the writing",
        icon: <FontAwesome name="file-text" size={24} color="black" />,
      },
    ],
  },
  {
    category: "Social",
    icon: "post-outline",
    data: [
      {
        title: "Tweet",
        subTitle: "Craft Tweets that will grab your redders attention",
        icon: <FontAwesome name="twitter" size={24} color="black" />,
      },
      {
        title: "Linkedin post",
        subTitle: "Create an attention-grabbing post on Linkedin",
        icon: <FontAwesome name="linkedin" size={24} color="black" />,
      },
      {
        title: "Instagram caption",
        subTitle:
          "Writing good Instagram captions to help your audiences find and understand you easily",
        icon: <FontAwesome name="instagram" size={24} color="black" />,
      },
      {
        title: "Tiktok caption",
        subTitle: "Create view-generating captions for viral TikToks",
        icon: <FontAwesome5 name="tiktok" size={24} color="black" />,
      },
      {
        title: "Turn into Tweet",
        subTitle: "Fit long text into 280 characters",
        icon: <FontAwesome5 name="retweet" size={24} color="black" />,
      },
    ],
  },
  {
    category: "Experts",
    icon: "account-group-outline",
    data: [],
  },
  {
    category: "Entertenmaint",
    icon: "movie-open-outline",
    data: [],
  },
  {
    category: "Learning",
    icon: "book-open-page-variant",
    data: [],
  },
  {
    category: "Business",
    icon: "currency-usd",
    data: [],
  },
  {
    category: "Working",
    icon: "briefcase-outline",
    data: [],
  },
  {
    category: "Fitness",
    icon: "yoga",
    data: [],
  },
  {
    category: "Gaming",
    icon: "gamepad-variant",
    data: [],
  },
  {
    category: "Programing",
    icon: "console",
    data: [],
  },
  {
    category: "Promoting",
    icon: "bullhorn",
    data: [],
  },
];

export { discoverData, pastelColors };
