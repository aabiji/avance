import { Text, TextInput, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { useState } from "react";

import { RadioButtonGroup } from "@/app/components/Elements";
import { colors, labelButton, stylesheet } from "@/app/components/design";

function PointerLabel(item: object[], _secondaryItem: object, _pointerIndex: number) {
  const label = item[0].label;
  return (
    <View style={{
        width: 60,
        backgroundColor: colors.grey,
        padding: 5,
        alignSelf: "center"
      }}>
      <Text style={{ fontSize: 9, alignSelf: "center" }}>{label}</Text>
    </View>
  )
}

export default function HomeScreen() {
  const [selection, setSelection] = useState(0);

  // Dummy data
  const data = [
    {value: 142.2, label: "Dec 11"},
    {value: 140.9, label: "Dec 12"},
    {value: 142.2, label: "Dec 13"},
    {value: 139.3, label: "Dec 14"},
    {value: 141.9, label: "Dec 16"},
    {value: 142.0, label: "Dec 17"},
    {value: 140.4, label: "Dec 18"},
    {value: 139.2, label: "Dec 19"},
    {value: 138.8, label: "Dec 20"},
    {value: 139.1, label: "Dec 21"},
    {value: 142.0, label: "Dec 22"},
    {value: 140.1, label: "Dec 23"},
    {value: 142.9, label: "Dec 24"},
  ];
  const values = data.map((entry) => entry.value);
  const lowest = Math.min(...values) - 1;

  return (
    <View style={[stylesheet.container, { alignItems: "center" }]}>
      <View style={[stylesheet.row, { width: 100, height: "20%" }]}>
        <TextInput style={[stylesheet.header]} keyboardType="numeric">100</TextInput>
        <Text style={stylesheet.header}> lbs</Text>
      </View>

      <RadioButtonGroup
        options={["Daily", "Weekly", "Full"]}
        styling={ labelButton }
        selection={selection}
        setSelection={setSelection}
      />

      <View style={ stylesheet.graph }>
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
          color={ colors.blue }
          yAxisTextStyle={{ fontSize: 9 }}
          xAxisLabelTextStyle={{ fontSize: 9 }}
          pointerConfig={{
            activatePointersOnLongPress: true,
            pointerLabelComponent: PointerLabel,
            pointerColor: colors.darkgrey,
            showPointerStrip: false
          }}
        />
      </View>
    </View>
  );
}