import { save, set } from "@/db/db";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import AddPerson from "./AddPerson";
import { useState } from "react";
import AddRelationship from "./AddRelationship";
import { UIWindow } from "./components";
import NodeList from "./NodeList";

export default function UI() {
  const [addPerson, setAddPerson] = useState(false);
  const [addRelationship, setAddRelationship] = useState(false);
  const [nodeList, setnodeList] = useState(true);

  return (
    <>
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={save}>
              Save <MenubarShortcut>CMD+S</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onClick={importDB}>
              Import <MenubarShortcut>CMD+I</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={() => setnodeList(true)}>
              People <MenubarShortcut>?</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Add</MenubarTrigger>
          <MenubarContent>
            <MenubarItem
              onClick={() => {
                setAddPerson(true);
              }}
            >
              Person <MenubarShortcut>CMD+SHIFT+P</MenubarShortcut>
            </MenubarItem>
            <MenubarItem
              onClick={() => {
                setAddRelationship(true);
              }}
            >
              Relationship <MenubarShortcut>CMD+SHIFT+R</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <UIWindow
        title="Add Person"
        openConditon={addPerson}
        onClose={() => setAddPerson(false)}
      >
        <AddPerson />
      </UIWindow>
      <UIWindow
        title="Add Person"
        openConditon={addRelationship}
        onClose={() => setAddRelationship(false)}
      >
        <AddRelationship />
      </UIWindow>

      <UIWindow
        openConditon={nodeList}
        title="People"
        onClose={() => setnodeList(false)}
      >
        <NodeList />
      </UIWindow>
    </>
  );
}

function importDB() {
  const fileUploadElement = document.createElement("input");
  fileUploadElement.type = "file";
  fileUploadElement.accept = ".json";
  fileUploadElement.click();

  fileUploadElement.addEventListener("change", () => {
    const files = fileUploadElement.files;
    if (files?.length ?? 0 > 0) {
      const file = files?.item(0);
      const reader = new FileReader();

      if (file) {
        reader.readAsText(file, "utf-8");
      }

      reader.addEventListener("load", (e) => {
        if (typeof e.target?.result === "string") {
          set(e.target.result);
        }
      });
    }
  });
}
