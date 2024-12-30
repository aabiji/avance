import { useRef } from "react";

import { Animated, FlatList, PanResponder, View } from "react-native";
import { Link } from "expo-router";

import { Card, Container, Row } from "@/components/containers";
import { ClickableIcon } from "@/components/buttons";
import { ThemedText } from "@/components/text";
import { GradientSeparator } from "@/components/border";

interface Food {
  amount: number;
  name: string;
  calories: number;
}

function FoodItem({ item }: { item: Food }) {
  const pan = useRef(new Animated.ValueXY()).current;

  // Show hidden controls on left swipe
  // TODO: style this better
  // TODO: should make this a component
  const panResponder = useRef(PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_event, gestureState) => {
      const x = Math.min(Math.max(-100, gestureState.dx), 0);
      pan.setValue({ x: x, y: 0 });
    },
    onPanResponderRelease: (_event, gestureState) => {
      if (gestureState.dx < -100) { // left swipe
        Animated.timing(pan, {
          toValue: { x: -100, y: 0 },
          useNativeDriver: true,
          duration: 200
        }).start();
      } else {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
          friction: 7,
          tension: 40,
        }).start();
      }
    },
  })).current;

  const handlePress = () => {
    console.log("Deleting food item!");
    Animated.timing(pan, {
      toValue: { x: 0, y: 0 },
      duration: 200,
      useNativeDriver: true
    }).start();
  }

  return (
    <Animated.View {...panResponder.panHandlers} style={{ flexDirection: "row", transform: [{translateX: pan.x}, {translateY: pan.y}] }}>
      <Card>
        <ThemedText text={item.amount} />
        <ThemedText bold text={item.name} />
        <ThemedText dimmed text={`${item.calories} cal`} />
      </Card>
      <ClickableIcon style={{ height: "100%", width: 100 }} name={"trash-bin"} onPress={handlePress} />
    </Animated.View>
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
