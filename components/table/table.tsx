import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { RenderCell } from "./render-cell";

export const TableWrapper = () => {
  const [menus, setMenus] = useState<
    Array<{ id: number; title: string; icon: string; submenus: any[] }>
  >([]);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await fetch("/api/menus");
        const data = await response.json();
        setMenus(data);
      } catch (error) {
        console.error("Error fetching menu data:", error);
      }
    };

    fetchMenus();
  }, []);

  const columns = [
    { uid: "title", name: "Title" },
    { uid: "icon", name: "Icon" },
    { uid: "submenus", name: "Submenus" },
    { uid: "actions", name: "Actions" },
  ];

  return (
    <div className="w-full flex flex-col gap-4">
      <Table aria-label="Menu Table">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              hideHeader={column.uid === "actions"}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={menus}>
          {(menu) => (
            <TableRow key={menu.id}>
              {(columnKey) => (
                <TableCell>
                  <RenderCell menu={menu} columnKey={columnKey} />
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
