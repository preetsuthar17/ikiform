"use client";

import { Crisp } from "crisp-sdk-web";
import { useEffect } from "react";

const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("27b76747-25f4-4634-8f1c-2a9ec6926fef");
  });

  return null;
};

export default CrispChat;
