import { Button, Text, TextInput, View, StyleSheet } from "react-native";

export default function HomeScreen() {
  return (
    <View>
      <Text> <TextInput keyboardType="numeric"> 139 </TextInput> lbs </Text>
      <Button title="Daily" />
      <Button title="Weekly" />
      <Button title="All" />
      <View>
        <Text> Graph goes here </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({ });