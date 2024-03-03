import { FolderUp, Save } from "lucide-react";

import { useContext } from "react";
import { DBContext } from "../App";

import { transformSetsToArray } from "../utils/helpers";
import { Button } from "./components";
import { db, set } from "../db/db";

export function SaveDB() {
  function save() {
    const saveDB = transformSetsToArray(db);

    const saveString = JSON.stringify(saveDB);

    console.log(JSON.parse(saveString));

    const blob = new Blob([saveString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    const date = new Date();
    const filename = `polycule-visualizer-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

    link.download = filename;
    link.href = url;
    link.click();
    link.remove();
  }

  return <Button icon={<Save />} onClick={save} />;
}

export function ImportDB() {
  const { setDBState } = useContext(DBContext);
  function importJSON() {
    const fileUploadElement = document.createElement("input");
    fileUploadElement.type = "file";
    fileUploadElement.accept = ".json";
    fileUploadElement.click();

    fileUploadElement.addEventListener("change", () => {
      setDBState({ nodes: {}, links: {}, linkTypes: {} });
      const files = fileUploadElement.files;

      if (files?.length ?? 0 > 0) {
        const file = files?.item(0);
        const reader = new FileReader();

        if (file) {
          reader.readAsText(file, "utf-8");
        }

        reader.addEventListener("load", (e) => {
          if (typeof e.target?.result === "string") {
            try {
              set(e.target.result, false);
              console.log(db);
              setDBState({ ...db });
            } catch (error) {
              throw new Error(`${error} while importing`);
            }
          }
        });
      }
    });
  }

  return <Button icon={<FolderUp />} onClick={importJSON} />;
}
