import { View } from "react-native";
import { Link, Stack, useNavigation } from "expo-router";

import { Container } from "@/components/containers";
import { Button, ClickableIcon } from "@/components/buttons";
import { Input } from "@/components/inputs";

export default function FoodAdder() {
  const navigation = useNavigation();

  const saveSelection = () => {
    navigation.goBack();
  };

  const search = (data: string) => {
    console.log("query", data);
  };

  return (
    <Container>
      <Stack.Screen
        options={{
          title: "Add food",
          headerRight: () => (
            <ClickableIcon transparent name="checkmark" onPress={() => saveSelection()} />
          ),
        }}
      />

      <View>
        <Input placeholder={"Search food"} setData={search} />
        <Link href="/createFood" asChild>
          <Button label={"Create custom"} />
        </Link>
      </View>
    </Container>
  );
}
