import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";

export const AddMenu = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [menus, setMenus] = useState<any[]>([]);
  const [newMenuName, setNewMenuName] = useState("");
  const [newMenuIcon, setNewMenuIcon] = useState("");

  useEffect(() => {
    // Fetch menu data from API
    const fetchMenus = async () => {
      try {
        const response = await fetch("/api/menus");
        const data = await response.json();
        setMenus(data);
      } catch (error) {
        console.error("Error fetching menus:", error);
      }
    };
    fetchMenus();
  }, []);

  const handleAddMenu = async () => {
    try {
      const response = await fetch("/api/menus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newMenuName, // Adjusted to match the API field
          icon: newMenuIcon,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add menu");
      }

      // Refresh the menu list after adding a new menu
      const updatedMenu = await response.json();
      setMenus((prevMenus) => [...prevMenus, updatedMenu]);
      setNewMenuName("");
      setNewMenuIcon("");
      onOpenChange(); // Close the modal
    } catch (error) {
      console.error("Error adding menu:", error);
    }
  };

  return (
    <div>
      <Button onPress={onOpen} color="primary">
        Add Menu
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add Menu
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Menu Name"
                  variant="bordered"
                  value={newMenuName}
                  onChange={(e) => setNewMenuName(e.target.value)}
                />
                <Input
                  label="Menu Icon"
                  variant="bordered"
                  value={newMenuIcon}
                  onChange={(e) => setNewMenuIcon(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onClick={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={handleAddMenu}>
                  Add Menu
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
