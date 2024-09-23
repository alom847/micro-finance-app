import React from "react";
import { Separator, SizableText, Tabs, Theme } from "tamagui";
import Basic from "../../../components/profile/basic";
import Address from "../../../components/profile/address";
import Contact from "../../../components/profile/contact";

type Props = {};

function EditProfile({}: Props) {
  return <HorizontalTabs />;
}

export default EditProfile;

const HorizontalTabs = () => {
  return (
    <Tabs
      defaultValue="tab1"
      orientation="horizontal"
      flexDirection="column"
      borderRadius="$4"
      borderWidth="$0.25"
      overflow="hidden"
      borderColor="$borderColor"
    >
      <Theme name={"blue"}>
        <Tabs.List
          separator={<Separator vertical />}
          disablePassBorderRadius="bottom"
          aria-label="Manage your account"
        >
          <Tabs.Tab flex={1} value="tab1">
            <SizableText>Basic</SizableText>
          </Tabs.Tab>
          <Tabs.Tab flex={1} value="tab2">
            <SizableText>Address</SizableText>
          </Tabs.Tab>
          <Tabs.Tab flex={1} value="tab3">
            <SizableText>Contact</SizableText>
          </Tabs.Tab>
        </Tabs.List>
      </Theme>

      <Separator />

      <Tabs.Content value="tab1">
        <Basic />
      </Tabs.Content>

      <Tabs.Content value="tab2">
        <Address />
      </Tabs.Content>

      <Tabs.Content value="tab3">
        <Contact />
      </Tabs.Content>
    </Tabs>
  );
};
