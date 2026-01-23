import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Svg, { Path } from "react-native-svg";
import { ThemeProvider, useTheme } from "./components/ThemeContext";
import { SavedArticlesProvider } from "./components/SavedArticlesContext";
import { ReelProvider } from "./components/ReelContext";

import GetStarted from "./components/GetStarted";
import Home from "./components/Home";
import Column from "./components/Column";
import Upload from "./components/Upload";
import Reels from "./components/Reels";
import Profile from "./components/Profile";
import DeepDive from "./components/DeepDive";
import SignUpScreen from "./components/SignUpScreen";
import SignUpJournalist from "./components/SignUpJournalist";
import SignUpUser from "./components/SignUpUser";
import LoginScreen from "./components/Login";
import UploadReels from "./components/UploadReels";
import UploadArticle from "./components/UploadColumns";
import EditProfile from "./components/EditProfile";
import ProfileSetting from "./components/ProfileSetting";
import SavedArticles from "./components/SavedArticles";
import ReadArticles from "./components/ReadColumns";
import ArticleDetail from "./components/ColumnDetails";
import YourColumns from "./components/YourColumns";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const { width } = Dimensions.get("window");

const TAB_BAR_HEIGHT = 58;
const CUTOUT_RADIUS = 32;

function CurvedBackground({ activeIndex }: { activeIndex: number }) {
  const tabWidth = width / 5;
  const radius = CUTOUT_RADIUS;
  const cornerCurve = 10;
  const centerX = activeIndex * tabWidth + tabWidth / 2;
  const { colors } = useTheme();

  return (
    <Svg
      width={width}
      height={TAB_BAR_HEIGHT}
      style={{ position: "absolute", bottom: 0 }}
      viewBox={`0 0 ${width} ${TAB_BAR_HEIGHT}`}
    >
      <Path
        d={`M0 0
          H${centerX - radius - cornerCurve}
          C${centerX - radius - cornerCurve / 2} 0, ${centerX - radius} ${cornerCurve / 2}, ${centerX - radius} ${cornerCurve}
          A${radius} ${radius} 0 0 0 ${centerX + radius} ${cornerCurve}
          C${centerX + radius} ${cornerCurve / 2}, ${centerX + radius + cornerCurve / 2} 0, ${centerX + radius + cornerCurve} 0
          H${width}
          V${TAB_BAR_HEIGHT}
          H0
          Z`}
        fill={colors.card}
      />
    </Svg>
  );
}

// Themed Bottom Tab Bar
function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors, isDarkMode } = useTheme();
  const activeColor = colors.primary;
  const inactiveColor = isDarkMode ? "#888" : "#A0A0A0";
  const activeIndex = state.index;

  return (
    <View
      style={[
        styles.tabWrapper,
        {
          height: TAB_BAR_HEIGHT,
          backgroundColor: colors.card,
        },
        Platform.select({
          ios: {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
          },
          android: {
            elevation: 12,
          },
        }),
      ]}
    >
      <CurvedBackground activeIndex={activeIndex} />

      <View style={styles.tabContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;
          const iconName =
            route.name === "Home"
              ? "home-outline"
              : route.name === "Column"
              ? "document-text-outline"
              : route.name === "Upload"
              ? "add-circle-outline"
              : route.name === "Reels"
              ? "play-circle-outline"
              : "person-outline";

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={index}
              onPress={onPress}
              activeOpacity={0.8}
              style={styles.tabButton}
            >
              {isFocused ? (
                <View
                  style={[
                    styles.activeCircle,
                    { backgroundColor: activeColor, bottom: 30 },
                  ]}
                >
                  <Ionicons name={iconName} size={22} color="#fff" />
                </View>
              ) : (
                <Ionicons name={iconName} size={22} color={inactiveColor} />
              )}

              <Text
                style={{
                  color: isFocused ? activeColor : inactiveColor,
                  fontSize: 12,
                  marginTop: isFocused ? -5 : 4,
                }}
              >
                {typeof label === "string" ? label : route.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

//  Bottom Tab Navigator
function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Column" component={Column} />
      <Tab.Screen name="Upload" component={Upload} />
      <Tab.Screen name="Reels" component={Reels} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

// Themed Navigation Setup
function ThemedNavigation() {
  const { colors, isDarkMode } = useTheme();

  const navTheme = {
    ...(isDarkMode ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDarkMode ? DarkTheme.colors : DefaultTheme.colors),
      primary: colors.primary,
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: isDarkMode ? "#222" : "#ddd",
      notification: colors.primary,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        initialRouteName="GetStarted"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="GetStarted" component={GetStarted} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        <Stack.Screen name="SignUpJournalist" component={SignUpJournalist} />
        <Stack.Screen name="SignUpUser" component={SignUpUser} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="Main" options={{ headerShown: false }}>
          {() => <BottomTabs />}
        </Stack.Screen>
        <Stack.Screen name="DeepDive" component={DeepDive} />
        <Stack.Screen name="UploadReels" component={UploadReels} />
        <Stack.Screen name="UploadArticles" component={UploadArticle} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="ProfileSetting" component={ProfileSetting} />
        <Stack.Screen name="SavedArticles" component={SavedArticles} />
        <Stack.Screen name="ReadArticles" component={ReadArticles} />
        <Stack.Screen name="ArticleDetail" component={ArticleDetail} />
        <Stack.Screen name="YourColumns" component={YourColumns}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Wrap all Providers
export default function App() {
  return (
    <SavedArticlesProvider>
      <ThemeProvider>
        <ReelProvider>
          <ThemedNavigation />
        </ReelProvider>
      </ThemeProvider>
    </SavedArticlesProvider>
  );
}

// Styles
const styles = StyleSheet.create({
  tabWrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    height: "100%",
    backgroundColor: "transparent",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  activeCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
  },
});
