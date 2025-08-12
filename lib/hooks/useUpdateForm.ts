import { useEffect, useState } from "react";

import { FormState } from "@/types";

export default function useUpdateForm(formState: FormState) {
  const [hideMessage, setHideMessage] = useState(false);

  useEffect(() => {
    setHideMessage(false);
  }, [formState.resetKey]);

  return { hideMessage, setHideMessage };
}
