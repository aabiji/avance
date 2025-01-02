import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { Link } from "expo-router";

import { Container, SwipeableCard } from "@/components/containers";
import { ClickableIcon } from "@/components/buttons";
import { ThemedText } from "@/components/text";
import { GradientSeparator } from "@/components/border";
import getTheme from "@/components/theme";

import request from "@/lib/http";

interface Food {
  name: string;
  servings: number;
  calories: number;
}

function FoodCard({ food, removeSelf }: { food: Food, removeSelf: () => void }) {
  return (
    <SwipeableCard maxXOffset={-50} style={{ height: 100 }}>
      <Container row style={{ width: "100%", height: "100%", paddingHorizontal: 20 }}>
        <ThemedText text={food.servings} />
        <ThemedText bold text={food.name} />
        <ThemedText dimmed text={`${food.calories} cal`} />
      </Container>
      <View>
        <ClickableIcon
          style={{ backgroundColor: "red", height: "100%" }}
          name={"trash-bin"}
          onPress={removeSelf}
        />
      </View>
    </SwipeableCard>
  );
}

export default function FoodTracker() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [calorieTotal, setCalorieTotal] = useState<number>(0);
  const max = 1500;

  useEffect(() => {
    request({
      method: "GET",
      endpoint: "/get_user_data",
      onError: (msg: unknown) => console.log("ERROR", msg),
      handler: (response: object) => {
        const data = response["foodLog"];
        const total = data.reduce((a: number, b: Food) => a + b.calories * b.servings, 0);
        setFoods(data);
        setCalorieTotal(total);
      }
    })
  }, []);

  const removeFood = (index: number) => {
    let copy = [...foods];
    copy.splice(index, 1);
    setFoods(copy);
  };

  return (
    <Container>
      <Container row style={{ width: "100%" }}>
        <Container row>
          <ThemedText header text={`${calorieTotal} / ${max}`} />
          <ThemedText text={"cal"} style={{ marginLeft: 10, marginTop: 5 }} />
        </Container>
        <Link href="/addFood" asChild>
          <ClickableIcon name="add-outline" />
        </Link>
      </Container>

      <GradientSeparator
        colors={[getTheme().secondary, getTheme().accent]}
        percentage={1.0}
      />

      <FlatList
        data={foods}
        renderItem={({ item, index }) =>
          <FoodCard food={item} removeSelf={() => removeFood(index)} />
        }
        contentContainerStyle={{ width: "100%", marginHorizontal: -10 }}
      />
    </Container>
  );
}
