import * as React from "react";
import Svg, {
  G,
  Path,
  Mask,
  Rect,
  Defs,
  RadialGradient,
  Stop,
  LinearGradient,
} from "react-native-svg";
/* SVGR has dropped some elements not supported by react-native-svg: filter */
const LoginLogo = (props: any) => (
  <Svg
    width={60}
    height={60}
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <G opacity={0.5}>
      <Path
        d="M34.6783 4.87935L50.02 14.1214C52.5971 15.6738 54.1502 18.4832 54.0942 21.4913L53.7612 39.3986C53.7053 42.4066 52.0489 45.1563 49.4159 46.6119L33.7412 55.2772C31.1082 56.7328 27.8986 56.6731 25.3216 55.1207L9.97983 45.8786C7.40277 44.3262 5.84969 41.5168 5.90562 38.5088L6.2386 20.6014C6.29453 17.5934 7.95098 14.8437 10.584 13.3881L26.2587 4.7228C28.8917 3.26722 32.1012 3.3269 34.6783 4.87935Z"
        fill="url(#paint0_radial_5572_56043)"
        fillOpacity={0.2}
        stroke="url(#paint1_linear_5572_56043)"
        strokeWidth={3.1579}
      />
      <G filter="url(#filter0_d_5572_56043)">
        <Mask id="path-2-inside-1_5572_56043" fill="white">
          <Rect
            x={18.5405}
            y={26.8389}
            width={5.1862}
            height={14.262}
            rx={0.425532}
          />
        </Mask>
        <Rect
          x={18.5405}
          y={26.8389}
          width={5.1862}
          height={14.262}
          rx={0.425532}
          fill="#66FF66"
          stroke="url(#paint2_linear_5572_56043)"
          strokeWidth={5.1862}
          mask="url(#path-2-inside-1_5572_56043)"
        />
        <Mask id="path-3-inside-2_5572_56043" fill="white">
          <Path d="M20.5811 23.6101C20.5811 23.3751 20.7716 23.1846 21.0066 23.1846H21.0199C21.2549 23.1846 21.4454 23.3751 21.4454 23.6101V27.0742H20.5811V23.6101Z" />
        </Mask>
        <Path
          d="M20.5811 23.6101C20.5811 23.3751 20.7716 23.1846 21.0066 23.1846H21.0199C21.2549 23.1846 21.4454 23.3751 21.4454 23.6101V27.0742H20.5811V23.6101Z"
          fill="#66FF66"
          stroke="url(#paint3_linear_5572_56043)"
          strokeWidth={0.864366}
          mask="url(#path-3-inside-2_5572_56043)"
        />
        <Mask id="path-4-inside-3_5572_56043" fill="white">
          <Path d="M20.7012 41.1011H21.5655V44.5652C21.5655 44.8002 21.375 44.9907 21.14 44.9907H21.1267C20.8917 44.9907 20.7012 44.8002 20.7012 44.5652V41.1011Z" />
        </Mask>
        <Path
          d="M20.7012 41.1011H21.5655V44.5652C21.5655 44.8002 21.375 44.9907 21.14 44.9907H21.1267C20.8917 44.9907 20.7012 44.8002 20.7012 44.5652V41.1011Z"
          fill="#66FF66"
          stroke="url(#paint4_linear_5572_56043)"
          strokeWidth={0.864366}
          mask="url(#path-4-inside-3_5572_56043)"
        />
      </G>
      <G filter="url(#filter1_d_5572_56043)">
        <Mask id="path-5-inside-4_5572_56043" fill="white">
          <Rect
            x={27.1323}
            y={23.1426}
            width={5.1862}
            height={14.262}
            rx={0.425532}
          />
        </Mask>
        <Rect
          x={27.1323}
          y={23.1426}
          width={5.1862}
          height={14.262}
          rx={0.425532}
          fill="#00FF00"
          stroke="url(#paint5_linear_5572_56043)"
          strokeWidth={5.1862}
          mask="url(#path-5-inside-4_5572_56043)"
        />
        <Mask id="path-6-inside-5_5572_56043" fill="white">
          <Path d="M29.292 19.6794C29.292 19.4444 29.4825 19.2539 29.7175 19.2539H29.7308C29.9658 19.2539 30.1564 19.4444 30.1564 19.6794V23.1435H29.292V19.6794Z" />
        </Mask>
        <Path
          d="M29.292 19.6794C29.292 19.4444 29.4825 19.2539 29.7175 19.2539H29.7308C29.9658 19.2539 30.1564 19.4444 30.1564 19.6794V23.1435H29.292V19.6794Z"
          fill="#00FF00"
          stroke="url(#paint6_linear_5572_56043)"
          strokeWidth={0.864366}
          mask="url(#path-6-inside-5_5572_56043)"
        />
        <Mask id="path-7-inside-6_5572_56043" fill="white">
          <Path d="M29.2925 37.4048H30.1568V40.8689C30.1568 41.1039 29.9663 41.2944 29.7313 41.2944H29.718C29.483 41.2944 29.2925 41.1039 29.2925 40.8689V37.4048Z" />
        </Mask>
        <Path
          d="M29.2925 37.4048H30.1568V40.8689C30.1568 41.1039 29.9663 41.2944 29.7313 41.2944H29.718C29.483 41.2944 29.2925 41.1039 29.2925 40.8689V37.4048Z"
          fill="#00FF00"
          stroke="url(#paint7_linear_5572_56043)"
          strokeWidth={0.864366}
          mask="url(#path-7-inside-6_5572_56043)"
        />
      </G>
      <G filter="url(#filter2_d_5572_56043)">
        <Mask id="path-8-inside-7_5572_56043" fill="white">
          <Rect
            x={35.7217}
            y={19.2104}
            width={5.1862}
            height={14.262}
            rx={0.425532}
          />
        </Mask>
        <Rect
          x={35.7217}
          y={19.2104}
          width={5.1862}
          height={14.262}
          rx={0.425532}
          fill="#00CC00"
          stroke="url(#paint8_linear_5572_56043)"
          strokeWidth={5.1862}
          mask="url(#path-8-inside-7_5572_56043)"
        />
        <Mask id="path-9-inside-8_5572_56043" fill="white">
          <Path d="M37.8818 15.7454C37.8818 15.5103 38.0724 15.3198 38.3074 15.3198H38.3207C38.5557 15.3198 38.7462 15.5103 38.7462 15.7454V19.2095H37.8818V15.7454Z" />
        </Mask>
        <Path
          d="M37.8818 15.7454C37.8818 15.5103 38.0724 15.3198 38.3074 15.3198H38.3207C38.5557 15.3198 38.7462 15.5103 38.7462 15.7454V19.2095H37.8818V15.7454Z"
          fill="#00CC00"
          stroke="url(#paint9_linear_5572_56043)"
          strokeWidth={0.864366}
          mask="url(#path-9-inside-8_5572_56043)"
        />
        <Mask id="path-10-inside-9_5572_56043" fill="white">
          <Path d="M37.8818 33.4712H38.7462V36.9353C38.7462 37.1703 38.5557 37.3608 38.3207 37.3608H38.3074C38.0724 37.3608 37.8818 37.1703 37.8818 36.9353V33.4712Z" />
        </Mask>
        <Path
          d="M37.8818 33.4712H38.7462V36.9353C38.7462 37.1703 38.5557 37.3608 38.3207 37.3608H38.3074C38.0724 37.3608 37.8818 37.1703 37.8818 36.9353V33.4712Z"
          fill="#00CC00"
          stroke="url(#paint10_linear_5572_56043)"
          strokeWidth={0.864366}
          mask="url(#path-10-inside-9_5572_56043)"
        />
      </G>
    </G>
    <Defs>
      <RadialGradient
        id="paint0_radial_5572_56043"
        cx={0}
        cy={0}
        r={1}
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(30 1.5) rotate(90.5415) scale(57.955)">
        <Stop offset={0.311305} stopColor="#9F8FEF" />
        <Stop offset={1} stopColor="#9F8FEF" stopOpacity={0} />
      </RadialGradient>
      <LinearGradient
        id="paint1_linear_5572_56043"
        x1={30}
        y1={-3}
        x2={30}
        y2={64.75}
        gradientUnits="userSpaceOnUse">
        <Stop stopColor="#18FFFF" />
        <Stop offset={1} stopColor="#8A2BE2" />
      </LinearGradient>
      <LinearGradient
        id="paint2_linear_5572_56043"
        x1={21.0796}
        y1={25.9827}
        x2={21.9162}
        y2={42.3436}
        gradientUnits="userSpaceOnUse">
        <Stop stopColor="#18FFFF" />
        <Stop offset={1} stopColor="#8A2BE2" />
      </LinearGradient>
      <LinearGradient
        id="paint3_linear_5572_56043"
        x1={21.0042}
        y1={22.9511}
        x2={21.376}
        y2={27.3937}
        gradientUnits="userSpaceOnUse">
        <Stop stopColor="#18FFFF" />
        <Stop offset={1} stopColor="#8A2BE2" />
      </LinearGradient>
      <LinearGradient
        id="paint4_linear_5572_56043"
        x1={21.1244}
        y1={40.8676}
        x2={21.4961}
        y2={45.3102}
        gradientUnits="userSpaceOnUse">
        <Stop stopColor="#18FFFF" />
        <Stop offset={1} stopColor="#8A2BE2" />
      </LinearGradient>
      <LinearGradient
        id="paint5_linear_5572_56043"
        x1={29.6714}
        y1={22.2864}
        x2={30.508}
        y2={38.6473}
        gradientUnits="userSpaceOnUse">
        <Stop stopColor="#18FFFF" />
        <Stop offset={1} stopColor="#8A2BE2" />
      </LinearGradient>
      <LinearGradient
        id="paint6_linear_5572_56043"
        x1={29.7152}
        y1={19.0204}
        x2={30.0869}
        y2={23.463}
        gradientUnits="userSpaceOnUse">
        <Stop stopColor="#18FFFF" />
        <Stop offset={1} stopColor="#8A2BE2" />
      </LinearGradient>
      <LinearGradient
        id="paint7_linear_5572_56043"
        x1={29.7157}
        y1={37.1713}
        x2={30.0874}
        y2={41.6139}
        gradientUnits="userSpaceOnUse">
        <Stop stopColor="#18FFFF" />
        <Stop offset={1} stopColor="#8A2BE2" />
      </LinearGradient>
      <LinearGradient
        id="paint8_linear_5572_56043"
        x1={38.2608}
        y1={18.3543}
        x2={39.0974}
        y2={34.7151}
        gradientUnits="userSpaceOnUse">
        <Stop stopColor="#18FFFF" />
        <Stop offset={1} stopColor="#8A2BE2" />
      </LinearGradient>
      <LinearGradient
        id="paint9_linear_5572_56043"
        x1={38.305}
        y1={15.0863}
        x2={38.6768}
        y2={19.5289}
        gradientUnits="userSpaceOnUse">
        <Stop stopColor="#18FFFF" />
        <Stop offset={1} stopColor="#8A2BE2" />
      </LinearGradient>
      <LinearGradient
        id="paint10_linear_5572_56043"
        x1={38.305}
        y1={33.2377}
        x2={38.6768}
        y2={37.6803}
        gradientUnits="userSpaceOnUse">
        <Stop stopColor="#18FFFF" />
        <Stop offset={1} stopColor="#8A2BE2" />
      </LinearGradient>
    </Defs>
  </Svg>
);
export default LoginLogo;
