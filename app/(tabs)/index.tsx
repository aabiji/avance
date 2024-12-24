import { Text, TextInput, View } from "react-native";

import Graph from "@/app/components/Graph";
import { Button } from "@/app/components/Elements";
import { stylesheet, activeButton, inactiveButton } from "@/app/components/design";

export default function HomeScreen() {
  return (
    <View style={[stylesheet.container, { alignItems: "center" }]}>
      <View style={[stylesheet.row, { width: 100 }]}>
        <TextInput style={[stylesheet.header, stylesheet.bold]} keyboardType="numeric">100</TextInput>
        <Text style={[stylesheet.header, stylesheet.bold]}> lbs</Text>
      </View>

      <View style={[stylesheet.row, { width: "80%" }]}>
        <Button styling={ activeButton } label="Daily" />
        <Button styling={ inactiveButton } label="Weekly" />
        <Button styling={ inactiveButton } label="All" />
      </View>

      <Graph />
    </View>
  );
}