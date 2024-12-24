import { Text, View, FlatList } from "react-native";
import { Link } from "expo-router";
import LinearGradient from "react-native-linear-gradient";

import { Button } from "@/app/components/Elements";
import { colors, activeButton, stylesheet } from "@/app/components/design";

interface Food {
  amount: number,
  name: string,
  calories: number,
}

function FoodItem({ item }: { item: Food }) {
  return (
    <View style={[stylesheet.row, stylesheet.card]}>
      <Text style={stylesheet.text}> {item.amount} </Text>
      <Text style={[stylesheet.text, {fontWeight: "bold"}]}> {item.name} </Text>
      <Text style={[stylesheet.text, stylesheet.dimmed]}> {item.calories} kCal</Text>
    </View>
  )
}

export default function FoodTracker() {
  const items: Food[] = [
    { amount: 1, name: "Food item 1", calories: 100 },
    { amount: 2, name: "Food item 2", calories: 120 },
    { amount: 2, name: "Food item 3", calories: 300 },
    { amount: 1, name: "Food item 4", calories: 100 },
    { amount: 4, name: "Food item 5", calories: 50 },
    { amount: 4, name: "Food item 5", calories: 50 },
  ];
  const total = items.reduce((a, b) => a + b.calories * b.amount, 0);
  const max = 1500;

  return (
    <View style={stylesheet.container}>
      <View style={[stylesheet.row, { width: "100%" }]}>
        <Text style={[stylesheet.text, stylesheet.dimmed]}>
          <Text style={[stylesheet.header, stylesheet.bold]}> {total} / {max} </Text> kcal
        </Text>

        <Link href="/addFood" asChild>
          <Button label="+" styling={ activeButton } />
        </Link>
      </View>
      <LinearGradient
        colors={[ colors.aquamarine, colors.blue ]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={ stylesheet.hr } />
      <FlatList
        renderItem={( { item } ) => <FoodItem item={item}/> }
        data={items}
        style={{ marginLeft: -10, marginRight: -10 }}
      />
    </View>
  )
}