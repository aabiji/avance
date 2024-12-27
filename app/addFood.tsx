import { Link, Stack, useNavigation } from "expo-router";

import { Container } from "@/components/containers";
import { Button, ClickableIcon } from "@/components/buttons";
import { Input } from "@/components/inputs";

import getTheme from "@/components/theme";

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
          headerStyle: { backgroundColor: getTheme().tabBar },
          headerTitleStyle: { color: getTheme().text },
          headerTintColor: getTheme().text,
          headerRight: () => (
            <ClickableIcon
              transparent
              name="checkmark"
              onPress={() => saveSelection()}
            />
          ),
        }}
      />

      <Input placeholder={"Search food"} setData={search} />
      <Link href="/createFood" asChild>
        <Button label={"Create custom"} />
      </Link>
    </Container>
  );
}
