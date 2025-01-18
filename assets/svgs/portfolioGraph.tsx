import * as React from "react";
import Svg, {
  SvgProps,
  Path,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg";
const PortfolioGraph = (props: SvgProps) => (
  <Svg
    width={350}
    height={249}
    viewBox="0 0 350 249"
    fill="none"
    // xmlns='http://www.w3.org/2000/svg'
    {...props}>
    <Path
      d="M18.5 82.0192C8.1 80.4192 1.83333 113.019 0 129.519V248.52H350V86.0195C347.5 72.6862 341.2 44.4198 336 38.021C329.5 30.0224 318.5 98.0195 310 98.5195C301.5 99.0195 288.5 42.0195 281.5 46.0195C274.5 50.0195 262 86.5195 254.5 88.5195C247 90.5195 227.5 1.52096 221 0.0209617C214.5 -1.47904 190 78.021 186 79.021C182 80.021 176.5 40.521 173.5 38.021C171.1 36.021 163.5 61.1876 160 74.021L143.5 16.021L93 126.521C88.6667 119.188 78.9 104.121 74.5 102.521C70.1 100.921 60.3333 115.854 56 123.521C47.8333 110.354 28.9 83.6192 18.5 82.0192Z"
      fill="url(#paint0_linear_7947_76832)"
      fillOpacity={0.2}
    />
    <Defs>
      <LinearGradient
        id="paint0_linear_7947_76832"
        x1={175}
        y1={0}
        x2={175}
        y2={248.52}
        gradientUnits="userSpaceOnUse">
        <Stop stopColor="#5FE4F5" stopOpacity={0.3} />
        <Stop offset={0.26} stopColor="#93C6F8" stopOpacity={0.5} />
        <Stop offset={0.791379} stopColor="white" />
        <Stop offset={1} stopColor="white" />
      </LinearGradient>
    </Defs>
  </Svg>
);
export default PortfolioGraph;
