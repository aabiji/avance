import { FlatList, View } from "react-native";
import { Link } from "expo-router";

import { SwipeableCard, Container, Row } from "@/components/containers";
import { ClickableIcon } from "@/components/buttons";
import { ThemedText } from "@/components/text";
import { GradientSeparator } from "@/components/border";

interface Food {
  amount: number;
  name: string;
  calories: number;
}

function FoodItem({ item }: { item: Food }) {
  const handleDelete = () => {
    console.log("deleting!");
  }

  return (
    <SwipeableCard maxXOffset={-50}>
      <Row>
        <ThemedText text={item.amount} />
        <ThemedText bold text={item.name} />
        <ThemedText dimmed text={`${item.calories} cal`} />
      </Row>
      <View>
        <ClickableIcon style={{ backgroundColor: "red", height: "100%" }} name={"trash-bin"} onPress={handleDelete} />
      </View>
    </SwipeableCard>
  );
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
    <Container noScroll>
      <Row style={{ width: "100%" }}>
        <Row>
          <ThemedText header text={`${total} / ${max}`} />
          <ThemedText text={"cal"} style={{ marginLeft: 10, marginTop: 5 }} />
        </Row>
        <Link href="/addFood" asChild>
          <ClickableIcon name="add-outline" />
        </Link>
      </Row>

      <GradientSeparator />

      <FlatList
        renderItem={({ item }) => <FoodItem item={item} />}
        data={items}
        style={{ marginLeft: -10, marginRight: -10 }}
      />
    </Container>
  );
}
