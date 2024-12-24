
"use client";

import { Modal } from "@/components/ui/modal";
import { useStoreModal } from "@/hooks/use-store-modal";
import { useEffect } from "react";
import { UserButton } from '@clerk/nextjs'

const SetupPage = () => {
  const onOpen = useStoreModal((state) => state.onOpen);
  const isOpen = useStoreModal((state) => state.isOpen);

  useEffect(() => {
    if(!isOpen) {
      onOpen();
    }

  }, [isOpen, onOpen]);

// return null;

  return (
    <div className="p-4">
      <Modal isOpen onClose={() => { } } title="test" description="test description" >
        Children
      </Modal>



      {/* <UserButton>
        <UserButton.MenuItems>
          <UserButton.Action label="signOut" />
          <UserButton.Action label="manageAccount" />
        </UserButton.MenuItems>
      </UserButton> */}
    </div>
  )
  }

  export default SetupPage;