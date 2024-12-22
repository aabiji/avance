import { Text, View, FlatList } from "react-native";
import { Link } from "expo-router";
import Button from "@/app/components/Button";
import styles from "@/app/components/styles";

interface Food {
  amount: number,
  name: string,
  calories: number,
}

function FoodItem({ item }: { item: Food }) {
  return (
    <View style={styles.row}>
      <Text style={styles.text}> {item.amount} </Text>
      <Text style={[styles.text, {fontWeight: "bold"}]}> {item.name} </Text>
      <Text style={styles.text}> {item.calories} kCal</Text>
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

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.text}>
          <Text style={styles.header}> {total} / 1500 </Text> kcal
        </Text>

        <Link href="/addFood" asChild>
          <Button text="+"/>
        </Link>
      </View>

      <FlatList
        contentContainerStyle={styles.list}
        renderItem={( { item } ) => <FoodItem item={item}/> }
        data={items}
      />
    </View>
  )
}