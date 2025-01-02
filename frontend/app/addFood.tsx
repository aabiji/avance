import { Link, useNavigation } from "expo-router";

import { Container } from "@/components/containers";
import { Button } from "@/components/buttons";
import { Input } from "@/components/inputs";
import Screen from "@/components/screen";

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
      <Screen name={"Add food"} handleGoingBack={saveSelection} />

      <Input placeholder={"Search food"} setData={search} />
      <Link href="/createFood" asChild>
        <Button label={"Create custom"} />
      </Link>
    </Container>
  );
}
