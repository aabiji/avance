import { useEffect, useState } from "react";

import { FlatList, View } from "react-native";
import { Link } from "expo-router";

import { Container, SwipeableCard } from "@/components/containers";
import { ClickableIcon } from "@/components/buttons";
import { ThemedText } from "@/components/text";
import getColors from "@/components/theme";

import useStorage from "@/lib/storage";

interface Food {
  name: string;
  servings: number;
  calories: number;
}

function FoodCard({ food, removeSelf }: { food: Food, removeSelf: () => void }) {
  return (
    <SwipeableCard maxXOffset={-50} style={{ height: 100 }}>
      <Container row style={{
        width: "100%", height: "100%", paddingHorizontal: 20,
        backgroundColor: getColors().background["300"],
      }}>
        <ThemedText text={food.servings} />
        <ThemedText bold text={food.name} />
        <ThemedText dimmed text={`${food.calories} cal`} />
      </Container>
      <View>
        <ClickableIcon
          style={{
            backgroundColor: getColors().red,
            height: "100%", borderRadius: 0, width: "110%"
          }}
          name={"trash-bin"}
          onPress={removeSelf}
        />
      </View>
    </SwipeableCard>
  );
}

export default function FoodTracker() {
  const [foods, setFoods] = useStorage("foodLog", []);
  const [calorieTotal, setCalorieTotal] = useState<number>(0);
  const max = 1500;

  useEffect(() => {
    const sum = foods.reduce((a: number, b: Food) => a + b.calories * b.servings, 0);
    setCalorieTotal(sum);
  }, []);

  const removeFood = (index: number) => {
    let copy = [...foods];
    copy.splice(index, 1);
    setFoods(copy);
  };

  return (
    <Container>
      <Container row style={{ width: "100%", marginBottom: 10 }}>
        <Container row>
          <ThemedText header text={`${calorieTotal} / ${max}`} />
          <ThemedText text={"cal"} style={{ marginLeft: 10, marginTop: 5 }} />
        </Container>
        <Link href="/addFood" asChild>
          <ClickableIcon name="add-outline" />
        </Link>
      </Container>

      <FlatList
        data={foods}
        renderItem={({ item, index }) =>
          <FoodCard food={item} removeSelf={() => removeFood(index)} />
        }
        style={{ width: "100%" }}
        contentContainerStyle={{ marginHorizontal: -10, paddingHorizontal: 5 }}
      />
    </Container>
  );
}
