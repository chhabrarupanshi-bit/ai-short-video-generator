"use client";

import React, { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { checkAndSaveUser } from "./_actions/user"; // Step 1 wali file import karein

const Provider = ({ children }) => {
  const { user } = useUser();

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      // Direct database call karne ke bajaye server action ko call kiya
      checkAndSaveUser(
        user?.fullName,
        user?.primaryEmailAddress?.emailAddress
      );
    }
  }, [user]);

  return <div>{children}</div>;
};

export default Provider;