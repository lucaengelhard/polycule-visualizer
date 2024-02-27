import AddPerson from "./AddPerson";
import { ImportDB, SaveDB } from "./SaveLoad";

export default function UI() {
  return (
    <div>
      <div className="flex w-full justify-between gap-3 p-3">
        <div className="flex gap-3">
          <AddPerson />
          {/* <AddRelationship />*/}
        </div>
        <div className="flex gap-3">
          <SaveDB />
          <ImportDB />
        </div>
      </div>

      <div>
        {/*
        <EditPerson />
        <EditRel />*/}
      </div>
    </div>
  );
}

/*
export default function UI() {
  const [radioItems, setRadioItems] = useState<Types.RadioItems>({
    items: {
      0: { id: 0, name: "test", color: "#f13456" },
      1: { id: 1, name: "test2", color: "#ffffff" },
    },
  });

  useEffect(() => {
    console.log(radioItems);
  }, [radioItems]);

  return (
    <div className="p-3">
      <div className="flex gap-3">
        <SaveDB />
        <ImportDB />
        <RadioInput
          items={radioItems}
          setItems={setRadioItems}
          extendable={true}
          color={true}
        />
      </div>
    </div>
  );
}
*/
