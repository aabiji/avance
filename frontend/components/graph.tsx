import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { LineChart, lineDataItem } from "react-native-gifted-charts";
import { fontSize, getColors } from "./theme";

function PointerLabel(
  items: lineDataItem[],
  _secondaryItem: object,
  _pointerIndex: number,
) {
  const item = items[0];
  return (
    <View style={[styles.label, { width: 80 }]}>
      <Text style={[styles.labelText, { color: getColors().background["default"] }]}>
        {item.label}
      </Text>
      <Text style={[styles.labelText, { color: getColors().background["default"] }]}>
        {item.value}
      </Text>
    </View>
  );
}

// TODO: rewrite a better line graph implementation ourselves
// TODO: and stress test by drawing a full graph with thousands of data points
// TODO: could we use the Ramer-Douglas-Peuker algorithm to simplify the graph when
//       we could also use the MinMax algorithm to "downsample" the poitns
// TODO: or, we could fix the annoying bugs in react-native-gifted-charts. what to do???
// TODO: remove the extra space at the end of the graph.
export default function Graph({
  data,
  showEverything,
}: {
  data: lineDataItem[];
  showEverything: boolean;
}) {
  const [lowest, setLowest] = useState(0);
  useEffect(() => {
    const values = data.map((entry: lineDataItem) => entry.value!);
    if (values.length > 0) setLowest(Math.min(...values) - 1);
  }, [data]);

  return (
    <View style={{ width: "100%", overflow: "hidden" }}>
      <LineChart
        data={data}
        showFractionalValues
        animateOnDataChange
        hideOrigin
        scrollToEnd
        rotateLabel
        hideRules
        curved
        thickness={3}
        yAxisOffset={lowest}
        stepHeight={25}
        endSpacing={0}
        initialSpacing={0}
        adjustToWidth={showEverything ?? false}
        yAxisColor={getColors().background["300"]}
        xAxisColor={getColors().background["300"]}
        dataPointsColor={getColors().primary["default"]}
        backgroundColor={getColors().background["default"]}
        color={getColors().primary["default"]}
        yAxisTextStyle={[styles.labelText]}
        xAxisLabelTextStyle={[styles.labelText, { width: 200 }]}
        pointerConfig={{
          activatePointersOnLongPress: true,
          pointerLabelComponent: PointerLabel,
          pointerColor: getColors().primary["default"],
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    padding: 5,
    alignSelf: "center",
    backgroundColor: getColors().primary["600"],
  },
  labelText: {
    fontSize: fontSize.small,
    alignSelf: "center",
    color: getColors().text["default"]
  },
});
