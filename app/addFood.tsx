import { NativeSyntheticEvent, TextInput, TextInputFocusEventData, View } from "react-native";
import { Link, Stack, useNavigation } from "expo-router";

import { Button } from "@/components/Elements";
import { activeButton, colors, stylesheet, transparentButton } from "@/app/components/design";

function search(e: NativeSyntheticEvent<TextInputFocusEventData>) {
  const input = e.nativeEvent.text;
  console.log(input);
}

export default function FoodAdder() {
  const navigation = useNavigation();

  const saveSelection = () => {
    navigation.goBack();
  }

  return (
    <View style={ stylesheet.container }>
      <Stack.Screen
        options={{
          title: "Add food",
          headerRight: () =>
            <Button
              label="checkmark"
              hasIcon
              color={ colors.blue }
              onPress={() => saveSelection()} styling={transparentButton}
            />
          }}
      />

      <View
        style={{
          backgroundColor: colors.grey,
          marginTop: -10, marginLeft: -10,
          marginRight: -10, padding: 10
        }}>
        <TextInput
          placeholder="Search food"
          style={ stylesheet.input }
          onChange={(event) => search(event)}
        />
        <Link href="/createFood" asChild>
          <Button label="Create custom" styling={activeButton} />
        </Link>
      </View>

    </View>
  )
}
