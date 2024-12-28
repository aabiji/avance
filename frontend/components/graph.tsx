import { StyleSheet, Text, View } from "react-native";
import { LineChart, lineDataItem } from "react-native-gifted-charts";
import { fontSize, getTheme } from "./theme";

function PointerLabel(
  items: lineDataItem[],
  _secondaryItem: object,
  _pointerIndex: number,
) {
  const item = items[0];
  return (
    <View style={[styles.label, { width: 80 }]}>
      <Text style={[styles.labelText, { color: getTheme().background }]}>
        {item.label}
      </Text>
      <Text style={[styles.labelText, { color: getTheme().background }]}>
        {item.value}
      </Text>
    </View>
  );
}

// TODO: rewrite a better line graph implementation ourselves
export default function Graph({
  data,
  showEverything,
}: {
  data: lineDataItem[];
  showEverything: boolean;
}) {
  const lowest = Math.min(...data.map((entry) => entry.value)) - 1;
  return (
    <View style={styles.container}>
      <LineChart
        data={data}
        isAnimated
        showFractionalValues
        animateOnDataChange
        showVerticalLines
        hideOrigin
        rotateLabel
        scrollToEnd
        thickness={3}
        dashGap={0}
        stepHeight={35}
        initialSpacing={1}
        adjustToWidth={showEverything}
        yAxisOffset={lowest}
        yAxisColor={getTheme().textShade}
        xAxisColor={getTheme().textShade}
        dataPointsColor={getTheme().primary}
        color={getTheme().primary}
        rulesColor={getTheme().textShade}
        verticalLinesColor={getTheme().textShade}
        yAxisTextStyle={[styles.labelText, { width: 30 }]}
        xAxisLabelTextStyle={[styles.labelText, { width: 200 }]}
        pointerConfig={{
          activatePointersOnLongPress: true,
          pointerLabelComponent: PointerLabel,
          pointerColor: getTheme().primary,
          showPointerStrip: true
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  label: {
    padding: 5,
    alignSelf: "center",
    backgroundColor: getTheme().primary,
  },
  labelText: {
    fontSize: fontSize.small,
    alignSelf: "center",
    color: getTheme().text,
  },
});
