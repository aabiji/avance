import { StyleSheet, Text, View } from "react-native";
import { LineChart, lineDataItem } from "react-native-gifted-charts";
import getTheme from "./theme";

function PointerLabel(
  item: lineDataItem[],
  _secondaryItem: object,
  _pointerIndex: number,
) {
  const label = item[0].label;
  return (
    <View style={styles.label}>
      <Text style={[styles.labelText, { color: getTheme().background }]}>
        {label}
      </Text>
    </View>
  );
}

export default function Graph({ data }: { data: lineDataItem[] }) {
  const lowest = Math.min(...data.map((entry) => entry.value)) - 1;
  return (
    <View style={styles.container}>
      <LineChart
        data={data}
        curved
        isAnimated
        showFractionalValues
        showVerticalLines
        hideOrigin
        rotateLabel
        thickness={3}
        dashGap={0}
        stepHeight={35}
        initialSpacing={1}
        yAxisOffset={lowest}
        yAxisColor={getTheme().textShade}
        xAxisColor={getTheme().textShade}
        dataPointsColor={getTheme().primary}
        color={getTheme().primary}
        rulesColor={getTheme().textShade}
        verticalLinesColor={getTheme().textShade}
        yAxisTextStyle={styles.labelText}
        xAxisLabelTextStyle={styles.labelText}
        pointerConfig={{
          activatePointersOnLongPress: true,
          pointerLabelComponent: PointerLabel,
          pointerColor: getTheme().primary,
          showPointerStrip: false,
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
    width: 60,
    padding: 5,
    alignSelf: "center",
    backgroundColor: getTheme().secondary,
  },
  labelText: {
    fontSize: 9,
    alignSelf: "center",
    color: getTheme().text,
  },
});
