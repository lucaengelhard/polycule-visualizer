import { save, set } from "@/db/db";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  //MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import AddPerson from "./AddPerson-v2";

export default function UI() {
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
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Add</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              Person <MenubarShortcut>CMD+SHIFT+P</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Relationship <MenubarShortcut>CMD+SHIFT+R</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <AddPerson />
    </>
  );
}
