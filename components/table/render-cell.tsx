import React from "react";
import { Tooltip, Chip } from "@nextui-org/react";
import { DeleteIcon } from "../icons/table/delete-icon";
import { EditIcon } from "../icons/table/edit-icon";
import { EyeIcon } from "../icons/table/eye-icon";

interface Props {
  menu: {
    id: number;
    title: string;
    icon: string;
    submenus: any[];
  };
  columnKey: string | React.Key;
}

export const RenderCell = ({ menu, columnKey }: Props) => {
  const cellValue = menu[columnKey as keyof typeof menu];

  switch (columnKey) {
    case "title":
      return <span>{menu.title}</span>;

    case "icon":
      return <span>{menu.icon}</span>; // Replace with an icon component if necessary

    case "submenus":
      return (
        <ul>
          {menu.submenus.map((submenu, index) => (
            <li key={index}>{submenu.title}</li>
          ))}
        </ul>
      );

    case "actions":
      return (
        <div className="flex items-center gap-4">
          <Tooltip content="Details">
            <button onClick={() => console.log("View menu", menu.id)}>
              <EyeIcon size={20} fill="#979797" />
            </button>
          </Tooltip>
          <Tooltip content="Edit menu" color="secondary">
            <button onClick={() => console.log("Edit menu", menu.id)}>
              <EditIcon size={20} fill="#979797" />
            </button>
          </Tooltip>
          <Tooltip content="Delete menu" color="danger">
            <button onClick={() => console.log("Delete menu", menu.id)}>
              <DeleteIcon size={20} fill="#FF0080" />
            </button>
          </Tooltip>
        </div>
      );

    default:
      return <span>{cellValue}</span>;
  }
};
