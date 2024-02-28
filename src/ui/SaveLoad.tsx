import { FolderUp, Save } from "lucide-react";
import { db, set } from "../db/db";
import { Button } from "./Components";
import { useContext } from "react";
import { DBContext } from "../App";

export function SaveDB() {
  function save() {
    const saveString = JSON.stringify(db);

    const blob = new Blob([saveString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.download = "polycule-visualizer";
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
      const files = fileUploadElement.files;

      if (files?.length ?? 0 > 0) {
        const file = files?.item(0);
        const reader = new FileReader();

        if (file) {
          reader.readAsText(file, "utf-8");
        }

        reader.addEventListener("load", (e) => {
          if (typeof e.target?.result === "string") {
            set(e.target.result, false);

            console.log(db);
            setDBState({ ...db });
          }
        });
      }
    });
  }

  return <Button icon={<FolderUp />} onClick={importJSON} />;
}
