import { Text, TextInput, View } from "react-native";
import Button from "@/app/components/Button";
import Graph from "@/app/components/Graph";
import styles from "@/app/components/styles";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={[styles.row, { width: 100, alignSelf: "center" }]}>
        <TextInput style={styles.header} keyboardType="numeric">100</TextInput>
        <Text style={styles.header}> lbs</Text>
      </View>

      <View style={[styles.row, { width: "80%", alignSelf: "center" }]}>
        <Button text="Daily" />
        <Button text="Weekly" />
        <Button text="All" />
      </View>

      <Graph />
    </View>
  );
}